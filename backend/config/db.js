require('dotenv').config();//đọc file .env
const mysql = require('mysql2');

// Tạo Connection Pool để tối ưu hiệu suất
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: '+07:00' 
});

// Chuyển sang dạng Promise để dùng được async/await
const db = pool.promise();

module.exports = db;