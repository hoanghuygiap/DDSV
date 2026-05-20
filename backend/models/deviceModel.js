const db = require('../config/db');

class DeviceModel {
    static async findStudentByAccountId(taiKhoanId) {
        const [rows] = await db.query(
            `
            SELECT id
            FROM sinh_vien
            WHERE tai_khoan_id = ?
              AND deleted_at IS NULL
            `,
            [taiKhoanId]
        );

        return rows[0];
    }

    static async registerDevice(data) {
        const {
            sinh_vien_id,
            device_id,
            push_token,
            platform
        } = data;

        const [result] = await db.query(
            `
            INSERT INTO thiet_bi (
                sinh_vien_id,
                device_id,
                push_token,
                platform,
                lan_cuoi
            )
            VALUES (?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
                push_token = VALUES(push_token),
                platform = VALUES(platform),
                lan_cuoi = NOW()
            `,
            [
                sinh_vien_id,
                device_id,
                push_token || null,
                platform || null
            ]
        );

        return result;
    }

    static async updatePushToken(data) {
        const {
            sinh_vien_id,
            device_id,
            push_token,
            platform
        } = data;

        const [result] = await db.query(
            `
            UPDATE thiet_bi
            SET
                push_token = ?,
                platform = COALESCE(?, platform),
                lan_cuoi = NOW()
            WHERE sinh_vien_id = ?
              AND device_id = ?
            `,
            [
                push_token,
                platform || null,
                sinh_vien_id,
                device_id
            ]
        );

        return result;
    }

    static async deleteDevice(sinhVienId, id) {
        const [result] = await db.query(
            `
            DELETE FROM thiet_bi
            WHERE id = ?
              AND sinh_vien_id = ?
            `,
            [id, sinhVienId]
        );

        return result;
    }

    static async getMyDevices(sinhVienId) {
        const [rows] = await db.query(
            `
            SELECT
                id,
                device_id,
                push_token,
                platform,
                lan_cuoi
            FROM thiet_bi
            WHERE sinh_vien_id = ?
            ORDER BY lan_cuoi DESC
            `,
            [sinhVienId]
        );

        return rows;
    }
}

module.exports = DeviceModel;