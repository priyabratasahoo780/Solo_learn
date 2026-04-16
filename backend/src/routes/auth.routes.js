const express = require('express');
const {
  signup,
  login,
  logout,
  getMe,
// ... existing imports
  refresh,
  forgotPassword,
  resetPassword,
  updateDetails,
  googleLogin
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.put('/updatedetails', protect, updateDetails);
router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);
// ... logout ...
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/refresh', refresh);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
