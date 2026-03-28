const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { getStaticResponse } = require('../utils/aiHelpers');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// @desc    Explain a code snippet using AI
// @route   POST /api/code/explain
// @access  Private
exports.explainCode = asyncHandler(async (req, res, next) => {
  const { code, language } = req.body;

  if (!code) {
    return next(new ApiError(400, 'Please provide a code snippet to explain'));
  }

  // Handle Missing API Key with Graceful Mock Fallback
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
     const mockExplainer = `
       **AI Code Breakdown (Simulated Mode)**:
       
       1. This looks like ${language || 'a programming'} snippet.
       2. To unlock the full step-by-step logic, please enable the Gemini API.
       
       General Tip: Always keep your code DRY (Don't Repeat Yourself)!
     `;

     return res.status(200).json({
       success: true,
       data: {
         explanation: mockExplainer,
         mode: 'simulated'
       }
     });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert Code Architect for SoloLearn.
      Analyze the following ${language || 'general'} code snippet and provide a clear, step-by-step breakdown of how it works.
      Focus on making it easy to understand for a student.
      
      CODE:
      ${code}
    `;

    const result = await model.generateContent(prompt);
    const explanation = result.response.text();

    res.status(200).json({
      success: true,
      data: {
        explanation,
        mode: 'ai'
      }
    });
  } catch (err) {
    console.error('❌ AI Breakdown Error:', err.message);
    
    // Switch to Static Specialist
    const fallback = `**AI Architect (Offline Mode)**: I've detected a network block. 
    In general, this code follows standard ${language || 'technical'} patterns.
    
    Tip: Check your brackets and semicolons!`;

    res.status(200).json({
      success: true,
      data: {
        explanation: fallback,
        mode: 'offline_specialist'
      }
    });
  }
});
