const CourseClassModel = require("../models/courseClassModel");
const SubjectModel = require("../models/subjectModel");
const LecturerModel = require("../models/lecturerModel");
const SemesterModel = require("../models/semesterModel");

class CourseClassService {
  static async getAll(limit, offset) {
    return await CourseClassModel.getAll(limit, offset);
  }

  static async countAll() {
    return await CourseClassModel.countAll();
  }

  static async getById(id) {
    const courseClass = await CourseClassModel.getById(id);

    if (!courseClass) {
      throw new Error("Lớp môn học không tồn tại");
    }

    return courseClass;
  }

  static async create(data) {
    const { ma_lop, hoc_phan_id, giang_vien_id, ky_hoc_id } = data;

    if (!ma_lop || ma_lop.trim() === "") {
      throw new Error("Mã lớp không được để trống");
    }

    if (!hoc_phan_id) {
      throw new Error("Học phần không được để trống");
    }

    if (!giang_vien_id) {
      throw new Error("Giảng viên không được để trống");
    }

    if (!ky_hoc_id) {
      throw new Error("Học kỳ không được để trống");
    }

    const subject = await SubjectModel.getSubjectById(hoc_phan_id);
    if (!subject) {
      throw new Error("Học phần không tồn tại");
    }

    const lecturer = await LecturerModel.getLecturerById(giang_vien_id);
    if (!lecturer) {
      throw new Error("Giảng viên không tồn tại");
    }

    const semester = await SemesterModel.getSemesterById(ky_hoc_id);
    if (!semester) {
      throw new Error("Học kỳ không tồn tại");
    }

    return await CourseClassModel.create({
      ma_lop: ma_lop.trim(),
      hoc_phan_id,
      giang_vien_id,
      ky_hoc_id,
    });
  }

  static async update(id, data) {
    const courseClass = await CourseClassModel.getById(id);

    if (!courseClass) {
      throw new Error("Lớp môn học không tồn tại");
    }

    const { ma_lop, hoc_phan_id, giang_vien_id, ky_hoc_id } = data;

    if (!ma_lop || ma_lop.trim() === "") {
      throw new Error("Mã lớp không được để trống");
    }

    if (!hoc_phan_id) {
      throw new Error("Học phần không được để trống");
    }

    if (!giang_vien_id) {
      throw new Error("Giảng viên không được để trống");
    }

    if (!ky_hoc_id) {
      throw new Error("Học kỳ không được để trống");
    }

    const subject = await SubjectModel.getSubjectById(hoc_phan_id);
    if (!subject) {
      throw new Error("Học phần không tồn tại");
    }

    const lecturer = await LecturerModel.getLecturerById(giang_vien_id);
    if (!lecturer) {
      throw new Error("Giảng viên không tồn tại");
    }

    const semester = await SemesterModel.getSemesterById(ky_hoc_id);
    if (!semester) {
      throw new Error("Học kỳ không tồn tại");
    }

    await CourseClassModel.update(id, {
      ma_lop: ma_lop.trim(),
      hoc_phan_id,
      giang_vien_id,
      ky_hoc_id,
    });

    return {
      id: Number(id),
      ma_lop: ma_lop.trim(),
      hoc_phan_id,
      giang_vien_id,
      ky_hoc_id,
    };
  }

  static async delete(id) {
    const courseClass = await CourseClassModel.getById(id);

    if (!courseClass) {
      throw new Error("Lớp môn học không tồn tại");
    }

    await CourseClassModel.delete(id);

    return true;
  }

  static async getStudents(classId, limit, offset) {
    const courseClass = await CourseClassModel.getById(classId);

    if (!courseClass) {
      throw new Error("Lớp môn học không tồn tại");
    }

    return await CourseClassModel.getStudents(classId, limit, offset);
  }

  static async countStudents(classId) {
    return await CourseClassModel.countStudents(classId);
  }

  static async registerStudent(classId, studentId, user) {
    const courseClass = await CourseClassModel.getById(classId);

    if (!courseClass) {
      throw new Error("Lớp môn học không tồn tại");
    }

    // [SECURITY CHECK] Kiểm tra quyền nếu là giáo viên
    if (user && user.vai_tro && !user.vai_tro.includes("admin")) {
      const db = require("../config/db");
      const [gvRows] = await db.query(
        "SELECT id FROM giang_vien WHERE tai_khoan_id = ?",
        [user.id],
      );
      if (gvRows.length === 0 || gvRows[0].id !== courseClass.giang_vien_id) {
        throw new Error(
          "Từ chối: Bạn không phải giảng viên phụ trách lớp này.",
        );
      }
    }

    const db = require("../config/db");
    const [svRows] = await db.query("SELECT id FROM sinh_vien WHERE id = ?", [
      studentId,
    ]);
    if (svRows.length === 0) {
      throw new Error("Sinh viên không tồn tại");
    }

    const registered = await CourseClassModel.checkRegistered(
      classId,
      studentId,
    );

    if (registered) {
      throw new Error(
        "Cảnh báo: Sinh viên này đã tồn tại trong danh sách lớp (Tránh đăng ký trùng).",
      );
    }

    await CourseClassModel.registerStudent(classId, studentId);

    return true;
  }

  static async unregisterStudent(classId, studentId, user) {
    const courseClass = await CourseClassModel.getById(classId);

    if (!courseClass) {
      throw new Error("Lớp môn học không tồn tại");
    }

    // [SECURITY CHECK] Kiểm tra quyền nếu là giáo viên
    if (user && user.vai_tro && !user.vai_tro.includes("admin")) {
      const db = require("../config/db");
      const [gvRows] = await db.query(
        "SELECT id FROM giang_vien WHERE tai_khoan_id = ?",
        [user.id],
      );
      if (gvRows.length === 0 || gvRows[0].id !== courseClass.giang_vien_id) {
        throw new Error(
          "Từ chối: Bạn không phải giảng viên phụ trách lớp này.",
        );
      }
    }

    const registered = await CourseClassModel.checkRegistered(
      classId,
      studentId,
    );

    if (!registered) {
      throw new Error("Sinh viên chưa đăng ký lớp này");
    }

    // [BUSINESS LOGIC] Kiểm tra dữ liệu điểm danh
    const db = require("../config/db");
    const [attCount] = await db.query(
      `SELECT count(id) as c FROM diem_danh WHERE sinh_vien_id = ? AND buoi_hoc_id IN (SELECT id FROM buoi_hoc WHERE lop_mon_hoc_id = ?)`,
      [studentId, classId],
    );
    if (attCount[0].c > 0) {
      throw new Error(
        "Thất bại: Sinh viên này đã tham gia điểm danh (" +
          attCount[0].c +
          " lần) trong lớp này. Không thể xoá hoàn toàn, chỉ có thể đánh rớt/cấm thi!",
      );
    }

    await CourseClassModel.unregisterStudent(classId, studentId);

    return true;
  }

  static async selfRegister(classId, accountId) {
    const student = await CourseClassModel.getStudentByAccountId(accountId);

    if (!student) {
      throw new Error("Tài khoản này không phải sinh viên");
    }

    return await this.registerStudent(classId, student.id);
  }

  static async selfUnregister(classId, accountId) {
    const student = await CourseClassModel.getStudentByAccountId(accountId);

    if (!student) {
      throw new Error("Tài khoản này không phải sinh viên");
    }

    return await this.unregisterStudent(classId, student.id);
  }

  // import excel file
  static async importStudents(classId, students) {
    const courseClass = await CourseClassModel.getById(classId);

    if (!courseClass) {
      throw new Error("Lớp môn học không tồn tại");
    }

    const result = {
      success: [],
      failed: [],
    };

    for (const item of students) {
      const ma_sinh_vien = String(item.ma_sinh_vien || "").trim();

      if (!ma_sinh_vien) {
        result.failed.push({
          ma_sinh_vien,
          reason: "Thiếu mã sinh viên",
        });
        continue;
      }

      const student = await CourseClassModel.getStudentByCode(ma_sinh_vien);

      if (!student) {
        result.failed.push({
          ma_sinh_vien,
          reason: "Sinh viên không tồn tại",
        });
        continue;
      }

      const registered = await CourseClassModel.checkRegistered(
        classId,
        student.id,
      );

      if (registered) {
        result.failed.push({
          ma_sinh_vien,
          reason: "Sinh viên đã đăng ký lớp này",
        });
        continue;
      }

      await CourseClassModel.registerStudent(classId, student.id);

      result.success.push({
        ma_sinh_vien,
        sinh_vien_id: student.id,
      });
    }

    return result;
  }
  static async getMyClasses(accountId) {
    const db = require("../config/db");

    const [gvRows] = await db.query(
      `
        SELECT id
        FROM giang_vien
        WHERE tai_khoan_id = ?
        `,
      [accountId],
    );

    if (gvRows.length === 0) {
      throw new Error("Không tìm thấy giảng viên");
    }

    return await CourseClassModel.getByLecturer(gvRows[0].id);
  }
}

module.exports = CourseClassService;
