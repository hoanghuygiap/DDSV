const DeviceService = require('../services/deviceService');

class DeviceController {
    static async registerDevice(req, res) {
        try {
            const result = await DeviceService.registerDevice(
                req.user.id,
                req.body
            );

            return res.status(201).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Register device error:', error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode ? error.message : 'Lỗi server'
            });
        }
    }

    static async updatePushToken(req, res) {
        try {
            const result = await DeviceService.updatePushToken(
                req.user.id,
                req.body
            );

            return res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Update push token error:', error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode ? error.message : 'Lỗi server'
            });
        }
    }

    static async deleteDevice(req, res) {
        try {
            const result = await DeviceService.deleteDevice(
                req.user.id,
                req.params.id
            );

            return res.json({
                success: true,
                message: result.message
            });
        } catch (error) {
            console.error('Delete device error:', error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode ? error.message : 'Lỗi server'
            });
        }
    }

    static async getMyDevices(req, res) {
        try {
            const devices = await DeviceService.getMyDevices(req.user.id);

            return res.json({
                success: true,
                message: 'Lấy danh sách thiết bị thành công',
                data: devices
            });
        } catch (error) {
            console.error('Get my devices error:', error);

            return res.status(error.statusCode || 500).json({
                success: false,
                message: error.statusCode ? error.message : 'Lỗi server'
            });
        }
    }
}

module.exports = DeviceController;