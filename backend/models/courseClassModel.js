const db = require('../config/db');

class CourseClassModel {
    static async getAll(limit, offset) {
        const [rows] = await db.query(
            `
            SELECT
                lmh.id,
                lmh.ma_lop,
                hp.ma_hoc_phan,
                hp.ten_hoc_phan,
                gv.ho_ten AS ten_giang_vien,
                kh.ten_ky
            FROM lop_mon_hoc lmh
            LEFT JOIN hoc_phan hp
                ON lmh.hoc_phan_id = hp.id
            LEFT JOIN giang_vien gv
                ON lmh.giang_vien_id = gv.id
            LEFT JOIN ky_hoc kh
                ON lmh.ky_hoc_id = kh.id
            ORDER BY lmh.id DESC
            LIMIT ? OFFSET ?
            `,
            [limit, offset]
        );

        return rows;
    }

    static async countAll() {
        const [rows] = await db.query(`
            SELECT COUNT(*) AS total
            FROM lop_mon_hoc
        `);

        return rows[0].total;
    }

    static async getById(id) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM lop_mon_hoc
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async create(data) {
        const {
            ma_lop,
            hoc_phan_id,
            giang_vien_id,
            ky_hoc_id
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO lop_mon_hoc (
                ma_lop,
                hoc_phan_id,
                giang_vien_id,
                ky_hoc_id
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                ma_lop,
                hoc_phan_id,
                giang_vien_id,
                ky_hoc_id
            ]
        );

        return {
            id: result.insertId,
            ...data
        };
    }

    static async update(id, data) {
        const {
            ma_lop,
            hoc_phan_id,
            giang_vien_id,
            ky_hoc_id
        } = data;

        const [result] = await db.query(
            `
            UPDATE lop_mon_hoc
            SET
                ma_lop = ?,
                hoc_phan_id = ?,
                giang_vien_id = ?,
                ky_hoc_id = ?
            WHERE id = ?
            `,
            [
                ma_lop,
                hoc_phan_id,
                giang_vien_id,
                ky_hoc_id,
                id
            ]
        );

        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query(
            `
            DELETE FROM lop_mon_hoc
            WHERE id = ?
            `,
            [id]
        );

        return result.affectedRows;
    }

    static async getStudents(classId, limit, offset) {
        const [rows] = await db.query(
            `
            SELECT
                sv.id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                lhc.ten_lop,
                (SELECT COUNT(*) FROM buoi_hoc bh WHERE bh.lop_mon_hoc_id = ?) AS tong_buoi,
                (SELECT COUNT(*) FROM diem_danh dd JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id 
                 WHERE bh.lop_mon_hoc_id = ? AND dd.sinh_vien_id = sv.id AND dd.trang_thai = 'co_mat') AS so_buoi_co_mat,
                (SELECT COUNT(*) FROM diem_danh dd JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id 
                 WHERE bh.lop_mon_hoc_id = ? AND dd.sinh_vien_id = sv.id AND dd.trang_thai = 'vang') AS so_buoi_vang,
                (SELECT COUNT(*) FROM diem_danh dd JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id 
                 WHERE bh.lop_mon_hoc_id = ? AND dd.sinh_vien_id = sv.id AND dd.trang_thai = 'tre') AS so_buoi_tre,
                (SELECT COUNT(*) FROM diem_danh dd JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id 
                 WHERE bh.lop_mon_hoc_id = ? AND dd.sinh_vien_id = sv.id AND dd.trang_thai = 'co_phep') AS so_buoi_co_phep,
                ROUND((
                  (SELECT COUNT(*) FROM diem_danh dd JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id 
                   WHERE bh.lop_mon_hoc_id = ? AND dd.sinh_vien_id = sv.id AND dd.trang_thai = 'vang')
                  / NULLIF((SELECT COUNT(*) FROM buoi_hoc bh WHERE bh.lop_mon_hoc_id = ?), 0)
                ) * 100, 2) AS ty_le_vang
            FROM dang_ky_lop dkl
            JOIN sinh_vien sv ON dkl.sinh_vien_id = sv.id
            LEFT JOIN lop_hanh_chinh lhc ON sv.lop_id = lhc.id
            WHERE dkl.lop_mon_hoc_id = ?
            ORDER BY sv.ma_sinh_vien ASC
            LIMIT ? OFFSET ?
            `,
            [classId, classId, classId, classId, classId, classId, classId, classId, limit, offset]
        );

        return rows;
    }

    static async countStudents(classId) {
        const [rows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM dang_ky_lop
            WHERE lop_mon_hoc_id = ?
            `,
            [classId]
        );

        return rows[0].total;
    }

    static async registerStudent(
        classId,
        studentId
    ) {
        await db.query(
            `
            INSERT INTO dang_ky_lop (
                lop_mon_hoc_id,
                sinh_vien_id
            )
            VALUES (?, ?)
            `,
            [classId, studentId]
        );
    }

    static async unregisterStudent(
        classId,
        studentId
    ) {
        await db.query(
            `
            DELETE FROM dang_ky_lop
            WHERE lop_mon_hoc_id = ?
            AND sinh_vien_id = ?
            `,
            [classId, studentId]
        );
    }

    static async checkRegistered(
        classId,
        studentId
    ) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM dang_ky_lop
            WHERE lop_mon_hoc_id = ?
            AND sinh_vien_id = ?
            `,
            [classId, studentId]
        );

        return rows[0];
    }
    static async getStudentByCode(ma_sinh_vien) {
        const [rows] = await db.query(
            `
        SELECT *
        FROM sinh_vien
        WHERE ma_sinh_vien = ?
        AND deleted_at IS NULL
        `,
            [ma_sinh_vien]
        );

        return rows[0];
    }
}

module.exports = CourseClassModel;