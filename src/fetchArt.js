// src/fetchArt.js
import axios from 'axios';

export async function fetchArt() {
  try {
    // 1. Search for paintings that have images
    const searchResponse = await axios.get('https://collectionapi.metmuseum.org/public/collection/v1/search', {
      params: {
        hasImages: true, // Ensure piece has an image
        q: 'paintings',  // Search needs term
      },
    });

    // Check if we received any object IDs
    if (!searchResponse.data.objectIDs || searchResponse.data.objectIDs.length === 0) {
      console.error('No objects found.');
      return null;
    }

    // 2.  Iterate over objectIDs to find piece with all data
    const objectIDs = searchResponse.data.objectIDs;
    let selectedArtPiece = null;

    for (const objectId of objectIDs) {
      try {
        const artResponse = await axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`);
        const artPiece = artResponse.data;

        // Structure data for the PDF
        const potentialArtPiece = {
          title: artPiece.title,
          artist: artPiece.artistDisplayName,
          artistBio: artPiece.artistDisplayBio,
          date: artPiece.objectDate,
          period: artPiece.period,
          medium: artPiece.medium,
          url: artPiece.objectURL,
          image: artPiece.primaryImageSmall,
          department: artPiece.department,
          type: artPiece.objectName,
        };

        // Validate that all fields are present and not blank
        const isComplete = Object.values(potentialArtPiece).every(value => value && value.trim() !== '');
        if (isComplete) {
          selectedArtPiece = potentialArtPiece;
          console.log("Selected Art Piece Data:", selectedArtPiece); // Logging for debugging
          break; // Stop once we find a valid piece
        }
      } catch (err) {
        console.error(`Failed to fetch object ${objectId}:`, err.message);
      }
    }

    // Return the found piece or log if nothing matched the criteria
    if (!selectedArtPiece) {
      console.log("No complete art piece found.");
    }

    return selectedArtPiece;

  } catch (error) {
    console.error('Error fetching art:', error);
    return null;
  }
}
