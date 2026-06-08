const MajorService = require('../services/majorService');

class MajorController {
    static async getAllMajors(req, res) {
        try {
            const data = await MajorService.getAllMajors();

            return res.json({
                success: true,
                message: 'Lấy danh sách ngành thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createMajor(req, res) {
        try {
            const data = await MajorService.createMajor(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo ngành thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateMajor(req, res) {
        try {
            const data = await MajorService.updateMajor(
                req.params.id,
                req.body
            );

            return res.json({
                success: true,
                message: 'Cập nhật ngành thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteMajor(req, res) {
        try {
            await MajorService.deleteMajor(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá ngành thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = MajorController;