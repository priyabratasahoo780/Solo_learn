const mongoose = require('mongoose');

const dailyInterviewSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    unique: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String, // Concise "one-liner" answer
    required: true
  },
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isAI: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DailyInterview', dailyInterviewSchema);
