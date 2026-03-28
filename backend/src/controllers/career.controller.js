const CareerRoadmap = require('../models/CareerRoadmap.model');
const QuizAttempt = require('../models/QuizAttempt.model');
const MockInterview = require('../models/MockInterview.model');
const Challenge = require('../models/Challenge.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Generate a personalized 30-day career roadmap
// @route   POST /api/career/generate
// @access  Private
exports.generateRoadmap = asyncHandler(async (req, res, next) => {
  const { dreamJob, targetCompany } = req.body;
  const userId = req.user.id;

  // 1. GATHER ALL USER DATA (The Context)
  const quizHistory = await QuizAttempt.find({ user: userId }).limit(10).populate('quizId', 'title category');
  const mockInterviews = await MockInterview.find({ user: userId }).limit(5);
  const user = await User.findById(userId);

  // 2. SYNTHESIZE CONTEXT
  const context = {
    userStats: {
      totalPoints: user.totalPoints,
      coins: user.coins,
      badges: user.badges
    },
    quizzes: quizHistory.map(q => ({
      title: q.quizId?.title,
      score: q.score,
      percentage: q.percentage
    })),
    interviews: mockInterviews.map(m => ({
      company: m.company,
      verdict: m.scorecard?.verdict,
      overall: m.scorecard?.overall
    }))
  };

  // 3. CALL GEMINI (THE ARCHITECT)
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    You are the 'SoloLearn AI Career Architect'. Your goal is to build a personalized 30-day learning roadmap for an elite software engineer.
    
    USER GOAL: Become a "${dreamJob}"${targetCompany ? ` at ${targetCompany}` : ''}.
    
    USER CURRENT PROFILE:
    ${JSON.stringify(context, null, 2)}
    
    TASKS:
    1. Analyze strengths and weaknesses based on quiz and mock interview performance.
    2. Generate a 30-day roadmap. Each day should have 1-2 specific "tasks" (quiz, sandbox, interview, or battle).
    3. Generate a "Readiness Score" (0-100) comparing user profile to the dream job requirements.
    
    Return JSON format:
    {
      "readinessScore": 65,
      "analysis": {
        "strengths": ["React State Management", "System Scalability"],
        "weaknesses": ["Async JavaScript", "Cloud Infrastructure"],
        "recommendation": "Focus on backend architecture to bridge the gap for a Senior Role."
      },
      "roadmap": [
        {
          "day": 1,
          "title": "Foundation Check",
          "tasks": [
            { "taskType": "quiz", "taskName": "Advanced JavaScript Closures", "isCompleted": false },
            { "taskType": "sandbox", "taskName": "Implement a custom Debounce function", "isCompleted": false }
          ]
        }
        ... and so on for 7, 14, or 30 days (start with 7 clearly defined days)
      ]
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const roadmapData = JSON.parse(response.text());

  // 4. SAVE OR UPDATE PERSISTENT ROADMAP
  let roadmap = await CareerRoadmap.findOne({ user: userId });

  if (roadmap) {
    roadmap.dreamJob = dreamJob;
    roadmap.targetCompany = targetCompany;
    roadmap.readinessScore = roadmapData.readinessScore;
    roadmap.analysis = roadmapData.analysis;
    roadmap.roadmap = roadmapData.roadmap;
  } else {
    roadmap = new CareerRoadmap({
      user: userId,
      dreamJob,
      targetCompany,
      readinessScore: roadmapData.readinessScore,
      analysis: roadmapData.analysis,
      roadmap: roadmapData.roadmap
    });
  }

  await roadmap.save();

  res.status(200).json({
    success: true,
    data: roadmap
  });
});

// @desc    Get current roadmap
// @route   GET /api/career/me
// @access  Private
exports.getMyRoadmap = asyncHandler(async (req, res, next) => {
  const roadmap = await CareerRoadmap.findOne({ user: req.user.id });
  
  if (!roadmap) {
    return res.status(200).json({ success: true, data: null });
  }

  res.status(200).json({
    success: true,
    data: roadmap
  });
});

// @desc    Mark a task as completed in the roadmap
// @route   PUT /api/career/task/complete
// @access  Private
exports.completeTask = asyncHandler(async (req, res, next) => {
  const { day, taskName } = req.body;
  const roadmap = await CareerRoadmap.findOne({ user: req.user.id });

  if (!roadmap) return next(new ApiError(404, 'Roadmap not found'));

  const dayObj = roadmap.roadmap.find(d => d.day === day);
  if (dayObj) {
    const task = dayObj.tasks.find(t => t.taskName === taskName);
    if (task) {
      task.isCompleted = true;
    }
  }

  await roadmap.save();

  res.status(200).json({
    success: true,
    data: roadmap
  });
});
创新
