const WarningModel = require('../models/warningModel');

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
        const {
            student_id,
            course_class_id,
            type = 'manual',
            content
        } = body;

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

    // CẢNH BÁO TỰ ĐỘNG
    static async autoGenerate(body) {
        const {
            course_class_id,
            max_absent_sessions = 3,
            max_absent_percent = 20
        } = body;

        if (!course_class_id) {
            throw new Error('Thiếu course_class_id');
        }

        const students = await WarningModel.getAttendanceSummary(course_class_id);

        let created = 0;
        const warnings = [];

        for (const student of students) {
            const absentCount = Number(student.vang) + Number(student.tre);
            const absentPercent = Number(student.ti_le_vang);

            if (
                absentCount >= max_absent_sessions ||
                absentPercent >= max_absent_percent
            ) {
                const existed = await WarningModel.findActiveWarning(
                    student.sinh_vien_id,
                    course_class_id
                );

                if (!existed) {
                    const warning = await WarningModel.create({
                        sinh_vien_id: student.sinh_vien_id,
                        lop_mon_hoc_id: course_class_id,
                        loai: 'auto_absent',
                        noi_dung: `Sinh viên ${student.ho_ten} đã vắng/trễ ${absentCount}/${student.tong_buoi} buổi, tỷ lệ ${absentPercent}%`
                    });

                    warnings.push(warning);
                    created++;
                }
            }
        }

        return {
            scanned: students.length,
            created,
            warnings
        };
    }
}

module.exports = WarningService;