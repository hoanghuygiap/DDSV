const db = require('../config/db');

class LecturerModel {
    //get all
    static async getAll() {
        const [rows] = await db.query(`
            SELECT
                gv.id,
                gv.ma_giang_vien,
                gv.ho_ten,
                gv.email,
                gv.sdt,
                tk.username,
                tk.kich_hoat,
                tk.created_at
            FROM giang_vien gv
            JOIN tai_khoan tk
                ON gv.tai_khoan_id = tk.id
            WHERE gv.deleted_at IS NULL
            ORDER BY gv.id DESC
        `);

        return rows;
    }

    //get by id
    static async getById(id) {
        const [rows] = await db.query(
            `
            SELECT
                gv.id,
                gv.ma_giang_vien,
                gv.ho_ten,
                gv.email,
                gv.sdt,
                tk.username,
                tk.kich_hoat,
                tk.created_at
            FROM giang_vien gv
            JOIN tai_khoan tk
                ON gv.tai_khoan_id = tk.id
            WHERE gv.id = ?
            AND gv.deleted_at IS NULL
        `,
            [id]
        );

        return rows[0];
    }
    static async getLecturerById(id) {
    return await this.getById(id);
    }

    //tao acc moi cho giang vien
    static async create(data) {
        const {
            tai_khoan_id,
            ma_giang_vien,
            ho_ten,
            email,
            sdt
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO giang_vien
            (
                tai_khoan_id,
                ma_giang_vien,
                ho_ten,
                email,
                sdt
            )
            VALUES (?, ?, ?, ?, ?)
        `,
            [
                tai_khoan_id,
                ma_giang_vien,
                ho_ten,
                email,
                sdt
            ]
        );

        return result;
    }

    //update thông tin 
    static async update(id, data) {
        const {
            ho_ten,
            email,
            sdt
        } = data;

        const [result] = await db.query(
            `
            UPDATE giang_vien
            SET
                ho_ten = ?,
                email = ?,
                sdt = ?
            WHERE id = ?
        `,
            [
                ho_ten,
                email,
                sdt,
                id
            ]
        );

        return result;
    }

    // =========================
    // SOFT DELETE
    // =========================
    static async remove(id) {
        const [result] = await db.query(
            `
            UPDATE giang_vien
            SET deleted_at = NOW()
            WHERE id = ?
        `,
            [id]
        );

        return result;
    }

    // =========================
    // SCHEDULE
    // =========================
    static async getSchedule(id) {
        const [rows] = await db.query(
            `
            SELECT
                bh.id AS buoi_hoc_id,
                bh.ngay_hoc,
                bh.gio_bat_dau,
                bh.gio_ket_thuc,
                bh.trang_thai,

                hp.ma_hoc_phan,
                hp.ten_hoc_phan,

                lmh.id AS lop_mon_hoc_id,
                lmh.ma_lop,

                ph.ten_phong,

                kh.ten_ky

            FROM lop_mon_hoc lmh

            JOIN hoc_phan hp
                ON lmh.hoc_phan_id = hp.id

            JOIN ky_hoc kh
                ON lmh.ky_hoc_id = kh.id

            JOIN buoi_hoc bh
                ON bh.lop_mon_hoc_id = lmh.id

            LEFT JOIN phong_hoc ph
                ON bh.phong_hoc_id = ph.id

            WHERE lmh.giang_vien_id = ?

            ORDER BY bh.ngay_hoc ASC,
                     bh.gio_bat_dau ASC
        `,
            [id]
        );

        return rows;
    }

    // =========================
    // COURSE CLASSES
    // =========================
    static async getCourseClasses(id) {
        const [rows] = await db.query(
            `
            SELECT
                lmh.id,
                lmh.ma_lop,

                hp.ma_hoc_phan,
                hp.ten_hoc_phan,
                hp.so_tin_chi,

                kh.ten_ky,
                kh.bat_dau,
                kh.ket_thuc,
                
                (SELECT COUNT(*) FROM dang_ky_lop dkl WHERE dkl.lop_mon_hoc_id = lmh.id) AS si_so,
                
                (SELECT COUNT(*) FROM buoi_hoc bh WHERE bh.lop_mon_hoc_id = lmh.id AND bh.trang_thai = 'da_ket_thuc') AS tong_buoi_da_day,
                
                ROUND( (SELECT COUNT(*) FROM diem_danh dd JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id WHERE bh.lop_mon_hoc_id = lmh.id AND dd.trang_thai = 'co_mat') / NULLIF((SELECT COUNT(*) FROM diem_danh dd JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id WHERE bh.lop_mon_hoc_id = lmh.id), 0) * 100, 0 ) AS ty_le_co_mat_tb,
                
                (
                    SELECT COUNT(DISTINCT dkl2.sinh_vien_id)
                    FROM dang_ky_lop dkl2
                    WHERE dkl2.lop_mon_hoc_id = lmh.id
                    AND (
                        (SELECT COUNT(*) FROM diem_danh dd2 JOIN buoi_hoc bh2 ON dd2.buoi_hoc_id = bh2.id WHERE bh2.lop_mon_hoc_id = lmh.id AND dd2.sinh_vien_id = dkl2.sinh_vien_id AND dd2.trang_thai = 'vang')
                        / NULLIF((SELECT COUNT(*) FROM buoi_hoc bh3 WHERE bh3.lop_mon_hoc_id = lmh.id), 0)
                    ) >= 0.2
                ) AS so_luong_nguy_co

            FROM lop_mon_hoc lmh

            JOIN hoc_phan hp
                ON lmh.hoc_phan_id = hp.id

            JOIN ky_hoc kh
                ON lmh.ky_hoc_id = kh.id

            WHERE lmh.giang_vien_id = ?
            AND lmh.deleted_at IS NULL

            ORDER BY lmh.id DESC
        `,
            [id]
        );

        return rows;
    }
}

module.exports = LecturerModel;