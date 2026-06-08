const FacultyService = require('../services/facultyService');

class FacultyController {
    static async getAllFaculties(req, res) {
        try {
            const data = await FacultyService.getAllFaculties();

            return res.json({
                success: true,
                message: 'Lấy danh sách khoa thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createFaculty(req, res) {
        try {
            const data = await FacultyService.createFaculty(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo khoa thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateFaculty(req, res) {
        try {
            const data = await FacultyService.updateFaculty(
                req.params.id,
                req.body
            );

            return res.json({
                success: true,
                message: 'Cập nhật khoa thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteFaculty(req, res) {
        try {
            await FacultyService.deleteFaculty(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá khoa thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = FacultyController;