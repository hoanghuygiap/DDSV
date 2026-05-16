const SubjectModel = require('../models/subjectModel');

class SubjectService {
    static async getAllSubjects(limit, offset) {
        return await SubjectModel.getAllSubjects(
            limit,
            offset
        );
    }

    static async countSubjects() {
        return await SubjectModel.countSubjects();
    }

    static async getSubjectById(id) {
        const subject =
            await SubjectModel.getSubjectById(id);

        if (!subject) {
            throw new Error('Học phần không tồn tại');
        }

        return subject;
    }

    static async createSubject(data) {
        const {
            ma_hoc_phan,
            ten_hoc_phan,
            so_tin_chi
        } = data;

        if (!ma_hoc_phan) {
            throw new Error('Mã học phần không được để trống');
        }

        if (!ten_hoc_phan) {
            throw new Error('Tên học phần không được để trống');
        }

        if (!so_tin_chi || so_tin_chi <= 0) {
            throw new Error('Số tín chỉ không hợp lệ');
        }

        return await SubjectModel.createSubject(data);
    }

    static async updateSubject(id, data) {
        const subject =
            await SubjectModel.getSubjectById(id);

        if (!subject) {
            throw new Error('Học phần không tồn tại');
        }

        await SubjectModel.updateSubject(id, data);

        return {
            id: Number(id),
            ...data
        };
    }

    static async deleteSubject(id) {
        const subject =
            await SubjectModel.getSubjectById(id);

        if (!subject) {
            throw new Error('Học phần không tồn tại');
        }

        await SubjectModel.deleteSubject(id);

        return true;
    }
}

module.exports = SubjectService;