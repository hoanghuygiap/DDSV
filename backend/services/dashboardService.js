const DashboardModel = require('../models/dashboardModel');

class DashboardService {
    async getAdminDashboard() {
        return await DashboardModel.getAdminDashboard();
    }

    async getLecturerDashboard(taiKhoanId) {
        const lecturer = await DashboardModel.findLecturerByAccountId(taiKhoanId);

        if (!lecturer) {
            throw new Error('Không tìm thấy thông tin giảng viên');
        }

        return await DashboardModel.getLecturerDashboard(lecturer.id);
    }

    async getStudentDashboard(taiKhoanId) {
        const student = await DashboardModel.findStudentByAccountId(taiKhoanId);

        if (!student) {
            throw new Error('Không tìm thấy thông tin sinh viên');
        }

        return await DashboardModel.getStudentDashboard(student.id);
    }
}

module.exports = new DashboardService();