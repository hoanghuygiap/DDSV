require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./config/db'); // Đường dẫn tới file db.js của bạn

// Hàm hỗ trợ sinh mảng chứa các mã sinh viên ngẫu nhiên không trùng lặp
function generateUniqueStudentCodes(count, min, max) {
    const codes = new Set();
    while (codes.size < count) {
        const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
        const code = `A${randomNum}`;
        codes.add(code);
    }
    return Array.from(codes);
}

async function generateBulkUsers() {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        console.log('=== BẮT ĐẦU QUÁ TRÌNH TẠO 1020 TÀI KHOẢN (ĐĂNG NHẬP BẰNG EMAIL THEO MÃ) ===');

        // 1. Chuẩn bị password hash chung
        const passwordPlain = '12345678'; 
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordPlain, salt);
        console.log('[✔] Đã tạo mã hóa mật khẩu mẫu.');

        // 2. Chuẩn bị trước 1000 mã sinh viên ngẫu nhiên không trùng lặp từ A45577 đến A55000
        console.log('--> Đang khởi tạo 1000 mã sinh viên ngẫu nhiên duy nhất...');
        const listMaSinhVien = generateUniqueStudentCodes(1000, 45577, 55000);
        console.log(`[✔] Đã chuẩn bị xong danh sách mã SV.`);

        // ==========================================
        // PHẦN I: TẠO 20 GIẢNG VIÊN (Email dạng cti061@thanglong.edu.vn)
        // ==========================================
        console.log('\n--> Đang tạo dữ liệu 20 Giảng viên...');
        const startGvCode = 61; 
        for (let i = 1; i <= 20; i++) {
            const currentGvNum = startGvCode + (i - 1);
            const maGiangVien = `CTI${String(currentGvNum).padStart(3, '0')}`; // CTI061 -> CTI080
            
            // Định dạng email theo mã giảng viên (viết thường)
            const email = `${maGiangVien.toLowerCase()}@thanglong.edu.vn`; 
            const username = email; // Đăng nhập trực tiếp bằng email này
            const hoTen = `Giảng viên ${i}`;
            const sdt = `091${String(i).padStart(7, '0')}`; // Đảm bảo đúng 10 số

            // Chèn vào tai_khoan
            const [resTk] = await connection.query(
                `INSERT INTO tai_khoan (username, password_hash, ho_ten, email, kich_hoat) VALUES (?, ?, ?, ?, TRUE)`,
                [username, passwordHash, hoTen, email]
            );
            const taiKhoanId = resTk.insertId;

            // Gán vai trò giảng viên (vai_tro_id = 2)
            await connection.query(
                `INSERT INTO tai_khoan_vai_tro (tai_khoan_id, vai_tro_id) VALUES (?, 2)`,
                [taiKhoanId]
            );

            // Chèn vào bảng chi tiết giang_vien
            await connection.query(
                `INSERT INTO giang_vien (tai_khoan_id, ma_giang_vien, ho_ten, email, sdt) VALUES (?, ?, ?, ?, ?)`,
                [taiKhoanId, maGiangVien, hoTen, email, sdt]
            );
        }
        console.log('[✔] Hoàn thành tạo 20 giảng viên.');


        // ==========================================
        // PHẦN II: TẠO 1000 SINH VIÊN (Email dạng a45577@thanglong.edu.vn)
        // ==========================================
        console.log('\n--> Đang tạo dữ liệu 1000 Sinh viên...');
        
        const BATCH_SIZE = 100;
        const TOTAL_SV = 1000;

        for (let start = 1; start <= TOTAL_SV; start += BATCH_SIZE) {
            const end = Math.min(start + BATCH_SIZE - 1, TOTAL_SV);
            console.log(`   Đang xử lý sinh viên từ ${start} đến ${end}...`);

            for (let i = start; i <= end; i++) {
                const maSinhVien = listMaSinhVien[i - 1]; // Ví dụ: A46496
                
                // Định dạng email theo mã sinh viên (viết thường)
                const email = `${maSinhVien.toLowerCase()}@thanglong.edu.vn`; // Ví dụ: a46496@thanglong.edu.vn
                const username = email; // Đăng nhập trực tiếp bằng email này
                const hoTen = `Sinh viên ${i}`;
                const sdt = `092${String(i).padStart(7, '0')}`; // Đảm bảo đúng 10 số

                // Chèn vào tai_khoan
                const [resTk] = await connection.query(
                    `INSERT INTO tai_khoan (username, password_hash, ho_ten, email, kich_hoat) VALUES (?, ?, ?, ?, TRUE)`,
                    [username, passwordHash, hoTen, email]
                );
                const taiKhoanId = resTk.insertId;

                // Gán vai trò sinh viên (vai_tro_id = 3)
                await connection.query(
                    `INSERT INTO tai_khoan_vai_tro (tai_khoan_id, vai_tro_id) VALUES (?, 3)`,
                    [taiKhoanId]
                );

                // Chèn vào bảng chi tiết sinh_vien
                await connection.query(
                    `INSERT INTO sinh_vien (tai_khoan_id, ma_sinh_vien, ho_ten, email, sdt, lop_id) VALUES (?, ?, ?, ?, ?, NULL)`,
                    [taiKhoanId, maSinhVien, hoTen, email, sdt]
                );
            }
        }
        console.log('[✔] Hoàn thành tạo 1000 sinh viên.');

        // Xác nhận lưu toàn bộ thay đổi vào Database
        await connection.commit();
        console.log('\n======================================================');
        console.log('>>> THÀNH CÔNG: ĐÃ TẠO ĐỦ 1020 TÀI KHOẢN ĐĂNG NHẬP EMAIL THEO MÃ! <<<');
        console.log('- Email Giảng viên: cti061@thanglong.edu.vn -> cti080@thanglong.edu.vn');
        console.log('- Email Sinh viên: a[random]@thanglong.edu.vn (Ví dụ: a45577@thanglong.edu.vn)');
        console.log('- Mật khẩu đăng nhập mặc định: 12345678');
        console.log('======================================================');

    } catch (error) {
        if (connection) {
            await connection.rollback();
        }
        console.error('[✘] Đã xảy ra lỗi nghiêm trọng. Rollback database!', error);
    } finally {
        if (connection) {
            connection.release();
        }
        process.exit();
    }
}

generateBulkUsers();