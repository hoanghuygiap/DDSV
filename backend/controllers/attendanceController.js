const AttendanceService = require('../services/attendanceService');

class AttendanceController {
    static async checkin(req, res) {
        try {
            const data = await AttendanceService.checkin(req.body, req);

            return res.status(201).json({
                success: true,
                message: 'Điểm danh thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getBySession(req, res) {
        try {
            const data = await AttendanceService.getBySession(req.params.id);

            return res.json({
                success: true,
                message: 'Lấy danh sách điểm danh buổi học thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getByStudent(req, res) {
        try {
            const data = await AttendanceService.getByStudent(req.params.id, req.query);

            return res.json({
                success: true,
                message: 'Lấy lịch sử điểm danh sinh viên thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const data = await AttendanceService.update(
                req.params.id,
                req.body,
                req.user
            );

            return res.json({
                success: true,
                message: 'Cập nhật điểm danh thành công',
                data
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
            await AttendanceService.remove(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá điểm danh thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async manual(req, res) {
        try {
            const data = await AttendanceService.manual(req.body, req.user);

            return res.status(201).json({
                success: true,
                message: 'Điểm danh thủ công thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async autoAbsent(req, res) {
        try {
            const data = await AttendanceService.autoAbsent(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tự động đánh vắng thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async statistics(req, res) {
        try {
            const data = await AttendanceService.statistics(req.query);

            return res.json({
                success: true,
                message: 'Lấy thống kê điểm danh thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async exportExcel(req, res) {
        try {
            const buffer = await AttendanceService.exportExcel(req.query);

            res.setHeader(
                'Content-Type',
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            );
            res.setHeader(
                'Content-Disposition',
                'attachment; filename=bao-cao-diem-danh.xlsx'
            );

            return res.send(buffer);
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async realtime(req, res) {
        try {
            const data = await AttendanceService.realtime(req.params.sessionId);

            return res.json({
                success: true,
                message: 'Lấy realtime điểm danh thành công',
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

module.exports = AttendanceController;