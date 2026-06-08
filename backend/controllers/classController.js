const ClassService = require('../services/classService');

class ClassController {
    static async getAllClasses(req, res) {
        try {
            const data = await ClassService.getAllClasses();

            return res.json({
                success: true,
                message: 'Lấy danh sách lớp hành chính thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createClass(req, res) {
        try {
            const data = await ClassService.createClass(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo lớp hành chính thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateClass(req, res) {
        try {
            const data = await ClassService.updateClass(
                req.params.id,
                req.body
            );

            return res.json({
                success: true,
                message: 'Cập nhật lớp hành chính thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteClass(req, res) {
        try {
            await ClassService.deleteClass(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá lớp hành chính thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ClassController;