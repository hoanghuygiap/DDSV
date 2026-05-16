const SemesterModel = require('../models/semesterModel');

class SemesterService {
    static async getAllSemesters() {
        return await SemesterModel.getAllSemesters();
    }

    static async getSemesterById(id) {
        const semester = await SemesterModel.getSemesterById(id);

        if (!semester) {
            throw new Error('Học kỳ không tồn tại');
        }

        return semester;
    }

    static async createSemester(data) {
        const { ten_ky, bat_dau, ket_thuc } = data;

        if (!ten_ky || ten_ky.trim() === '') {
            throw new Error('Tên học kỳ không được để trống');
        }

        if (!bat_dau || !ket_thuc) {
            throw new Error('Ngày bắt đầu và ngày kết thúc không được để trống');
        }

        if (new Date(ket_thuc) <= new Date(bat_dau)) {
            throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }

        return await SemesterModel.createSemester({
            ten_ky: ten_ky.trim(),
            bat_dau,
            ket_thuc
        });
    }

    static async updateSemester(id, data) {
        const semester = await SemesterModel.getSemesterById(id);

        if (!semester) {
            throw new Error('Học kỳ không tồn tại');
        }

        const { ten_ky, bat_dau, ket_thuc } = data;

        if (!ten_ky || ten_ky.trim() === '') {
            throw new Error('Tên học kỳ không được để trống');
        }

        if (!bat_dau || !ket_thuc) {
            throw new Error('Ngày bắt đầu và ngày kết thúc không được để trống');
        }

        if (new Date(ket_thuc) <= new Date(bat_dau)) {
            throw new Error('Ngày kết thúc phải lớn hơn ngày bắt đầu');
        }

        await SemesterModel.updateSemester(id, {
            ten_ky: ten_ky.trim(),
            bat_dau,
            ket_thuc
        });

        return {
            id: Number(id),
            ten_ky: ten_ky.trim(),
            bat_dau,
            ket_thuc
        };
    }

    static async deleteSemester(id) {
        const semester = await SemesterModel.getSemesterById(id);

        if (!semester) {
            throw new Error('Học kỳ không tồn tại');
        }

        await SemesterModel.deleteSemester(id);

        return true;
    }
}

module.exports = SemesterService;