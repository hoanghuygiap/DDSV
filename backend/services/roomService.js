const RoomModel = require('../models/roomModel');

class RoomService {
    static async getAll(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const offset = (page - 1) * limit;

        const data = await RoomModel.getAll(limit, offset);
        const total = await RoomModel.countAll();

        return {
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    static async create(body) {
        const {
            name,
            latitude,
            longitude,
            radius_meters,
            require_gps = true,
            require_wifi = false
        } = body;

        if (!name) {
            throw new Error('Tên phòng không được để trống');
        }

        const existed = await RoomModel.findByName(name);

        if (existed) {
            throw new Error('Tên phòng đã tồn tại');
        }

        return await RoomModel.create({
            ten_phong: name,
            latitude,
            longitude,
            ban_kinh_gps_m: radius_meters || 50,
            require_gps,
            require_wifi
        });
    }

    static async update(id, body) {
        const {
            name,
            latitude,
            longitude,
            radius_meters,
            require_gps,
            require_wifi
        } = body;

        const existed = await RoomModel.findById(id);

        if (!existed) {
            throw new Error('Phòng học không tồn tại');
        }

        return await RoomModel.update(id, {
            ten_phong: name ?? existed.ten_phong,
            latitude: latitude ?? existed.latitude,
            longitude: longitude ?? existed.longitude,
            ban_kinh_gps_m: radius_meters ?? existed.ban_kinh_gps_m,
            require_gps: require_gps ?? existed.require_gps,
            require_wifi: require_wifi ?? existed.require_wifi
        });
    }

    static async remove(id) {
        const existed = await RoomModel.findById(id);

        if (!existed) {
            throw new Error('Phòng học không tồn tại');
        }

        return await RoomModel.remove(id);
    }

    static async getWifi(roomId) {
        const room = await RoomModel.findById(roomId);

        if (!room) {
            throw new Error('Phòng học không tồn tại');
        }

        return await RoomModel.getWifi(roomId);
    }

    static async addWifi(roomId, body) {
        const { bssid } = body;

        if (!bssid) {
            throw new Error('Thiếu bssid WiFi');
        }

        const room = await RoomModel.findById(roomId);

        if (!room) {
            throw new Error('Phòng học không tồn tại');
        }

        return await RoomModel.addWifi(roomId, bssid);
    }

    static async deleteWifi(roomId, wifiId) {
        const room = await RoomModel.findById(roomId);

        if (!room) {
            throw new Error('Phòng học không tồn tại');
        }

        return await RoomModel.deleteWifi(roomId, wifiId);
    }
}

module.exports = RoomService;