const CareerRoadmap = require('../models/CareerRoadmap.model');
const QuizAttempt = require('../models/QuizAttempt.model');
const MockInterview = require('../models/MockInterview.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const { generateAIContent } = require('../utils/aiService');

// ─── OFFLINE FALLBACK GENERATOR ────────────────────────────────────────────────
function generateOfflineRoadmap(dreamJob, targetCompany, context) {
  const jobLower = dreamJob.toLowerCase();
  const isFrontend = jobLower.includes('frontend') || jobLower.includes('react') || jobLower.includes('ui');
  const isBackend = jobLower.includes('backend') || jobLower.includes('node') || jobLower.includes('api');
  const isFullstack = jobLower.includes('fullstack') || jobLower.includes('full-stack') || jobLower.includes('full stack');
  const isData = jobLower.includes('data') || jobLower.includes('ml') || jobLower.includes('ai');

  const quizCount = context.quizzes.length;
  const avgScore = quizCount > 0 
    ? context.quizzes.reduce((a, b) => a + (b.percentage || 0), 0) / quizCount 
    : 0;
  const readinessScore = Math.min(95, Math.max(20, Math.round(avgScore * 0.7 + (context.userStats.totalPoints / 100))));

  const strengths = [];
  const weaknesses = [];

  if (avgScore > 70) strengths.push('Strong Quiz Performance', 'Consistent Practice');
  else weaknesses.push('Quiz Accuracy Needs Improvement');

  if (context.interviews.some(i => i.verdict === 'HIRE')) strengths.push('Interview Presence');
  else weaknesses.push('Mock Interview Practice');

  if (isFrontend || isFullstack) {
    strengths.push('UI Development Insight');
    weaknesses.push('Performance Optimization', 'Accessibility Standards');
  } else if (isBackend || isFullstack) {
    strengths.push('System Architecture Awareness');
    weaknesses.push('Distributed Systems', 'Database Optimization');
  } else if (isData) {
    strengths.push('Analytical Mindset');
    weaknesses.push('Statistical Modeling', 'Model Deployment (MLOps)');
  }

  const company = targetCompany || 'a top tech company';
  const recommendation = `Based on your current profile, focus on ${weaknesses[0] || 'consistent daily practice'} to close the gap for a ${dreamJob} role at ${company}. Maintain your streak and attempt at least 3 Mock Interviews over the next 2 weeks.`;

  const tasks = isFrontend
    ? [
        [{ taskType: 'quiz', taskName: 'Advanced React Patterns', isCompleted: false }, { taskType: 'sandbox', taskName: 'Build a React custom Hook', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'CSS Grid & Flexbox Mastery', isCompleted: false }],
        [{ taskType: 'interview', taskName: 'Frontend Mock Interview - Round 1', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'JavaScript Performance', isCompleted: false }, { taskType: 'sandbox', taskName: 'Optimize a slow React render', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'Web Accessibility (A11y)', isCompleted: false }],
        [{ taskType: 'battle', taskName: 'PvP CSS Challenge', isCompleted: false }],
        [{ taskType: 'interview', taskName: `${company} Frontend Simulation`, isCompleted: false }],
      ]
    : isData
    ? [
        [{ taskType: 'quiz', taskName: 'Python Data Structures', isCompleted: false }, { taskType: 'sandbox', taskName: 'Pandas Data Cleaning Task', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'SQL Advanced Queries', isCompleted: false }],
        [{ taskType: 'interview', taskName: 'Data Analyst Mock Interview', isCompleted: false }],
        [{ taskType: 'sandbox', taskName: 'Build a Data Visualization Dashboard', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'Machine Learning Fundamentals', isCompleted: false }],
        [{ taskType: 'battle', taskName: 'SQL PvP Duel', isCompleted: false }],
        [{ taskType: 'interview', taskName: `${company} Data Science Simulation`, isCompleted: false }],
      ]
    : [
        [{ taskType: 'quiz', taskName: 'System Design: Scalability', isCompleted: false }, { taskType: 'sandbox', taskName: 'Design a REST API schema', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'Node.js Advanced Patterns', isCompleted: false }],
        [{ taskType: 'interview', taskName: 'Backend Systems Mock Interview', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'Database Indexing & Optimization', isCompleted: false }, { taskType: 'sandbox', taskName: 'Implement a caching layer', isCompleted: false }],
        [{ taskType: 'quiz', taskName: 'Docker & Kubernetes Basics', isCompleted: false }],
        [{ taskType: 'battle', taskName: 'System Design PvP Duel', isCompleted: false }],
        [{ taskType: 'interview', taskName: `${company} Full Technical Simulation`, isCompleted: false }],
      ];

  const roadmap = tasks.map((dayTasks, i) => ({
    day: i + 1,
    title: [`Foundation Check`, `Core Concepts Deep Dive`, `Interview Simulation`, `Advanced Practice`, `Specialization Sprint`, `Battle Conditioning`, `Company-Specific Prep`][i],
    tasks: dayTasks
  }));

  return { readinessScore, analysis: { strengths, weaknesses, recommendation }, roadmap };
}

// @desc    Generate a personalized 30-day career roadmap
// @route   POST /api/career/generate
// @access  Private
exports.generateRoadmap = asyncHandler(async (req, res, next) => {
  const { dreamJob, targetCompany } = req.body;
  if (!dreamJob) return next(new ApiError(400, 'Please provide a dream job'));

  const userId = req.user.id;

  const [quizHistory, mockInterviews, user] = await Promise.all([
    QuizAttempt.find({ user: userId }).limit(10).lean(),
    MockInterview.find({ user: userId }).limit(5).lean(),
    User.findById(userId)
  ]);

  const context = {
    userStats: { totalPoints: user.totalPoints || 0, coins: user.coins || 0, badges: user.badges || [] },
    quizzes: quizHistory.map(q => ({ title: q.quizId?.title, score: q.score, percentage: q.percentage })),
    interviews: mockInterviews.map(m => ({ company: m.company, verdict: m.scorecard?.verdict, overall: m.scorecard?.overall }))
  };

  let roadmapData;

  // Try Gemini, fall back to offline generator on any error
  try {
    const prompt = `You are the 'SoloLearn AI Career Architect'. Build a personalized 7-day starter roadmap.
USER GOAL: "${dreamJob}"${targetCompany ? ` at ${targetCompany}` : ''}.
USER PROFILE: ${JSON.stringify(context)}
Return ONLY valid JSON: { "readinessScore": number, "analysis": { "strengths": string[], "weaknesses": string[], "recommendation": string }, "roadmap": [{ "day": number, "title": string, "tasks": [{ "taskType": "quiz"|"sandbox"|"interview"|"battle", "taskName": string, "isCompleted": false }] }] }`;

    roadmapData = await generateAIContent(prompt, true);
  } catch (err) {
    // Offline Specialist Fallback
    roadmapData = generateOfflineRoadmap(dreamJob, targetCompany, context);
  }

  let roadmap = await CareerRoadmap.findOne({ user: userId });
  if (roadmap) {
    Object.assign(roadmap, { dreamJob, targetCompany, ...roadmapData });
  } else {
    roadmap = new CareerRoadmap({ user: userId, dreamJob, targetCompany, ...roadmapData });
  }
  await roadmap.save();

  res.status(200).json({ success: true, data: roadmap });
});

// @desc    Get current roadmap
// @route   GET /api/career/me
// @access  Private
exports.getMyRoadmap = asyncHandler(async (req, res, next) => {
  const roadmap = await CareerRoadmap.findOne({ user: req.user.id });
  res.status(200).json({ success: true, data: roadmap || null });
});

// @desc    Mark a task as completed
// @route   PUT /api/career/task/complete
// @access  Private
exports.completeTask = asyncHandler(async (req, res, next) => {
  const { day, taskName } = req.body;
  const roadmap = await CareerRoadmap.findOne({ user: req.user.id });
  if (!roadmap) return next(new ApiError(404, 'Roadmap not found'));

  const dayObj = roadmap.roadmap.find(d => d.day === day);
  if (dayObj) {
    const task = dayObj.tasks.find(t => t.taskName === taskName);
    if (task) task.isCompleted = true;
  }

  await roadmap.save();
  res.status(200).json({ success: true, data: roadmap });
});
