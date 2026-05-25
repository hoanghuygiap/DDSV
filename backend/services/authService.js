const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/authModel');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key_123';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key_456';
const ACCESS_TOKEN_LIFE = '15m'; // Access token sống ngắn (15 phút)
const REFRESH_TOKEN_LIFE_DAYS = 7; // Refresh token sống 7 ngày

const AuthService = {
    // Tạo cặp Access Token và Refresh Token
    generateTokens: (user) => {
        const payload = {
            id: user.id,
            username: user.username,
            vai_tro: user.vai_tro ? user.vai_tro.split(',') : [],
            quyen: user.quyen ? user.quyen.split(',') : []
        };

        const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE });
        const refreshToken = jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: `${REFRESH_TOKEN_LIFE_DAYS}d` });

        return { accessToken, refreshToken };
    },

    // Đăng nhập người dùng
    login: async (username, password) => {
        const user = await AuthModel.findByUsername(username);
        if (!user) {
            throw new Error('Tài khoản hoặc mật khẩu không chính xác.');
        }

        if (!user.kich_hoat) {
            throw new Error('Tài khoản đã bị vô hiệu hóa.');
        }

        // Kiểm tra tài khoản có đang bị khóa tạm thời không
        if (user.lock_until && new Date(user.lock_until) > new Date()) {
            const timeLeft = Math.ceil((new Date(user.lock_until) - new Date()) / 1000 / 60);
            throw new Error(`Tài khoản đang bị khóa. Vui lòng thử lại sau ${timeLeft} phút.`);
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            const newAttempts = user.failed_attempts + 1;
            let lockUntil = null;
            if (newAttempts >= 5) {
                // Khóa tài khoản 15 phút nếu nhập sai quá 5 lần
                lockUntil = new Date(Date.now() + 15 * 60 * 1000);
            }
            await AuthModel.updateLoginAttempts(username, newAttempts, lockUntil);
            throw new Error(lockUntil ? 'Nhập sai quá nhiều. Tài khoản bị khóa 15 phút.' : 'Tài khoản hoặc mật khẩu không chính xác.');
        }

        // Đăng nhập thành công -> Reset trạng thái lỗi & cập nhật ngày giờ đăng nhập
        await AuthModel.resetLoginAttemptsAndSetLoginTime(user.id);

        // Tạo Token
        const { accessToken, refreshToken } = AuthService.generateTokens(user);

        // Lưu refresh token vào DB
        const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFE_DAYS * 24 * 60 * 60 * 1000);
        await AuthModel.updateRefreshToken(user.id, refreshToken, expiresAt);

        return {
            user: {
                id: user.id,
                username: user.username,
                ho_ten: user.ho_ten,
                email: user.email,
                vai_tro: user.vai_tro ? user.vai_tro.split(',') : [],
                quyen: user.quyen ? user.quyen.split(',') : []
            },
            accessToken,
            refreshToken
        };
    },

    // Đăng xuất (Revoke Refresh Token)
    logout: async (userId) => {
        await AuthModel.revokeRefreshToken(userId);
    },

    // Refresh Token mới
    refreshToken: async (oldRefreshToken) => {
        try {
            const decoded = jwt.verify(oldRefreshToken, REFRESH_TOKEN_SECRET);
            const userTokenData = await AuthModel.getRefreshToken(decoded.id);

            if (!userTokenData || userTokenData.refresh_token !== oldRefreshToken) {
                throw new Error('Refresh Token không hợp lệ hoặc đã bị hủy.');
            }

            if (new Date(userTokenData.refresh_token_het_han) < new Date()) {
                throw new Error('Refresh Token đã hết hạn. Vui lòng đăng nhập lại.');
            }

            const user = await AuthModel.findById(decoded.id);
            const tokens = AuthService.generateTokens(user);

            // Cập nhật lại Refresh Token mới xoay vòng (Token Rotation) để bảo mật
            const expiresAt = new Date(Date.now() + REFRESH_TOKEN_LIFE_DAYS * 24 * 60 * 60 * 1000);
            await AuthModel.updateRefreshToken(user.id, tokens.refreshToken, expiresAt);

            return tokens;
        } catch (error) {
            throw new Error(error.message || 'Mã xác thực không hợp lệ.');
        }
    },

    // Đổi mật khẩu
    changePassword: async (userId, currentPassword, newPassword) => {
        const db = require('../config/db');
        const [rows] = await db.query('SELECT password_hash FROM tai_khoan WHERE id = ?', [userId]);
        const user = rows[0];

        if (!user) throw new Error('Người dùng không tồn tại.');

        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) throw new Error('Mật khẩu hiện tại không chính xác.');

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await AuthModel.updatePassword(userId, newHash);
        await AuthModel.revokeRefreshToken(userId); // Bắt buộc đăng nhập lại trên các thiết bị khác
    },

    // Đặt lại mật khẩu (Sử dụng cho quên mật khẩu)
    resetPassword: async (email, newPassword) => {
        const user = await AuthModel.findByEmail(email);
        if (!user) throw new Error('Email không tồn tại trên hệ thống.');

        const salt = await bcrypt.genSalt(10);
        const newHash = await bcrypt.hash(newPassword, salt);

        await AuthModel.updatePassword(user.id, newHash);
        await AuthModel.revokeRefreshToken(user.id);
    }
};

module.exports = AuthService;