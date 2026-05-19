const ExcelJS = require('exceljs');
const AttendanceModel = require('../models/attendanceModel');

class AttendanceService {
    static async checkin(body, req) {
        const {
            qr_token,
            session_id,
            student_id,
            latitude,
            longitude,
            accuracy_meters,
            wifi_bssid,
            wifi_ssid
        } = body;

        if (!qr_token || !session_id || !student_id) {
            throw new Error('Thiếu qr_token, session_id hoặc student_id');
        }

        const session = await AttendanceModel.getSessionForCheckin(session_id);

        if (!session) {
            throw new Error('Buổi học không tồn tại');
        }

        if (!session.diem_danh_mo) {
            throw new Error('Buổi học chưa mở điểm danh');
        }

        const qr = await AttendanceModel.getActiveQr(session_id, qr_token);

        if (!qr) {
            await AttendanceModel.saveQrLog({
                qr_token_id: null,
                sinh_vien_id: student_id,
                thanh_cong: false,
                ly_do_fail: 'QR không hợp lệ hoặc hết hạn',
                ip: req.ip,
                thiet_bi_id: req.headers['device-id'] || null
            });

            throw new Error('QR không hợp lệ hoặc đã hết hạn');
        }

        const existed = await AttendanceModel.checkExisted(session_id, student_id);

        if (existed) {
            throw new Error('Sinh viên đã điểm danh buổi học này');
        }

        const inClass = await AttendanceModel.checkStudentInClass(
            student_id,
            session.lop_mon_hoc_id
        );

        if (!inClass) {
            throw new Error('Sinh viên không thuộc lớp môn học này');
        }

        let hopLeGps = true;
        let hopLeWifi = true;

        if (session.require_gps) {
            if (!latitude || !longitude) {
                throw new Error('Thiếu thông tin GPS');
            }

            hopLeGps = this.checkGpsDistance(
                Number(latitude),
                Number(longitude),
                Number(session.latitude),
                Number(session.longitude),
                Number(session.ban_kinh_gps_m || 50)
            );
        }

        // Có validate WiFi để sau này mở rộng
        // Nhưng require_wifi = false thì đoạn này KHÔNG chạy
        if (session.require_wifi) {
            if (!wifi_bssid) {
                throw new Error('Thiếu WiFi BSSID');
            }

            const validWifiList = await AttendanceModel.getValidWifiByRoom(
                session.phong_hoc_id
            );

            hopLeWifi = validWifiList.some(
                item => item.bssid.toLowerCase() === wifi_bssid.toLowerCase()
            );
        }

        const hopLe =
            (!session.require_gps || hopLeGps) &&
            (!session.require_wifi || hopLeWifi);

        if (!hopLe) {
            await AttendanceModel.saveQrLog({
                qr_token_id: qr.id,
                sinh_vien_id: student_id,
                thanh_cong: false,
                ly_do_fail: 'Sai GPS hoặc WiFi',
                ip: req.ip,
                thiet_bi_id: req.headers['device-id'] || null
            });

            throw new Error('Điểm danh không hợp lệ do sai GPS hoặc WiFi');
        }

        const attendance = await AttendanceModel.create({
            buoi_hoc_id: session_id,
            sinh_vien_id: student_id,
            trang_thai: 'co_mat',
            latitude,
            longitude,
            hop_le_gps: session.require_gps ? hopLeGps : null,
            wifi_bssid: session.require_wifi ? wifi_bssid : null,
            hop_le_wifi: session.require_wifi ? hopLeWifi : null,
            hop_le: hopLe,
            thiet_bi_id: req.headers['device-id'] || null,
            ip: req.ip
        });

        await AttendanceModel.saveQrLog({
            qr_token_id: qr.id,
            sinh_vien_id: student_id,
            thanh_cong: true,
            ly_do_fail: null,
            ip: req.ip,
            thiet_bi_id: req.headers['device-id'] || null
        });

        return {
            ...attendance,
            wifi_ssid: session.require_wifi ? wifi_ssid : null,
            method: 'qr'
        };
    }

    static checkGpsDistance(lat1, lon1, lat2, lon2, radius) {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) *
            Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;

        return distance <= radius;
    }

    static async getBySession(sessionId) {
        return await AttendanceModel.getBySession(sessionId);
    }

    static async getByStudent(studentId, query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const offset = (page - 1) * limit;

        const data = await AttendanceModel.getByStudent(studentId, limit, offset);
        const total = await AttendanceModel.countByStudent(studentId);

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

    static async update(id, body, user) {
        const { trang_thai, ghi_chu } = body;

        if (!trang_thai) {
            throw new Error('Thiếu trạng thái điểm danh');
        }

        const validStatus = ['co_mat', 'vang', 'tre', 'co_phep'];

        if (!validStatus.includes(trang_thai)) {
            throw new Error('Trạng thái điểm danh không hợp lệ');
        }

        const existed = await AttendanceModel.getById(id);

        if (!existed) {
            throw new Error('Bản ghi điểm danh không tồn tại');
        }

        await AttendanceModel.update(id, {
            trang_thai,
            ghi_chu,
            chinh_sua_boi: user.id
        });

        return await AttendanceModel.getById(id);
    }

    static async remove(id) {
        const existed = await AttendanceModel.getById(id);

        if (!existed) {
            throw new Error('Bản ghi điểm danh không tồn tại');
        }

        return await AttendanceModel.remove(id);
    }

    static async manual(body, user) {
        const {
            session_id,
            student_id,
            trang_thai = 'co_mat',
            ghi_chu
        } = body;

        if (!session_id || !student_id) {
            throw new Error('Thiếu session_id hoặc student_id');
        }

        const session = await AttendanceModel.getSessionForCheckin(session_id);

        if (!session) {
            throw new Error('Buổi học không tồn tại');
        }

        const inClass = await AttendanceModel.checkStudentInClass(
            student_id,
            session.lop_mon_hoc_id
        );

        if (!inClass) {
            throw new Error('Sinh viên không thuộc lớp môn học này');
        }

        const existed = await AttendanceModel.checkExisted(session_id, student_id);

        if (existed) {
            throw new Error('Sinh viên đã có bản ghi điểm danh');
        }

        return await AttendanceModel.createManual({
            buoi_hoc_id: session_id,
            sinh_vien_id: student_id,
            trang_thai,
            hop_le: true,
            ghi_chu,
            chinh_sua_boi: user.id
        });
    }

    static async autoAbsent(body) {
        const { session_id } = body;

        if (!session_id) {
            throw new Error('Thiếu session_id');
        }

        const session = await AttendanceModel.getSessionForCheckin(session_id);

        if (!session) {
            throw new Error('Buổi học không tồn tại');
        }

        const result = await AttendanceModel.autoAbsent(
            session_id,
            session.lop_mon_hoc_id
        );

        return {
            affectedRows: result.affectedRows
        };
    }

    static async statistics(query) {
        return await AttendanceModel.statistics(query);
    }

    static async exportExcel(query) {
        const rows = await AttendanceModel.exportExcel(query);

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Bao cao diem danh');

        sheet.columns = [
            { header: 'Mã sinh viên', key: 'ma_sinh_vien', width: 20 },
            { header: 'Tên sinh viên', key: 'ten_sinh_vien', width: 30 },
            { header: 'Lớp hành chính', key: 'lop_hanh_chinh', width: 20 },
            { header: 'Mã lớp', key: 'ma_lop', width: 20 },
            { header: 'Mã học phần', key: 'ma_hoc_phan', width: 20 },
            { header: 'Tên học phần', key: 'ten_hoc_phan', width: 30 },
            { header: 'Kỳ học', key: 'ky_hoc', width: 20 },
            { header: 'Ngày học', key: 'ngay_hoc', width: 20 },
            { header: 'Giờ bắt đầu', key: 'gio_bat_dau', width: 15 },
            { header: 'Giờ kết thúc', key: 'gio_ket_thuc', width: 15 },
            { header: 'Phòng học', key: 'phong_hoc', width: 15 },
            { header: 'Trạng thái', key: 'trang_thai', width: 15 },
            { header: 'Thời gian điểm danh', key: 'thoi_gian_diem_danh', width: 25 },
            { header: 'Hợp lệ GPS', key: 'hop_le_gps', width: 15 },
            { header: 'Hợp lệ WiFi', key: 'hop_le_wifi', width: 15 },
            { header: 'Hợp lệ', key: 'hop_le', width: 15 },
            { header: 'Ghi chú', key: 'ghi_chu', width: 30 },
            { header: 'Giảng viên', key: 'ten_giang_vien', width: 30 }
        ];

        rows.forEach(row => {
            sheet.addRow(row);
        });

        sheet.getRow(1).font = { bold: true };

        return await workbook.xlsx.writeBuffer();
    }

    static async realtime(sessionId) {
        return await AttendanceModel.realtime(sessionId);
    }
}

module.exports = AttendanceService;