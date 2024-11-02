// src/fetchTopStories.js
import axios from 'axios';

export async function fetchTopStories() {
  const NYT_API_KEY = process.env.NYT_API_KEY;
  try {
    const response = await axios.get('https://api.nytimes.com/svc/topstories/v2/home.json', {
      params: {
        'api-key': NYT_API_KEY,
      },
    });

    // Extract top 5 stories
    const topStories = response.data.results.slice(0, 5).map(story => ({
      title: story.title,
      abstract: story.abstract,
      byline: story.byline,
      url: story.url,
    }));

    return topStories;
  } catch (error) {
    console.error('Error fetching top stories:', error);
    return [];
  }
}
