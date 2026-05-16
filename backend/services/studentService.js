const bcrypt = require('bcryptjs');
const StudentModel = require('../models/studentModel');
const { getPagination } = require('../utils/pagination');

class StudentService {
    static async getAllStudents(query) {
        const pagination = getPagination(query);
        return await StudentModel.getAllStudents(query, pagination);
    }

    static async getStudentById(id) {
        return await StudentModel.getStudentById(id);
    }

    static async createStudent(data) {
        const {
            username,
            password,
            ho_ten,
            email,
            sdt,
            ma_sinh_vien,
            lop_id
        } = data;

        if (!username || !password || !ho_ten || !email || !sdt || !ma_sinh_vien) {
            throw new Error('Vui lòng nhập đầy đủ thông tin bắt buộc');
        }

        const password_hash = await bcrypt.hash(password, 10);

        return await StudentModel.createStudent({
            username,
            password_hash,
            ho_ten,
            email,
            sdt,
            ma_sinh_vien,
            lop_id
        });
    }

    static async updateStudent(id, data) {
        const student = await StudentModel.getStudentById(id);

        if (!student) {
            throw new Error('Sinh viên không tồn tại');
        }

        return await StudentModel.updateStudent(id, data);
    }

    static async deleteStudent(id) {
        const student = await StudentModel.getStudentById(id);

        if (!student) {
            throw new Error('Sinh viên không tồn tại');
        }

        return await StudentModel.deleteStudent(id);
    }

    static async getStudentClasses(id, query) {
        const pagination = getPagination(query);
        return await StudentModel.getStudentClasses(id, pagination);
    }

    static async getStudentSchedule(id, query) {
        const pagination = getPagination(query);
        return await StudentModel.getStudentSchedule(id, pagination);
    }

    static async getStudentAttendance(id, query) {
        const pagination = getPagination(query);
        return await StudentModel.getStudentAttendance(id, query, pagination);
    }

    static async getStudentStatistics(id) {
        return await StudentModel.getStudentStatistics(id);
    }
}

module.exports = StudentService;