const express = require('express');
const router = express.Router();
const { getDailyQuestions, refreshDailyQuestions } = require('../controllers/dailyInterview.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/questions', getDailyQuestions);
router.post('/refresh', protect, authorize('admin'), refreshDailyQuestions);

module.exports = router;
