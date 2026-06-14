

// const WarningModel = require('../models/warningModel');
// const NotificationModel = require('../models/notificationModel');

// class WarningService {
//     static async getAll(query) {
//         const page = Number(query.page) || 1;
//         const limit = Number(query.limit) || 10;
//         const offset = (page - 1) * limit;

//         const data = await WarningModel.getAll(limit, offset);
//         const total = await WarningModel.countAll();

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

//     static async create(body) {
//         const { student_id, course_class_id, type = 'manual', content } = body;

//         if (!student_id || !course_class_id || !content) {
//             throw new Error('Thiếu student_id, course_class_id hoặc content');
//         }

//         return await WarningModel.create({
//             sinh_vien_id: student_id,
//             lop_mon_hoc_id: course_class_id,
//             loai: type,
//             noi_dung: content
//         });
//     }

//     static async process(id, user) {
//         const existed = await WarningModel.findById(id);

//         if (!existed) {
//             throw new Error('Cảnh báo không tồn tại');
//         }

//         return await WarningModel.process(id, user.id);
//     }

//     static async remove(id) {
//         const existed = await WarningModel.findById(id);

//         if (!existed) {
//             throw new Error('Cảnh báo không tồn tại');
//         }

//         return await WarningModel.remove(id);
//     }

//     static async getByStudent(studentId) {
//         return await WarningModel.getByStudent(studentId);
//     }

//     static async getByCourseClass(courseClassId) {
//         return await WarningModel.getByCourseClass(courseClassId);
//     }

//     static async autoGenerate(body = {}) {
//         const course_class_id = Number(body.course_class_id);
//         const max_absent_percent = Number(body.max_absent_percent) || 20;

//         if (!course_class_id) {
//             throw new Error('Thiếu course_class_id');
//         }

//         const TOTAL_SESSIONS = 15;
//         const LATE_WEIGHT = 0.5;

//         const students = await WarningModel.getAttendanceSummary(course_class_id);

//         let created = 0;
//         const warnings = [];

//         for (const student of students) {
//             const vangCount = Number(student.vang || 0);
//             const treCount = Number(student.tre || 0);

//             const absentPoint = vangCount + treCount * LATE_WEIGHT;
//             const absentPercent = (absentPoint / TOTAL_SESSIONS) * 100;

//             if (absentPercent < max_absent_percent) {
//                 continue;
//             }

//             const existed = await WarningModel.findActiveWarning(
//                 student.sinh_vien_id,
//                 course_class_id
//             );

//             if (existed) {
//                 continue;
//             }

//             const content =
//                 `Môn ${student.ten_hoc_phan} - lớp ${student.ma_lop}: ` +
//                 `bạn đã vắng ${vangCount} buổi, trễ ${treCount} buổi, ` +
//                 `quy đổi thành ${absentPoint}/${TOTAL_SESSIONS} buổi ` +
//                 `(${absentPercent.toFixed(2)}%). ` +
//                 `Sinh viên có nguy cơ không đủ điều kiện dự thi nếu tiếp tục vắng học.`;

//             const warning = await WarningModel.create({
//                 sinh_vien_id: student.sinh_vien_id,
//                 lop_mon_hoc_id: course_class_id,
//                 loai: 'auto_absent',
//                 noi_dung: content
//             });

//             try {
//                 const notification = await NotificationModel.createNotification({
//                     tieu_de: 'Cảnh báo chuyên cần',
//                     noi_dung: content,
//                     nguoi_gui_id: null,
//                     lop_mon_hoc_id: course_class_id,
//                     loai: 'ca_nhan'
//                 });

//                 if (student.tai_khoan_id) {
//                     await NotificationModel.addReceivers(
//                         notification.id,
//                         [student.tai_khoan_id]
//                     );
//                 }
//             } catch (err) {
//                 console.error('Lỗi tạo thông báo cảnh báo:', err.message);
//             }

//             warnings.push(warning);
//             created++;
//         }

//         return {
//             scanned: students.length,
//             created,
//             warnings
//         };
//     }

//     static async autoGenerateAll() {
//         const courseClasses = await WarningModel.getAllCourseClassIds();

//         let totalScannedClasses = 0;
//         let totalCreatedWarnings = 0;
//         const results = [];

//         for (const courseClass of courseClasses) {
//             try {
//                 const result = await this.autoGenerate({
//                     course_class_id: courseClass.id,
//                     max_absent_percent: 20
//                 });

//                 totalScannedClasses++;
//                 totalCreatedWarnings += result.created;

//                 results.push({
//                     course_class_id: courseClass.id,
//                     ma_lop: courseClass.ma_lop,
//                     created: result.created,
//                     scanned_students: result.scanned
//                 });
//             } catch (err) {
//                 console.error(
//                     `Lỗi tạo cảnh báo lớp ${courseClass.id}:`,
//                     err.message
//                 );
//             }
//         }

//         return {
//             total_scanned_classes: totalScannedClasses,
//             total_created_warnings: totalCreatedWarnings,
//             results
//         };
//     }
// }

// module.exports = WarningService;

const WarningModel = require('../models/warningModel');
const NotificationModel = require('../models/notificationModel');

class WarningService {
    static async getAll(query) {
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        const offset = (page - 1) * limit;

        const data = await WarningModel.getAll(limit, offset);
        const total = await WarningModel.countAll();

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

    static async create(body) {
        const { student_id, course_class_id, type = 'manual', content } = body;

        if (!student_id || !course_class_id || !content) {
            throw new Error('Thiếu student_id, course_class_id hoặc content');
        }

        return await WarningModel.create({
            sinh_vien_id: student_id,
            lop_mon_hoc_id: course_class_id,
            loai: type,
            noi_dung: content
        });
    }

    static async process(id, user) {
        const existed = await WarningModel.findById(id);

        if (!existed) {
            throw new Error('Cảnh báo không tồn tại');
        }

        return await WarningModel.process(id, user.id);
    }

    static async remove(id) {
        const existed = await WarningModel.findById(id);

        if (!existed) {
            throw new Error('Cảnh báo không tồn tại');
        }

        return await WarningModel.remove(id);
    }

    static async getByStudent(studentId) {
        return await WarningModel.getByStudent(studentId);
    }

    static async getByCourseClass(courseClassId) {
        return await WarningModel.getByCourseClass(courseClassId);
    }

    static buildWarningContent(student, vangCount, treCount, absentPoint, absentPercent, totalSessions) {
        if (vangCount >= 4) {
            return {
                type: 'cam_thi',
                content:
                    `Môn ${student.ten_hoc_phan} - lớp ${student.ma_lop}: ` +
                    `bạn đã vắng ${vangCount} buổi, trễ ${treCount} buổi, ` +
                    `quy đổi thành ${absentPoint}/${totalSessions} buổi ` +
                    `(${absentPercent.toFixed(2)}%). ` +
                    `Sinh viên bị cấm thi do vượt quá số buổi nghỉ cho phép.`
            };
        }

        return {
            type: 'auto_absent',
            content:
                `Môn ${student.ten_hoc_phan} - lớp ${student.ma_lop}: ` +
                `bạn đã vắng ${vangCount} buổi, trễ ${treCount} buổi, ` +
                `quy đổi thành ${absentPoint}/${totalSessions} buổi ` +
                `(${absentPercent.toFixed(2)}%). ` +
                `Nếu nghỉ đến buổi thứ 4, sinh viên sẽ bị cấm thi.`
        };
    }

    static async sendWarningNotification(student, courseClassId, content) {
        try {
            if (!student.tai_khoan_id) return;

            const notification = await NotificationModel.createNotification({
                tieu_de: 'Cảnh báo chuyên cần',
                noi_dung: content,
                nguoi_gui_id: null,
                lop_mon_hoc_id: courseClassId,
                loai: 'ca_nhan'
            });

            await NotificationModel.addReceivers(
                notification.id,
                [student.tai_khoan_id]
            );
        } catch (err) {
            console.error('Lỗi tạo thông báo cảnh báo:', err.message);
        }
    }

    static async autoGenerate(body = {}) {
        const course_class_id = Number(body.course_class_id);
        const max_absent_percent = Number(body.max_absent_percent) || 20;

        if (!course_class_id) {
            throw new Error('Thiếu course_class_id');
        }

        const TOTAL_SESSIONS = 15;
        const LATE_WEIGHT = 0.5;

        const students = await WarningModel.getAttendanceSummary(course_class_id);

        let created = 0;
        let updated = 0;
        const warnings = [];

        for (const student of students) {
            const vangCount = Number(student.vang || 0);
            const treCount = Number(student.tre || 0);

            const absentPoint = vangCount + treCount * LATE_WEIGHT;
            const absentPercent = (absentPoint / TOTAL_SESSIONS) * 100;

            if (absentPercent < max_absent_percent) {
                continue;
            }

            const { type, content } = this.buildWarningContent(
                student,
                vangCount,
                treCount,
                absentPoint,
                absentPercent,
                TOTAL_SESSIONS
            );

            const existed = await WarningModel.findActiveWarning(
                student.sinh_vien_id,
                course_class_id
            );

            if (existed) {
                const warning = await WarningModel.updateActiveWarning(existed.id, {
                    loai: type,
                    noi_dung: content
                });

                warnings.push(warning);
                updated++;
                continue;
            }

            const warning = await WarningModel.create({
                sinh_vien_id: student.sinh_vien_id,
                lop_mon_hoc_id: course_class_id,
                loai: type,
                noi_dung: content
            });

            await this.sendWarningNotification(student, course_class_id, content);

            warnings.push(warning);
            created++;
        }

        return {
            scanned: students.length,
            created,
            updated,
            warnings
        };
    }

    static async autoGenerateAll() {
        const courseClasses = await WarningModel.getAllCourseClassIds();

        let totalScannedClasses = 0;
        let totalCreatedWarnings = 0;
        let totalUpdatedWarnings = 0;
        const results = [];

        for (const courseClass of courseClasses) {
            try {
                const result = await this.autoGenerate({
                    course_class_id: courseClass.id,
                    max_absent_percent: 20
                });

                totalScannedClasses++;
                totalCreatedWarnings += result.created;
                totalUpdatedWarnings += result.updated;

                results.push({
                    course_class_id: courseClass.id,
                    ma_lop: courseClass.ma_lop,
                    created: result.created,
                    updated: result.updated,
                    scanned_students: result.scanned
                });
            } catch (err) {
                console.error(
                    `Lỗi tạo cảnh báo lớp ${courseClass.id}:`,
                    err.message
                );
            }
        }

        return {
            total_scanned_classes: totalScannedClasses,
            total_created_warnings: totalCreatedWarnings,
            total_updated_warnings: totalUpdatedWarnings,
            results
        };
    }
}

module.exports = WarningService;