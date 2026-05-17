const db = require('../config/db');

class SessionModel {
    static async getAll({ limit, offset }) {
        const [rows] = await db.query(
            `
            SELECT 
                bh.*,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                ph.ten_phong
            FROM buoi_hoc bh
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            LEFT JOIN phong_hoc ph ON bh.phong_hoc_id = ph.id
            ORDER BY bh.ngay_hoc DESC, bh.gio_bat_dau DESC
            LIMIT ? OFFSET ?
            `,
            [limit, offset]
        );

        return rows;
    }

    static async countAll() {
        const [rows] = await db.query(`SELECT COUNT(*) AS total FROM buoi_hoc`);
        return rows[0].total;
    }

    static async getById(id) {
        const [rows] = await db.query(
            `
            SELECT 
                bh.*,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                ph.ten_phong
            FROM buoi_hoc bh
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            LEFT JOIN phong_hoc ph ON bh.phong_hoc_id = ph.id
            WHERE bh.id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async create(data) {
        const {
            lop_mon_hoc_id,
            ngay_hoc,
            gio_bat_dau,
            gio_ket_thuc,
            phong_hoc_id
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO buoi_hoc 
            (lop_mon_hoc_id, ngay_hoc, gio_bat_dau, gio_ket_thuc, phong_hoc_id)
            VALUES (?, ?, ?, ?, ?)
            `,
            [lop_mon_hoc_id, ngay_hoc, gio_bat_dau, gio_ket_thuc, phong_hoc_id || null]
        );

        return result.insertId;
    }

    static async update(id, data) {
        const {
            lop_mon_hoc_id,
            ngay_hoc,
            gio_bat_dau,
            gio_ket_thuc,
            phong_hoc_id,
            trang_thai
        } = data;

        const [result] = await db.query(
            `
            UPDATE buoi_hoc
            SET 
                lop_mon_hoc_id = ?,
                ngay_hoc = ?,
                gio_bat_dau = ?,
                gio_ket_thuc = ?,
                phong_hoc_id = ?,
                trang_thai = ?
            WHERE id = ?
            `,
            [
                lop_mon_hoc_id,
                ngay_hoc,
                gio_bat_dau,
                gio_ket_thuc,
                phong_hoc_id || null,
                trang_thai || 'sap_dien_ra',
                id
            ]
        );

        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query(
            `UPDATE buoi_hoc SET trang_thai = 'huy' WHERE id = ?`,
            [id]
        );

        return result.affectedRows;
    }

    static async openAttendance(id, tokenHash, expireAt) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            await conn.query(
                `
                UPDATE buoi_hoc
                SET diem_danh_mo = TRUE,
                    trang_thai = 'dang_dien_ra',
                    dong_diem_danh_luc = NULL
                WHERE id = ?
                `,
                [id]
            );

            await conn.query(
                `
                UPDATE qr_token
                SET dang_hoat_dong = FALSE
                WHERE buoi_hoc_id = ?
                `,
                [id]
            );

            const [lanRows] = await conn.query(
                `
                SELECT COALESCE(MAX(lan_tao), 0) + 1 AS lan_tao
                FROM qr_token
                WHERE buoi_hoc_id = ?
                `,
                [id]
            );

            const lanTao = lanRows[0].lan_tao;

            const [qrResult] = await conn.query(
                `
                INSERT INTO qr_token 
                (buoi_hoc_id, token_hash, het_han, dang_hoat_dong, lan_tao)
                VALUES (?, ?, ?, TRUE, ?)
                `,
                [id, tokenHash, expireAt, lanTao]
            );

            await conn.commit();

            return {
                qr_token_id: qrResult.insertId,
                lan_tao: lanTao
            };
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async closeAttendance(id) {
        const conn = await db.getConnection();

        try {
            await conn.beginTransaction();

            await conn.query(
                `
                UPDATE buoi_hoc
                SET diem_danh_mo = FALSE,
                    trang_thai = 'da_ket_thuc',
                    dong_diem_danh_luc = NOW()
                WHERE id = ?
                `,
                [id]
            );

            await conn.query(
                `
                UPDATE qr_token
                SET dang_hoat_dong = FALSE
                WHERE buoi_hoc_id = ?
                `,
                [id]
            );

            await conn.query(
                `
                INSERT INTO diem_danh 
                (buoi_hoc_id, sinh_vien_id, trang_thai, thoi_gian, hop_le)
                SELECT 
                    bh.id,
                    dk.sinh_vien_id,
                    'vang',
                    NOW(),
                    FALSE
                FROM buoi_hoc bh
                JOIN dang_ky_lop dk ON bh.lop_mon_hoc_id = dk.lop_mon_hoc_id
                WHERE bh.id = ?
                AND dk.sinh_vien_id NOT IN (
                    SELECT sinh_vien_id 
                    FROM diem_danh 
                    WHERE buoi_hoc_id = ?
                )
                `,
                [id, id]
            );

            await conn.commit();
            return true;
        } catch (error) {
            await conn.rollback();
            throw error;
        } finally {
            conn.release();
        }
    }

    static async changeRoom(id, phong_hoc_id) {
        const [result] = await db.query(
            `
            UPDATE buoi_hoc
            SET phong_hoc_id = ?
            WHERE id = ?
            `,
            [phong_hoc_id, id]
        );

        return result.affectedRows;
    }
}

module.exports = SessionModel;