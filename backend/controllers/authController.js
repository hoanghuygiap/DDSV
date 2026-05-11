const AuthService = { login, logout, refreshToken, changePassword, resetPassword } = require('../services/authService');
const AuthModel = require('../models/authModel');
const jwt = require('jsonwebtoken');

const AuthController = {
    // [POST] /auth/login
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                return res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ tài khoản và mật khẩu.' });
            }
            const data = await AuthService.login(username, password);
            return res.status(200).json({ success: true, message: 'Đăng nhập thành công.', data });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },

    // [POST] /auth/logout
    logout: async (req, res) => {
        try {
            const userId = req.user.id; // Lấy ra từ token đã giải mã ở middleware
            await AuthService.logout(userId);
            return res.status(200).json({ success: true, message: 'Đăng xuất thành công.' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // [POST] /auth/refresh-token
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ success: false, message: 'Yêu cầu cung cấp Refresh Token.' });
            }
            const tokens = await AuthService.refreshToken(refreshToken);
            return res.status(200).json({ success: true, message: 'Làm mới token thành công.', data: tokens });
        } catch (error) {
            return res.status(401).json({ success: false, message: error.message });
        }
    },

    // [GET] /auth/me
    getMe: async (req, res) => {
        try {
            const user = await AuthModel.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Không tìm thấy thông tin người dùng.' });
            }
            return res.status(200).json({ success: true, data: user });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // [POST] /auth/change-password
    changePassword: async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ success: false, message: 'Vui lòng cung cấp mật khẩu cũ và mới.' });
            }
            await AuthService.changePassword(req.user.id, currentPassword, newPassword);
            return res.status(200).json({ success: true, message: 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại trên các thiết bị.' });
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message });
        }
    },

    // [POST] /auth/forgot-password (Giả lập gửi email OTP / Link reset)
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ success: false, message: 'Vui lòng cung cấp Email.' });
            }
            const user = await AuthModel.findByEmail(email);
            if (!user) {
                return res.status(404).json({ success: false, message: 'Email này không tồn tại trên hệ thống.' });
            }

            // Ở đây bạn có thể triển khai gửi mail chứa mã OTP hoặc link reset thực tế.
            // Đoạn mã mẫu này tạm thời mô phỏng việc tạo token reset password có hạn dùng 10 phút.
            const resetToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET || 'access_secret_key_123', { expiresIn: '10m' });

            return res.status(200).json({ 
                success: true, 
                message: 'Yêu cầu thành công. Đã tạo mã đặt lại mật khẩu gửi cho Client (mô phỏng).',
                resetToken // Trả ra token này để Client sử dụng gọi API reset-password tiếp theo
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // [POST] /auth/reset-password
    resetPassword: async (req, res) => {
        try {
            const { resetToken, newPassword } = req.body;
            if (!resetToken || !newPassword) {
                return res.status(400).json({ success: false, message: 'Thiếu mã reset hoặc mật khẩu mới.' });
            }

            // Giải mã token reset
            const decoded = jwt.verify(resetToken, process.env.ACCESS_TOKEN_SECRET || 'access_secret_key_123');
            await AuthService.resetPassword(decoded.email, newPassword);

            return res.status(200).json({ success: true, message: 'Đặt lại mật khẩu thành công.' });
        } catch (error) {
            return res.status(400).json({ success: false, message: 'Mã xác thực reset không hợp lệ hoặc đã hết hạn.' });
        }
    },

    // [POST] /auth/verify-token
    verifyToken: async (req, res) => {
        try {
            const { token } = req.body;
            if (!token) {
                return res.status(400).json({ success: false, message: 'Yêu cầu token để xác thực.' });
            }
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access_secret_key_123');
            return res.status(200).json({ success: true, message: 'Token hợp lệ.', data: decoded });
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
    }
};

module.exports = AuthController;