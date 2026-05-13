const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roleRoutes = require('./routes/roleRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Phân tích body có định dạng application/json
app.use(express.urlencoded({ extended: true }));

// Khai báo Base Route cho cấu trúc Authentication
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/lecturers', lecturerRoutes);

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