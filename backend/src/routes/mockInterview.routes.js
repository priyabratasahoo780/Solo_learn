const express = require('express');
const router = express.Router();
const { startInterview, chatWithRecruiter, finishInterview } = require('../controllers/mockInterview.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/start', protect, startInterview);
router.post('/:id/chat', protect, chatWithRecruiter);
router.post('/:id/finish', protect, finishInterview);

module.exports = router;
