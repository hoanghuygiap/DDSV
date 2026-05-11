require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db'); // Đường dẫn tới file db.js của bạn

async function createAdminUser() {
    try {
        const username = 'admin';
        const passwordPlain = '12345678'; // Mật khẩu dùng để đăng nhập test
        const hoTen = 'admin';
        const email = 'admin@thanglong.edu.vn';

        // 1. Mã hóa mật khẩu bằng bcrypt
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordPlain, salt);

        console.log('--- Đang tạo tài khoản test ---');

        // 2. Chèn dữ liệu vào bảng tai_khoan
        const queryTaiKhoan = `
            INSERT INTO tai_khoan (username, password_hash, ho_ten, email, kich_hoat)
            VALUES (?, ?, ?, ?, TRUE)
        `;
        const [resultTk] = await db.query(queryTaiKhoan, [username, passwordHash, hoTen, email]);
        const taiKhoanId = resultTk.insertId;
        console.log(`=> Đã tạo xong tài khoản: [${username}] với ID: ${taiKhoanId}`);

        // 3. Phân vai trò 'admin' (vai_tro_id = 1) cho tài khoản này
        const queryVaiTro = `
            INSERT INTO tai_khoan_vai_tro (tai_khoan_id, vai_tro_id)
            VALUES (?, 1)
        `;
        await db.query(queryVaiTro, [taiKhoanId]);
        console.log(`=> Đã gán vai trò Admin thành công.`);
        console.log(`\nTHÔNG TIN ĐĂNG NHẬP TEST:\n- Username: ${username}\n- Password: ${passwordPlain}`);


    } catch (error) {
        console.error('Lỗi khi tạo tài khoản test:', error);
    } finally {
        process.exit();
    }
}

createAdminUser();

