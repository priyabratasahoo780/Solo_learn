const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User.model');
const Post = require('./src/models/Post.model');

const seedPosts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Strategy...');

    // 1. Create Elite Community Users
    const communityUsers = [
      { name: 'Alex Rivera', email: 'alex@community.dev', password: 'password123', points: 1250, streak: 14 },
      { name: 'Sofia Chen', email: 'sofia@community.dev', password: 'password123', points: 2800, streak: 42 },
      { name: 'Marcus Thorne', email: 'marcus@community.dev', password: 'password123', points: 950, streak: 5 },
      { name: 'Immersive AI', email: 'ai@community.dev', password: 'password123', points: 5000, streak: 100 }
    ];

    const users = [];
    for (const u of communityUsers) {
      let user = await User.findOne({ email: u.email });
      if (!user) {
        user = await User.create(u);
      }
      users.push(user);
    }

    console.log('Community users ready.');

    // 2. Clear existing posts to avoid duplicates
    await Post.deleteMany({ type: { $in: ['status', 'achievement', 'interview_scorecard', 'quiz_completed'] } });

    // 3. Create Diverse Universal Feed Content
    const posts = [
      {
        user: users[1]._id,
        content: "Just crushed the React Hooks Masterclass quiz! 🚀 The persistence paid off. Highly recommend this for anyone struggling with useEffect optimization.",
        type: 'achievement',
        metadata: { quizTitle: 'React Hooks Masterclass', score: 95, percentage: 95 }
      },
      {
        user: users[0]._id,
        content: "Finished a Google Mock Interview simulation. AI Sarah really pushes the technical boundaries on System Design! 🎯",
        type: 'interview_scorecard',
        metadata: { 
          company: 'Google', 
          verdict: 'HIRE', 
          technical: 92, 
          communication: 88, 
          cultureFit: 95, 
          score: 91 
        }
      },
      {
        user: users[3]._id,
        content: "System Update: The Universal Feed is now decentralized and fully operational. Share your progress and connect with fellow engineers! 🌐",
        type: 'status'
      },
      {
        user: users[2]._id,
        content: "Anyone else finding the Python AsyncIO module a bit tricky? Practicing in the SoloLearn Sandbox today. 🧠",
        type: 'status'
      },
      {
        user: users[1]._id,
        content: "Consistency is the only superpower that matters in coding. Day 42 of my streak and still learning every day! 🔥",
        type: 'achievement'
      },
      {
        user: users[0]._id,
        content: "Scorecard Result: Amazon Mock Interview completed. Focus area for next time: Dynamic Programming optimization. 📦",
        type: 'interview_scorecard',
        metadata: { 
          company: 'Amazon', 
          verdict: 'LEAN HIRE', 
          technical: 78, 
          communication: 85, 
          cultureFit: 90, 
          score: 84 
        }
      },
      {
        user: users[2]._id,
        content: "Just unlocked the 'JavaScript Architect' certificate! 🏆 Building complex apps feels much more intuitive now.",
        type: 'achievement',
        metadata: { quizTitle: 'Clean Code & Architecture', score: 100, percentage: 100 }
      }
    ];

    await Post.create(posts);
    console.log('Universal Feed seeded successfully with 7 premium posts.');

    process.exit(0);
  } catch (err) {
    console.error('Seeding failure:', err);
    process.exit(1);
  }
};

seedPosts();
