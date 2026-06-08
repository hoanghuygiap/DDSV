const db = require('../config/db');

const AuthModel = {
    // Tìm tài khoản theo username kèm vai trò và danh sách quyền
    findByUsername: async (username) => {
        const query = `
            SELECT tk.*, 
                   GROUP_CONCAT(DISTINCT vt.ten_vai_tro) AS vai_tro,
                   GROUP_CONCAT(DISTINCT q.ma_quyen) AS quyen
            FROM tai_khoan tk
            LEFT JOIN tai_khoan_vai_tro tkvt ON tk.id = tkvt.tai_khoan_id
            LEFT JOIN vai_tro vt ON tkvt.vai_tro_id = vt.id
            LEFT JOIN vai_tro_quyen vtq ON vt.id = vtq.vai_tro_id
            LEFT JOIN quyen q ON vtq.quyen_id = q.id
            WHERE tk.username = ?
            GROUP BY tk.id
        `;
        const [rows] = await db.query(query, [username]);
        return rows[0];
    },

    // Tìm tài khoản theo ID
    findById: async (id) => {
        const query = `
            SELECT tk.id, tk.username, tk.ho_ten, tk.email, tk.kich_hoat,
                   GROUP_CONCAT(DISTINCT vt.ten_vai_tro) AS vai_tro,
                   GROUP_CONCAT(DISTINCT q.ma_quyen) AS quyen
            FROM tai_khoan tk
            LEFT JOIN tai_khoan_vai_tro tkvt ON tk.id = tkvt.tai_khoan_id
            LEFT JOIN vai_tro vt ON tkvt.vai_tro_id = vt.id
            LEFT JOIN vai_tro_quyen vtq ON vt.id = vtq.vai_tro_id
            LEFT JOIN quyen q ON vtq.quyen_id = q.id
            WHERE tk.id = ?
            GROUP BY tk.id
        `;
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Tìm tài khoản theo email
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM tai_khoan WHERE email = ?', [email]);
        return rows[0];
    },

    // Cập nhật thông tin đăng nhập sai để khóa tài khoản khi cần
    updateLoginAttempts: async (username, failedAttempts, lockUntil) => {
        const query = `
            UPDATE tai_khoan 
            SET failed_attempts = ?, lock_until = ? 
            WHERE username = ?
        `;
        await db.query(query, [failedAttempts, lockUntil, username]);
    },

    // Reset số lần đăng nhập sai và cập nhật thời gian đăng nhập cuối
    resetLoginAttemptsAndSetLoginTime: async (id) => {
        const query = `
            UPDATE tai_khoan 
            SET failed_attempts = 0, lock_until = NULL, last_login = NOW() 
            WHERE id = ?
        `;
        await db.query(query, [id]);
    },

    // Lưu Refresh Token
    updateRefreshToken: async (id, token, expiresAt) => {
        const query = `
            UPDATE tai_khoan 
            SET refresh_token = ?, refresh_token_het_han = ? 
            WHERE id = ?
        `;
        await db.query(query, [token, expiresAt, id]);
    },

    // Lấy Refresh Token của user để so sánh đối chiếu
    getRefreshToken: async (id) => {
        const query = 'SELECT refresh_token, refresh_token_het_han FROM tai_khoan WHERE id = ?';
        const [rows] = await db.query(query, [id]);
        return rows[0];
    },

    // Xóa Refresh Token khi logout
    revokeRefreshToken: async (id) => {
        const query = `
            UPDATE tai_khoan 
            SET refresh_token = NULL, refresh_token_het_han = NULL 
            WHERE id = ?
        `;
        await db.query(query, [id]);
    },

    // Cập nhật mật khẩu mới
    updatePassword: async (id, passwordHash) => {
        const query = 'UPDATE tai_khoan SET password_hash = ? WHERE id = ?';
        await db.query(query, [passwordHash, id]);
    }
};

module.exports = AuthModel;