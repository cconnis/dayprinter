// src/server.js
import express from 'express';
import { fetchTopStories } from './fetchTopStories.js';
import { fetchArt } from './fetchArt.js';

const app = express();

// Serve static files from public directory
app.use(express.static('public'));

// API endpoint for stories
app.get('/api/stories', async (req, res) => {
    try {
        const stories = await fetchTopStories();
        res.json(stories);
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Failed to fetch stories' });
    }
});

// API endpoint for art
app.get('/api/art', async (req, res) => {
    try {
        const artPiece = await fetchArt();
        if (!artPiece) {
            res.status(404).json({ error: 'No art piece found' });
            return;
        }
        res.json(artPiece);
    } catch (error) {
        console.error('Error fetching art:', error);
        res.status(500).json({ error: 'Failed to fetch art' });
    }
});

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile('template.html', { root: './src' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DayPrinter available at http://localhost:${PORT}`);
});