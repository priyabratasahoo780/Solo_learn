const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['status', 'achievement', 'quiz_completed', 'review', 'recommendation', 'interview_scorecard'],
    default: 'status'
  },
  metadata: {
    quizTitle: String,
    score: Number,
    percentage: Number,
    category: String,
    company: String,
    verdict: String,
    technical: Number,
    communication: Number,
    cultureFit: Number
  },
  referenceId: String, // Certificate Code or Quiz ID
  achievementId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
Post.createIndexes(); // Ensure indices (user, type, createdAt)
module.exports = Post;
