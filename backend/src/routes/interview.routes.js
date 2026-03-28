const express = require('express');
const { getQuestions, seedInterviewData } = require('../controllers/interview.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/seed', protect, authorize('admin'), seedInterviewData);

module.exports = router;
