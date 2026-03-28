const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true,
    validate: [v => v.length === 4, 'Daily challenge must have 4 options']
  },
  answerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  },
  explanation: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    default: 'Medium'
  },
  category: {
    type: String,
    default: 'General'
  },
  pointsReward: {
    type: Number,
    default: 100
  },
  coinsReward: {
    type: Number,
    default: 50
  },
  isActive: {
    type: Boolean,
    default: true
  },
  date: {
    type: Date,
    default: () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0); // Normalize to start of day
      return d;
    },
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
