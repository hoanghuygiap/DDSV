const RoomService = require('../services/roomService');

class RoomController {
    static async getAll(req, res) {
        try {
            const data = await RoomService.getAll(req.query);

            return res.json({
                success: true,
                message: 'Lấy danh sách phòng học thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async create(req, res) {
        try {
            const data = await RoomService.create(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo phòng học thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async update(req, res) {
        try {
            const data = await RoomService.update(req.params.id, req.body);

            return res.json({
                success: true,
                message: 'Cập nhật phòng học thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async remove(req, res) {
        try {
            await RoomService.remove(req.params.id);

            return res.json({
                success: true,
                message: 'Xoá phòng học thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getWifi(req, res) {
        try {
            const data = await RoomService.getWifi(req.params.id);

            return res.json({
                success: true,
                message: 'Lấy danh sách WiFi thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async addWifi(req, res) {
        try {
            const data = await RoomService.addWifi(req.params.id, req.body);

            return res.status(201).json({
                success: true,
                message: 'Thêm WiFi hợp lệ thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async deleteWifi(req, res) {
        try {
            await RoomService.deleteWifi(req.params.id, req.params.wifiId);

            return res.json({
                success: true,
                message: 'Xoá WiFi khỏi phòng thành công'
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = RoomController;