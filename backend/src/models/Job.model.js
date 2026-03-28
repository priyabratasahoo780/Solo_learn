const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  logo: {
    type: String
  },
  requiredSkills: [{
    category: {
      type: String,
      required: true
    },
    minLevel: {
      type: Number,
      required: true
    }
  }],
  salary: {
    type: String
  },
  location: {
    type: String
  },
  type: {
    type: String,
    enum: ['Internship', 'Full-time', 'Part-time', 'Contract'],
    default: 'Internship'
  },
  link: {
    type: String // Link to original job posting (or simulated application flow)
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
