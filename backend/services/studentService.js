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

    static async importStudents(rows) {
        const successCount = { value: 0 };
        const errors = [];

        for (const [index, row] of rows.entries()) {
            const rowNum = index + 2;

            const username = String(row['username'] || row['ten_dang_nhap'] || row['Tên đăng nhập'] || '').trim();
            const password = String(row['password'] || row['mat_khau'] || row['Mật khẩu'] || '').trim();
            const ho_ten = String(row['ho_ten'] || row['Họ và tên'] || row['Ho va ten'] || '').trim();
            const ma_sinh_vien = String(row['ma_sinh_vien'] || row['Mã sinh viên'] || row['Ma sinh vien'] || '').trim();
            const email = String(row['email'] || row['Email'] || '').trim();
            const sdt = String(row['sdt'] || row['Số điện thoại'] || row['So dien thoai'] || '').trim();

            if (!username || !password || !ho_ten || !ma_sinh_vien || !email || !sdt) {
                errors.push({ row: rowNum, ma_sinh_vien: ma_sinh_vien || '—', ho_ten: ho_ten || '—', error: 'Thiếu thông tin bắt buộc' });
                continue;
            }

            try {
                const password_hash = await bcrypt.hash(password, 10);
                await StudentModel.createStudent({ username, password_hash, ho_ten, email, sdt, ma_sinh_vien, lop_id: null });
                successCount.value++;
            } catch (err) {
                errors.push({ row: rowNum, ma_sinh_vien, ho_ten, error: err.message });
            }
        }

        return { successCount: successCount.value, errors };
    }
}

module.exports = StudentService;