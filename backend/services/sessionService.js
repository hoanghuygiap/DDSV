// const crypto = require('crypto');
// const SessionModel = require('../models/sessionModel');

// class SessionService {
//     static async getAllSessions(query) {
//         const page = parseInt(query.page) || 1;
//         const limit = parseInt(query.limit) || 10;
//         const offset = (page - 1) * limit;

//         const data = await SessionModel.getAll({ limit, offset });
//         const total = await SessionModel.countAll();

//         return {
//             data,
//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     }

//     static async getSessionById(id) {
//         const session = await SessionModel.getById(id);

//         if (!session) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return session;
//     }

//     static async createSession(data) {
//         const id = await SessionModel.create(data);
//         return await SessionModel.getById(id);
//     }

//     static async updateSession(id, data) {
//         const affected = await SessionModel.update(id, data);

//         if (!affected) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return await SessionModel.getById(id);
//     }

//     static async deleteSession(id) {
//         const affected = await SessionModel.delete(id);

//         if (!affected) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return true;
//     }

//     static async openAttendance(id) {
//         const session = await SessionModel.getById(id);

//         if (!session) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         if (session.trang_thai === 'huy') {
//             throw new Error('Buổi học đã bị huỷ');
//         }

//         const rawToken = crypto.randomBytes(32).toString('hex');
//         const tokenHash = crypto
//             .createHash('sha256')
//             .update(rawToken)
//             .digest('hex');

//         const expireAt = new Date(Date.now() + 30 * 1000);

//         const qr = await SessionModel.openAttendance(id, tokenHash, expireAt);

//         return {
//             buoi_hoc_id: id,
//             qr_token: rawToken,
//             qr_token_id: qr.qr_token_id,
//             het_han: expireAt
//         };
//     }

//     static async closeAttendance(id) {
//         const session = await SessionModel.getById(id);

//         if (!session) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         await SessionModel.closeAttendance(id);

//         return true;
//     }

//     static async changeRoom(id, phong_hoc_id) {
//         const affected = await SessionModel.changeRoom(id, phong_hoc_id);

//         if (!affected) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return await SessionModel.getById(id);
//     }
// }

// module.exports = SessionService;
// const crypto = require('crypto');
// const SessionModel = require('../models/sessionModel');

// class SessionService {
//     static async getAllSessions(query) {
//         const page = parseInt(query.page) || 1;
//         const limit = parseInt(query.limit) || 10;
//         const offset = (page - 1) * limit;

//         const filter = {
//             keyword: query.keyword || '',
//             date: query.date || null,
//             week: query.week || null,
//             status: query.status || query.trang_thai || null,
//             room_id: query.room_id || query.phong_hoc_id || null,
//             course_class_id: query.course_class_id || query.lop_mon_hoc_id || null
//         };

//         const data = await SessionModel.getAll({ limit, offset, filter });
//         const total = await SessionModel.countAll(filter);

//         return {
//             data,
//             pagination: {
//                 page,
//                 limit,
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     }

//     static async getSessionById(id) {
//         const session = await SessionModel.getById(id);

//         if (!session) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return session;
//     }

//     static async createSession(data) {
//         const id = await SessionModel.create(data);
//         return await SessionModel.getById(id);
//     }

//     static async updateSession(id, data) {
//         const affected = await SessionModel.update(id, data);

//         if (!affected) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return await SessionModel.getById(id);
//     }

//     static async deleteSession(id) {
//         const affected = await SessionModel.delete(id);

//         if (!affected) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return true;
//     }

//     static async openAttendance(id) {
//         const session = await SessionModel.getById(id);

//         if (!session) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         if (session.trang_thai === 'huy') {
//             throw new Error('Buổi học đã bị huỷ');
//         }

//         const rawToken = crypto.randomBytes(32).toString('hex');
//         const tokenHash = crypto
//             .createHash('sha256')
//             .update(rawToken)
//             .digest('hex');

//         const expireAt = new Date(Date.now() + 30 * 1000);

//         const qr = await SessionModel.openAttendance(id, tokenHash, expireAt);

//         return {
//             buoi_hoc_id: id,
//             qr_token: rawToken,
//             qr_token_id: qr.qr_token_id,
//             het_han: expireAt
//         };
//     }

//     static async closeAttendance(id) {
//         const session = await SessionModel.getById(id);

//         if (!session) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         await SessionModel.closeAttendance(id);

//         return true;
//     }

//     static async changeRoom(id, phong_hoc_id) {
//         const affected = await SessionModel.changeRoom(id, phong_hoc_id);

//         if (!affected) {
//             throw new Error('Không tìm thấy buổi học');
//         }

//         return await SessionModel.getById(id);
//     }
// }

// module.exports = SessionService;

const crypto = require('crypto');
const SessionModel = require('../models/sessionModel');
const WarningService = require('./warningService');

class SessionService {
    static async getAllSessions(query) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const offset = (page - 1) * limit;

        const filter = {
            keyword: query.keyword || '',
            date: query.date || null,
            week: query.week || null,
            status: query.status || query.trang_thai || null,
            room_id: query.room_id || query.phong_hoc_id || null,
            course_class_id: query.course_class_id || query.lop_mon_hoc_id || null
        };

        const data = await SessionModel.getAll({ limit, offset, filter });
        const total = await SessionModel.countAll(filter);

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

    static async getSessionById(id) {
        const session = await SessionModel.getById(id);

        if (!session) {
            throw new Error('Không tìm thấy buổi học');
        }

        return session;
    }

    static async createSession(data) {
        const id = await SessionModel.create(data);
        return await SessionModel.getById(id);
    }

    static async updateSession(id, data) {
        const affected = await SessionModel.update(id, data);

        if (!affected) {
            throw new Error('Không tìm thấy buổi học');
        }

        return await SessionModel.getById(id);
    }

    static async deleteSession(id) {
        const affected = await SessionModel.delete(id);

        if (!affected) {
            throw new Error('Không tìm thấy buổi học');
        }

        return true;
    }

    static async openAttendance(id) {
        const session = await SessionModel.getById(id);

        if (!session) {
            throw new Error('Không tìm thấy buổi học');
        }

        if (session.trang_thai === 'huy') {
            throw new Error('Buổi học đã bị huỷ');
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = crypto
            .createHash('sha256')
            .update(rawToken)
            .digest('hex');

        const expireAt = new Date(Date.now() + 30 * 1000);

        const qr = await SessionModel.openAttendance(id, tokenHash, expireAt);

        return {
            buoi_hoc_id: id,
            qr_token: rawToken,
            qr_token_id: qr.qr_token_id,
            het_han: expireAt
        };
    }

    static async closeAttendance(id) {
        const session = await SessionModel.getById(id);

        if (!session) {
            throw new Error('Không tìm thấy buổi học');
        }

        await SessionModel.closeAttendance(id);

        // Sau khi đóng điểm danh, tự động quét cảnh báo chuyên cần
        await WarningService.autoGenerate({
            course_class_id: session.lop_mon_hoc_id,
            max_absent_percent: 20
        });

        return true;
    }

    static async changeRoom(id, phong_hoc_id) {
        const affected = await SessionModel.changeRoom(id, phong_hoc_id);

        if (!affected) {
            throw new Error('Không tìm thấy buổi học');
        }

        return await SessionModel.getById(id);
    }
}

module.exports = SessionService;