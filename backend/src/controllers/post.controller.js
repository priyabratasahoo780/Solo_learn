const Post = require('../models/Post.model');
const Notification = require('../models/Notification.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all feed posts
// @route   GET /api/posts
// @access  Private
exports.getFeed = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate('user', 'name profileImage')
    .populate('comments.user', 'name profileImage')
    .sort({ createdAt: -1 })
    .limit(50);

  res.status(200).json({
    success: true,
    count: posts.length,
    data: posts
  });
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
exports.createPost = asyncHandler(async (req, res, next) => {
  const { content, type, metadata } = req.body;

  if (!content) {
    return next(new ApiError(400, 'Please provide content for the post'));
  }

  const post = await Post.create({
    user: req.user.id,
    content,
    type: type || 'status',
    metadata: metadata || {}
  });

  const populatedPost = await Post.findById(post._id).populate('user', 'name profileImage');

  res.status(201).json({
    success: true,
    data: populatedPost
  });
});

// @desc    Like/Unlike a post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.toggleLike = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  const isLiked = post.likes.includes(req.user.id);

  if (!isLiked) {
    post.likes.push(req.user.id);
    
    // Create Notification
    if (post.user.toString() !== req.user.id.toString()) {
       await Notification.create({
         user: post.user,
         sender: req.user.id,
         type: 'like',
         message: `${req.user.name} liked your challenge achievement!`,
         referenceId: post._id
       });
    }
  } else {
    post.likes = post.likes.filter(id => id.toString() !== req.user.id.toString());
  }

  await post.save();

  res.status(200).json({
    success: true,
    likes: post.likes.length,
    isLiked: !isLiked
  });
});

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.addComment = asyncHandler(async (req, res, next) => {
  const { text } = req.body;
  if (!text) {
    return next(new ApiError(400, 'Comment text is required'));
  }

  const post = await Post.findById(req.params.id);

  if (!post) {
    return next(new ApiError(404, 'Post not found'));
  }

  const comment = {
    user: req.user.id,
    text
  };

  post.comments.unshift(comment);
  await post.save();

  // Create Notification
  if (post.user.toString() !== req.user.id.toString()) {
     await Notification.create({
       user: post.user,
       sender: req.user.id,
       type: 'comment',
       message: `${req.user.name} commented on your achievement!`,
       referenceId: post._id
     });
  }

  const freshPost = await Post.findById(post._id).populate('comments.user', 'name profileImage');

  res.status(201).json({
    success: true,
    data: freshPost.comments[0]
  });
});

// @desc    Recommend a quiz to the social feed
// @route   POST /api/posts/share-quiz
// @access  Private
exports.shareQuiz = asyncHandler(async (req, res, next) => {
  const { quizId, quizTitle, category, note } = req.body;

  if (!quizId || !quizTitle) {
    return next(new ApiError(400, 'Quiz ID and Title are required'));
  }

  const post = await Post.create({
    user: req.user.id,
    content: note || `I highly recommend checking out this ${quizTitle} challenge! 🚀`,
    type: 'recommendation',
    referenceId: quizId,
    metadata: {
      quizTitle,
      category,
      type: 'quiz_recommendation'
    }
  });

  const populatedPost = await Post.findById(post._id).populate('user', 'name profileImage');

  res.status(201).json({
    success: true,
    data: populatedPost
  });
});

// @desc    Share interview scorecard to feed
// @route   POST /api/posts/share-scorecard
// @access  Private
exports.shareScorecard = asyncHandler(async (req, res, next) => {
  const { scorecard, company, message } = req.body;

  if (!scorecard || !company) {
    return next(new ApiError(400, 'Scorecard and Company are required'));
  }

  const post = await Post.create({
    user: req.user.id,
    content: message || `I just completed a mock interview for ${company}! 🎯 Result: ${scorecard.verdict}`,
    type: 'interview_scorecard',
    metadata: {
      company,
      verdict: scorecard.verdict,
      technical: scorecard.technical,
      communication: scorecard.communication,
      cultureFit: scorecard.cultureFit,
      score: scorecard.overall
    }
  });

  const populatedPost = await Post.findById(post._id).populate('user', 'name profileImage');

  res.status(201).json({
    success: true,
    data: populatedPost
  });
});
