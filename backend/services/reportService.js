const ExcelJS = require('exceljs');
const ReportModel = require('../models/reportModel');

class ReportService {
    static async attendance(query) {
        return await ReportModel.attendance(query);
    }

    static async topAbsent(query) {
        return await ReportModel.topAbsent(query);
    }

    static async weeklyAttendance(query) {
        return await ReportModel.weeklyAttendance(query);
    }

    static async byCourseClass(query) {
        return await ReportModel.byCourseClass(query);
    }

    static async bySemester(query) {
        return await ReportModel.bySemester(query);
    }

    static async exportReport(query) {
        const rows = await ReportModel.exportData(query);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Bao cao');

        sheet.columns = [
            { header: 'Mã sinh viên', key: 'ma_sinh_vien', width: 20 },
            { header: 'Tên sinh viên', key: 'ten_sinh_vien', width: 30 },
            { header: 'Lớp hành chính', key: 'lop_hanh_chinh', width: 20 },
            { header: 'Mã lớp', key: 'ma_lop', width: 20 },
            { header: 'Mã học phần', key: 'ma_hoc_phan', width: 20 },
            { header: 'Tên học phần', key: 'ten_hoc_phan', width: 30 },
            { header: 'Kỳ học', key: 'ky_hoc', width: 20 },
            { header: 'Ngày học', key: 'ngay_hoc', width: 20 },
            { header: 'Giờ bắt đầu', key: 'gio_bat_dau', width: 15 },
            { header: 'Giờ kết thúc', key: 'gio_ket_thuc', width: 15 },
            { header: 'Phòng học', key: 'phong_hoc', width: 15 },
            { header: 'Trạng thái', key: 'trang_thai', width: 15 },
            { header: 'Thời gian điểm danh', key: 'thoi_gian_diem_danh', width: 25 },
            { header: 'Hợp lệ GPS', key: 'hop_le_gps', width: 15 },
            { header: 'Hợp lệ WiFi', key: 'hop_le_wifi', width: 15 },
            { header: 'Hợp lệ', key: 'hop_le', width: 15 },
            { header: 'Ghi chú', key: 'ghi_chu', width: 30 },
            { header: 'Giảng viên', key: 'ten_giang_vien', width: 30 }
        ];

        rows.forEach(row => sheet.addRow(row));
        sheet.getRow(1).font = { bold: true };

        return await workbook.xlsx.writeBuffer();
    }
}

module.exports = ReportService;