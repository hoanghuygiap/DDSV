const CourseClassService = require('../services/courseClassService');
const xlsx = require('xlsx');
const fs = require('fs');
const {
    getPagination,
    pagingData
} = require('../utils/pagination');

class CourseClassController {
    static async getAll(req, res) {
        try {
            const { page, limit, offset } = getPagination(req.query);

            const rows = await CourseClassService.getAll(limit, offset);
            const total = await CourseClassService.countAll();

            const response = pagingData(rows, total, page, limit);

            return res.json({
                success: true,
                message: 'Lấy danh sách lớp môn học thành công',
                ...response
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getById(req, res) {
        try {
            const data = await CourseClassService.getById(req.params.id);

            return res.json({
                success: true,
                message: 'Lấy chi tiết lớp môn học thành công',
                data
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            const data = await CourseClassService.create(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo lớp môn học thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const data = await CourseClassService.update(
                req.params.id,
                req.body
            );

            return res.json({
                success: true,
                message: 'Cập nhật lớp môn học thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async delete(req, res) {
        try {
            await CourseClassService.delete(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá lớp môn học thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getStudents(req, res) {
        try {
            const { page, limit, offset } = getPagination(req.query);

            const rows = await CourseClassService.getStudents(
                req.params.id,
                limit,
                offset
            );

            const total = await CourseClassService.countStudents(req.params.id);

            const response = pagingData(rows, total, page, limit);

            return res.json({
                success: true,
                message: 'Lấy danh sách sinh viên trong lớp thành công',
                ...response
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async registerStudent(req, res) {
        try {
            let { studentId, ma_sinh_vien } = req.body;

            if (!studentId && !ma_sinh_vien) {
                return res.status(400).json({
                    success: false,
                    message: 'Yêu cầu truyền studentId hoặc ma_sinh_vien'
                });
            }

            if (!studentId && ma_sinh_vien) {
                const db = require('../config/db');
                const [svRows] = await db.query('SELECT id FROM sinh_vien WHERE ma_sinh_vien = ?', [ma_sinh_vien]);
                if (svRows.length === 0) {
                    return res.status(400).json({ success: false, message: 'Không tìm thấy sinh viên có mã này' });
                }
                studentId = svRows[0].id;
            }

            await CourseClassService.registerStudent(
                req.params.id,
                studentId,
                req.user
            );

            return res.status(201).json({
                success: true,
                message: 'Đăng ký sinh viên vào lớp thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async unregisterStudent(req, res) {
        try {
            await CourseClassService.unregisterStudent(
                req.params.id,
                req.params.studentId,
                req.user
            );

            return res.json({
                success: true,
                message: 'Huỷ đăng ký lớp thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async selfRegister(req, res) {
        try {
            await CourseClassService.selfRegister(
                req.params.id,
                req.user.id
            );

            return res.status(201).json({
                success: true,
                message: 'Tự đăng ký lớp thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async selfUnregister(req, res) {
        try {
            await CourseClassService.selfUnregister(
                req.params.id,
                req.user.id
            );

            return res.json({
                success: true,
                message: 'Tự huỷ đăng ký lớp thành công'
            });
        } catch (error) {
            return res.status(400).json({
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
                    message: 'Vui lòng upload file Excel'
                });
            }

            const workbook = xlsx.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const students = xlsx.utils.sheet_to_json(sheet);

            fs.unlinkSync(req.file.path);

            const data = await CourseClassService.importStudents(
                req.params.id,
                students
            );

            return res.json({
                success: true,
                message: 'Import danh sách sinh viên hoàn tất',
                data
            });
        } catch (error) {
            if (req.file && fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = CourseClassController;