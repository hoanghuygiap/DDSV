const db = require('../config/db');

class AttendanceModel {
    static async getSessionForCheckin(sessionId) {
        const [rows] = await db.query(
            `
            SELECT 
                bh.id,
                bh.lop_mon_hoc_id,
                bh.phong_hoc_id,
                bh.diem_danh_mo,
                ph.latitude,
                ph.longitude,
                ph.ban_kinh_gps_m,
                ph.require_gps,
                ph.require_wifi
            FROM buoi_hoc bh
            LEFT JOIN phong_hoc ph ON bh.phong_hoc_id = ph.id
            WHERE bh.id = ?
            `,
            [sessionId]
        );

        return rows[0];
    }

    static async getActiveQr(sessionId, qrToken) {
        const [rows] = await db.query(
            `
            SELECT id
            FROM qr_token
            WHERE buoi_hoc_id = ?
              AND token_hash = ?
              AND dang_hoat_dong = TRUE
              AND het_han > NOW()
            LIMIT 1
            `,
            [sessionId, qrToken]
        );

        return rows[0];
    }

    static async checkExisted(sessionId, studentId) {
        const [rows] = await db.query(
            `
            SELECT id
            FROM diem_danh
            WHERE buoi_hoc_id = ?
              AND sinh_vien_id = ?
            LIMIT 1
            `,
            [sessionId, studentId]
        );

        return rows.length > 0;
    }

    static async checkStudentInClass(studentId, lopMonHocId) {
        const [rows] = await db.query(
            `
            SELECT sinh_vien_id
            FROM dang_ky_lop
            WHERE sinh_vien_id = ?
              AND lop_mon_hoc_id = ?
            LIMIT 1
            `,
            [studentId, lopMonHocId]
        );

        return rows.length > 0;
    }

    static async getValidWifiByRoom(roomId) {
        const [rows] = await db.query(
            `
            SELECT bssid
            FROM phong_wifi
            WHERE phong_hoc_id = ?
            `,
            [roomId]
        );

        return rows;
    }

    static async create(data) {
        const [result] = await db.query(
            `
            INSERT INTO diem_danh (
                buoi_hoc_id,
                sinh_vien_id,
                trang_thai,
                thoi_gian,
                latitude,
                longitude,
                hop_le_gps,
                wifi_bssid,
                hop_le_wifi,
                hop_le,
                thiet_bi_id,
                ip
            )
            VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [
                data.buoi_hoc_id,
                data.sinh_vien_id,
                data.trang_thai,
                data.latitude,
                data.longitude,
                data.hop_le_gps,
                data.wifi_bssid,
                data.hop_le_wifi,
                data.hop_le,
                data.thiet_bi_id,
                data.ip
            ]
        );

        return {
            id: result.insertId,
            ...data
        };
    }

    static async createManual(data) {
        const [result] = await db.query(
            `
            INSERT INTO diem_danh (
                buoi_hoc_id,
                sinh_vien_id,
                trang_thai,
                thoi_gian,
                hop_le,
                ghi_chu,
                chinh_sua_boi
            )
            VALUES (?, ?, ?, NOW(), ?, ?, ?)
            `,
            [
                data.buoi_hoc_id,
                data.sinh_vien_id,
                data.trang_thai,
                data.hop_le,
                data.ghi_chu,
                data.chinh_sua_boi
            ]
        );

        return {
            id: result.insertId,
            ...data
        };
    }

    static async getById(id) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM diem_danh
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async getBySession(sessionId) {
        const [rows] = await db.query(
            `
            SELECT 
                dd.id,
                dd.sinh_vien_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                dd.trang_thai,
                dd.thoi_gian,
                dd.latitude,
                dd.longitude,
                dd.hop_le_gps,
                dd.wifi_bssid,
                dd.hop_le_wifi,
                dd.hop_le,
                dd.ghi_chu
            FROM diem_danh dd
            JOIN sinh_vien sv ON dd.sinh_vien_id = sv.id
            WHERE dd.buoi_hoc_id = ?
            ORDER BY dd.thoi_gian DESC
            `,
            [sessionId]
        );

        return rows;
    }

    static async getByStudent(studentId, lopMonHocId, limit, offset) {
        let sql = `
            SELECT
                dd.id,
                dd.buoi_hoc_id,
                dd.trang_thai,
                dd.thoi_gian,
                dd.hop_le_gps,
                dd.hop_le_wifi,
                dd.hop_le,
                dd.ghi_chu,
                bh.ngay_hoc,
                bh.gio_bat_dau,
                bh.gio_ket_thuc,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                ph.ten_phong
            FROM diem_danh dd
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            LEFT JOIN phong_hoc ph ON bh.phong_hoc_id = ph.id
            WHERE dd.sinh_vien_id = ?
        `;
        let params = [studentId];
        if (lopMonHocId) {
            sql += `  AND bh.lop_mon_hoc_id = ? `;
            params.push(lopMonHocId);
        }
        sql += ` ORDER BY bh.ngay_hoc DESC, bh.gio_bat_dau DESC LIMIT ? OFFSET ? `;
        params.push(limit, offset);

        const [rows] = await db.query(sql, params);
        return rows;
    }

    static async countByStudent(studentId, lopMonHocId) {
        let sql = `
            SELECT COUNT(*) AS total
            FROM diem_danh dd
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            WHERE dd.sinh_vien_id = ?
        `;
        let params = [studentId];
        if (lopMonHocId) {
            sql += ` AND bh.lop_mon_hoc_id = ? `;
            params.push(lopMonHocId);
        }

        const [rows] = await db.query(sql, params);
        return rows[0].total;
    }

    static async update(id, data) {
        const [result] = await db.query(
            `
            UPDATE diem_danh
            SET 
                trang_thai = ?,
                ghi_chu = ?,
                chinh_sua_boi = ?
            WHERE id = ?
            `,
            [
                data.trang_thai,
                data.ghi_chu,
                data.chinh_sua_boi,
                id
            ]
        );

        return result;
    }

    static async remove(id) {
        const [result] = await db.query(
            `
            DELETE FROM diem_danh
            WHERE id = ?
            `,
            [id]
        );

        return result;
    }

    static async autoAbsent(sessionId, lopMonHocId) {
        const [result] = await db.query(
            `
            INSERT INTO diem_danh (
                buoi_hoc_id,
                sinh_vien_id,
                trang_thai,
                thoi_gian,
                hop_le
            )
            SELECT 
                ?,
                dk.sinh_vien_id,
                'vang',
                NOW(),
                FALSE
            FROM dang_ky_lop dk
            WHERE dk.lop_mon_hoc_id = ?
              AND dk.sinh_vien_id NOT IN (
                    SELECT sinh_vien_id
                    FROM diem_danh
                    WHERE buoi_hoc_id = ?
              )
            `,
            [sessionId, lopMonHocId, sessionId]
        );

        return result;
    }

    static async statistics(query) {
        const { lop_mon_hoc_id, sinh_vien_id } = query;

        let sql = `
            SELECT
                dd.sinh_vien_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                COUNT(*) AS tong_buoi,
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

        if (lop_mon_hoc_id) {
            sql += ` AND bh.lop_mon_hoc_id = ?`;
            params.push(lop_mon_hoc_id);
        }

        if (sinh_vien_id) {
            sql += ` AND dd.sinh_vien_id = ?`;
            params.push(sinh_vien_id);
        }

        sql += `
            GROUP BY 
                dd.sinh_vien_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                bh.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan
            ORDER BY sv.ho_ten ASC
        `;

        const [rows] = await db.query(sql, params);

        return rows;
    }

    static async exportExcel(query) {
        const { lop_mon_hoc_id, sinh_vien_id } = query;

        let sql = `
            SELECT *
            FROM v_export_diem_danh
            WHERE 1 = 1
        `;

        const params = [];

        if (lop_mon_hoc_id) {
            sql += ` AND ma_lop = ?`;
            params.push(lop_mon_hoc_id);
        }

        if (sinh_vien_id) {
            sql += ` AND ma_sinh_vien = ?`;
            params.push(sinh_vien_id);
        }

        sql += ` ORDER BY ngay_hoc DESC, gio_bat_dau DESC`;

        const [rows] = await db.query(sql, params);

        return rows;
    }

    // static async realtime(sessionId) {
    //     const [rows] = await db.query(
    //         `
    //         SELECT 
    //             dd.sinh_vien_id,
    //             sv.ho_ten AS student_name,
    //             dd.thoi_gian AS checked_in_at,
    //             'qr' AS method,
    //             dd.trang_thai,
    //             dd.hop_le
    //         FROM diem_danh dd
    //         JOIN sinh_vien sv ON dd.sinh_vien_id = sv.id
    //         WHERE dd.buoi_hoc_id = ?
    //         ORDER BY dd.thoi_gian DESC
    //         `,
    //         [sessionId]
    //     );

    //     return rows;
    // }
    static async realtime(sessionId) {
    const [rows] = await db.query(
        `
        SELECT 
            dd.sinh_vien_id,
            sv.ma_sinh_vien,
            sv.ho_ten AS student_name,
            dd.thoi_gian AS checked_in_at,
            'qr' AS method,
            dd.trang_thai,
            dd.hop_le
        FROM diem_danh dd
        JOIN sinh_vien sv ON dd.sinh_vien_id = sv.id
        WHERE dd.buoi_hoc_id = ?
        ORDER BY dd.thoi_gian DESC
        `,
        [sessionId]
    );

         return rows;
    }

    static async saveQrLog(data) {
        if (!data.qr_token_id) return;

        const [result] = await db.query(
            `
            INSERT INTO lich_su_quet_qr (
                qr_token_id,
                sinh_vien_id,
                thanh_cong,
                ly_do_fail,
                ip,
                thiet_bi_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                data.qr_token_id,
                data.sinh_vien_id,
                data.thanh_cong,
                data.ly_do_fail,
                data.ip,
                data.thiet_bi_id
            ]
        );

        return result;
    }
}

module.exports = AttendanceModel;