const NotificationService = require('../services/notificationService');

class NotificationController {
    static async getMyNotifications(req, res) {
        try {
            const data = await NotificationService.getMyNotifications(req.user.id, req.query);

            return res.json({
                success: true,
                message: 'Lấy danh sách thông báo thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            const data = await NotificationService.create(req.body, req.user);

            return res.status(201).json({
                success: true,
                message: 'Gửi thông báo thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getDetail(req, res) {
        try {
            const data = await NotificationService.getDetail(req.params.id, req.user.id);

            return res.json({
                success: true,
                message: 'Lấy chi tiết thông báo thành công',
                data
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async markAsRead(req, res) {
        try {
            await NotificationService.markAsRead(req.params.id, req.user.id);

            return res.json({
                success: true,
                message: 'Đánh dấu đã đọc thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async remove(req, res) {
        try {
            await NotificationService.remove(req.params.id, req.user.id);

            return res.json({
                success: true,
                message: 'Xoá thông báo thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async unreadCount(req, res) {
        try {
            const data = await NotificationService.unreadCount(req.user.id);

            return res.json({
                success: true,
                message: 'Đếm thông báo chưa đọc thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async readAll(req, res) {
        try {
            await NotificationService.readAll(req.user.id);

            return res.json({
                success: true,
                message: 'Đánh dấu tất cả thông báo là đã đọc thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = NotificationController;