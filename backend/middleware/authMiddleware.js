const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key_123';

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy chuỗi sau "Bearer "

    if (!token) {
        return res.status(401).json({ success: false, message: 'Yêu cầu không được xác thực. Thiếu Token.' });
    }

    try {
        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        req.user = decoded; // Gán payload của token vào object request (req.user)
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Mã token không hợp lệ hoặc đã hết hạn.' });
    }
};

module.exports = authMiddleware;