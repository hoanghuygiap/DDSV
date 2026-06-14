const db = require("../config/db");

class NotificationModel {
  // static async getMyNotifications(userId, limit, offset) {
  //   const [rows] = await db.query(
  //     `
  //           SELECT
  //               tb.id,
  //               tb.tieu_de AS title,
  //               tb.noi_dung AS content,
  //               tb.loai AS type,
  //               tb.gui_luc AS sent_at,
  //               tb.lop_mon_hoc_id AS course_class_id,
  //               tbnd.da_doc AS is_read
  //           FROM thong_bao_nguoi_dung tbnd
  //           JOIN thong_bao tb ON tbnd.thong_bao_id = tb.id
  //           WHERE tbnd.tai_khoan_id = ?
  //           ORDER BY tb.gui_luc DESC
  //           LIMIT ? OFFSET ?
  //           `,
  //     [userId, limit, offset],
  //   );

  //   return rows;
  // }
  static async getMyNotifications(userId, limit, offset) {
    const [rows] = await db.query(
        `
        SELECT
            tb.id,
            tb.tieu_de AS title,
            tb.noi_dung AS content,
            tb.loai AS type,
            tb.gui_luc AS sent_at,
            tb.lop_mon_hoc_id AS course_class_id,
            lmh.ma_lop,
            hp.ten_hoc_phan,
            CONCAT(lmh.ma_lop, ' - ', hp.ten_hoc_phan) AS class_name,
            tbnd.da_doc AS is_read
        FROM thong_bao_nguoi_dung tbnd
        JOIN thong_bao tb ON tbnd.thong_bao_id = tb.id
        LEFT JOIN lop_mon_hoc lmh ON tb.lop_mon_hoc_id = lmh.id
        LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
        WHERE tbnd.tai_khoan_id = ?
        ORDER BY tb.gui_luc DESC
        LIMIT ? OFFSET ?
        `,
        [userId, limit, offset]
    );

    return rows;
  }

  static async countMyNotifications(userId) {
    const [rows] = await db.query(
      `
            SELECT COUNT(*) AS total
            FROM thong_bao_nguoi_dung
            WHERE tai_khoan_id = ?
            `,
      [userId],
    );

    return rows[0].total;
  }

  static async createNotification(data) {
    const [result] = await db.query(
      `
            INSERT INTO thong_bao (
                tieu_de,
                noi_dung,
                nguoi_gui_id,
                lop_mon_hoc_id,
                loai
            )
            VALUES (?, ?, ?, ?, ?)
            `,
      [
        data.tieu_de,
        data.noi_dung,
        data.nguoi_gui_id,
        data.lop_mon_hoc_id,
        data.loai,
      ],
    );

    return {
      id: result.insertId,
      ...data,
    };
  }

  static async addReceivers(notificationId, userIds) {
    const values = userIds.map((userId) => [notificationId, userId, false]);

    const [result] = await db.query(
      `
            INSERT IGNORE INTO thong_bao_nguoi_dung (
                thong_bao_id,
                tai_khoan_id,
                da_doc
            )
            VALUES ?
            `,
      [values],
    );

    return result;
  }

  static async getAllUserIds() {
    const [rows] = await db.query(
      `
            SELECT id
            FROM tai_khoan
            WHERE kich_hoat = TRUE
            `,
    );

    return rows.map((row) => row.id);
  }

  static async getUserIdsByRole(role) {
    const [rows] = await db.query(
      `
            SELECT tk.id
            FROM tai_khoan tk
            JOIN tai_khoan_vai_tro tkvt ON tk.id = tkvt.tai_khoan_id
            JOIN vai_tro vt ON tkvt.vai_tro_id = vt.id
            WHERE vt.ten_vai_tro = ?
              AND tk.kich_hoat = TRUE
            `,
      [role],
    );

    return rows.map((row) => row.id);
  }

  static async getUserIdsByCourseClass(courseClassId) {
    const [rows] = await db.query(
      `
            SELECT sv.tai_khoan_id AS id
            FROM dang_ky_lop dk
            JOIN sinh_vien sv ON dk.sinh_vien_id = sv.id
            JOIN tai_khoan tk ON sv.tai_khoan_id = tk.id
            WHERE dk.lop_mon_hoc_id = ?
              AND tk.kich_hoat = TRUE
            `,
      [courseClassId],
    );

    return rows.map((row) => row.id);
  }

  static async getUserIdsByStudentIds(studentIds) {
    const [rows] = await db.query(
      `
            SELECT sv.tai_khoan_id AS id
            FROM sinh_vien sv
            JOIN tai_khoan tk ON sv.tai_khoan_id = tk.id
            WHERE sv.id IN (?)
              AND tk.kich_hoat = TRUE
            `,
      [studentIds],
    );

    return rows.map((row) => row.id);
  }

  static async getDetail(notificationId, userId) {
    const [rows] = await db.query(
      `
            SELECT
                tb.id,
                tb.tieu_de AS title,
                tb.noi_dung AS content,
                tb.loai AS type,
                tb.gui_luc AS sent_at,
                tb.lop_mon_hoc_id AS course_class_id,
                tbnd.da_doc AS is_read
            FROM thong_bao_nguoi_dung tbnd
            JOIN thong_bao tb ON tbnd.thong_bao_id = tb.id
            WHERE tb.id = ?
              AND tbnd.tai_khoan_id = ?
            `,
      [notificationId, userId],
    );

    return rows[0];
  }

  static async markAsRead(notificationId, userId) {
    const [result] = await db.query(
      `
            UPDATE thong_bao_nguoi_dung
            SET da_doc = TRUE
            WHERE thong_bao_id = ?
              AND tai_khoan_id = ?
            `,
      [notificationId, userId],
    );

    return result;
  }

  static async readAll(userId) {
    const [result] = await db.query(
      `
            UPDATE thong_bao_nguoi_dung
            SET da_doc = TRUE
            WHERE tai_khoan_id = ?
            `,
      [userId],
    );

    return result;
  }

  static async unreadCount(userId) {
    const [rows] = await db.query(
      `
            SELECT COUNT(*) AS total
            FROM thong_bao_nguoi_dung
            WHERE tai_khoan_id = ?
              AND da_doc = FALSE
            `,
      [userId],
    );

    return rows[0].total;
  }
  static async getSentNotifications(userId, limit, offset) {
    const [rows] = await db.query(
      `
        SELECT
            tb.id,
            tb.tieu_de AS title,
            tb.noi_dung AS content,
            tb.loai AS type,
            tb.gui_luc AS sent_at,
            tb.lop_mon_hoc_id AS course_class_id,
            lmh.ma_lop,
            hp.ten_hoc_phan,
            COUNT(tbnd.tai_khoan_id) AS total_receivers
        FROM thong_bao tb
        LEFT JOIN thong_bao_nguoi_dung tbnd
            ON tbnd.thong_bao_id = tb.id
        LEFT JOIN lop_mon_hoc lmh
            ON tb.lop_mon_hoc_id = lmh.id
        LEFT JOIN hoc_phan hp
            ON lmh.hoc_phan_id = hp.id
        WHERE tb.nguoi_gui_id = ?
        GROUP BY tb.id
        ORDER BY tb.gui_luc DESC
        LIMIT ? OFFSET ?
        `,
      [userId, limit, offset],
    );

    return rows;
  }

  static async countSentNotifications(userId) {
    const [rows] = await db.query(
      `
        SELECT COUNT(*) AS total
        FROM thong_bao
        WHERE nguoi_gui_id = ?
        `,
      [userId],
    );

    return rows[0].total;
  }
  static async removeForUser(notificationId, userId) {
    const [result] = await db.query(
      `
            DELETE FROM thong_bao_nguoi_dung
            WHERE thong_bao_id = ?
              AND tai_khoan_id = ?
            `,
      [notificationId, userId],
    );

    return result;
  }
}

module.exports = NotificationModel;
