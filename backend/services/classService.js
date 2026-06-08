const ClassModel = require('../models/classModel');
const MajorModel = require('../models/majorModel');

class ClassService {
    static async getAllClasses() {
        return await ClassModel.getAllClasses();
    }

    static async createClass(data) {
        const { ten_lop, nganh_id } = data;

        if (!ten_lop || ten_lop.trim() === '') {
            throw new Error('Tên lớp không được để trống');
        }

        if (!nganh_id) {
            throw new Error('Ngành không được để trống');
        }

        const major = await MajorModel.getMajorById(nganh_id);

        if (!major) {
            throw new Error('Ngành không tồn tại');
        }

        return await ClassModel.createClass(
            ten_lop.trim(),
            nganh_id
        );
    }

    static async updateClass(id, data) {
        const { ten_lop, nganh_id } = data;

        const classData = await ClassModel.getClassById(id);

        if (!classData) {
            throw new Error('Lớp không tồn tại');
        }

        if (!ten_lop || ten_lop.trim() === '') {
            throw new Error('Tên lớp không được để trống');
        }

        if (!nganh_id) {
            throw new Error('Ngành không được để trống');
        }

        const major = await MajorModel.getMajorById(nganh_id);

        if (!major) {
            throw new Error('Ngành không tồn tại');
        }

        await ClassModel.updateClass(
            id,
            ten_lop.trim(),
            nganh_id
        );

        return {
            id: Number(id),
            ten_lop: ten_lop.trim(),
            nganh_id
        };
    }

    static async deleteClass(id) {
        const classData = await ClassModel.getClassById(id);

        if (!classData) {
            throw new Error('Lớp không tồn tại');
        }

        await ClassModel.deleteClass(id);

        return true;
    }
}

module.exports = ClassService;