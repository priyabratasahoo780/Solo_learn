const DailyChallenge = require('../models/DailyChallenge.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure AI Fallback for generation
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Get the daily challenge
// @route   GET /api/daily-challenge
// @access  Private
exports.getDailyChallenge = asyncHandler(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let challenge = await DailyChallenge.findOne({ date: today });

  // 🤖 AUTO-GENERATE DAILY CHALLENGE IF MISSING (AI AGENT MODE)
  if (!challenge && process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
    try {
      const model = genAI.getGenerativeModel({ 
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: "application/json" }
      });

      const prompt = `
        Generate a "Question of the Day" for a coding platform. 
        Topic: Random tech topic (JavaScript, Python, SQL, etc.)
        Difficulty: Medium
        Return JSON:
        {
          "question": "What is...",
          "options": ["A", "B", "C", "D"],
          "answerIndex": 0-3,
          "explanation": "Why?",
          "category": "JavaScript",
          "difficulty": "Medium"
        }
      `;

      const result = await model.generateContent(prompt);
      const data = JSON.parse(result.response.text());
      
      challenge = await DailyChallenge.create({
        ...data,
        date: today
      });
      console.log('✅ AI Generated Daily Challenge for today!');
    } catch (err) {
      console.error('❌ AI Daily Gen Failed:', err.message);
    }
  }

  if (!challenge) {
    return next(new ApiError(404, 'No daily challenge available for today. Please check back later.'));
  }

  // Check if user already did it
  const user = await User.findById(req.user.id);
  const alreadyDone = user.lastDailyChallengeDate && 
                      new Date(user.lastDailyChallengeDate).getTime() === today.getTime();

  res.status(200).json({
    success: true,
    data: challenge,
    alreadyDone
  });
});

// @desc    Submit daily challenge
// @route   POST /api/daily-challenge/submit
// @access  Private
exports.submitDailyChallenge = asyncHandler(async (req, res, next) => {
  const { answerIndex } = req.body;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const challenge = await DailyChallenge.findOne({ date: today });
  if (!challenge) return next(new ApiError(404, 'Challenge not found'));

  const user = await User.findById(req.user.id);
  
  // Check if already done today
  if (user.lastDailyChallengeDate && new Date(user.lastDailyChallengeDate).getTime() === today.getTime()) {
    return next(new ApiError(400, 'You have already completed the daily challenge!'));
  }

  const isCorrect = answerIndex === challenge.answerIndex;

  if (isCorrect) {
    // Reward
    user.totalPoints += challenge.pointsReward;
    user.weeklyPoints += challenge.pointsReward;
    user.monthlyPoints += challenge.pointsReward;
    user.coins += challenge.coinsReward;
    user.lastDailyChallengeDate = today;
    
    // Streak logic applies automatically elsewhere, but we mark the date here
    await user.save();
  }

  res.status(200).json({
    success: true,
    isCorrect,
    correctAnswer: challenge.answerIndex,
    explanation: challenge.explanation,
    rewards: isCorrect ? {
      points: challenge.pointsReward,
      coins: challenge.coinsReward
    } : null
  });
});
