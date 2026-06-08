const DeviceModel = require('../models/deviceModel');

class DeviceService {
    static async getSinhVienIdByUserId(userId) {
        const student = await DeviceModel.findStudentByAccountId(userId);

        if (!student) {
            const error = new Error('Chỉ sinh viên mới được quản lý thiết bị');
            error.statusCode = 403;
            throw error;
        }

        return student.id;
    }

    static validatePlatform(platform) {
        if (!platform) return;

        const validPlatforms = ['android', 'ios', 'web'];

        if (!validPlatforms.includes(platform)) {
            const error = new Error('Platform chỉ được là android, ios hoặc web');
            error.statusCode = 400;
            throw error;
        }
    }

    static async registerDevice(userId, body) {
        const sinhVienId = await this.getSinhVienIdByUserId(userId);

        const {
            device_id,
            push_token,
            platform
        } = body;

        if (!device_id) {
            const error = new Error('Thiếu device_id');
            error.statusCode = 400;
            throw error;
        }

        this.validatePlatform(platform);

        await DeviceModel.registerDevice({
            sinh_vien_id: sinhVienId,
            device_id,
            push_token,
            platform
        });

        return {
            message: 'Đăng ký thiết bị thành công'
        };
    }

    static async updatePushToken(userId, body) {
        const sinhVienId = await this.getSinhVienIdByUserId(userId);

        const {
            device_id,
            push_token,
            platform
        } = body;

        if (!device_id) {
            const error = new Error('Thiếu device_id');
            error.statusCode = 400;
            throw error;
        }

        if (!push_token) {
            const error = new Error('Thiếu push_token');
            error.statusCode = 400;
            throw error;
        }

        this.validatePlatform(platform);

        const result = await DeviceModel.updatePushToken({
            sinh_vien_id: sinhVienId,
            device_id,
            push_token,
            platform
        });

        if (result.affectedRows === 0) {
            const error = new Error('Không tìm thấy thiết bị');
            error.statusCode = 404;
            throw error;
        }

        return {
            message: 'Cập nhật push token thành công'
        };
    }

    static async deleteDevice(userId, id) {
        const sinhVienId = await this.getSinhVienIdByUserId(userId);

        const result = await DeviceModel.deleteDevice(sinhVienId, id);

        if (result.affectedRows === 0) {
            const error = new Error('Không tìm thấy thiết bị');
            error.statusCode = 404;
            throw error;
        }

        return {
            message: 'Xoá thiết bị thành công'
        };
    }

    static async getMyDevices(userId) {
        const sinhVienId = await this.getSinhVienIdByUserId(userId);

        const devices = await DeviceModel.getMyDevices(sinhVienId);

        return devices;
    }
}

module.exports = DeviceService;