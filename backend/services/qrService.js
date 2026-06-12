// const crypto = require('crypto');
// const QRCode = require('qrcode');
// const QrModel = require('../models/qrModel');

// function hashToken(token) {
//     return crypto.createHash('sha256').update(token).digest('hex');
// }

// function calcDistanceMeters(lat1, lon1, lat2, lon2) {
//     const R = 6371000;
//     const toRad = deg => deg * Math.PI / 180;

//     const dLat = toRad(lat2 - lat1);
//     const dLon = toRad(lon2 - lon1);

//     const a =
//         Math.sin(dLat / 2) ** 2 +
//         Math.cos(toRad(lat1)) *
//         Math.cos(toRad(lat2)) *
//         Math.sin(dLon / 2) ** 2;

//     return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// class QrService {
//     static async generateQr(body) {
//         const {
//             session_id,
//             expires_in_seconds = 10
//         } = body;

//         if (!session_id) {
//             throw new Error('Thiếu session_id');
//         }

//         const session = await QrModel.getSessionById(session_id);

//         if (!session) {
//             throw new Error('Buổi học không tồn tại');
//         }

//         if (!session.diem_danh_mo) {
//             throw new Error('Buổi học chưa mở điểm danh');
//         }

//         await QrModel.deactivateOldQr(session_id);

//         const rawToken = crypto.randomBytes(32).toString('hex');
//         const tokenHash = hashToken(rawToken);

//         const expiresAt = new Date(Date.now() + expires_in_seconds * 1000);

//         const lastLanTao = await QrModel.getLastLanTao(session_id);
//         const lanTao = lastLanTao + 1;

//         await QrModel.createQr(session_id, tokenHash, expiresAt, lanTao);

//         const qrPayload = {
//             token: rawToken,
//             session_id
//         };

//         const qrImage = await QRCode.toDataURL(JSON.stringify(qrPayload));

//         return {
//             session_id,
//             token: rawToken,
//             qr_image: qrImage,
//             expires_at: expiresAt,
//             lan_tao: lanTao
//         };
//     }

//     static async getCurrentQr(sessionId) {
//         const qr = await QrModel.getCurrentQr(sessionId);

//         if (!qr) {
//             throw new Error('Không có QR đang hoạt động');
//         }

//         return qr;
//     }

//     static async refreshQr(body) {
//         return this.generateQr(body);
//     }

//     static async scanQr(body, reqUser, req) {
//         const {
//             token,
//             session_id,
//             latitude,
//             longitude,
//             wifi_bssid
//         } = body;
//         const deviceId = (req.headers['user-agent'] || '').slice(0, 100);

//         if (!token || !session_id) {
//             throw new Error('Thiếu token hoặc session_id');
//         }

//         const tokenHash = hashToken(token);
//         const qr = await QrModel.findQrByTokenHash(tokenHash, session_id);

//         if (!qr) {
//             throw new Error('QR không hợp lệ hoặc đã hết hạn');
//         }

//         const student = await QrModel.getStudentByAccountId(reqUser.id);

//         if (!student) {
//             await QrModel.logScan({
//                 qrTokenId: qr.id,
//                 thanhCong: false,
//                 lyDoFail: 'NOT_STUDENT',
//                 ip: req.ip,
//                 deviceId
//             });

//             throw new Error('Tài khoản không phải sinh viên');
//         }

//         const session = await QrModel.getSessionById(session_id);

//         if (!session || !session.diem_danh_mo) {
//             throw new Error('Buổi học chưa mở điểm danh');
//         }

//         const inClass = await QrModel.checkStudentInClass(student.id, session_id);

//         if (!inClass) {
//             await QrModel.logScan({
//                 qrTokenId: qr.id,
//                 studentId: student.id,
//                 thanhCong: false,
//                 lyDoFail: 'NOT_IN_CLASS',
//                 ip: req.ip,
//                 deviceId
//             });

//             throw new Error('Sinh viên không thuộc lớp môn học này');
//         }

//         let hopLeGps = true;
//         let hopLeWifi = true;

//         if (session.require_gps) {
//             if (!latitude || !longitude || !session.latitude || !session.longitude) {
//                 hopLeGps = false;
//             } else {
//                 const distance = calcDistanceMeters(
//                     Number(latitude),
//                     Number(longitude),
//                     Number(session.latitude),
//                     Number(session.longitude)
//                 );

//                 hopLeGps = distance <= Number(session.ban_kinh_gps_m || 50);
//             }
//         }

//         if (session.require_wifi) {
//             if (!wifi_bssid || !session.phong_hoc_id) {
//                 hopLeWifi = false;
//             } else {
//                 const wifi = await QrModel.checkWifi(session.phong_hoc_id, wifi_bssid);
//                 hopLeWifi = !!wifi;
//             }
//         }

//         const hopLe = hopLeGps && hopLeWifi;

//         const attendanceId = await QrModel.createAttendance({
//             sessionId: session_id,
//             studentId: student.id,
//             trangThai: hopLe ? 'co_mat' : 'tre',
//             latitude,
//             longitude,
//             hopLeGps,
//             wifiBssid: wifi_bssid,
//             hopLeWifi,
//             hopLe,
//             deviceId,
//             ip: req.ip
//         });

//         await QrModel.logScan({
//             qrTokenId: qr.id,
//             studentId: student.id,
//             thanhCong: true,
//             ip: req.ip,
//             deviceId
//         });

//         return {
//             attendance_id: attendanceId,
//             sinh_vien_id: student.id,
//             hop_le_gps: hopLeGps,
//             hop_le_wifi: hopLeWifi,
//             hop_le: hopLe,
//             trang_thai: hopLe ? 'co_mat' : 'tre'
//         };
//     }

//     static async scanQrPublic(body, req) {
//         const { token, session_id, ma_sinh_vien, latitude, longitude, wifi_bssid } = body;
//         const deviceId = (req.headers['user-agent'] || '').slice(0, 100);

//         if (!token || !session_id || !ma_sinh_vien) {
//             throw new Error('Thiếu token, session_id hoặc mã sinh viên');
//         }

//         const tokenHash = hashToken(token);
//         const qr = await QrModel.findQrByTokenHash(tokenHash, session_id);

//         if (!qr) {
//             throw new Error('QR không hợp lệ hoặc đã hết hạn');
//         }

//         const student = await QrModel.getStudentByMaSinhVien(ma_sinh_vien);

//         if (!student) {
//             await QrModel.logScan({
//                 qrTokenId: qr.id,
//                 thanhCong: false,
//                 lyDoFail: 'NOT_FOUND',
//                 ip: req.ip,
//                 deviceId
//             });
//             throw new Error('Mã sinh viên không tồn tại');
//         }

//         const session = await QrModel.getSessionById(session_id);

//         if (!session || !session.diem_danh_mo) {
//             throw new Error('Buổi học chưa mở điểm danh');
//         }

//         const inClass = await QrModel.checkStudentInClass(student.id, session_id);

//         if (!inClass) {
//             await QrModel.logScan({
//                 qrTokenId: qr.id,
//                 studentId: student.id,
//                 thanhCong: false,
//                 lyDoFail: 'NOT_IN_CLASS',
//                 ip: req.ip,
//                 deviceId
//             });
//             throw new Error('Sinh viên không thuộc lớp môn học này');
//         }

//         let hopLeGps = true;
//         let hopLeWifi = true;

//         if (session.require_gps) {
//             if (!latitude || !longitude || !session.latitude || !session.longitude) {
//                 hopLeGps = false;
//             } else {
//                 const distance = calcDistanceMeters(
//                     Number(latitude), Number(longitude),
//                     Number(session.latitude), Number(session.longitude)
//                 );
//                 hopLeGps = distance <= Number(session.ban_kinh_gps_m || 50);
//             }
//         }

//         if (session.require_wifi) {
//             if (!wifi_bssid || !session.phong_hoc_id) {
//                 hopLeWifi = false;
//             } else {
//                 const wifi = await QrModel.checkWifi(session.phong_hoc_id, wifi_bssid);
//                 hopLeWifi = !!wifi;
//             }
//         }

//         const hopLe = hopLeGps && hopLeWifi;

//         const attendanceId = await QrModel.createAttendance({
//             sessionId: session_id,
//             studentId: student.id,
//             trangThai: hopLe ? 'co_mat' : 'tre',
//             latitude,
//             longitude,
//             hopLeGps,
//             wifiBssid: wifi_bssid,
//             hopLeWifi,
//             hopLe,
//             deviceId,
//             ip: req.ip
//         });

//         await QrModel.logScan({
//             qrTokenId: qr.id,
//             studentId: student.id,
//             thanhCong: true,
//             ip: req.ip,
//             deviceId
//         });

//         return {
//             attendance_id: attendanceId,
//             sinh_vien_id: student.id,
//             hop_le_gps: hopLeGps,
//             hop_le_wifi: hopLeWifi,
//             hop_le: hopLe,
//             trang_thai: hopLe ? 'co_mat' : 'tre'
//         };
//     }

//     static async getHistory(sessionId) {
//         return await QrModel.getQrHistory(sessionId);
//     }
// }

// module.exports = QrService;

const crypto = require('crypto');
const QRCode = require('qrcode');
const QrModel = require('../models/qrModel');

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

function calcAttendanceStatus(session) {
    const now = new Date();

    const ngayHoc = new Date(session.ngay_hoc);
    const yyyy = ngayHoc.getFullYear();
    const mm = String(ngayHoc.getMonth() + 1).padStart(2, '0');
    const dd = String(ngayHoc.getDate()).padStart(2, '0');

    const startTime = new Date(`${yyyy}-${mm}-${dd}T${session.gio_bat_dau}`);

    const lateAfterMinutes = 10;
    const lateTime = new Date(startTime.getTime() + lateAfterMinutes * 60 * 1000);

    return now <= lateTime ? 'co_mat' : 'tre';
}

class QrService {
    static async generateQr(body) {
        const {
            session_id,
            expires_in_seconds = 10
        } = body;

        if (!session_id) {
            throw new Error('Thiếu session_id');
        }

        const session = await QrModel.getSessionById(session_id);

        if (!session) {
            throw new Error('Buổi học không tồn tại');
        }

        if (!session.diem_danh_mo) {
            throw new Error('Buổi học chưa mở điểm danh');
        }

        await QrModel.deactivateOldQr(session_id);

        const rawToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = hashToken(rawToken);

        const expiresAt = new Date(Date.now() + expires_in_seconds * 1000);

        const lastLanTao = await QrModel.getLastLanTao(session_id);
        const lanTao = lastLanTao + 1;

        await QrModel.createQr(session_id, tokenHash, expiresAt, lanTao);

        const qrPayload = {
            token: rawToken,
            session_id
        };

        const qrImage = await QRCode.toDataURL(JSON.stringify(qrPayload));

        return {
            session_id,
            token: rawToken,
            qr_image: qrImage,
            expires_at: expiresAt,
            lan_tao: lanTao
        };
    }

    static async getCurrentQr(sessionId) {
        const qr = await QrModel.getCurrentQr(sessionId);

        if (!qr) {
            throw new Error('Không có QR đang hoạt động');
        }

        return qr;
    }

    static async refreshQr(body) {
        return this.generateQr(body);
    }

    static async scanQr(body, reqUser, req) {
        const {
            token,
            session_id,
            latitude,
            longitude,
            wifi_bssid
        } = body;

        const deviceId = (req.headers['user-agent'] || '').slice(0, 100);

        if (!token || !session_id) {
            throw new Error('Thiếu token hoặc session_id');
        }

        const tokenHash = hashToken(token);
        const qr = await QrModel.findQrByTokenHash(tokenHash, session_id);

        if (!qr) {
            throw new Error('QR không hợp lệ hoặc đã hết hạn');
        }

        const student = await QrModel.getStudentByAccountId(reqUser.id);

        if (!student) {
            await QrModel.logScan({
                qrTokenId: qr.id,
                thanhCong: false,
                lyDoFail: 'NOT_STUDENT',
                ip: req.ip,
                deviceId
            });

            throw new Error('Tài khoản không phải sinh viên');
        }

        const session = await QrModel.getSessionById(session_id);

        if (!session || !session.diem_danh_mo) {
            throw new Error('Buổi học chưa mở điểm danh');
        }

        const inClass = await QrModel.checkStudentInClass(student.id, session_id);

        if (!inClass) {
            await QrModel.logScan({
                qrTokenId: qr.id,
                studentId: student.id,
                thanhCong: false,
                lyDoFail: 'NOT_IN_CLASS',
                ip: req.ip,
                deviceId
            });

            throw new Error('Sinh viên không thuộc lớp môn học này');
        }

        // Bỏ qua GPS
        const hopLeGps = true;

        let hopLeWifi = true;

        if (session.require_wifi) {
            if (!wifi_bssid || !session.phong_hoc_id) {
                hopLeWifi = false;
            } else {
                const wifi = await QrModel.checkWifi(session.phong_hoc_id, wifi_bssid);
                hopLeWifi = !!wifi;
            }
        }

        // Chỉ xét WiFi, không xét GPS
        const hopLe = hopLeWifi;

        const trangThai = hopLe
            ? calcAttendanceStatus(session)
            : 'tre';

        const attendanceId = await QrModel.createAttendance({
            sessionId: session_id,
            studentId: student.id,
            trangThai,
            latitude,
            longitude,
            hopLeGps,
            wifiBssid: wifi_bssid,
            hopLeWifi,
            hopLe,
            deviceId,
            ip: req.ip
        });

        await QrModel.logScan({
            qrTokenId: qr.id,
            studentId: student.id,
            thanhCong: true,
            ip: req.ip,
            deviceId
        });

        return {
            attendance_id: attendanceId,
            sinh_vien_id: student.id,
            hop_le_gps: hopLeGps,
            hop_le_wifi: hopLeWifi,
            hop_le: hopLe,
            trang_thai: trangThai
        };
    }

    static async scanQrPublic(body, req) {
        const {
            token,
            session_id,
            ma_sinh_vien,
            latitude,
            longitude,
            wifi_bssid
        } = body;

        const deviceId = (req.headers['user-agent'] || '').slice(0, 100);

        if (!token || !session_id || !ma_sinh_vien) {
            throw new Error('Thiếu token, session_id hoặc mã sinh viên');
        }

        const tokenHash = hashToken(token);
        const qr = await QrModel.findQrByTokenHash(tokenHash, session_id);

        if (!qr) {
            throw new Error('QR không hợp lệ hoặc đã hết hạn');
        }

        const student = await QrModel.getStudentByMaSinhVien(ma_sinh_vien);

        if (!student) {
            await QrModel.logScan({
                qrTokenId: qr.id,
                thanhCong: false,
                lyDoFail: 'NOT_FOUND',
                ip: req.ip,
                deviceId
            });

            throw new Error('Mã sinh viên không tồn tại');
        }

        const session = await QrModel.getSessionById(session_id);

        if (!session || !session.diem_danh_mo) {
            throw new Error('Buổi học chưa mở điểm danh');
        }

        const inClass = await QrModel.checkStudentInClass(student.id, session_id);

        if (!inClass) {
            await QrModel.logScan({
                qrTokenId: qr.id,
                studentId: student.id,
                thanhCong: false,
                lyDoFail: 'NOT_IN_CLASS',
                ip: req.ip,
                deviceId
            });

            throw new Error('Sinh viên không thuộc lớp môn học này');
        }

        // Bỏ qua GPS
        const hopLeGps = true;

        let hopLeWifi = true;

        if (session.require_wifi) {
            if (!wifi_bssid || !session.phong_hoc_id) {
                hopLeWifi = false;
            } else {
                const wifi = await QrModel.checkWifi(session.phong_hoc_id, wifi_bssid);
                hopLeWifi = !!wifi;
            }
        }

        // Chỉ xét WiFi, không xét GPS
        const hopLe = hopLeWifi;

        const trangThai = hopLe
            ? calcAttendanceStatus(session)
            : 'tre';

        const attendanceId = await QrModel.createAttendance({
            sessionId: session_id,
            studentId: student.id,
            trangThai,
            latitude,
            longitude,
            hopLeGps,
            wifiBssid: wifi_bssid,
            hopLeWifi,
            hopLe,
            deviceId,
            ip: req.ip
        });

        await QrModel.logScan({
            qrTokenId: qr.id,
            studentId: student.id,
            thanhCong: true,
            ip: req.ip,
            deviceId
        });

        return {
            attendance_id: attendanceId,
            sinh_vien_id: student.id,
            hop_le_gps: hopLeGps,
            hop_le_wifi: hopLeWifi,
            hop_le: hopLe,
            trang_thai: trangThai
        };
    }

    static async getHistory(sessionId) {
        return await QrModel.getQrHistory(sessionId);
    }
}

module.exports = QrService;