const Job = require('../models/Job.model');
const User = require('../models/User.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all jobs matching user skills
// @route   GET /api/jobs/matched
// @access  Private
exports.getMatchedJobs = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  const allJobs = await Job.find();

  // Logic: A job is matched if the user's skillLevel in every required category 
  // is >= the job's minLevel.
  // Skill Level = floor(skillPoints / 1000)
  
  const matched = allJobs.filter(job => {
    let qualifies = true;
    
    job.requiredSkills.forEach(reqSkill => {
      const userPoints = user.skillPoints.get(reqSkill.category) || 0;
      const userLevel = Math.floor(userPoints / 1000);
      
      if (userLevel < reqSkill.minLevel) {
        qualifies = false;
      }
    });

    return qualifies;
  });

  res.status(200).json({
    success: true,
    count: matched.length,
    data: matched
  });
});

// @desc    Get job details
// @route   GET /api/jobs/:id
// @access  Private
exports.getJob = asyncHandler(async (req, res, next) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    return next(new ApiError(404, 'Job opportunity not found'));
  }

  res.status(200).json({
    success: true,
    data: job
  });
});

// @desc    Seed few initial mock jobs (Admin Only)
// @route   POST /api/jobs/seed
// @access  Private (Admin Role)
exports.seedJobs = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const mockJobs = [
    {
      title: "Frontend Intern",
      company: "Google",
      description: "Looking for advanced ReactJS enthusiasts to build modern UIs.",
      requiredSkills: [
        { category: "ReactJS", minLevel: 2 },
        { category: "CSS", minLevel: 1 }
      ],
      salary: "$5000/mo (Internship)",
      location: "Remote",
      type: "Internship"
    },
    {
      title: "Junior Backend Developer",
      company: "Stripe",
      description: "Work on Node.js microservices and database architecture.",
      requiredSkills: [
        { category: "Node.js", minLevel: 3 },
        { category: "SQL", minLevel: 2 }
      ],
      salary: "$120,000/yr",
      location: "San Francisco",
      type: "Full-time"
    },
    {
      title: "JavaScript Guru",
      company: "Meta",
      description: "Deep dive into JS internals and optimization.",
      requiredSkills: [
        { category: "JavaScript", minLevel: 5 }
      ],
      salary: "$180,000/yr",
      location: "Remote",
      type: "Full-time"
    }
  ];

  await Job.deleteMany(); // Clear old seeds
  const createdJobs = await Job.create(mockJobs);

  res.status(201).json({
    success: true,
    data: createdJobs
  });
});
