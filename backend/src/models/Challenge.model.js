const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  challenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'declined'],
    default: 'pending'
  },
  challengerScore: {
    type: Number,
    default: 0
  },
  opponentScore: {
    type: Number,
    default: 0
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  pointsWager: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

const Challenge = mongoose.model('Challenge', challengeSchema);
Challenge.createIndexes(); // Ensure indices (status, challenger, opponent, quizId)
module.exports = Challenge;
