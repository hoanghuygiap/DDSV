const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET =
    process.env.ACCESS_TOKEN_SECRET || 'access_secret_key_123';

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Thiếu access token'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(403).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn'
        });
    }
};

module.exports = authMiddleware;