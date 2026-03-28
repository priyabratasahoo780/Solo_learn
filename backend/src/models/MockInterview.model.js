const mongoose = require('mongoose');

const mockInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'Software Engineer'
  },
  recruiterPersona: {
    type: String,
    required: true
  },
  transcript: [{
    sender: { type: String, enum: ['recruiter', 'user'] },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['ongoing', 'completed'],
    default: 'ongoing'
  },
  scorecard: {
    technical: Number, // 0-100
    communication: Number, // 0-100
    cultureFit: Number, // 0-100
    overall: Number,
    verdict: { type: String, enum: ['HIRE', 'NO-HIRE', 'PENDING'], default: 'PENDING' },
    summary: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('MockInterview', mockInterviewSchema);
