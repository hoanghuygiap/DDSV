const SubjectService = require('../services/subjectService');

const {
    getPagination,
    pagingData
} = require('../utils/pagination');

class SubjectController {
    static async getAllSubjects(req, res) {
        try {
            const {
                page,
                limit,
                offset
            } = getPagination(req.query);

            const rows =
                await SubjectService.getAllSubjects(
                    limit,
                    offset
                );

            const total =
                await SubjectService.countSubjects();

            const response = pagingData(
                rows,
                total,
                page,
                limit
            );

            return res.json({
                success: true,
                message:
                    'Lấy danh sách học phần thành công',
                ...response
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getSubjectById(req, res) {
        try {
            const data =
                await SubjectService.getSubjectById(
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

    static async createSubject(req, res) {
        try {
            const data =
                await SubjectService.createSubject(
                    req.body
                );

            return res.status(201).json({
                success: true,
                message: 'Tạo học phần thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async updateSubject(req, res) {
        try {
            const data =
                await SubjectService.updateSubject(
                    req.params.id,
                    req.body
                );

            return res.json({
                success: true,
                message:
                    'Cập nhật học phần thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteSubject(req, res) {
        try {
            await SubjectService.deleteSubject(
                req.params.id
            );

            return res.json({
                success: true,
                message: 'Xoá học phần thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = SubjectController;