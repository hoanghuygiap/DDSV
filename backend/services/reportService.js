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
    const sheet = workbook.addWorksheet('Bao cao chuyen can');

    const days = [...new Set(rows.map(r => r.ngay_hoc).filter(Boolean))];

    const studentsMap = new Map();

    rows.forEach(row => {
        if (!studentsMap.has(row.sinh_vien_id)) {
            studentsMap.set(row.sinh_vien_id, {
                ma_sinh_vien: row.ma_sinh_vien,
                ten_sinh_vien: row.ten_sinh_vien,
                ma_hoc_phan: row.ma_hoc_phan,
                ten_hoc_phan: row.ten_hoc_phan,
                days: {},
                co_mat: 0,
                vang: 0,
                tre: 0,
            });
        }

        const student = studentsMap.get(row.sinh_vien_id);

        if (row.ngay_hoc) {
            let status = '';

            if (row.trang_thai === 'co_mat') {
                status = 'Có mặt';
                student.co_mat++;
            } else if (row.trang_thai === 'vang') {
                status = 'Vắng';
                student.vang++;
            } else if (row.trang_thai === 'tre') {
                status = 'Trễ';
                student.tre++;
            } else if (row.trang_thai === 'co_phep') {
                status = 'Có phép';
            } else {
                status = 'Chưa điểm danh';
            }

            student.days[row.ngay_hoc] = status;
        }
    });

    sheet.columns = [
        { header: 'Mã sinh viên', key: 'ma_sinh_vien', width: 18 },
        { header: 'Họ tên', key: 'ten_sinh_vien', width: 28 },
        { header: 'Mã học phần', key: 'ma_hoc_phan', width: 16 },
        { header: 'Tên học phần', key: 'ten_hoc_phan', width: 30 },
        ...days.map(day => ({
            header: day,
            key: day,
            width: 15,
        })),
        { header: 'Có mặt', key: 'co_mat', width: 12 },
        { header: 'Vắng', key: 'vang', width: 12 },
        { header: 'Trễ', key: 'tre', width: 12 },
        { header: 'Tỷ lệ vắng (%)', key: 'ty_le_vang', width: 16 },
        { header: 'Tình trạng', key: 'tinh_trang', width: 18 },
    ];

    studentsMap.forEach(student => {
        const tongBuoi = days.length;
        const tyLeVang = tongBuoi > 0
            ? Number(((student.vang / tongBuoi) * 100).toFixed(1))
            : 0;

        let tinhTrang = 'Bình thường';
        if (tyLeVang >= 20) tinhTrang = 'Nguy cơ cao';
        else if (tyLeVang >= 10) tinhTrang = 'Cảnh báo';

        const rowData = {
            ma_sinh_vien: student.ma_sinh_vien,
            ten_sinh_vien: student.ten_sinh_vien,
            ma_hoc_phan: student.ma_hoc_phan,
            ten_hoc_phan: student.ten_hoc_phan,
            co_mat: student.co_mat,
            vang: student.vang,
            tre: student.tre,
            ty_le_vang: tyLeVang,
            tinh_trang: tinhTrang,
        };

        days.forEach(day => {
            rowData[day] = student.days[day] || 'Chưa điểm danh';
        });

        sheet.addRow(rowData);
    });

    sheet.getRow(1).font = { bold: true };

    return await workbook.xlsx.writeBuffer();
    }
}

module.exports = ReportService;