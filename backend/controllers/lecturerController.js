const LecturerService = require('../services/lecturerService');

class LecturerController {
    static async getAllLecturers(req, res) {
        try {
            const data = await LecturerService.getAllLecturers();

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getLecturerById(req, res) {
        try {
            const data = await LecturerService.getLecturerById(
                req.params.id
            );

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async createLecturer(req, res) {
        try {
            const result =
                await LecturerService.createLecturer(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo giảng viên thành công',
                result
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateLecturer(req, res) {
        try {
            await LecturerService.updateLecturer(
                req.params.id,
                req.body
            );

            return res.json({
                success: true,
                message: 'Cập nhật giảng viên thành công'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteLecturer(req, res) {
        try {
            await LecturerService.deleteLecturer(req.params.id);

            return res.json({
                success: true,
                message: 'Xóa giảng viên thành công'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getLecturerSchedule(req, res) {
        try {
            const data =
                await LecturerService.getLecturerSchedule(
                    req.params.id
                );

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getLecturerCourseClasses(req, res) {
        try {
            const data =
                await LecturerService.getLecturerCourseClasses(
                    req.params.id
                );

            return res.json({
                success: true,
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = LecturerController;