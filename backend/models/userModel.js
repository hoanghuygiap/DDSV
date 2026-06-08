// models/userModel.js
const db = require('../config/db');

class UserModel {
    static async getAll(limit = 10, offset = 0) {
        const [rows] = await db.query(
            `SELECT id, username, ho_ten, email, kich_hoat, last_login, failed_attempts, lock_until, created_at 
             FROM tai_khoan LIMIT ? OFFSET ?`,
            [parseInt(limit), parseInt(offset)]
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query(
            `SELECT id, username, ho_ten, email, kich_hoat, last_login, failed_attempts, lock_until, created_at 
             FROM tai_khoan WHERE id = ?`,
            [id]
        );
        return rows[0];
    }

    static async getByUsername(username) {
        const [rows] = await db.query('SELECT * FROM tai_khoan WHERE username = ?', [username]);
        return rows[0];
    }

    static async getByEmail(email) {
        const [rows] = await db.query('SELECT * FROM tai_khoan WHERE email = ?', [email]);
        return rows[0];
    }

    static async create(userData) {
        const { username, password_hash, ho_ten, email } = userData;
        const [result] = await db.query(
            `INSERT INTO tai_khoan (username, password_hash, ho_ten, email) 
             VALUES (?, ?, ?, ?)`,
            [username, password_hash, ho_ten, email]
        );
        return result.insertId;
    }

    static async update(id, updateData) {
        const fields = [];
        const values = [];
        
        for (const [key, val] of Object.entries(updateData)) {
            fields.push(`${key} = ?`);
            values.push(val);
        }
        
        if (fields.length === 0) return false;
        
        values.push(id);
        const [result] = await db.query(
            `UPDATE tai_khoan SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result.affectedRows > 0;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM tai_khoan WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    // Các hàm gán vai trò (RBAC)
    static async assignRole(userId, roleId) {
        await db.query(
            'INSERT IGNORE INTO tai_khoan_vai_tro (tai_khoan_id, vai_tro_id) VALUES (?, ?)',
            [userId, roleId]
        );
    }

    static async removeRoles(userId) {
        await db.query('DELETE FROM tai_khoan_vai_tro WHERE tai_khoan_id = ?', [userId]);
    }

    static async getUserRolesAndPermissions(userId) {
        const [rows] = await db.query(
            `SELECT vt.ten_vai_tro, q.ma_quyen 
             FROM tai_khoan_vai_tro tkvt
             JOIN vai_tro vt ON tkvt.vai_tro_id = vt.id
             LEFT JOIN vai_tro_quyen vtq ON vt.id = vtq.vai_tro_id
             LEFT JOIN quyen q ON vtq.quyen_id = q.id
             WHERE tkvt.tai_khoan_id = ?`,
            [userId]
        );
        return rows;
    }
}

module.exports = UserModel;