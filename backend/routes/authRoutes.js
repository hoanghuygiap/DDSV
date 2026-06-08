const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Các Endpoint công khai không cần Token
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/forgot-password', AuthController.forgotPassword);
router.post('/reset-password', AuthController.resetPassword);
router.post('/verify-token', AuthController.verifyToken);

// Các Endpoint cần được bảo vệ bởi authMiddleware (Đã Đăng Nhập)
router.post('/logout', authMiddleware, AuthController.logout);
router.get('/me', authMiddleware, AuthController.getMe);
router.post('/change-password', authMiddleware, AuthController.changePassword);

module.exports = router;