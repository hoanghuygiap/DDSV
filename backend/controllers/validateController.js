const ValidateService = require('../services/validateService');

class ValidateController {
    static async validateGPS(req, res) {
        try {
            const result = await ValidateService.validateGPS(req.body);

            return res.json({
                success: true,
                message: result.valid
                    ? 'Vị trí hợp lệ'
                    : 'Sinh viên không nằm trong bán kính cho phép',
                data: result
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = ValidateController;