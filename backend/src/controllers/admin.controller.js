const User = require('../models/User.model');
const Quiz = require('../models/Quiz.model');
const Certificate = require('../models/Certificate.model');
const QuizAttempt = require('../models/QuizAttempt.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get aggregate platform metrics
// @route   GET /api/admin/metrics
// @access  Private (Admin Only)
exports.getPlatformMetrics = asyncHandler(async (req, res, next) => {
  // Check Admin Role
  if (req.user.role !== 'admin') {
    return next(new ApiError(401, 'Not authorized to access platform metrics'));
  }

  const userCount = await User.countDocuments();
  const proUserCount = await User.countDocuments({ isPro: true });
  const quizCount = await Quiz.countDocuments();
  const certsCount = await Certificate.countDocuments();
  const totalAttempts = await QuizAttempt.countDocuments();

  // Get tech stack popularity (based on attempts)
  const categoryStats = await Quiz.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: {
      users: {
        total: userCount,
        pro: proUserCount,
        free: userCount - proUserCount
      },
      content: {
        quizzes: quizCount,
        certificatesIssued: certsCount,
        engagementAttempts: totalAttempts
      },
      trends: {
        topCategories: categoryStats
      },
      serverTime: new Date()
    }
  });
});
// @desc    Update a user's status (e.g. Ban/Suspend)
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin Only)
exports.updateUserStatus = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new ApiError(404, 'User not found'));
  }

  user.status = req.body.status || 'active'; // active, banned, suspended
  await user.save();

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Update quiz status (UGC Approval Queue)
// @route   PUT /api/admin/quizzes/:id/status
// @access  Private (Admin Only)
exports.updateQuizStatus = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return next(new ApiError(404, 'Quiz not found'));
  }

  quiz.isApproved = req.body.isApproved;
  await quiz.save();

  res.status(200).json({
    success: true,
    data: quiz
  });
});
