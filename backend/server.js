const express = require('express');
const cors = require('cors');
const axios = require('axios');
const NodeCache = require('node-cache');
const app = express();
const PORT = process.env.PORT || 3000;

// GNews configuration
const GNEWS_API_URL = 'https://gnews.io/api/v4/top-headlines';
const GNEWS_API_KEY = process.env.GNEWS_API_KEY || 'e3450f5937bd7932fa02b06a21efeeea'; // Free tier key (100 req/day)

const newsCache = new NodeCache({ stdTTL: 600 }); // 10 minute cache

app.use(cors());
app.use(express.json());

// Mock user profile and content for demo
const userProfile = { interests: { tech: 0.8, business: 0.6, politics: 0.2 } };
const contentList = [
  { title: 'SpaceX Launch Today', category: 'tech', recencyScore: 0.9 },
  { title: 'Election Update', category: 'politics', recencyScore: 0.7 },
  { title: 'Market Trends', category: 'business', recencyScore: 0.85 },
];

// Simple AI ranking function
function rankContent(profile, content) {
  return content
    .map(item => {
      const relevance =
        (item.category === 'tech' ? profile.interests.tech : 0) +
        (item.category === 'business' ? profile.interests.business : 0) +
        (item.category === 'politics' ? profile.interests.politics : 0) +
        (item.recencyScore * 0.4);
      return { ...item, score: relevance };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// Enhanced insights endpoint with GNews integration
app.get('/insights', async (req, res) => {
  try {
    const cached = newsCache.get('insights');
    if (cached) return res.json(cached);
    
    const categories = ['technology', 'business', 'health'];
    const allArticles = [];
    
    for (const category of categories) {
      const response = await axios.get(GNEWS_API_URL, {
        params: {
          category,
          max: 3, // 3 articles per category
          lang: 'en',
          apikey: GNEWS_API_KEY
        }
      });
      
      // Add category to articles
      const categorizedArticles = response.data.articles.map(article => ({
        ...article,
        category: category.charAt(0).toUpperCase() + category.slice(1)
      }));
      
      allArticles.push(...categorizedArticles);
    }

    // Process and format articles
    const insights = allArticles
      .filter(article => article.title && article.description)
      .map((article, index) => ({
        id: `${article.publishedAt}-${index}`,
        category: article.category,
        title: article.title,
        content: article.description,
        url: article.url,
        image: article.image || 'https://via.placeholder.com/150',
        source: article.source.name
      }));

    newsCache.set('insights', insights);
    res.json(insights.slice(0, 9)); // Return max 9 items

  } catch (error) {
    console.error('GNews API error:', error.response?.data || error.message);
    res.status(500).json({ 
      error: 'Failed to fetch news',
      details: error.response?.data?.message || error.message
    });
  }
});

// Keep test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'active', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});