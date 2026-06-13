// const WarningService = require('../services/warningService');

// class WarningController {
//     static async getAll(req, res) {
//         try {
//             const data = await WarningService.getAll(req.query);

//             res.json({
//                 success: true,
//                 message: 'Lấy danh sách cảnh báo thành công',
//                 data
//             });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }

//     static async create(req, res) {
//         try {
//             const data = await WarningService.create(req.body);

//             res.status(201).json({
//                 success: true,
//                 message: 'Tạo cảnh báo thành công',
//                 data
//             });
//         } catch (error) {
//             res.status(400).json({ success: false, message: error.message });
//         }
//     }

//     static async process(req, res) {
//         try {
//             const data = await WarningService.process(req.params.id, req.user);

//             res.json({
//                 success: true,
//                 message: 'Xử lý cảnh báo thành công',
//                 data
//             });
//         } catch (error) {
//             res.status(400).json({ success: false, message: error.message });
//         }
//     }

//     static async remove(req, res) {
//         try {
//             await WarningService.remove(req.params.id);

//             res.json({
//                 success: true,
//                 message: 'Xoá cảnh báo thành công'
//             });
//         } catch (error) {
//             res.status(400).json({ success: false, message: error.message });
//         }
//     }

//     static async getByStudent(req, res) {
//         try {
//             const data = await WarningService.getByStudent(req.params.id);

//             res.json({
//                 success: true,
//                 message: 'Lấy cảnh báo của sinh viên thành công',
//                 data
//             });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }

//     static async getByCourseClass(req, res) {
//         try {
//             const data = await WarningService.getByCourseClass(req.params.id);

//             res.json({
//                 success: true,
//                 message: 'Lấy cảnh báo theo lớp môn học thành công',
//                 data
//             });
//         } catch (error) {
//             res.status(500).json({ success: false, message: error.message });
//         }
//     }

//     static async autoGenerate(req, res) {
//         try {
//             const data = await WarningService.autoGenerate(req.body);

//             res.json({
//                 success: true,
//                 message: 'Tạo cảnh báo tự động thành công',
//                 data
//             });
//         } catch (error) {
//             res.status(400).json({ success: false, message: error.message });
//         }
//     }
// }

// module.exports = WarningController;


const WarningService = require('../services/warningService');

class WarningController {
    static async getAll(req, res) {
        try {
            const data = await WarningService.getAll(req.query);

            res.json({
                success: true,
                message: 'Lấy danh sách cảnh báo thành công',
                data
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async create(req, res) {
        try {
            const data = await WarningService.create(req.body);

            res.status(201).json({
                success: true,
                message: 'Tạo cảnh báo thành công',
                data
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async process(req, res) {
        try {
            const data = await WarningService.process(req.params.id, req.user);

            res.json({
                success: true,
                message: 'Xử lý cảnh báo thành công',
                data
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async remove(req, res) {
        try {
            await WarningService.remove(req.params.id);

            res.json({
                success: true,
                message: 'Xoá cảnh báo thành công'
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getByStudent(req, res) {
        try {
            const data = await WarningService.getByStudent(req.params.id);

            res.json({
                success: true,
                message: 'Lấy cảnh báo của sinh viên thành công',
                data
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async getByCourseClass(req, res) {
        try {
            const data = await WarningService.getByCourseClass(req.params.id);

            res.json({
                success: true,
                message: 'Lấy cảnh báo theo lớp môn học thành công',
                data
            });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    static async autoGenerate(req, res) {
        try {
            const data = await WarningService.autoGenerate(req.body);

            res.json({
                success: true,
                message: 'Tạo cảnh báo tự động thành công',
                data
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async autoGenerateAll(req, res) {
        try {
            const data = await WarningService.autoGenerateAll();

            res.json({
                success: true,
                message: 'Đã quét toàn bộ dữ liệu điểm danh và tạo cảnh báo tự động',
                data
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = WarningController;