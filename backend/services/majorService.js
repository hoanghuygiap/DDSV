const MajorModel = require('../models/majorModel');
const FacultyModel = require('../models/facultyModel');

class MajorService {
    static async getAllMajors() {
        return await MajorModel.getAllMajors();
    }

    static async createMajor(data) {
        const { ten_nganh, khoa_id } = data;

        if (!ten_nganh || ten_nganh.trim() === '') {
            throw new Error('Tên ngành không được để trống');
        }

        if (!khoa_id) {
            throw new Error('Khoa không được để trống');
        }

        const faculty = await FacultyModel.getFacultyById(khoa_id);

        if (!faculty) {
            throw new Error('Khoa không tồn tại');
        }

        return await MajorModel.createMajor(
            ten_nganh.trim(),
            khoa_id
        );
    }

    static async updateMajor(id, data) {
        const { ten_nganh, khoa_id } = data;

        const major = await MajorModel.getMajorById(id);

        if (!major) {
            throw new Error('Ngành không tồn tại');
        }

        if (!ten_nganh || ten_nganh.trim() === '') {
            throw new Error('Tên ngành không được để trống');
        }

        if (!khoa_id) {
            throw new Error('Khoa không được để trống');
        }

        const faculty = await FacultyModel.getFacultyById(khoa_id);

        if (!faculty) {
            throw new Error('Khoa không tồn tại');
        }

        await MajorModel.updateMajor(
            id,
            ten_nganh.trim(),
            khoa_id
        );

        return {
            id: Number(id),
            ten_nganh,
            khoa_id
        };
    }

    static async deleteMajor(id) {
        const major = await MajorModel.getMajorById(id);

        if (!major) {
            throw new Error('Ngành không tồn tại');
        }

        await MajorModel.deleteMajor(id);

        return true;
    }
}

module.exports = MajorService;