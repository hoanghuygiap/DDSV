const ValidateModel = require('../models/validateModel');

class ValidateService {
    static async validateGPS(body) {
        const {
            session_id,
            latitude,
            longitude,
            accuracy_meters
        } = body;

        if (!session_id || latitude === undefined || longitude === undefined) {
            throw new Error('Thiếu session_id, latitude hoặc longitude');
        }

        if (accuracy_meters && Number(accuracy_meters) > 100) {
            throw new Error('GPS không đủ chính xác, vui lòng thử lại');
        }

        const session = await ValidateModel.getSessionLocation(session_id);

        if (!session) {
            throw new Error('Không tìm thấy buổi học');
        }

        if (!session.latitude || !session.longitude) {
            throw new Error('Phòng học chưa có tọa độ GPS');
        }

        const allowedRadius = session.allowed_radius_meters || 50;

        const distance = this.calculateDistance(
            Number(latitude),
            Number(longitude),
            Number(session.latitude),
            Number(session.longitude)
        );

        return {
            valid: distance <= allowedRadius,
            distance_meters: Number(distance.toFixed(2)),
            allowed_radius_meters: allowedRadius
        };
    }

    static calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371000;

        const toRad = (value) => value * Math.PI / 180;

        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }
}

module.exports = ValidateService;