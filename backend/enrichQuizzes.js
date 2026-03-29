const mongoose = require('mongoose');
const Quiz = require('./src/models/Quiz.model');
require('dotenv').config();

const advancedQuestionsPool = [
  { question: "What is the primary advantage of a Microservices architecture over a Monolithic one?", options: ["Easier to deploy as a single unit", "Independent scaling of components", "Reduced network latency", "Simpler debugging across services"], answerIndex: 1, explanation: "Microservices allow teams to deploy and scale different functional parts of an application independently." },
  { question: "In Big O notation, what is the time complexity of searching an element in a balanced Binary Search Tree?", options: ["O(1)", "O(n)", "O(log n)", "O(n^2)"], answerIndex: 2, explanation: "A balanced BST allows you to halve the search space at each step, resulting in logarithmic time complexity." },
  { question: "Which HTTP method is universally accepted as completely 'idempotent' by REST standards?", options: ["POST", "PUT", "PATCH", "CONNECT"], answerIndex: 1, explanation: "A PUT request creates or replaces a resource entirely. Calling it multiple times with the same payload results in the exact same state." },
  { question: "What is 'memoization' in dynamic programming?", options: ["Writing code from memory", "Storing the results of expensive function calls", "Managing memory leaks", "A special type of array"], answerIndex: 1, explanation: "Memoization caches the output of an expensive computation for specific inputs so it doesn't need to be recomputed." },
  { question: "What does the ACID acronym stand for in database transactions?", options: ["Asynchronous, Consistent, Isolated, Distributed", "Atomicity, Consistency, Isolation, Durability", "Active, Concurrent, Indexed, Durable", "Application, Cache, Insertion, Deletion"], answerIndex: 1, explanation: "ACID properties ensure that database transactions are processed reliably." },
  { question: "What is the purpose of CORS (Cross-Origin Resource Sharing) headers?", options: ["To prevent SQL injection", "To optimize image delivery", "To define which domains can access API resources", "To encrypt passwords"], answerIndex: 2, explanation: "CORS is a browser security measure that restricts Web pages from making requests to a different domain than the one that served the page." },
  { question: "In Git, what does a 'Fast-forward' merge mean?", options: ["Merging without reviewing the code", "The target branch has no new commits since the source branch diverged", "Pushing directly to origin/main", "A merge conflict that auto-resolves"], answerIndex: 1, explanation: "If there are no diverging commits, Git simply moves the pointer forward, which is a fast-forward merge." },
  { question: "What is a major characteristic of a NoSQL Key-Value store?", options: ["Complex SQL joins", "Strict schema enforcement", "Extreme speed for simple lookups", "Relational foreign keys"], answerIndex: 2, explanation: "Key-value stores like Redis are optimized for sub-millisecond lookups based on simple keys." },
  { question: "In React, what represents the mechanism that updates the browser DOM efficiently?", options: ["Real DOM", "Shadow DOM", "Virtual DOM", "Component DOM"], answerIndex: 2, explanation: "React builds a Virtual DOM in memory, calculates differences (diffing), and makes batched updates to the real DOM." },
  { question: "What does an API Gateway primarily pattern handle in a microservice architecture?", options: ["Database schema migration", "Routing requests, rate limiting, and auth", "Compiling frontend code", "Hosting container images"], answerIndex: 1, explanation: "An API Gateway acts as the single entry point, routing requests to the appropriate backend microservice." }
];

const seed = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("MONGO_URI is missing in .env");

    await mongoose.connect(mongoUri);
    console.log('📦 Connected to MongoDB for Enrichment...');

    const quizzes = await Quiz.find();
    let updatedCount = 0;
    
    // Enrich each quiz so it has at least 7 questions
    for (const quiz of quizzes) {
      if (quiz.questions.length < 7) {
        const needed = 7 - quiz.questions.length;
        
        // Pick random questions from the pool
        const shuffled = [...advancedQuestionsPool].sort(() => 0.5 - Math.random());
        const extraQuestions = shuffled.slice(0, needed);
        
        quiz.questions.push(...extraQuestions);
        quiz.pointsPerQuestion = 10;
        await quiz.save();
        updatedCount++;
        console.log(`[+] Enriched "${quiz.title}" with ${needed} extra questions.`);
      } else {
        console.log(`[=] "${quiz.title}" already has ${quiz.questions.length} questions.`);
      }
    }

    console.log(`✅ Successfully enriched ${updatedCount} quizzes! All technical tasks completed.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Enrichment failed:', err.message);
    process.exit(1);
  }
};

seed();
