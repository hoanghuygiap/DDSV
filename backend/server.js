const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const studentRoutes = require('./routes/studentRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const majorRoutes = require('./routes/majorRoutes');
const classRoutes = require('./routes/classRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const courseClassRoutes = require('./routes/courseClassRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
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