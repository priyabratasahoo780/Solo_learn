const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateAIContent } = require('../utils/aiService');
const { getStaticResponse } = require('../utils/aiHelpers');

// @desc    Ask AI Tutor a question
// @route   POST /api/ai/ask
// @access  Private
exports.askTutor = asyncHandler(async (req, res, next) => {
  const { question } = req.body;

  if (!question) {
    return next(new ApiError(400, 'Please provide a question'));
  }

  // Handle Missing API Key with Graceful Mock Fallback
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return res.status(200).json({
      success: true,
      data: {
        answer: getStaticResponse(question),
        timestamp: new Date(),
        mode: 'simulated'
      }
    });
  }

  try {
    const TutorContext = require('../models/TutorContext.model');
    
    // Fetch and Initialize Context if needed
    let context = await TutorContext.findOne({ user: req.user.id });
    if (!context) {
      context = await TutorContext.create({ user: req.user.id });
    }

    const prompt = `
      You are an expert Coding Tutor for a platform called SoloLearn. 
      Your goal is to explain concepts clearly, provide code snippets where helpful, and keep the tone professional but encouraging.
      Focus on JavaScript, Web Development, and Computer Science fundamentals.
      Keep the answer concise (max 200 words) but high quality.

      LEARNING CONTEXT (Remember this about the student):
      - Personality Preference: ${context.aiPersonality}
      - Previous Topics: ${context.lastTopics.join(', ') || 'None'}
      - Memory Summary: ${context.memorySummary}
      - Help the user avoid these past mistakes: ${context.mistakeHistory.map(m => m.incorrectConcept).join(', ') || 'No recorded mistakes'}

      Student Question: ${question}
    `;


    const answer = await generateAIContent(prompt);

    res.status(200).json({
      success: true,
      data: {
        answer,
        timestamp: new Date(),
        mode: 'ai'
      }
    });
  } catch (err) {
    // 🔍 HYBRID FALLBACK: IF NETWORK IS BLOCKED, SWITCH TO STATIC EXPERT
    console.error('❌ [AI FETCH ERROR]:', err.message);
    
    const fallbackAnswer = getStaticResponse(question);

    res.status(200).json({
      success: true,
      data: {
        answer: fallbackAnswer,
        timestamp: new Date(),
        mode: 'offline_specialist',
        error: err.message.substring(0, 50)
      }
    });
  }
});

// @desc    Generate a quiz using AI
// @route   POST /api/ai/generate-quiz
// @access  Private (Admin Role)
exports.generateQuiz = asyncHandler(async (req, res, next) => {
  const { topic, difficulty = 'Beginner' } = req.body;

  if (!topic) {
    return next(new ApiError(400, 'Please provide a topic for the quiz'));
  }

  // Handle Missing API Key with Graceful Mock Fallback
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return next(new ApiError(400, 'AI Quiz Architect requires a valid GEMINI_API_KEY in .env'));
  }

  try {

    const prompt = `
      Create a high-quality technical quiz about "${topic}" for level "${difficulty}".
      Return exactly 10 questions in JSON format following this exact schema:
      {
        "title": "Clear and Engaging Title",
        "description": "Short description of what the quiz covers",
        "category": "Pick one: HTML, CSS, JavaScript, ReactJS, Node.js, Python, SQL, Git",
        "difficulty": "${difficulty}",
        "questions": [
          {
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "answerIndex": 0,
            "explanation": "Brief explanation of why this answer is correct"
          }
        ]
      }
    `;

    const quizData = await generateAIContent(prompt, true);

    res.status(200).json({
      success: true,
      data: quizData
    });
  } catch (err) {
    console.error('❌ [AI GENERATOR ERROR]:', err.message);
    
    // OFFLINE SPECIALIST FALLBACK for common topics
    const fallbackQuizzes = {
      ReactJS: {
        title: "React Fundamentals (Specialist)",
        description: "Core React concepts including Hooks and Virtual DOM.",
        category: "ReactJS",
        difficulty: "Intermediate",
        questions: [
          { question: "What is the Virtual DOM?", options: ["A direct copy of the DOM", "A lightweight representation of the DOM", "A CSS engine", "A server-side tool"], answerIndex: 1, explanation: "Virtual DOM is a lightweight copy of the real DOM." }
        ]
      },
      JavaScript: {
        title: "JS Core Concepts (Specialist)",
        description: "Closures, Hoisting, and ES6+ features.",
        category: "JavaScript",
        difficulty: "Intermediate",
        questions: [
          { question: "What is a Closure?", options: ["A way to close a tab", "A function with its lexical environment", "A syntax error", "A loop type"], answerIndex: 1, explanation: "A closure is the combination of a function and its scope." }
        ]
      }
    };

    const fallback = fallbackQuizzes[topic] || fallbackQuizzes['JavaScript'];
    
    res.status(200).json({
      success: true,
      data: fallback,
      mode: 'offline_specialist'
    });
  }
});
