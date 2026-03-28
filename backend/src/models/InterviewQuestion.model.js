const mongoose = require('mongoose');

const interviewQuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true
  },
  answer: {
    type: String,
    required: [true, 'Please add a concise answer'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please select a subject (e.g., JavaScript, Python)'],
    enum: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'DSA', 'System Design', 'General'],
    default: 'General'
  },
  companies: {
    type: [String],
    default: [] // e.g., ["Google", "Amazon", "Flipkart"]
  },
  difficulty: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Intermediate'
  },
  recentAsked: {
    type: Boolean,
    default: true
  },
  isOneLiner: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewQuestion', interviewQuestionSchema);
