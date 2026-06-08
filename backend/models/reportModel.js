const db = require('../config/db');

class ReportModel {
    static async attendance(query) {
        const { sinh_vien_id, lop_mon_hoc_id } = query;

        let sql = `
            SELECT
                dd.sinh_vien_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                COUNT(*) AS tong,
                SUM(dd.trang_thai = 'co_mat') AS co_mat,
                SUM(dd.trang_thai = 'vang') AS vang,
                SUM(dd.trang_thai = 'tre') AS tre,
                SUM(dd.trang_thai = 'co_phep') AS co_phep,
                ROUND(SUM(dd.trang_thai = 'co_mat') / COUNT(*) * 100, 2) AS ti_le_co_mat
            FROM diem_danh dd
            JOIN sinh_vien sv ON dd.sinh_vien_id = sv.id
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            WHERE 1 = 1
        `;

        const params = [];

        if (sinh_vien_id) {
            sql += ` AND dd.sinh_vien_id = ?`;
            params.push(sinh_vien_id);
        }

        if (lop_mon_hoc_id) {
            sql += ` AND bh.lop_mon_hoc_id = ?`;
            params.push(lop_mon_hoc_id);
        }

        sql += `
            GROUP BY 
                dd.sinh_vien_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan
            ORDER BY ti_le_co_mat ASC
        `;

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async topAbsent(query) {
        const limit = Number(query.limit) || 10;

        const [rows] = await db.query(
            `
            SELECT
                sv.id AS sinh_vien_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                COUNT(*) AS tong_buoi,
                SUM(dd.trang_thai IN ('vang','tre')) AS tong_vang,
                SUM(dd.trang_thai = 'vang') AS vang_khong_phep,
                ROUND(SUM(dd.trang_thai IN ('vang','tre')) / COUNT(*) * 100, 2) AS ti_le_vang
            FROM diem_danh dd
            JOIN sinh_vien sv ON dd.sinh_vien_id = sv.id
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            GROUP BY 
                sv.id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan
            ORDER BY tong_vang DESC, ti_le_vang DESC
            LIMIT ?
            `,
            [limit]
        );

        return rows;
    }

    static async weeklyAttendance(query) {
        const { sinh_vien_id, lop_mon_hoc_id } = query;

        let sql = `
            SELECT
                dd.sinh_vien_id,
                bh.lop_mon_hoc_id,
                YEARWEEK(bh.ngay_hoc, 1) AS tuan_hoc,
                DATE_SUB(bh.ngay_hoc, INTERVAL WEEKDAY(bh.ngay_hoc) DAY) AS ngay_dau_tuan,
                COUNT(*) AS tong_buoi,
                SUM(dd.trang_thai = 'co_mat') AS co_mat,
                SUM(dd.trang_thai IN ('vang','tre')) AS vang,
                ROUND(SUM(dd.trang_thai = 'co_mat') / COUNT(*) * 100, 2) AS ti_le_co_mat
            FROM diem_danh dd
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            WHERE 1 = 1
        `;

        const params = [];

        if (sinh_vien_id) {
            sql += ` AND dd.sinh_vien_id = ?`;
            params.push(sinh_vien_id);
        }

        if (lop_mon_hoc_id) {
            sql += ` AND bh.lop_mon_hoc_id = ?`;
            params.push(lop_mon_hoc_id);
        }

        sql += `
            GROUP BY 
                dd.sinh_vien_id,
                bh.lop_mon_hoc_id,
                YEARWEEK(bh.ngay_hoc, 1),
                DATE_SUB(bh.ngay_hoc, INTERVAL WEEKDAY(bh.ngay_hoc) DAY)
            ORDER BY tuan_hoc ASC
        `;

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async byCourseClass(query) {
        const { lop_mon_hoc_id } = query;

        let sql = `
            SELECT
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                COUNT(dd.id) AS tong_luot_diem_danh,
                SUM(dd.trang_thai = 'co_mat') AS co_mat,
                SUM(dd.trang_thai = 'vang') AS vang,
                SUM(dd.trang_thai = 'tre') AS tre,
                SUM(dd.trang_thai = 'co_phep') AS co_phep,
                ROUND(SUM(dd.trang_thai = 'co_mat') / COUNT(dd.id) * 100, 2) AS ti_le_co_mat
            FROM diem_danh dd
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            WHERE 1 = 1
        `;

        const params = [];

        if (lop_mon_hoc_id) {
            sql += ` AND bh.lop_mon_hoc_id = ?`;
            params.push(lop_mon_hoc_id);
        }

        sql += `
            GROUP BY 
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan
            ORDER BY ti_le_co_mat ASC
        `;

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async bySemester(query) {
        const { ky_hoc_id } = query;

        let sql = `
            SELECT
                ky.id AS ky_hoc_id,
                ky.ten_ky,
                lmh.id AS lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                COUNT(dd.id) AS tong_luot_diem_danh,
                SUM(dd.trang_thai = 'co_mat') AS co_mat,
                SUM(dd.trang_thai = 'vang') AS vang,
                SUM(dd.trang_thai = 'tre') AS tre,
                SUM(dd.trang_thai = 'co_phep') AS co_phep,
                ROUND(SUM(dd.trang_thai = 'co_mat') / COUNT(dd.id) * 100, 2) AS ti_le_co_mat
            FROM diem_danh dd
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            JOIN ky_hoc ky ON lmh.ky_hoc_id = ky.id
            WHERE 1 = 1
        `;

        const params = [];

        if (ky_hoc_id) {
            sql += ` AND ky.id = ?`;
            params.push(ky_hoc_id);
        }

        sql += `
            GROUP BY 
                ky.id,
                ky.ten_ky,
                lmh.id,
                lmh.ma_lop,
                hp.ten_hoc_phan
            ORDER BY ky.id DESC, lmh.ma_lop ASC
        `;

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async exportData(query) {
        const { ma_lop, ma_sinh_vien, ky_hoc } = query;

        let sql = `
            SELECT
                sv.ma_sinh_vien,
                sv.ho_ten AS ten_sinh_vien,
                lhc.ten_lop AS lop_hanh_chinh,
                lmh.ma_lop,
                hp.ma_hoc_phan,
                hp.ten_hoc_phan,
                hp.so_tin_chi,
                ky.ten_ky AS ky_hoc,
                bh.ngay_hoc,
                bh.gio_bat_dau,
                bh.gio_ket_thuc,
                ph.ten_phong AS phong_hoc,
                dd.trang_thai,
                dd.thoi_gian AS thoi_gian_diem_danh,
                dd.hop_le_gps,
                dd.hop_le_wifi,
                dd.hop_le,
                dd.ghi_chu,
                tk_gv.ho_ten AS ten_giang_vien
            FROM diem_danh dd
            JOIN sinh_vien sv ON dd.sinh_vien_id = sv.id
            LEFT JOIN lop_hanh_chinh lhc ON sv.lop_id = lhc.id
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            JOIN ky_hoc ky ON lmh.ky_hoc_id = ky.id
            LEFT JOIN phong_hoc ph ON bh.phong_hoc_id = ph.id
            LEFT JOIN giang_vien gv ON lmh.giang_vien_id = gv.id
            LEFT JOIN tai_khoan tk_gv ON gv.tai_khoan_id = tk_gv.id
            WHERE 1 = 1
        `;

        const params = [];

        if (ma_lop) {
            sql += ` AND lmh.ma_lop = ?`;
            params.push(ma_lop);
        }

        if (ma_sinh_vien) {
            sql += ` AND sv.ma_sinh_vien = ?`;
            params.push(ma_sinh_vien);
        }

        if (ky_hoc) {
            sql += ` AND ky.ten_ky = ?`;
            params.push(ky_hoc);
        }

        sql += ` ORDER BY bh.ngay_hoc DESC, bh.gio_bat_dau DESC`;

        const [rows] = await db.query(sql, params);
        return rows;
    }
}

module.exports = ReportModel;