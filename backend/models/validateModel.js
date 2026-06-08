const db = require('../config/db');

class ValidateModel {
    static async getSessionLocation(sessionId) {
        const [rows] = await db.query(
            `
            SELECT 
                s.id AS session_id,
                r.id AS room_id,
                r.latitude,
                r.longitude,
                r.allowed_radius_meters
            FROM sessions s
            JOIN rooms r ON s.room_id = r.id
            WHERE s.id = ?
            `,
            [sessionId]
        );

        return rows[0];
    }
}

module.exports = ValidateModel;