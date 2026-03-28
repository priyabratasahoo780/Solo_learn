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

  // AI Logic: Maintain Persoma
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const chat = model.startChat({
    history: interview.transcript.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.message }]
    })),
    systemInstruction: `
      You are an elite Recruiter Persona: ${interview.recruiterPersona} from ${interview.company}.
      Your personality: ${PERSONAS[interview.company]?.personality || 'Professional and technical.'}.
      
      Conduct a REALISTIC technical interview. 
      1. Ask one technical question at a time.
      2. If the user's answer is good, ask a deeper follow-up.
      3. If the answer is weak, provide a subtle nudge or move to a related topic.
      4. If the interview has reached 5-6 total questions, conclude naturally.
      
      Keep responses concise and professional. Use markdown if necessary for code snippets.
    `
  });

  const result = await chat.sendMessage(message);
  const aiResponse = await result.response.text();

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

  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    generationConfig: { responseMimeType: "application/json" }
  });

  const prompt = `
    Analyze this technical interview transcript for ${interview.company}.
    Transcript: ${JSON.stringify(interview.transcript)}
    
    Evaluate on:
    1. Technical Accuracy (0-100)
    2. Communication Clarity (0-100)
    3. Cultural Fit for ${interview.company} (0-100)
    
    Provide a detailed summary and a final 'HIRE' or 'NO-HIRE' verdict.
    
    Return JSON format:
    {
      "technical": 85,
      "communication": 90,
      "cultureFit": 75,
      "summary": "The candidate has strong technical skills but needs to work on...",
      "verdict": "HIRE"
    }
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const scorecard = JSON.parse(response.text());

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
