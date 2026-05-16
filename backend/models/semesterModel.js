const db = require('../config/db');

class SemesterModel {
    static async getAllSemesters() {
        const [rows] = await db.query(`
            SELECT id, ten_ky, bat_dau, ket_thuc
            FROM ky_hoc
            ORDER BY bat_dau DESC
        `);

        return rows;
    }

    static async getSemesterById(id) {
        const [rows] = await db.query(
            `
            SELECT id, ten_ky, bat_dau, ket_thuc
            FROM ky_hoc
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async createSemester(data) {
        const { ten_ky, bat_dau, ket_thuc } = data;

        const [result] = await db.query(
            `
            INSERT INTO ky_hoc (ten_ky, bat_dau, ket_thuc)
            VALUES (?, ?, ?)
            `,
            [ten_ky, bat_dau, ket_thuc]
        );

        return {
            id: result.insertId,
            ten_ky,
            bat_dau,
            ket_thuc
        };
    }

    static async updateSemester(id, data) {
        const { ten_ky, bat_dau, ket_thuc } = data;

        const [result] = await db.query(
            `
            UPDATE ky_hoc
            SET ten_ky = ?, bat_dau = ?, ket_thuc = ?
            WHERE id = ?
            `,
            [ten_ky, bat_dau, ket_thuc, id]
        );

        return result.affectedRows;
    }

    static async deleteSemester(id) {
        const [result] = await db.query(
            `
            DELETE FROM ky_hoc
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = SemesterModel;