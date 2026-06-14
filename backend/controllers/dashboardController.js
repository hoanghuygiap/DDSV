const DashboardService = require('../services/dashboardService');

class DashboardController {
    async getAdminDashboard(req, res) {
        try {
            const data = await DashboardService.getAdminDashboard();

            return res.status(200).json({
                success: true,
                message: 'Lấy dashboard admin thành công',
                data
            });
        } catch (error) {
            console.error('getAdminDashboard error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Lỗi server'
            });
        }
    }

    async getLecturerDashboard(req, res) {
        try {
            const taiKhoanId = req.user.id;

            const data = await DashboardService.getLecturerDashboard(taiKhoanId);

            return res.status(200).json({
                success: true,
                message: 'Lấy dashboard giảng viên thành công',
                data
            });
        } catch (error) {
            console.error('getLecturerDashboard error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Lỗi server'
            });
        }
    }

    async getStudentDashboard(req, res) {
        try {
            const taiKhoanId = req.user.id;
            const { lop_mon_hoc_id } = req.query;

            const data = await DashboardService.getStudentDashboard(taiKhoanId, lop_mon_hoc_id);

            return res.status(200).json({
                success: true,
                message: 'Lấy dashboard sinh viên thành công',
                data
            });
        } catch (error) {
            console.error('getStudentDashboard error:', error);
            return res.status(500).json({
                success: false,
                message: error.message || 'Lỗi server'
            });
        }
    }
}

module.exports = new DashboardController();