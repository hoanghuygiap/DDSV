const UserModel = require('../models/userModel');

exports.requirePermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // 1. Check login từ JWT middleware
            if (!req.user?.id) {
                return res.status(401).json({
                    success: false,
                    message: 'Chưa xác thực tài khoản'
                });
            }

            // 2. Lấy quyền từ DB
            const userAuthorizations = await UserModel.getUserRolesAndPermissions(req.user.id);

            if (!userAuthorizations || userAuthorizations.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Không có quyền truy cập'
                });
            }

            // 3. Check admin (bypass toàn quyền)
            const isAdmin = userAuthorizations.some(
                (auth) => auth.ten_vai_tro === 'admin'
            );

            if (isAdmin) return next();

            // 4. Check permission cụ thể
            const hasPermission = userAuthorizations.some(
                (auth) => auth.ma_quyen === requiredPermission
            );

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'Bạn không có quyền thực hiện chức năng này'
                });
            }

            next();
        } catch (error) {
            console.error('Role middleware error:', error);

            return res.status(500).json({
                success: false,
                message: 'Lỗi hệ thống kiểm tra quyền'
            });
        }
    };
};