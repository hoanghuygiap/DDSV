const db = require('../config/db');

class FacultyModel {
    static async getAllFaculties() {
        const [rows] = await db.query(`
            SELECT id, ten_khoa
            FROM khoa
            ORDER BY id DESC
        `);

        return rows;
    }

    static async getFacultyById(id) {
        const [rows] = await db.query(
            `
            SELECT id, ten_khoa
            FROM khoa
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async createFaculty(ten_khoa) {
        const [result] = await db.query(
            `
            INSERT INTO khoa (ten_khoa)
            VALUES (?)
            `,
            [ten_khoa]
        );

        return {
            id: result.insertId,
            ten_khoa
        };
    }

    static async updateFaculty(id, ten_khoa) {
        const [result] = await db.query(
            `
            UPDATE khoa
            SET ten_khoa = ?
            WHERE id = ?
            `,
            [ten_khoa, id]
        );

        return result.affectedRows;
    }

    static async deleteFaculty(id) {
        const [result] = await db.query(
            `
            DELETE FROM khoa
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = FacultyModel;