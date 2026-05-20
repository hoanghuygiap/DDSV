const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');// Auth - đăng nhập, đăng ký, quên mật khẩu, đổi mật khẩu
const userRoutes = require('./routes/userRoutes');// User - quản lý tài khoản người dùng
const roleRoutes = require('./routes/roleRoutes');// Role - quản lý vai trò, phân quyền
const lecturerRoutes = require('./routes/lecturerRoutes');// Lecturer - quản lý thông tin giảng viên
const studentRoutes = require('./routes/studentRoutes');// Student - quản lý thông tin sinh viên
const facultyRoutes = require('./routes/facultyRoutes'); // Faculty - quản lý khoa
const majorRoutes = require('./routes/majorRoutes');// Major - quản lý ngành học
const classRoutes = require('./routes/classRoutes');// Class - quản lý lớp hành chính
const subjectRoutes = require('./routes/subjectRoutes');// Subject - quản lý học phần / môn học
const semesterRoutes = require('./routes/semesterRoutes');// Semester - quản lý học kỳ, năm học
const courseClassRoutes = require('./routes/courseClassRoutes');// CourseClass - quản lý lớp môn học, danh sách sinh viên trong lớp môn học
const sessionRoutes = require('./routes/sessionRoutes');// Session - quản lý buổi học, mở/đóng điểm danh, đổi phòng học
const qrRoutes = require('./routes/qrRoutes');//tao qr code
const attendanceRoutes = require('./routes/attendanceRoutes');//diem danh
const validateRoutes = require('./routes/validateRoutes');//chech gps
const roomRoutes = require('./routes/roomRoutes');//quản lý phòng học
const notificationRoutes = require('./routes/notificationRoutes');//quản lý thông báo
const warningRoutes = require('./routes/warningRoutes');//quản lý cảnh báo
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Phân tích body có định dạng application/json
app.use(express.urlencoded({ extended: true }));

// Khai báo Base Route cho cấu trúc Authentication
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);
app.use('/lecturers', lecturerRoutes);
app.use('/students', studentRoutes);
app.use('/faculties', facultyRoutes);
app.use('/majors', majorRoutes);
app.use('/classes', classRoutes);
app.use('/subjects', subjectRoutes);
app.use('/semesters', semesterRoutes);
app.use('/course-classes', courseClassRoutes);
app.use('/sessions', sessionRoutes);
app.use('/qr', qrRoutes);
app.use('/attendance', attendanceRoutes);
app.use('/validate', validateRoutes);
app.use('/rooms', roomRoutes);
app.use('/notifications', notificationRoutes);
app.use('/warnings', warningRoutes);



// Bắt lỗi các route không tồn tại (404)
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Bắt lỗi hệ thống (Global Error Handler)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Có lỗi xảy ra trên hệ thống.' });
});

// Khởi chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});