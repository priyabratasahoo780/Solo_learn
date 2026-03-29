const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const generateCertificate = require('../utils/generateCertificate');
const { sendCertificateEmail, sendResetEmail } = require('../utils/sendEmail');

// Helper to check and update streak
const updateStreak = async (user) => {
  const now = new Date();
  const lastLogin = new Date(user.lastLogin || 0);
  
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const lastDate = new Date(lastLogin.getFullYear(), lastLogin.getMonth(), lastLogin.getDate()).getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  // Periodic points reset logic
  const lastReset = new Date(user.lastPointsReset || user.createdAt);
  const isNewWeek = today - new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate()).getTime() >= 7 * oneDay;
  const isNewMonth = now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear();

  if (isNewWeek || isNewMonth) {
    if (isNewWeek) user.weeklyPoints = 0;
    if (isNewMonth) user.monthlyPoints = 0;
    user.lastPointsReset = now;
    await user.save();
  }

  if (today === lastDate) return false;

  if (today - lastDate === oneDay) {
    user.streak = (user.streak || 0) + 1;
  } else {
    user.streak = 1;
  }
  
  user.lastLogin = now;
  await user.save();
  return true;
};

// Generate tokens and send response
const sendTokenResponse = async (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken(); // Ensure User model has this method or implement it

  // Update streak
  await updateStreak(user);

  // Create cookie options
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days matching refresh token
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', refreshToken, options)
    .json({
      success: true,
      token,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        coins: user.coins,
        totalPoints: user.totalPoints,
        badges: user.badges
      }
    });
};

// Removed OTP-related functions: sendOtp, verifyOtp, resendOtp

// @desc    Register user
// @route   POST /api/auth/signup
// @access  Public
exports.signup = asyncHandler(async (req, res, next) => {
  const { name, email, password, referralCode: usedReferralCode } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ApiError(400, 'User already exists'));
  }

  // Generate unique referral code for this user
  const myReferralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  let referredBy = null;
  let bonusCoins = 0;

  // Process Referral
  if (usedReferralCode) {
    const referrer = await User.findOne({ referralCode: usedReferralCode });
    if (referrer) {
      referredBy = referrer._id;
      bonusCoins = 500; // New user gets 500
      
      // Reward Referrer
      referrer.coins = (referrer.coins || 0) + 500;
      referrer.referralCount = (referrer.referralCount || 0) + 1;
      await referrer.save();
    }
  }

  const BASE_SIGNUP_BONUS = 100; // Every new user gets 100 coins to duel immediately

  const user = await User.create({
    name,
    email,
    password,
    referralCode: myReferralCode,
    referredBy,
    coins: BASE_SIGNUP_BONUS + bonusCoins // 100 base + 500 if referred
  });

  await sendTokenResponse(user, 201, res);
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Please provide an email and password'));
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return next(new ApiError(401, 'Invalid credentials'));
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ApiError(401, 'Invalid email or password. If you’ve previously used OTP, please use "Forgot Password" to set your account password.'));
  }

  await sendTokenResponse(user, 200, res);
});

// @desc    Log user out / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  await updateStreak(user);

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public (Cookie based)
exports.refresh = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies.token;

  if (!refreshToken) {
    return next(new ApiError(401, 'No refresh token provided'));
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    const accessToken = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      token: accessToken
    });
  } catch (err) {
    return next(new ApiError(401, 'Invalid refresh token'));
  }
});

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ApiError(404, 'There is no user with that email'));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

  try {
    // Instead of sending email from backend, we return the resetUrl
    // so the frontend can send it via EmailJS instantly.
    res.status(200).json({
      success: true,
      message: 'Reset URL generated. Frontend will dispatch email.',
      resetUrl,
      data: 'Email data ready'
    });
  } catch (err) {
    console.log('❌ Reset URL generation failed:', err.message);
    return next(new ApiError(500, 'Could not generate reset URL'));
  }
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  if (req.body.avatar !== undefined) {
    fieldsToUpdate.avatar = req.body.avatar;
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  const crypto = require('crypto');
  
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ApiError(400, 'Invalid token'));
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  await sendTokenResponse(user, 200, res);
});
