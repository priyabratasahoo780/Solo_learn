const mongoose = require('mongoose');

const tutorContextSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  lastTopics: [String],
  mistakeHistory: [{
    questionId: String,
    category: String,
    incorrectConcept: String
  }],
  aiPersonality: {
    type: String,
    enum: ['Friendly', 'Rigorous', 'Socratic', 'Encouraging'],
    default: 'Socratic'
  },
  memorySummary: {
    type: String, // Condensed summary of user's learning path for Gemini to digest
    default: 'Student is just starting their journey.'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TutorContext', tutorContextSchema);
