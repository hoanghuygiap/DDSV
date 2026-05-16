const db = require('../config/db');

class SubjectModel {
    static async getAllSubjects(limit, offset) {
        const [rows] = await db.query(
            `
            SELECT
                id,
                ma_hoc_phan,
                ten_hoc_phan,
                so_tin_chi
            FROM hoc_phan
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            `,
            [limit, offset]
        );

        return rows;
    }

    static async countSubjects() {
        const [rows] = await db.query(`
            SELECT COUNT(*) AS total
            FROM hoc_phan
        `);

        return rows[0].total;
    }

    static async getSubjectById(id) {
        const [rows] = await db.query(
            `
            SELECT
                id,
                ma_hoc_phan,
                ten_hoc_phan,
                so_tin_chi
            FROM hoc_phan
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async createSubject(data) {
        const {
            ma_hoc_phan,
            ten_hoc_phan,
            so_tin_chi
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO hoc_phan (
                ma_hoc_phan,
                ten_hoc_phan,
                so_tin_chi
            )
            VALUES (?, ?, ?)
            `,
            [
                ma_hoc_phan,
                ten_hoc_phan,
                so_tin_chi
            ]
        );

        return {
            id: result.insertId,
            ...data
        };
    }

    static async updateSubject(id, data) {
        const {
            ma_hoc_phan,
            ten_hoc_phan,
            so_tin_chi
        } = data;

        const [result] = await db.query(
            `
            UPDATE hoc_phan
            SET
                ma_hoc_phan = ?,
                ten_hoc_phan = ?,
                so_tin_chi = ?
            WHERE id = ?
            `,
            [
                ma_hoc_phan,
                ten_hoc_phan,
                so_tin_chi,
                id
            ]
        );

        return result.affectedRows;
    }

    static async deleteSubject(id) {
        const [result] = await db.query(
            `
            DELETE FROM hoc_phan
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = SubjectModel;