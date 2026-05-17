const SessionService = require('../services/sessionService');

class SessionController {
    static async getAllSessions(req, res) {
        try {
            const result = await SessionService.getAllSessions(req.query);

            return res.json({
                success: true,
                message: 'Lấy danh sách buổi học thành công',
                ...result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getSessionById(req, res) {
        try {
            const data = await SessionService.getSessionById(req.params.id);

            return res.json({
                success: true,
                message: 'Lấy chi tiết buổi học thành công',
                data
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createSession(req, res) {
        try {
            const data = await SessionService.createSession(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo buổi học thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateSession(req, res) {
        try {
            const data = await SessionService.updateSession(req.params.id, req.body);

            return res.json({
                success: true,
                message: 'Cập nhật buổi học thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteSession(req, res) {
        try {
            await SessionService.deleteSession(req.params.id);

            return res.json({
                success: true,
                message: 'Huỷ buổi học thành công'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async openAttendance(req, res) {
        try {
            const data = await SessionService.openAttendance(req.params.id);

            return res.json({
                success: true,
                message: 'Mở điểm danh thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async closeAttendance(req, res) {
        try {
            await SessionService.closeAttendance(req.params.id);

            return res.json({
                success: true,
                message: 'Đóng điểm danh thành công'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async changeRoom(req, res) {
        try {
            const data = await SessionService.changeRoom(
                req.params.id,
                req.body.phong_hoc_id
            );

            return res.json({
                success: true,
                message: 'Đổi phòng học thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = SessionController;