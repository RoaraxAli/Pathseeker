const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const { generateOTP, hashOTP, OTP_TTL_MS } = require('../utils/otp');
const serializeUser = require('../utils/serializeUser');

const router = express.Router();

// Public self-registration can only pick these roles — 'admin' is never
// assignable through this endpoint. Admins are created via the seed script.
const PUBLIC_ROLES = ['student', 'graduate', 'professional'];

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email, and password are required' });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }
    if (role && !PUBLIC_ROLES.includes(role)) {
      return res.status(400).json({ error: `role must be one of: ${PUBLIC_ROLES.join(', ')}` });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'student',
    });

    const token = signToken(user);
    res.status(201).json({ token, user: serializeUser(user) });
  } catch (err) {
    console.error('[auth/register] error:', err.message);
    res.status(500).json({ error: 'Something went wrong during registration' });
  }
});

// POST /api/auth/login
// Same endpoint for regular users and the seeded admin — role is whatever
// is stored on the user document, not something the caller can choose.
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = signToken(user);
    res.json({ token, user: serializeUser(user) });
  } catch (err) {
    console.error('[auth/login] error:', err.message);
    res.status(500).json({ error: 'Something went wrong during login' });
  }
});

// GET /api/auth/me — confirms a token is valid and returns the current user.
router.get('/me', protect, (req, res) => {
  res.json({ user: serializeUser(req.user) });
});

// POST /api/auth/forgot-password — always responds the same way whether or
// not the email exists, so this can't be used to enumerate accounts.
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'email is required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      const otp = generateOTP();
      user.resetOTPHash = hashOTP(otp);
      user.resetOTPExpires = new Date(Date.now() + OTP_TTL_MS);
      await user.save();

      await sendEmail({
        to: user.email,
        subject: 'Your PathSeeker password reset code',
        text: `Your password reset code is ${otp}. It expires in 10 minutes.`,
        html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`,
      });
    }

    res.json({ message: 'If an account exists for that email, a reset code has been sent.' });
  } catch (err) {
    console.error('[auth/forgot-password] error:', err.message);
    res.status(500).json({ error: 'Something went wrong requesting a reset code' });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'email, otp, and newPassword are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+resetOTPHash +resetOTPExpires'
    );

    if (
      !user ||
      !user.resetOTPHash ||
      !user.resetOTPExpires ||
      user.resetOTPExpires < new Date() ||
      user.resetOTPHash !== hashOTP(otp)
    ) {
      return res.status(400).json({ error: 'Invalid or expired reset code' });
    }

    user.password = newPassword;
    user.resetOTPHash = undefined;
    user.resetOTPExpires = undefined;
    await user.save();

    res.json({ message: 'Password has been reset. You can now log in.' });
  } catch (err) {
    console.error('[auth/reset-password] error:', err.message);
    res.status(500).json({ error: 'Something went wrong resetting the password' });
  }
});

module.exports = router;
