const mongoose = require('mongoose');

const careerRoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  dreamJob: {
    type: String,
    required: true
  },
  targetCompany: {
    type: String
  },
  readinessScore: {
    type: Number,
    default: 0
  },
  analysis: {
    strengths: [String],
    weaknesses: [String],
    recommendation: String
  },
  roadmap: [{
    day: Number,
    title: String,
    description: String,
    tasks: [{
      taskType: { type: String, enum: ['quiz', 'sandbox', 'interview', 'battle', 'review'] },
      taskName: String,
      isCompleted: { type: Boolean, default: false },
      referenceId: String
    }]
  }]
}, {
  timestamps: true
});

const CareerRoadmap = mongoose.model('CareerRoadmap', careerRoadmapSchema);
CareerRoadmap.createIndexes(); // Ensure indices (user, dreamJob)
module.exports = CareerRoadmap;
