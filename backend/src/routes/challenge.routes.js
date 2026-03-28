const express = require('express');
const router = express.Router();
const { 
  createChallenge, 
  acceptChallenge, 
  submitDuelResult, 
  getOpenChallenges 
} = require('../controllers/challenge.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/create', createChallenge);
router.get('/open', getOpenChallenges);
router.put('/:id/accept', acceptChallenge);
router.put('/:id/submit', submitDuelResult);

module.exports = router;
