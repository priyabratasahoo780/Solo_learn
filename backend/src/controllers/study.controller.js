const QuizAttempt = require('../models/QuizAttempt.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getStaticResponse } = require('../utils/aiHelpers');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Get a personalized study guide based on user weaknesses
// @route   GET /api/study/guide
// @access  Private
exports.getPersonalizedGuide = asyncHandler(async (req, res, next) => {
  // 1. Fetch recent failed attempts (score < 70)
  const user = await User.findById(req.user.id);
  const recentAttempts = await QuizAttempt.find({ 
    userId: user._id, 
    status: 'completed'
  })
  .populate('quizId', 'category title')
  .sort({ createdAt: -1 })
  .limit(10);

  // 2. Identify weak categories
  const weaknessMap = {};
  recentAttempts.forEach(attempt => {
    if (attempt.scorePercent < 70) {
      const category = attempt.quizId?.category || 'General';
      weaknessMap[category] = (weaknessMap[category] || 0) + 1;
    }
  });

  const weakCategories = Object.keys(weaknessMap).sort((a, b) => weaknessMap[b] - weaknessMap[a]);

  if (weakCategories.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        status: 'Legendary',
        message: 'You are performing exceptionally well in all categories! Keep up the great work.',
        recommendation: 'Try taking some Advanced level quizzes to see how far you can push your limits.',
        weakAreas: []
      }
    });
  }

  const primaryWeakness = weakCategories[0];

  // 3. AI Generation (Hybrid: Gemini with Offline Fallback)
  let guide;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
     try {
       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
       const prompt = `
         Identify as a Personalized Study Partner for SoloLearn.
         The student is struggling with "${primaryWeakness}".
         Generate a 3-step actionable study guide for them.
         Keep it encouraging and high-fidelity.
       `;
       const result = await model.generateContent(prompt);
       guide = result.response.text();
     } catch (err) {
       console.error('Study Guide AI Error:', err.message);
       guide = `We've detected you're having some trouble with ${primaryWeakness}. Focus on re-reading the documentation and practicing the core syntax.`;
     }
  } else {
     guide = `Local Study Guide: Focusing on ${primaryWeakness}. Practice more quizzes in this category to bridge your knowledge gaps.`;
  }

  res.status(200).json({
    success: true,
    data: {
      status: 'Growth Opportunity',
      message: `I've noticed you're hitting some challenges in ${primaryWeakness}. Here's my customized plan to help you improve.`,
      primaryWeakness,
      guide,
      allWeaknesses: weakCategories
    }
  });
});
