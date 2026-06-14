const StudentService = require('../services/studentService');
const xlsx = require('xlsx');
const fs = require('fs');

class StudentController {
    static async getAllStudents(req, res) {
        try {
            const result = await StudentService.getAllStudents(req.query);

            return res.json({
                success: true,
                message: 'Lấy danh sách sinh viên thành công',
                ...result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getStudentById(req, res) {
        try {
            const student = await StudentService.getStudentById(req.params.id);

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy sinh viên'
                });
            }

            return res.json({
                success: true,
                data: student
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createStudent(req, res) {
        try {
            const result = await StudentService.createStudent(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo sinh viên thành công',
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateStudent(req, res) {
        try {
            const result = await StudentService.updateStudent(req.params.id, req.body);

            return res.json({
                success: true,
                message: 'Cập nhật sinh viên thành công',
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteStudent(req, res) {
        try {
            await StudentService.deleteStudent(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá sinh viên thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getStudentClasses(req, res) {
        try {
            const result = await StudentService.getStudentClasses(req.params.id, req.query);

            return res.json({
                success: true,
                message: 'Lấy danh sách lớp sinh viên tham gia thành công',
                ...result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getStudentSchedule(req, res) {
        try {
            const result = await StudentService.getStudentSchedule(req.params.id, req.query);

            return res.json({
                success: true,
                message: 'Lấy thời khóa biểu sinh viên thành công',
                ...result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getStudentAttendance(req, res) {
        try {
            const result = await StudentService.getStudentAttendance(req.params.id, req.query);

            return res.json({
                success: true,
                message: 'Lấy lịch sử điểm danh sinh viên thành công',
                ...result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getStudentStatistics(req, res) {
        try {
            const data = await StudentService.getStudentStatistics(req.params.id);

            return res.json({
                success: true,
                message: 'Lấy thống kê chuyên cần thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async importStudents(req, res) {
        try {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'Vui lòng upload file Excel (.xlsx)'
                });
            }

            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const rows = xlsx.utils.sheet_to_json(sheet);

            fs.unlinkSync(req.file.path);

            if (rows.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'File Excel không có dữ liệu'
                });
            }

            const result = await StudentService.importStudents(rows);

            return res.json({
                success: true,
                message: `Import thành công ${result.successCount} sinh viên${result.errors.length > 0 ? `, ${result.errors.length} dòng lỗi` : ''}`,
                data: result
            });
        } catch (error) {
            if (req.file) {
                try { fs.unlinkSync(req.file.path); } catch (_) {}
            }
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = StudentController;