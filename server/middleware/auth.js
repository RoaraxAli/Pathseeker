const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verifies the JWT from the Authorization header and attaches req.user.
// Use on any route that requires a logged-in user.
async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Not authorized — no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Not authorized — user no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized — invalid or expired token' });
  }
}

// Attaches req.user if a valid token is present, but never rejects the
// request — for routes that are public but behave differently when the
// caller happens to be logged in (e.g. showing "your rating" on media).
async function optionalAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    // Invalid/expired token on an optional route — just proceed as anonymous.
  }
  next();
}

// Restricts a route to one or more roles. Use after `protect`.
// e.g. router.get('/admin/stuff', protect, requireRole('admin'), handler)
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden — insufficient role' });
    }
    next();
  };
}

module.exports = { protect, optionalAuth, requireRole };
