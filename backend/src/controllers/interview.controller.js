const InterviewQuestion = require('../models/InterviewQuestion.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');

// @desc    Get all interview questions with filtering
// @route   GET /api/interview/questions
// @access  Public
exports.getQuestions = asyncHandler(async (req, res, next) => {
  let query;

  // Copy req.query
  const reqQuery = { ...req.query };

  // Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];
  removeFields.forEach(param => delete reqQuery[param]);

  // Support Company Filtering (e.g., ?company=Google)
  if (reqQuery.company) {
    reqQuery.companies = { $in: [reqQuery.company] };
    delete reqQuery.company;
  }

  // Support Subject Filtering (e.g., ?category=JavaScript)
  if (reqQuery.category) {
    reqQuery.category = reqQuery.category;
  }

  query = InterviewQuestion.find(reqQuery);

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields);
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await InterviewQuestion.countDocuments(reqQuery);

  query = query.skip(startIndex).limit(limit);

  const results = await query;

  res.status(200).json({
    success: true,
    count: results.length,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit)
    },
    data: results
  });
});

// @desc    Seed real-world interview data (Admin Only)
// @route   POST /api/interview/seed
// @access  Private (Admin Role)
exports.seedInterviewData = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'admin') {
    return next(new ApiError(401, 'Unauthorized'));
  }

  const realData = [
    {
      question: "What is a Closure in JavaScript?",
      answer: "A function bundled with its lexical environment, allowing it to access outer scope variables even after the outer function has returned.",
      category: "JavaScript",
      companies: ["Google", "Microsoft", "Amazon", "Flipkart"],
      difficulty: "Intermediate"
    },
    {
      question: "Explain the difference between Virtual DOM and Real DOM in React.",
      answer: "Virtual DOM is a lightweight representation of the Real DOM; React uses it to batch updates and minimize expensive direct DOM manipulations.",
      category: "React",
      companies: ["Meta", "Flipkart", "Swiggy"],
      difficulty: "Intermediate"
    },
    {
      question: "What are Promises and why are they used?",
      answer: "Objects representing the eventual completion (or failure) of an asynchronous operation, used to avoid callback hell.",
      category: "JavaScript",
      companies: ["Swiggy", "Amazon", "Microsoft"],
      difficulty: "Beginner"
    },
    {
      question: "Explain Time Complexity of searching in a Binary Search Tree (BST).",
      answer: "O(log n) on average for balanced trees, but O(n) in the worst case (skewed tree).",
      category: "DSA",
      companies: ["Google", "Amazon", "Microsoft"],
      difficulty: "Advanced"
    },
    {
      question: "What is the use of 'key' prop in React lists?",
      answer: "Helps React identify which items have changed, been added, or removed, optimizing rendering performance.",
      category: "React",
      companies: ["Flipkart", "Swiggy", "PhonePe"],
      difficulty: "Beginner"
    }
    // ... Multi-seeding will be handled in a dedicated script for the 50+ list.
  ];

  await InterviewQuestion.deleteMany();
  const created = await InterviewQuestion.create(realData);

  res.status(201).json({
    success: true,
    data: created
  });
});
