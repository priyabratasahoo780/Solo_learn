const DailyInterview = require('../models/DailyInterview.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Get all daily questions for MNCs
// @route   GET /api/interview-daily/questions
// @access  Public
exports.getDailyQuestions = asyncHandler(async (req, res, next) => {
  const questions = await DailyInterview.find().sort({ lastUpdated: -1 });
  
  res.status(200).json({
    success: true,
    data: questions
  });
});

// @desc    Refresh Daily MNC Questions using AI
// @route   POST /api/interview-daily/refresh
// @access  Private (Admin Role)
exports.refreshDailyQuestions = asyncHandler(async (req, res, next) => {
  const companies = ['Google', 'Microsoft', 'Amazon', 'Swiggy', 'Zomato', 'Meta', 'Netflix', 'Adobe', 'Uber', 'Flipkart'];
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });

  try {
    const results = [];
    
    for (const company of companies) {
      const prompt = `
        Generate a fresh, real-world technical interview question that is CURRENTLY being asked at ${company} (as of early 2026).
        The answer must be a concise, professional ONE-LINER "concise fix" or explanation.
        Category should be one of: JavaScript, React, Node.js, Python, SQL, DSA, System Design.
        
        Return JSON format:
        {
          "question": "Question text?",
          "answer": "Concise one-line fix/explanation",
          "category": "React/JavaScript/...",
          "difficulty": "Intermediate/Advanced"
        }
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const data = JSON.parse(response.text());

      // Update or Create the daily record
      const dailyItem = await DailyInterview.findOneAndUpdate(
        { company },
        { 
          ...data,
          lastUpdated: new Date()
        },
        { upsert: true, new: true }
      );
      
      results.push(dailyItem);
    }

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (err) {
    console.error('❌ AI MNC REFRESH ERROR:', err.message);
    return next(new ApiError(500, `AI Generation failed (Network Block). Please check VPN settings.`));
  }
});
