const FacultyModel = require('../models/facultyModel');

class FacultyService {
    static async getAllFaculties() {
        return await FacultyModel.getAllFaculties();
    }

    static async createFaculty(data) {
        const { ten_khoa } = data;

        if (!ten_khoa || ten_khoa.trim() === '') {
            throw new Error('Tên khoa không được để trống');
        }

        return await FacultyModel.createFaculty(ten_khoa.trim());
    }

    static async updateFaculty(id, data) {
        const { ten_khoa } = data;

        if (!id) {
            throw new Error('Thiếu id khoa');
        }

        if (!ten_khoa || ten_khoa.trim() === '') {
            throw new Error('Tên khoa không được để trống');
        }

        const faculty = await FacultyModel.getFacultyById(id);

        if (!faculty) {
            throw new Error('Không tìm thấy khoa');
        }

        await FacultyModel.updateFaculty(id, ten_khoa.trim());

        return {
            id: Number(id),
            ten_khoa: ten_khoa.trim()
        };
    }

    static async deleteFaculty(id) {
        if (!id) {
            throw new Error('Thiếu id khoa');
        }

        const faculty = await FacultyModel.getFacultyById(id);

        if (!faculty) {
            throw new Error('Không tìm thấy khoa');
        }

        await FacultyModel.deleteFaculty(id);

        return true;
    }
}

module.exports = FacultyService;