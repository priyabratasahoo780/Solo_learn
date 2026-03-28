const mongoose = require('mongoose');

const missionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['SolveQuiz', 'EarnXP', 'DuelWin', 'SharePost', 'ReferFriend'],
    required: true
  },
  targetCount: {
    type: Number,
    required: true
  },
  rewardCoins: {
    type: Number,
    default: 100
  },
  difficulty: {
    type: String,
    enum: ['Common', 'Rare', 'Epic', 'Legendary'],
    default: 'Common'
  },
  isDaily: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Mission', missionSchema);
