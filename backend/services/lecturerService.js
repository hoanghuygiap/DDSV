const LecturerModel = require('../models/lecturerModel');

class LecturerService {
    static async getAllLecturers() {
        return await LecturerModel.getAll();
    }

    static async getLecturerById(id) {
        const lecturer = await LecturerModel.getById(id);

        if (!lecturer) {
            throw new Error('Giảng viên không tồn tại');
        }

        return lecturer;
    }

    static async createLecturer(data) {
        return await LecturerModel.create(data);
    }

    static async updateLecturer(id, data) {
        const lecturer = await LecturerModel.getById(id);

        if (!lecturer) {
            throw new Error('Giảng viên không tồn tại');
        }

        return await LecturerModel.update(id, data);
    }

    static async deleteLecturer(id) {
        const lecturer = await LecturerModel.getById(id);

        if (!lecturer) {
            throw new Error('Giảng viên không tồn tại');
        }

        return await LecturerModel.remove(id);
    }

    static async getLecturerSchedule(id) {
        return await LecturerModel.getSchedule(id);
    }

    static async getLecturerCourseClasses(id) {
        return await LecturerModel.getCourseClasses(id);
    }
}

module.exports = LecturerService;