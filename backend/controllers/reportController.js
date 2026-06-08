const ReportService = require('../services/reportService');

class ReportController {
    static async attendance(req, res) {
        const data = await ReportService.attendance(req.query);
        res.json({ success: true, message: 'Báo cáo điểm danh thành công', data });
    }

    static async topAbsent(req, res) {
        const data = await ReportService.topAbsent(req.query);
        res.json({ success: true, message: 'Thống kê sinh viên vắng nhiều thành công', data });
    }

    static async weeklyAttendance(req, res) {
        const data = await ReportService.weeklyAttendance(req.query);
        res.json({ success: true, message: 'Báo cáo chuyên cần theo tuần thành công', data });
    }

    static async byCourseClass(req, res) {
        const data = await ReportService.byCourseClass(req.query);
        res.json({ success: true, message: 'Báo cáo theo lớp môn học thành công', data });
    }

    static async bySemester(req, res) {
        const data = await ReportService.bySemester(req.query);
        res.json({ success: true, message: 'Báo cáo theo học kỳ thành công', data });
    }

    static async exportReport(req, res) {
        const buffer = await ReportService.exportReport(req.query);

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=bao-cao.xlsx'
        );

        res.send(buffer);
    }
}

module.exports = ReportController;