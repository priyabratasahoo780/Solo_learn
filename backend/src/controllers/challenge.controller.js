const Challenge = require('../models/Challenge.model');
const User = require('../models/User.model');
const Quiz = require('../models/Quiz.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Create a new PvP Challenge
// @route   POST /api/challenges/create
// @access  Private
exports.createChallenge = asyncHandler(async (req, res, next) => {
  const { quizId, pointsWager } = req.body;
  const user = await User.findById(req.user.id);

  if (user.coins < pointsWager) {
    return next(new ApiError(400, 'Insufficient coins to wager'));
  }

  // Deduct wager
  user.coins -= pointsWager;
  await user.save();

  const challenge = await Challenge.create({
    challenger: req.user.id,
    opponent: req.body.opponentId || null,
    quizId,
    pointsWager,
    status: 'pending'
  });

  res.status(201).json({
    success: true,
    data: challenge,
    remainingCoins: user.coins
  });
});

// @desc    Accept a pending challenge from the feed
// @route   PUT /api/challenges/:id/accept
// @access  Private
exports.acceptChallenge = asyncHandler(async (req, res, next) => {
  const challenge = await Challenge.findById(req.params.id);
  const user = await User.findById(req.user.id);

  if (!challenge) return next(new ApiError(404, 'Challenge not found'));
  if (challenge.status !== 'pending') return next(new ApiError(400, 'Challenge already active or closed'));

  if (user.coins < challenge.pointsWager) {
    return next(new ApiError(400, 'Insufficient coins to accept this duel'));
  }

  // Deduct wager from opponent
  user.coins -= challenge.pointsWager;
  await user.save();

  challenge.opponent = req.user.id;
  challenge.status = 'accepted';
  await challenge.save();

  res.status(200).json({
    success: true,
    data: challenge,
    remainingCoins: user.coins
  });
});

// @desc    Submit result for a challenge
// @route   PUT /api/challenges/:id/submit
// @access  Private
exports.submitDuelResult = asyncHandler(async (req, res, next) => {
  const { score, timeTaken } = req.body;
  const challenge = await Challenge.findById(req.params.id);

  if (!challenge) return next(new ApiError(404, 'Challenge not found'));

  const isChallenger = challenge.challenger.toString() === req.user.id.toString();
  
  if (isChallenger) {
    challenge.challengerScore = score;
    challenge.challengerTime = timeTaken || 0;
  } else {
    challenge.opponentScore = score;
    challenge.opponentTime = timeTaken || 0;
  }

  // Check if both have finished
  if (challenge.challengerScore > -1 && challenge.opponentScore > -1) {
    challenge.status = 'completed';
    
    // Determine winner
    if (challenge.challengerScore > challenge.opponentScore) {
      challenge.winner = challenge.challenger;
    } else if (challenge.opponentScore > challenge.challengerScore) {
      challenge.winner = challenge.opponent;
    } else {
      challenge.winner = challenge.challengerTime < challenge.opponentTime ? challenge.challenger : challenge.opponent;
    }

    // Award Reward
    const winner = await User.findById(challenge.winner);
    winner.coins += (challenge.pointsWager * 2);
    await winner.save();
  }

  await challenge.save();

  res.status(200).json({
    success: true,
    data: challenge
  });
});

// @desc    Get battle stats for the current user
// @route   GET /api/challenges/stats
// @access  Private
exports.getUserBattleStats = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  const completedBattles = await Challenge.find({
    $or: [{ challenger: userId }, { opponent: userId }],
    status: 'completed'
  });

  const battlesWon = completedBattles.filter(b => b.winner && b.winner.toString() === userId.toString()).length;
  const totalBattles = completedBattles.length;
  const winRate = totalBattles > 0 ? Math.round((battlesWon / totalBattles) * 100) : 0;
  
  // Calculate Global Rank
  const higherRankedUsers = await User.countDocuments({
    totalPoints: { $gt: user.totalPoints }
  });
  const globalRank = higherRankedUsers + 1;

  res.status(200).json({
    success: true,
    data: {
      battlesWon,
      totalBattles,
      winRate,
      coins: user.coins,
      totalPoints: user.totalPoints,
      globalRank: `#${globalRank}`
    }
  });
});

// @desc    Get active open challenges for the BattleGround
// @route   GET /api/challenges/open
// @access  Private
exports.getOpenChallenges = asyncHandler(async (req, res) => {
  const challenges = await Challenge.find({ status: 'pending', opponent: null })
    .populate('challenger', 'name profileImage')
    .populate('quizId', 'title category')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: challenges
  });
});
