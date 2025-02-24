const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

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

app.get('/insights', (req, res) => {
  const rankedContent = rankContent(userProfile, contentList);
  res.json(rankedContent);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});