const db = require('../config/db');

class RoomModel {
    static async getAll(limit, offset) {
        const [rows] = await db.query(
            `
            SELECT 
                id,
                ten_phong AS name,
                latitude,
                longitude,
                ban_kinh_gps_m AS radius_meters,
                require_gps,
                require_wifi
            FROM phong_hoc
            ORDER BY id DESC
            LIMIT ? OFFSET ?
            `,
            [limit, offset]
        );

        return rows;
    }

    static async countAll() {
        const [rows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM phong_hoc
            `
        );

        return rows[0].total;
    }

    static async findById(id) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM phong_hoc
            WHERE id = ?
            `,
            [id]
        );

        return rows[0];
    }

    static async findByName(name) {
        const [rows] = await db.query(
            `
            SELECT *
            FROM phong_hoc
            WHERE ten_phong = ?
            `,
            [name]
        );

        return rows[0];
    }

    static async create(data) {
        const [result] = await db.query(
            `
            INSERT INTO phong_hoc (
                ten_phong,
                latitude,
                longitude,
                ban_kinh_gps_m,
                require_gps,
                require_wifi
            )
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                data.ten_phong,
                data.latitude,
                data.longitude,
                data.ban_kinh_gps_m,
                data.require_gps,
                data.require_wifi
            ]
        );

        return {
            id: result.insertId,
            ...data
        };
    }

    static async update(id, data) {
        await db.query(
            `
            UPDATE phong_hoc
            SET
                ten_phong = ?,
                latitude = ?,
                longitude = ?,
                ban_kinh_gps_m = ?,
                require_gps = ?,
                require_wifi = ?
            WHERE id = ?
            `,
            [
                data.ten_phong,
                data.latitude,
                data.longitude,
                data.ban_kinh_gps_m,
                data.require_gps,
                data.require_wifi,
                id
            ]
        );

        return await this.findById(id);
    }

    static async remove(id) {
        const [result] = await db.query(
            `
            DELETE FROM phong_hoc
            WHERE id = ?
            `,
            [id]
        );

        return result;
    }

    static async getWifi(roomId) {
        const [rows] = await db.query(
            `
            SELECT 
                id,
                phong_hoc_id,
                bssid
            FROM phong_wifi
            WHERE phong_hoc_id = ?
            ORDER BY id DESC
            `,
            [roomId]
        );

        return rows;
    }

    static async addWifi(roomId, bssid) {
        const [result] = await db.query(
            `
            INSERT INTO phong_wifi (
                phong_hoc_id,
                bssid
            )
            VALUES (?, ?)
            `,
            [roomId, bssid]
        );

        return {
            id: result.insertId,
            phong_hoc_id: Number(roomId),
            bssid
        };
    }

    static async deleteWifi(roomId, wifiId) {
        const [result] = await db.query(
            `
            DELETE FROM phong_wifi
            WHERE id = ?
              AND phong_hoc_id = ?
            `,
            [wifiId, roomId]
        );

        return result;
    }
}

module.exports = RoomModel;