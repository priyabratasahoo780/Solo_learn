const mongoose = require('mongoose');
const DailyInterview = require('./src/models/DailyInterview.model');
require('dotenv').config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connected for Daily MNC Initialization...');

    const data = [
      {
        company: 'Google',
        question: 'How would you scale a read-heavy system with 1 million writes per second?',
        answer: 'Use a write-ahead log (WAL) and sharded databases with asynchronous replication and local caching.',
        category: 'System Design',
        difficulty: 'Advanced'
      },
      {
        company: 'Amazon',
        question: 'Explain the difference between S3 and EBS and when to use each.',
        answer: 'S3 is for scalable object storage (photos/logs), EBS is for persistent block storage attached to EC2 instances (OS/DBs).',
        category: 'Cloud',
        difficulty: 'Intermediate'
      },
      {
        company: 'Swiggy',
        question: 'What is the Event Loop in JavaScript and how does it handle asynchronous operations?',
        answer: 'It is a mechanism that handles the execution of multiple chunks of your code over time, each at a time, using a Task Queue.',
        category: 'JavaScript',
        difficulty: 'Advanced'
      },
      {
        company: 'Microsoft',
        question: 'Write a function to detect if a linked list has a cycle.',
        answer: 'Use Floyd\'s Cycle-Finding Algorithm with a slow and fast pointer.',
        category: 'DSA',
        difficulty: 'Intermediate'
      },
      {
        company: 'Meta',
        question: 'What is the difference between a functional and a class component in React?',
        answer: 'Functional components are simpler, use Hooks (like useEffect), and are generally more performant than class components.',
        category: 'React',
        difficulty: 'Intermediate'
      },
      {
        company: 'Netflix',
        question: 'How does Netflix maintain high availability when an entire AWS region goes down?',
        answer: 'By using cross-region replication and multi-region traffic steering through global CDNs.',
        category: 'DevOps',
        difficulty: 'Advanced'
      },
      {
        company: 'Uber',
        question: 'How would you design a rate limiter for a high-traffic API?',
        answer: 'Use a Token Bucket or Leaky Bucket algorithm implemented in Redis for distributed consistency.',
        category: 'System Design',
        difficulty: 'Advanced'
      },
      {
        company: 'Adobe',
        question: 'Explain the concept of Web Workers and when to use them.',
        answer: 'Web Workers allow running scripts in background threads, ideal for heavy computations without blocking the UI thread.',
        category: 'JavaScript',
        difficulty: 'Intermediate'
      },
      {
        company: 'Flipkart',
        question: 'How do you prevent SQL injection in a Node.js application?',
        answer: 'By using parameterized queries or ORMs like Sequelize/Mongoose that sanitize input automatically.',
        category: 'SQL',
        difficulty: 'Intermediate'
      },
      {
        company: 'Zomato',
        question: 'What is the difference between Redis and MongoDB?',
        answer: 'Redis is an in-memory key-value store optimized for speed, while MongoDB is a document-oriented database for complex data structures.',
        category: 'NoSQL',
        difficulty: 'Intermediate'
      }
    ];

    await DailyInterview.deleteMany({}); // Fresh start
    await DailyInterview.insertMany(data);
    console.log(`✅ Successfully seeded ${data.length} Daily MNC Hot Picks!`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Daily MNC Seeding failed:', err.message);
    process.exit(1);
  }
};

seed();
