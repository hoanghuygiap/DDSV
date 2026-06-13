// const db = require('../config/db');

// class WarningModel {
//     static async getAll(limit, offset) {
//         const [rows] = await db.query(
//             `
//             SELECT 
//                 cb.id,
//                 cb.sinh_vien_id AS student_id,
//                 sv.ma_sinh_vien,
//                 sv.ho_ten AS student_name,
//                 cb.lop_mon_hoc_id AS course_class_id,
//                 lmh.ma_lop,
//                 hp.ten_hoc_phan,
//                 cb.loai AS type,
//                 cb.noi_dung AS content,
//                 cb.da_xu_ly AS processed,
//                 cb.tao_luc AS created_at,
//                 cb.xu_ly_luc AS processed_at
//             FROM canh_bao cb
//             JOIN sinh_vien sv ON cb.sinh_vien_id = sv.id
//             JOIN lop_mon_hoc lmh ON cb.lop_mon_hoc_id = lmh.id
//             JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
//             ORDER BY cb.tao_luc DESC
//             LIMIT ? OFFSET ?
//             `,
//             [limit, offset]
//         );

//         return rows;
//     }

//     static async countAll() {
//         const [rows] = await db.query(
//             `SELECT COUNT(*) AS total FROM canh_bao`
//         );

//         return rows[0].total;
//     }

//     static async create(data) {
//         const [result] = await db.query(
//             `
//             INSERT INTO canh_bao (
//                 sinh_vien_id,
//                 lop_mon_hoc_id,
//                 loai,
//                 noi_dung
//             )
//             VALUES (?, ?, ?, ?)
//             `,
//             [
//                 data.sinh_vien_id,
//                 data.lop_mon_hoc_id,
//                 data.loai,
//                 data.noi_dung
//             ]
//         );

//         return {
//             id: result.insertId,
//             ...data,
//             da_xu_ly: false
//         };
//     }

//     static async findById(id) {
//         const [rows] = await db.query(
//             `
//             SELECT *
//             FROM canh_bao
//             WHERE id = ?
//             `,
//             [id]
//         );

//         return rows[0];
//     }

//     static async process(id, userId) {
//         await db.query(
//             `
//             UPDATE canh_bao
//             SET 
//                 da_xu_ly = TRUE,
//                 xu_ly_boi = ?,
//                 xu_ly_luc = NOW()
//             WHERE id = ?
//             `,
//             [userId, id]
//         );

//         return await this.findById(id);
//     }

//     static async remove(id) {
//         const [result] = await db.query(
//             `
//             DELETE FROM canh_bao
//             WHERE id = ?
//             `,
//             [id]
//         );

//         return result;
//     }

//     static async getByStudent(studentId) {
//         const [rows] = await db.query(
//             `
//             SELECT 
//                 cb.id,
//                 cb.sinh_vien_id AS student_id,
//                 sv.ma_sinh_vien,
//                 sv.ho_ten AS student_name,
//                 cb.lop_mon_hoc_id AS course_class_id,
//                 lmh.ma_lop,
//                 hp.ten_hoc_phan,
//                 cb.loai AS type,
//                 cb.noi_dung AS content,
//                 cb.da_xu_ly AS processed,
//                 cb.tao_luc AS created_at,
//                 cb.xu_ly_luc AS processed_at
//             FROM canh_bao cb
//             JOIN sinh_vien sv ON cb.sinh_vien_id = sv.id
//             JOIN lop_mon_hoc lmh ON cb.lop_mon_hoc_id = lmh.id
//             JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
//             WHERE cb.sinh_vien_id = ?
//             ORDER BY cb.tao_luc DESC
//             `,
//             [studentId]
//         );

//         return rows;
//     }

//     static async getByCourseClass(courseClassId) {
//         const [rows] = await db.query(
//             `
//             SELECT 
//                 cb.id,
//                 cb.sinh_vien_id AS student_id,
//                 sv.ma_sinh_vien,
//                 sv.ho_ten AS student_name,
//                 cb.lop_mon_hoc_id AS course_class_id,
//                 lmh.ma_lop,
//                 hp.ten_hoc_phan,
//                 cb.loai AS type,
//                 cb.noi_dung AS content,
//                 cb.da_xu_ly AS processed,
//                 cb.tao_luc AS created_at,
//                 cb.xu_ly_luc AS processed_at
//             FROM canh_bao cb
//             JOIN sinh_vien sv ON cb.sinh_vien_id = sv.id
//             JOIN lop_mon_hoc lmh ON cb.lop_mon_hoc_id = lmh.id
//             JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
//             WHERE cb.lop_mon_hoc_id = ?
//             ORDER BY cb.tao_luc DESC
//             `,
//             [courseClassId]
//         );

//         return rows;
//     }

//     static async findActiveWarning(studentId, courseClassId) {
//         const [rows] = await db.query(
//             `
//             SELECT id
//             FROM canh_bao
//             WHERE sinh_vien_id = ?
//               AND lop_mon_hoc_id = ?
//               AND da_xu_ly = FALSE
//             LIMIT 1
//             `,
//             [studentId, courseClassId]
//         );

//         return rows[0];
//     }

//     static async getAttendanceSummary(courseClassId) {
//         const [rows] = await db.query(
//             `
//             SELECT
//                 dd.sinh_vien_id,
//                 sv.ma_sinh_vien,
//                 sv.ho_ten,
//                 COUNT(*) AS tong_buoi,
//                 SUM(dd.trang_thai = 'co_mat') AS co_mat,
//                 SUM(dd.trang_thai = 'vang') AS vang,
//                 SUM(dd.trang_thai = 'tre') AS tre,
//                 ROUND(SUM(dd.trang_thai IN ('vang', 'tre')) / COUNT(*) * 100, 2) AS ti_le_vang
//             FROM diem_danh dd
//             JOIN sinh_vien sv ON dd.sinh_vien_id = sv.id
//             JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
//             WHERE bh.lop_mon_hoc_id = ?
//             GROUP BY dd.sinh_vien_id, sv.ma_sinh_vien, sv.ho_ten
//             `,
//             [courseClassId]
//         );

//         return rows;
//     }
// }

// module.exports = WarningModel;


const db = require('../config/db');

class WarningModel {
    static async getAll(limit, offset) {
        const [rows] = await db.query(
            `
            SELECT 
                cb.id,
                cb.sinh_vien_id AS student_id,
                sv.ma_sinh_vien,
                sv.ho_ten AS student_name,
                cb.lop_mon_hoc_id AS course_class_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                cb.loai AS type,
                cb.noi_dung AS content,
                cb.da_xu_ly AS processed,
                cb.tao_luc AS created_at,
                cb.xu_ly_luc AS processed_at
            FROM canh_bao cb
            JOIN sinh_vien sv ON cb.sinh_vien_id = sv.id
            JOIN lop_mon_hoc lmh ON cb.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            ORDER BY cb.tao_luc DESC
            LIMIT ? OFFSET ?
            `,
            [limit, offset]
        );

        return rows;
    }

    static async countAll() {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS total FROM canh_bao`
        );

        return rows[0].total;
    }

    static async create(data) {
        const [result] = await db.query(
            `
            INSERT INTO canh_bao (
                sinh_vien_id,
                lop_mon_hoc_id,
                loai,
                noi_dung
            )
            VALUES (?, ?, ?, ?)
            `,
            [
                data.sinh_vien_id,
                data.lop_mon_hoc_id,
                data.loai,
                data.noi_dung
            ]
        );

        return {
            id: result.insertId,
            ...data,
            da_xu_ly: false
        };
    }

    static async findById(id) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM canh_bao
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async process(id, userId) {
        await db.query(
            `
            UPDATE canh_bao
            SET 
                da_xu_ly = TRUE,
                xu_ly_boi = ?,
                xu_ly_luc = NOW()
            WHERE id = ?
            `,
            [userId, id]
        );

        return await this.findById(id);
    }

    static async remove(id) {
        const [result] = await db.query(
            `
            DELETE FROM canh_bao
            WHERE id = ?
            `,
            [id]
        );

        return result;
    }

    static async getByStudent(studentId) {
        const [rows] = await db.query(
            `
            SELECT 
                cb.id,
                cb.sinh_vien_id AS student_id,
                sv.ma_sinh_vien,
                sv.ho_ten AS student_name,
                cb.lop_mon_hoc_id AS course_class_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                cb.loai AS type,
                cb.noi_dung AS content,
                cb.da_xu_ly AS processed,
                cb.tao_luc AS created_at,
                cb.xu_ly_luc AS processed_at
            FROM canh_bao cb
            JOIN sinh_vien sv ON cb.sinh_vien_id = sv.id
            JOIN lop_mon_hoc lmh ON cb.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            WHERE cb.sinh_vien_id = ?
            ORDER BY cb.tao_luc DESC
            `,
            [studentId]
        );

        return rows;
    }

    static async getByCourseClass(courseClassId) {
        const [rows] = await db.query(
            `
            SELECT 
                cb.id,
                cb.sinh_vien_id AS student_id,
                sv.ma_sinh_vien,
                sv.ho_ten AS student_name,
                cb.lop_mon_hoc_id AS course_class_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                cb.loai AS type,
                cb.noi_dung AS content,
                cb.da_xu_ly AS processed,
                cb.tao_luc AS created_at,
                cb.xu_ly_luc AS processed_at
            FROM canh_bao cb
            JOIN sinh_vien sv ON cb.sinh_vien_id = sv.id
            JOIN lop_mon_hoc lmh ON cb.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            WHERE cb.lop_mon_hoc_id = ?
            ORDER BY cb.tao_luc DESC
            `,
            [courseClassId]
        );

        return rows;
    }

    static async findActiveWarning(studentId, courseClassId) {
        const [rows] = await db.query(
            `
            SELECT id
            FROM canh_bao
            WHERE sinh_vien_id = ?
              AND lop_mon_hoc_id = ?
              AND da_xu_ly = FALSE
            LIMIT 1
            `,
            [studentId, courseClassId]
        );

        return rows[0];
    }

    static async getAttendanceSummary(courseClassId) {
        const [rows] = await db.query(
            `
            SELECT
                sv.id AS sinh_vien_id,
                sv.tai_khoan_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                lmh.id AS lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,

                COALESCE(SUM(CASE WHEN dd.trang_thai = 'co_mat' THEN 1 ELSE 0 END), 0) AS co_mat,
                COALESCE(SUM(CASE WHEN dd.trang_thai = 'vang' THEN 1 ELSE 0 END), 0) AS vang,
                COALESCE(SUM(CASE WHEN dd.trang_thai = 'tre' THEN 1 ELSE 0 END), 0) AS tre,
                COALESCE(SUM(CASE WHEN dd.trang_thai = 'co_phep' THEN 1 ELSE 0 END), 0) AS co_phep

            FROM dang_ky_lop dk
            JOIN sinh_vien sv ON sv.id = dk.sinh_vien_id
            JOIN lop_mon_hoc lmh ON lmh.id = dk.lop_mon_hoc_id
            JOIN hoc_phan hp ON hp.id = lmh.hoc_phan_id
            LEFT JOIN buoi_hoc bh ON bh.lop_mon_hoc_id = dk.lop_mon_hoc_id
            LEFT JOIN diem_danh dd
                ON dd.buoi_hoc_id = bh.id
               AND dd.sinh_vien_id = sv.id

            WHERE dk.lop_mon_hoc_id = ?

            GROUP BY
                sv.id,
                sv.tai_khoan_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                lmh.id,
                lmh.ma_lop,
                hp.ten_hoc_phan
            `,
            [courseClassId]
        );

        return rows;
    }

    static async getAllCourseClassIds() {
        const [rows] = await db.query(
            `
            SELECT id, ma_lop
            FROM lop_mon_hoc
            ORDER BY id
            `
        );

        return rows;
    }
}

module.exports = WarningModel;