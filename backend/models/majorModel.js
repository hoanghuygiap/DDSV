const db = require('../config/db');

class MajorModel {
    static async getAllMajors() {
        const [rows] = await db.query(`
            SELECT
                n.id,
                n.ten_nganh,
                n.khoa_id,
                k.ten_khoa
            FROM nganh n
            LEFT JOIN khoa k ON n.khoa_id = k.id
            ORDER BY n.id DESC
        `);

        return rows;
    }

    static async getMajorById(id) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM nganh
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async createMajor(ten_nganh, khoa_id) {
        const [result] = await db.query(
            `
            INSERT INTO nganh (ten_nganh, khoa_id)
            VALUES (?, ?)
            `,
            [ten_nganh, khoa_id]
        );

        return {
            id: result.insertId,
            ten_nganh,
            khoa_id
        };
    }

    static async updateMajor(id, ten_nganh, khoa_id) {
        const [result] = await db.query(
            `
            UPDATE nganh
            SET ten_nganh = ?, khoa_id = ?
            WHERE id = ?
            `,
            [ten_nganh, khoa_id, id]
        );

        return result.affectedRows;
    }

    static async deleteMajor(id) {
        const [result] = await db.query(
            `
            DELETE FROM nganh
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = MajorModel;