const SemesterService = require('../services/semesterService');

class SemesterController {
    static async getAllSemesters(req, res) {
        try {
            const data = await SemesterService.getAllSemesters();

            return res.json({
                success: true,
                message: 'Lấy danh sách học kỳ thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getSemesterById(req, res) {
        try {
            const data = await SemesterService.getSemesterById(req.params.id);

            return res.json({
                success: true,
                message: 'Lấy chi tiết học kỳ thành công',
                data
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createSemester(req, res) {
        try {
            const data = await SemesterService.createSemester(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo học kỳ thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateSemester(req, res) {
        try {
            const data = await SemesterService.updateSemester(
                req.params.id,
                req.body
            );

            return res.json({
                success: true,
                message: 'Cập nhật học kỳ thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteSemester(req, res) {
        try {
            await SemesterService.deleteSemester(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá học kỳ thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = SemesterController;