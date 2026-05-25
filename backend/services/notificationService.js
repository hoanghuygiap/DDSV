const NotificationModel = require('../models/notificationModel');

class NotificationService {
    static async getMyNotifications(userId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const offset = (page - 1) * limit;

        const data = await NotificationModel.getMyNotifications(userId, limit, offset);
        const total = await NotificationModel.countMyNotifications(userId);

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

    static async create(body, user) {
        const { title, content, target } = body;

        if (!title || !content || !target || !target.type) {
            throw new Error('Thiếu title, content hoặc target');
        }

        const validTypes = ['all', 'role', 'course_class', 'student_ids'];

        if (!validTypes.includes(target.type)) {
            throw new Error('Loại target không hợp lệ');
        }

        const notification = await NotificationModel.createNotification({
            tieu_de: title,
            noi_dung: content,
            nguoi_gui_id: user.id,
            lop_mon_hoc_id: target.course_class_id || null,
            loai: target.type === 'student_ids' ? 'ca_nhan' : target.type === 'course_class' ? 'lop' : 'he_thong'
        });

        let receiverIds = [];

        if (target.type === 'all') {
            receiverIds = await NotificationModel.getAllUserIds();
        }

        if (target.type === 'role') {
            if (!target.role) {
                throw new Error('Thiếu role');
            }

            receiverIds = await NotificationModel.getUserIdsByRole(target.role);
        }

        if (target.type === 'course_class') {
            if (!target.course_class_id) {
                throw new Error('Thiếu course_class_id');
            }

            // [SECURITY CHECK]: Nếu không phải admin thì phải là GV dạy lớp này!
            const db = require('../config/db');
            if (!user.vai_tro || !user.vai_tro.includes('admin')) {
                const [lop_mon] = await db.query('SELECT giang_vien_id FROM lop_mon_hoc WHERE id = ?', [target.course_class_id]);
                if (lop_mon.length === 0) throw new Error('Lớp môn học không tồn tại');

                const [gvRows] = await db.query('SELECT id FROM giang_vien WHERE tai_khoan_id = ?', [user.id]);
                if (gvRows.length === 0 || gvRows[0].id !== lop_mon[0].giang_vien_id) {
                    throw new Error('Bạn không có quyền gửi thông báo tới lớp này (Không phải giảng viên phụ trách)');
                }
            }

            receiverIds = await NotificationModel.getUserIdsByCourseClass(target.course_class_id);
        }

        if (target.type === 'student_ids') {
            if (!Array.isArray(target.student_ids) || target.student_ids.length === 0) {
                throw new Error('Thiếu student_ids');
            }

            receiverIds = await NotificationModel.getUserIdsByStudentIds(target.student_ids);
        }

        receiverIds = [...new Set(receiverIds)];

        if (receiverIds.length === 0) {
            throw new Error('Không tìm thấy người nhận thông báo');
        }

        await NotificationModel.addReceivers(notification.id, receiverIds);

        return {
            ...notification,
            total_receivers: receiverIds.length
        };
    }

    static async getDetail(notificationId, userId) {
        const notification = await NotificationModel.getDetail(notificationId, userId);

        if (!notification) {
            throw new Error('Không tìm thấy thông báo');
        }

        return notification;
    }

    static async markAsRead(notificationId, userId) {
        return await NotificationModel.markAsRead(notificationId, userId);
    }

    static async remove(notificationId, userId) {
        return await NotificationModel.removeForUser(notificationId, userId);
    }

    static async unreadCount(userId) {
        const total = await NotificationModel.unreadCount(userId);

        return { unread: total };
    }

    static async readAll(userId) {
        return await NotificationModel.readAll(userId);
    }
}

module.exports = NotificationService;