const QrService = require('../services/qrService');

class QrController {
    static async generate(req, res) {
        try {
            const data = await QrService.generateQr(req.body);

            return res.status(201).json({
                success: true,
                message: 'Tạo mã QR thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getCurrent(req, res) {
        try {
            const data = await QrService.getCurrentQr(req.params.sessionId);

            return res.json({
                success: true,
                message: 'Lấy QR hiện tại thành công',
                data
            });
        } catch (error) {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    static async scan(req, res) {
        try {
            const data = await QrService.scanQr(req.body, req.user, req);

            return res.status(201).json({
                success: true,
                message: 'Điểm danh thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async refresh(req, res) {
        try {
            const data = await QrService.refreshQr(req.body);

            return res.status(201).json({
                success: true,
                message: 'Làm mới QR thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async scanPublic(req, res) {
        try {
            const data = await QrService.scanQrPublic(req.body, req);
            return res.status(201).json({
                success: true,
                message: 'Điểm danh thành công',
                data
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    static async history(req, res) {
        try {
            const data = await QrService.getHistory(req.params.sessionId);

            return res.json({
                success: true,
                message: 'Lấy lịch sử QR thành công',
                data
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = QrController;