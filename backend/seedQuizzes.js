const mongoose = require('mongoose');
const User = require('./src/models/User.model');
const Quiz = require('./src/models/Quiz.model');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected to MongoDB for Seeding...');

    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('❌ No Admin user found. Please create an admin first.');
      process.exit(1);
    }

    const quizzes = [
      {
        title: "Python Fundamentals",
        description: "Master the basics of Python syntax and data types.",
        category: "Python",
        difficulty: "Beginner",
        createdBy: admin._id,
        questions: [
          { question: "What is the output of print(2**3)?", options: ["6", "8", "9", "5"], answerIndex: 1, explanation: "** is the exponentiation operator." },
          { question: "Which collection is ordered and unchangeable?", options: ["List", "Set", "Dictionary", "Tuple"], answerIndex: 3, explanation: "Tuples are immutable sequences." }
        ]
      },
      {
        title: "Advanced SQL Joins",
        description: "Deep dive into complex database queries.",
        category: "SQL",
        difficulty: "Advanced",
        createdBy: admin._id,
        questions: [
          { question: "Which join returns all records from both tables?", options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"], answerIndex: 3 },
          { question: "What does the UNION operator do?", options: ["Joins tables", "Combines result sets", "Filters rows", "Sorts data"], answerIndex: 1 }
        ]
      },
      {
        title: "React State & Hooks",
        description: "Modern state management in React.",
        category: "ReactJS",
        difficulty: "Intermediate",
        createdBy: admin._id,
        questions: [
          { question: "When does useEffect run by default?", options: ["Once", "Every render", "Only on mount", "Never"], answerIndex: 1 },
          { question: "Which hook is used for complex state logic?", options: ["useState", "useMemo", "useReducer", "useCallback"], answerIndex: 2 }
        ]
      },
      // ... Add 12 more quizzes here (Simulated for brevity in this step)
      {
        title: "JavaScript ES2024",
        description: "The latest features in the JS ecosystem.",
        category: "JavaScript",
        difficulty: "Advanced",
        createdBy: admin._id,
        questions: [
          { question: "Which new feature helps with deep cloning?", options: ["structuredClone", "deepCopy", "JSON.parse", "Object.assign"], answerIndex: 0 }
        ]
      }
    ];

    // Bulk Create
    await Quiz.insertMany(quizzes);
    console.log(`✅ Successfully seeded ${quizzes.length} New Quizzes!`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
