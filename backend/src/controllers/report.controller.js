const User = require('../models/User.model');
const QuizAttempt = require('../models/QuizAttempt.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const nodemailer = require('nodemailer');

// @desc    Generate and send a weekly learning report
// @route   POST /api/reports/send-weekly
// @access  Private (Admin or Automated Task)
exports.sendWeeklyReport = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  
  // 1. Analytics Logic (Mocked for 7 days)
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);

  const attempts = await QuizAttempt.find({
    user: user._id,
    createdAt: { $gte: lastWeek }
  });

  const xpGained = attempts.reduce((acc, curr) => acc + (curr.pointsEarned || 0), 0);
  const topCategory = attempts.length > 0 ? attempts[0].category : 'None';

  // 2. Email Formatting
  const reportContent = `
    <h2>SoloLearn Infinity - Your Weekly Progress Report 🚀</h2>
    <p>Hello <b>${user.name}</b>,</p>
    <p>Here is what you achieved in the last 7 days:</p>
    <ul>
      <li><b>XP Gained:</b> ${xpGained} points</li>
      <li><b>Quizzes Solved:</b> ${attempts.length}</li>
      <li><b>Mastered Topic:</b> ${topCategory}</li>
      <li><b>Current Streak:</b> ${user.streak || 0} days</li>
    </ul>
    <p><i>"Consistency is the key to mastering code. Keep up the great work!"</i></p>
    <br/>
    <p>Best regards,<br/>The SoloLearn Team</p>
  `;

  // 3. Nodemailer Transport (Using Simulated Mailer)
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER || 'solo_learn_test@ethereal.email',
      pass: process.env.EMAIL_PASS || 'password'
    }
  });

  try {
    // In a real app, we'd send the actual email.
    // For this prototype, we confirm the data payload.
    res.status(200).json({
      success: true,
      message: `Weekly report generated for ${user.email}`,
      data: {
        xpGained,
        quizzesSolved: attempts.length,
        topCategory,
        emailBody: "Simulated email send success"
      }
    });
  } catch (err) {
    console.error('❌ Email Report Error:', err.message);
    return next(new ApiError(500, 'Failed to send weekly report email'));
  }
});
