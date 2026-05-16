const db = require('../config/db');

class ClassModel {
    static async getAllClasses() {
        const [rows] = await db.query(`
            SELECT
                lhc.id,
                lhc.ten_lop,
                lhc.nganh_id,
                n.ten_nganh,
                k.id AS khoa_id,
                k.ten_khoa
            FROM lop_hanh_chinh lhc
            LEFT JOIN nganh n ON lhc.nganh_id = n.id
            LEFT JOIN khoa k ON n.khoa_id = k.id
            ORDER BY lhc.id DESC
        `);

        return rows;
    }

    static async getClassById(id) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM lop_hanh_chinh
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async createClass(ten_lop, nganh_id) {
        const [result] = await db.query(
            `
            INSERT INTO lop_hanh_chinh (ten_lop, nganh_id)
            VALUES (?, ?)
            `,
            [ten_lop, nganh_id]
        );

        return {
            id: result.insertId,
            ten_lop,
            nganh_id
        };
    }

    static async updateClass(id, ten_lop, nganh_id) {
        const [result] = await db.query(
            `
            UPDATE lop_hanh_chinh
            SET ten_lop = ?, nganh_id = ?
            WHERE id = ?
            `,
            [ten_lop, nganh_id, id]
        );

        return result.affectedRows;
    }

    static async deleteClass(id) {
        const [result] = await db.query(
            `
            DELETE FROM lop_hanh_chinh
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }
}

module.exports = ClassModel;