const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get trending technical articles and industry news
// @route   GET /api/news/trending
// @access  Public
exports.getTrendingNews = asyncHandler(async (req, res, next) => {
  // In a real-world app, we'd fetch from a News API or TechCrunch RSS.
  // For SoloLearn Infinity, we provide a high-fidelity curated feed.
  
  const techNews = [
    {
      title: "The Rise of Gemini 1.5: How 1M Token Context is Changing AI",
      source: "Google AI Blog",
      category: "AI",
      summary: "Explore how the massive context window of Gemini 1.5 Flash is revolutionizing coding assistants.",
      link: "https://ai.google.dev/",
      publishedAt: new Date()
    },
    {
      title: "React 19: The Actions API and Client/Server Components",
      source: "Meta Engineering",
      category: "Frontend",
      summary: "Everything you need to know about the next major release of React.",
      link: "https://react.dev/",
      publishedAt: new Date(Date.now() - 86400000)
    },
    {
      title: "Node.js v22: Faster Streams and WebSocket Support natively",
      source: "Node.js Org",
      category: "Backend",
      summary: "Node.js continues to dominate the backend with major performance upgrades.",
      link: "https://nodejs.org/",
      publishedAt: new Date(Date.now() - 172800000)
    },
    {
      title: "CyberSecurity: Why Zero Trust is the new standard",
      source: "Security Weekly",
      category: "Security",
      summary: "The shift from perimeter security to constant authentication.",
      link: "https://cyberscoop.com/",
      publishedAt: new Date(Date.now() - 259200000)
    }
  ];

  res.status(200).json({
    success: true,
    count: techNews.length,
    data: techNews
  });
});
