import express from 'express';
import {
  registerUser,
  loginUser,
  googleLogin,
  getUserProfile,
  updateUserProfile,
  updateUserRole,
  getAllUsers,
  forgotPassword,
  resetPassword,
  adminUpdateUser,
  deleteUser,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/me', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.put('/role', protect, updateUserRole);

router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id', protect, admin, adminUpdateUser);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
