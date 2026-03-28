const express = require('express');
const router = express.Router();
const { 
  generateRoadmap, 
  getMyRoadmap, 
  completeTask 
} = require('../controllers/career.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/me', getMyRoadmap);
router.post('/generate', generateRoadmap);
router.put('/task/complete', completeTask);

module.exports = router;
