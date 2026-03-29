const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error.middleware');
const ApiError = require('./utils/ApiError');

// Route files
const auth = require('./routes/auth.routes');
const quizzes = require('./routes/quiz.routes');
const leaderboard = require('./routes/leaderboard.routes');
const certificates = require('./routes/certificate.routes');
const reviews = require('./routes/review.routes');
const posts = require('./routes/post.routes');
const ai = require('./routes/ai.routes');
const interview = require('./routes/interview.routes');

const app = express();

// Security Header
app.use(helmet());

// Enable CORS
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // [TACTICAL] Allow requests with no origin (like mobile apps or institutional scans)
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.includes(origin) || 
                     (origin.endsWith('.vercel.app')) || 
                     (origin.endsWith('.onrender.com'));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`🚫 MISSION CRITICAL: CORS Blocked origin: ${origin}. Add to CLIENT_URL or authorize subdomain.`);
      callback(new Error('Institutional Access Denied by CORS'));
    }
  },
  credentials: true
}));

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'active', message: 'SoloLearn API is running smoothly' });
});

// Body parser (increase limit for base64 image uploads)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
console.log('✅ Body parser limits set to 50mb');

// Cookie parser
app.use(cookieParser());

// Sanitize data
app.use(mongoSanitize());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again in 10 minutes'
});
app.use('/api', limiter);

// Mount routers
app.use('/api/auth', auth);
app.use('/api/quizzes', quizzes);
app.use('/api/leaderboard', leaderboard);
app.use('/api/certificates', certificates);
app.use('/api/reviews', reviews);
app.use('/api/posts', posts);
app.use('/api/ai', ai);
app.use('/api/interview', interview);
app.use('/api/interview-daily', require('./routes/dailyInterview.routes'));
app.use('/api/mock-interview', require('./routes/mockInterview.routes'));
app.use('/api/challenges', require('./routes/challenge.routes'));
app.use('/api/career', require('./routes/career.routes'));

// 404 handler
app.all('*', (req, res, next) => {
  next(new ApiError(404, `Can't find ${req.originalUrl} on this server!`));
});

// Global Error Handler
app.use(errorHandler);

module.exports = app;
