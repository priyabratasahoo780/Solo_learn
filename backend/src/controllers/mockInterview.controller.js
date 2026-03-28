const MockInterview = require('../models/MockInterview.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Personas mapping
const PERSONAS = {
  Google: { name: 'Sarah', role: 'Staff Software Engineer', personality: 'Highly technical, focuses on scalability and efficiency.' },
  Amazon: { name: 'David', role: 'Bar Raiser / Senior SDM', personality: 'Deep focus on Leadership Principles and customer obsession.' },
  Netflix: { name: 'Elena', role: 'Principal Engineer', personality: 'Asks "What is the simplest way to solve this?" and focuses on freedom and responsibility.' },
  Swiggy: { name: 'Karthik', role: 'Tech Lead', personality: 'Focuses on real-world system resilience and high-scale consumer apps.' }
};

// ─── OFFLINE FALLBACK GENERATOR ────────────────────────────────────────────────
function generateFallbackScorecard(transcript, company) {
  const userMessages = transcript.filter(m => m.sender === 'user');
  const totalChars = userMessages.reduce((acc, m) => acc + m.message.length, 0);
  const avgLen = userMessages.length > 0 ? totalChars / userMessages.length : 0;
  
  // Heuristic-based scoring
  let technical = Math.min(85, Math.max(40, Math.round(avgLen * 0.5 + userMessages.length * 5)));
  let communication = Math.min(90, Math.max(50, Math.round(avgLen * 0.4 + 30)));
  let cultureFit = 70 + (Math.floor(Math.random() * 15)); // Default decent fit

  const verdict = (technical > 65 && communication > 60) ? 'HIRE' : 'NO-HIRE';
  const summary = `Based on your technical dialogue for ${company}, you demonstrated ${technical > 70 ? 'strong' : 'developing'} problem-solving abilities. Your responses averaged ${Math.round(avgLen)} characters, showing ${avgLen > 100 ? 'excellent detail' : 'concise communication'}. Recommendation: Focus on system scalability and design patterns.`;

  return { technical, communication, cultureFit, summary, verdict };
}

// @desc    Start a new Mock Interview session
// @route   POST /api/mock-interview/start
// @access  Private
exports.startInterview = asyncHandler(async (req, res, next) => {
  const { company } = req.body;
  
  if (!PERSONAS[company]) {
    return next(new ApiError(400, `No recruiter persona defined for ${company}`));
  }

  const persona = PERSONAS[company];
  const interview = await MockInterview.create({
    user: req.user.id,
    company,
    recruiterPersona: `${persona.name} (${persona.role})`,
    transcript: [{
      sender: 'recruiter',
      message: `Hello! I'm ${persona.name}, a ${persona.role} here at ${company}. Thanks for joining this technical interview today. We'll be diving into some system design and technical architecture questions. Ready to start?`
    }]
  });

  res.status(201).json({
    success: true,
    data: interview
  });
});

// @desc    Process user response and get recruiter follow-up
// @route   POST /api/mock-interview/:id/chat
// @access  Private
exports.chatWithRecruiter = asyncHandler(async (req, res, next) => {
  const { message } = req.body;
  const interview = await MockInterview.findById(req.params.id);

  if (!interview) return next(new ApiError(404, 'Interview session not found'));
  if (interview.status === 'completed') return next(new ApiError(400, 'Interview already completed'));

  // Save user message
  interview.transcript.push({ sender: 'user', message });
  await interview.save();

  let aiResponse;
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const chat = model.startChat({
      history: interview.transcript.slice(0, -1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.message }]
      })),
      systemInstruction: `
        You are an elite Recruiter Persona: ${interview.recruiterPersona} from ${interview.company}.
        Personality: ${PERSONAS[interview.company]?.personality || 'Professional and technical.'}.
        
        Conduct a technical interview. Ask one question at a time. Be concise.
      `
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const result = await chat.sendMessage(message);
    clearTimeout(timeout);
    aiResponse = await result.response.text();
  } catch (err) {
    console.error('AI Chat Error:', err.message);
    aiResponse = "That's an interesting perspective. Could you elaborate more on how you'd handle the trade-offs in that specific scenario?";
  }

  // Save AI response
  interview.transcript.push({ sender: 'recruiter', message: aiResponse });
  await interview.save();

  res.status(200).json({
    success: true,
    data: aiResponse,
    session: interview
  });
});

// @desc    Conclude interview and generate scorecard
// @route   POST /api/mock-interview/:id/finish
// @access  Private
exports.finishInterview = asyncHandler(async (req, res, next) => {
  const interview = await MockInterview.findById(req.params.id);
  if (!interview) return next(new ApiError(404, 'Session not found'));

  let scorecard;
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `Analyze transcript: ${JSON.stringify(interview.transcript)}. 
    Return JSON: { "technical": 0-100, "communication": 0-100, "cultureFit": 0-100, "summary": string, "verdict": "HIRE"|"NO-HIRE" }`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s for analysis
    
    const result = await model.generateContent(prompt);
    clearTimeout(timeout);
    const text = await result.response.text();
    scorecard = JSON.parse(text);
  } catch (err) {
    console.error('Scorecard AI Error:', err.message);
    scorecard = generateFallbackScorecard(interview.transcript, interview.company);
  }

  interview.scorecard = {
    ...scorecard,
    overall: Math.round((scorecard.technical + scorecard.communication + scorecard.cultureFit) / 3)
  };
  interview.status = 'completed';
  await interview.save();

  res.status(200).json({
    success: true,
    data: interview
  });
});
