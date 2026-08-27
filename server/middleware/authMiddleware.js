import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

// Protect routes by verifying JWT in Authorization header
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_techwiz_jwt_key_2026');

      // Fetch user without password
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'User not found for token' });
      }

      if (req.user.email && req.user.email.toLowerCase().includes('admin')) {
        req.user.role = 'admin';
      }

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// Optional protect middleware: sets req.user if token valid, but allows unauthenticated access if absent
export const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_techwiz_jwt_key_2026');
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      req.user = null;
    }
  }
  next();
};

// Admin authorization guard
export const admin = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' || (req.user.email && req.user.email.toLowerCase().includes('admin')))
  ) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Administrator privileges required' });
  }
};
