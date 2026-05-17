const db = require('../config/db');

class QrModel {
    static async getSessionById(sessionId) {
        const [rows] = await db.query(`
            SELECT bh.*, ph.latitude, ph.longitude, ph.ban_kinh_gps_m,
                   ph.require_gps, ph.require_wifi
            FROM buoi_hoc bh
            LEFT JOIN phong_hoc ph ON bh.phong_hoc_id = ph.id
            WHERE bh.id = ?
        `, [sessionId]);
        return rows[0];
    }

    static async deactivateOldQr(sessionId) {
        await db.query(
            `UPDATE qr_token SET dang_hoat_dong = FALSE WHERE buoi_hoc_id = ?`,
            [sessionId]
        );
    }

    static async createQr(sessionId, tokenHash, expiresAt, lanTao) {
        const [result] = await db.query(`
            INSERT INTO qr_token (buoi_hoc_id, token_hash, het_han, dang_hoat_dong, lan_tao)
            VALUES (?, ?, ?, TRUE, ?)
        `, [sessionId, tokenHash, expiresAt, lanTao]);

        return result.insertId;
    }

    static async getLastLanTao(sessionId) {
        const [rows] = await db.query(
            `SELECT MAX(lan_tao) AS lan_tao FROM qr_token WHERE buoi_hoc_id = ?`,
            [sessionId]
        );
        return rows[0]?.lan_tao || 0;
    }

    static async getCurrentQr(sessionId) {
        const [rows] = await db.query(`
            SELECT id, buoi_hoc_id, het_han, dang_hoat_dong, lan_tao, created_at
            FROM qr_token
            WHERE buoi_hoc_id = ?
              AND dang_hoat_dong = TRUE
              AND het_han > NOW()
            ORDER BY id DESC
            LIMIT 1
        `, [sessionId]);

        return rows[0];
    }

    static async findQrByTokenHash(tokenHash, sessionId) {
        const [rows] = await db.query(`
            SELECT *
            FROM qr_token
            WHERE token_hash = ?
              AND buoi_hoc_id = ?
              AND dang_hoat_dong = TRUE
              AND het_han > NOW()
            LIMIT 1
        `, [tokenHash, sessionId]);

        return rows[0];
    }

    static async getStudentByAccountId(accountId) {
        const [rows] = await db.query(
            `SELECT * FROM sinh_vien WHERE tai_khoan_id = ? AND deleted_at IS NULL`,
            [accountId]
        );
        return rows[0];
    }

    static async checkStudentInClass(studentId, sessionId) {
        const [rows] = await db.query(`
            SELECT dk.*
            FROM dang_ky_lop dk
            JOIN buoi_hoc bh ON dk.lop_mon_hoc_id = bh.lop_mon_hoc_id
            WHERE dk.sinh_vien_id = ?
              AND bh.id = ?
            LIMIT 1
        `, [studentId, sessionId]);

        return rows[0];
    }

    static async checkWifi(roomId, wifiBssid) {
        const [rows] = await db.query(`
            SELECT *
            FROM phong_wifi
            WHERE phong_hoc_id = ?
              AND bssid = ?
            LIMIT 1
        `, [roomId, wifiBssid]);

        return rows[0];
    }

    static async createAttendance(data) {
        const [result] = await db.query(`
            INSERT INTO diem_danh (
                buoi_hoc_id, sinh_vien_id, trang_thai, thoi_gian,
                latitude, longitude, hop_le_gps,
                wifi_bssid, hop_le_wifi, hop_le,
                thiet_bi_id, ip
            )
            VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            data.sessionId,
            data.studentId,
            data.trangThai,
            data.latitude,
            data.longitude,
            data.hopLeGps,
            data.wifiBssid,
            data.hopLeWifi,
            data.hopLe,
            data.deviceId,
            data.ip
        ]);

        return result.insertId;
    }

    static async logScan(data) {
        await db.query(`
            INSERT INTO lich_su_quet_qr (
                qr_token_id, sinh_vien_id, thanh_cong,
                ly_do_fail, ip, thiet_bi_id
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            data.qrTokenId,
            data.studentId || null,
            data.thanhCong,
            data.lyDoFail || null,
            data.ip,
            data.deviceId
        ]);
    }

    static async getQrHistory(sessionId) {
        const [rows] = await db.query(`
            SELECT id, buoi_hoc_id, het_han, dang_hoat_dong, lan_tao, created_at
            FROM qr_token
            WHERE buoi_hoc_id = ?
            ORDER BY created_at DESC
        `, [sessionId]);

        return rows;
    }
}

module.exports = QrModel;