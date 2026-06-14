const db = require('../config/db');

class DashboardModel {
    async findLecturerByAccountId(taiKhoanId) {
        const [rows] = await db.query(`
            SELECT id
            FROM giang_vien
            WHERE tai_khoan_id = ?
              AND deleted_at IS NULL
            LIMIT 1
        `, [taiKhoanId]);

        return rows[0];
    }

    async findStudentByAccountId(taiKhoanId) {
        const [rows] = await db.query(`
            SELECT id
            FROM sinh_vien
            WHERE tai_khoan_id = ?
              AND deleted_at IS NULL
            LIMIT 1
        `, [taiKhoanId]);

        return rows[0];
    }

    async getAdminDashboard() {
        const [[students]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM sinh_vien
            WHERE deleted_at IS NULL
        `);

        const [[lecturers]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM giang_vien
            WHERE deleted_at IS NULL
        `);

        const [[courseClasses]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM lop_mon_hoc
            WHERE deleted_at IS NULL
        `);

        const [[attendanceRate]] = await db.query(`
            SELECT 
                ROUND(
                    IFNULL(
                        SUM(CASE WHEN trang_thai IN ('co_mat', 'tre') THEN 1 ELSE 0 END)
                        / NULLIF(COUNT(*), 0) * 100,
                        0
                    ),
                    2
                ) AS rate
            FROM diem_danh
        `);

        const [[warnings]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM canh_bao
            WHERE da_xu_ly = 0
        `);

        const [topAbsentClasses] = await db.query(`
            SELECT 
                lmh.id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                COUNT(CASE WHEN dd.trang_thai = 'vang' THEN 1 END) AS so_buoi_vang,
                COUNT(dd.id) AS tong_diem_danh,
                ROUND(
                    IFNULL(
                        COUNT(CASE WHEN dd.trang_thai = 'vang' THEN 1 END)
                        / NULLIF(COUNT(dd.id), 0) * 100,
                        0
                    ),
                    2
                ) AS ty_le_vang
            FROM lop_mon_hoc lmh
            JOIN hoc_phan hp ON hp.id = lmh.hoc_phan_id
            LEFT JOIN buoi_hoc bh ON bh.lop_mon_hoc_id = lmh.id
            LEFT JOIN diem_danh dd ON dd.buoi_hoc_id = bh.id
            WHERE lmh.deleted_at IS NULL
            GROUP BY lmh.id, lmh.ma_lop, hp.ten_hoc_phan
            ORDER BY ty_le_vang DESC
            LIMIT 5
        `);

        const [latestWarnings] = await db.query(`
            SELECT 
                cb.id,
                cb.loai,
                cb.noi_dung,
                cb.tao_luc,
                sv.ma_sinh_vien,
                tk.ho_ten,
                lmh.ma_lop
            FROM canh_bao cb
            JOIN sinh_vien sv ON sv.id = cb.sinh_vien_id
            JOIN tai_khoan tk ON tk.id = sv.tai_khoan_id
            JOIN lop_mon_hoc lmh ON lmh.id = cb.lop_mon_hoc_id
            WHERE cb.da_xu_ly = 0
            ORDER BY cb.tao_luc DESC
            LIMIT 5
        `);

        return {
            total_students: students.total,
            total_lecturers: lecturers.total,
            total_course_classes: courseClasses.total,
            attendance_rate: attendanceRate.rate,
            pending_warnings: warnings.total,
            top_absent_classes: topAbsentClasses,
            latest_warnings: latestWarnings
        };
    }

    async getLecturerDashboard(giangVienId) {
        const [[totalClasses]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM lop_mon_hoc
            WHERE giang_vien_id = ?
              AND deleted_at IS NULL
        `, [giangVienId]);

        const [todaySessions] = await db.query(`
            SELECT 
                bh.id,
                bh.ngay_hoc,
                bh.gio_bat_dau,
                bh.gio_ket_thuc,
                bh.trang_thai,
                bh.diem_danh_mo,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                ph.ten_phong
            FROM buoi_hoc bh
            JOIN lop_mon_hoc lmh ON lmh.id = bh.lop_mon_hoc_id
            JOIN hoc_phan hp ON hp.id = lmh.hoc_phan_id
            LEFT JOIN phong_hoc ph ON ph.id = bh.phong_hoc_id
            WHERE lmh.giang_vien_id = ?
              AND bh.ngay_hoc = CURDATE()
            ORDER BY bh.gio_bat_dau ASC
        `, [giangVienId]);

        const [[attendanceRate]] = await db.query(`
            SELECT 
                ROUND(
                    IFNULL(
                        SUM(CASE WHEN dd.trang_thai IN ('co_mat', 'tre') THEN 1 ELSE 0 END)
                        / NULLIF(COUNT(dd.id), 0) * 100,
                        0
                    ),
                    2
                ) AS rate
            FROM diem_danh dd
            JOIN buoi_hoc bh ON bh.id = dd.buoi_hoc_id
            JOIN lop_mon_hoc lmh ON lmh.id = bh.lop_mon_hoc_id
            WHERE lmh.giang_vien_id = ?
        `, [giangVienId]);

        const [[pendingWarnings]] = await db.query(`
            SELECT COUNT(*) AS total
            FROM canh_bao cb
            JOIN lop_mon_hoc lmh ON lmh.id = cb.lop_mon_hoc_id
            WHERE lmh.giang_vien_id = ?
              AND cb.da_xu_ly = 0
        `, [giangVienId]);

        return {
            total_classes: totalClasses.total,
            today_sessions: todaySessions,
            attendance_rate: attendanceRate.rate,
            pending_warnings: pendingWarnings.total
        };
    }

    async getStudentDashboard(sinhVienId, lopMonHocId = null) {
        let summarySql = `
            SELECT 
                COUNT(*) AS total_sessions,
                SUM(CASE WHEN dd.trang_thai = 'co_mat' THEN 1 ELSE 0 END) AS co_mat,
                SUM(CASE WHEN dd.trang_thai = 'tre' THEN 1 ELSE 0 END) AS tre,
                SUM(CASE WHEN dd.trang_thai = 'vang' THEN 1 ELSE 0 END) AS vang,
                SUM(CASE WHEN dd.trang_thai = 'co_phep' THEN 1 ELSE 0 END) AS co_phep,
                ROUND(
                    IFNULL(
                        SUM(CASE WHEN dd.trang_thai IN ('co_mat', 'tre') THEN 1 ELSE 0 END)
                        / NULLIF(COUNT(*), 0) * 100,
                        0
                    ),
                    2
                ) AS attendance_rate
            FROM diem_danh dd
        `;
        const summaryParams = [];

        if (lopMonHocId && lopMonHocId !== 'all') {
            summarySql += `
            JOIN buoi_hoc bh ON bh.id = dd.buoi_hoc_id
            WHERE dd.sinh_vien_id = ? AND bh.lop_mon_hoc_id = ?
            `;
            summaryParams.push(sinhVienId, lopMonHocId);
        } else {
            summarySql += `
            WHERE dd.sinh_vien_id = ?
            `;
            summaryParams.push(sinhVienId);
        }

        const [[summary]] = await db.query(summarySql, summaryParams);

        const [enrolledClasses] = await db.query(`
            SELECT lmh.id, lmh.ma_lop, hp.ten_hoc_phan
            FROM dang_ky_lop dkl
            JOIN lop_mon_hoc lmh ON lmh.id = dkl.lop_mon_hoc_id
            JOIN hoc_phan hp ON hp.id = lmh.hoc_phan_id
            WHERE dkl.sinh_vien_id = ?
        `, [sinhVienId]);

        const [upcomingSessions] = await db.query(`
            SELECT 
                bh.id,
                bh.ngay_hoc,
                bh.gio_bat_dau,
                bh.gio_ket_thuc,
                bh.trang_thai,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                ph.ten_phong,
                tk.ho_ten AS ten_giang_vien
            FROM dang_ky_lop dkl
            JOIN lop_mon_hoc lmh ON lmh.id = dkl.lop_mon_hoc_id
            JOIN hoc_phan hp ON hp.id = lmh.hoc_phan_id
            JOIN giang_vien gv ON gv.id = lmh.giang_vien_id
            JOIN tai_khoan tk ON tk.id = gv.tai_khoan_id
            JOIN buoi_hoc bh ON bh.lop_mon_hoc_id = lmh.id
            LEFT JOIN phong_hoc ph ON ph.id = bh.phong_hoc_id
            WHERE dkl.sinh_vien_id = ?
              AND bh.ngay_hoc >= CURDATE()
              AND bh.trang_thai IN ('sap_dien_ra', 'dang_dien_ra')
            ORDER BY bh.ngay_hoc ASC, bh.gio_bat_dau ASC
            LIMIT 5
        `, [sinhVienId]);

        const [warnings] = await db.query(`
            SELECT 
                id,
                loai,
                noi_dung,
                da_xu_ly,
                tao_luc
            FROM canh_bao
            WHERE sinh_vien_id = ?
            ORDER BY tao_luc DESC
            LIMIT 5
        `, [sinhVienId]);

        return {
            sinh_vien_id: sinhVienId,
            summary: {
                total_sessions: summary.total_sessions || 0,
                co_mat: summary.co_mat || 0,
                tre: summary.tre || 0,
                vang: summary.vang || 0,
                co_phep: summary.co_phep || 0,
                attendance_rate: summary.attendance_rate || 0
            },
            enrolled_classes: enrolledClasses,
            upcoming_sessions: upcomingSessions,
            warnings
        };
    }
}

module.exports = new DashboardModel();