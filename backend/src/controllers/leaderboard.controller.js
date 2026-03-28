const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User.model');

// @desc    Get leaderboard
// @route   GET /api/leaderboard
// @access  Public
exports.getLeaderboard = asyncHandler(async (req, res, next) => {
  const { timeframe = 'all' } = req.query;
  
  let sortField = 'totalPoints';
  if (timeframe === 'weekly') sortField = 'weeklyPoints';
  if (timeframe === 'monthly') sortField = 'monthlyPoints';

  const users = await User.find({})
    .select(`name totalPoints weeklyPoints monthlyPoints coins quizzesAttempted badges ${sortField}`)
    .sort({ [sortField]: -1, coins: -1 })
    .limit(10);

  // Add rank and localized points to response
  const rankedUsers = users.map((user, index) => ({
    rank: index + 1,
    id: user._id,
    name: user.name,
    points: user[sortField], // Return the relevant points for the timeframe
    totalPoints: user.totalPoints,
    coins: user.coins,
    badges: user.badges,
    quizzesCompleted: user.quizzesAttempted.length
  }));

  res.status(200).json({
    success: true,
    timeframe,
    count: rankedUsers.length,
    data: rankedUsers
  });
});
