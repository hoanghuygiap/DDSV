const db = require('../config/db');
const { pagingData } = require('../utils/pagination');

class StudentModel {
    static async getAllStudents(query, pagination) {
        const { page, limit, offset } = pagination;
        const keyword = query.keyword || '';
        const searchValue = `%${keyword}%`;

        const whereSql = `
            FROM sinh_vien sv
            JOIN tai_khoan tk ON sv.tai_khoan_id = tk.id
            LEFT JOIN lop_hanh_chinh lhc ON sv.lop_id = lhc.id
            LEFT JOIN nganh n ON lhc.nganh_id = n.id
            LEFT JOIN khoa k ON n.khoa_id = k.id
            WHERE sv.deleted_at IS NULL
            AND (
                sv.ma_sinh_vien LIKE ?
                OR sv.ho_ten LIKE ?
                OR sv.email LIKE ?
                OR sv.sdt LIKE ?
                OR lhc.ten_lop LIKE ?
            )
        `;

        const params = [
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue
        ];

        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total ${whereSql}`,
            params
        );

        const [rows] = await db.query(
            `
            SELECT
                sv.id,
                sv.tai_khoan_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                sv.email,
                sv.sdt,
                sv.lop_id,
                lhc.ten_lop,
                n.ten_nganh,
                k.ten_khoa,
                tk.username,
                tk.kich_hoat,
                tk.created_at
            ${whereSql}
            ORDER BY sv.id DESC
            LIMIT ? OFFSET ?
            `,
            [...params, limit, offset]
        );

        return pagingData(rows, countRows[0].total, page, limit);
    }

    static async getStudentById(id) {
        const [rows] = await db.query(
            `
            SELECT
                sv.id,
                sv.tai_khoan_id,
                sv.ma_sinh_vien,
                sv.ho_ten,
                sv.email,
                sv.sdt,
                sv.lop_id,
                lhc.ten_lop,
                n.ten_nganh,
                k.ten_khoa,
                tk.username,
                tk.kich_hoat,
                tk.last_login,
                tk.created_at
            FROM sinh_vien sv
            JOIN tai_khoan tk ON sv.tai_khoan_id = tk.id
            LEFT JOIN lop_hanh_chinh lhc ON sv.lop_id = lhc.id
            LEFT JOIN nganh n ON lhc.nganh_id = n.id
            LEFT JOIN khoa k ON n.khoa_id = k.id
            WHERE sv.id = ?
            AND sv.deleted_at IS NULL
            `,
            [id]
        );

        return rows[0];
    }

    static async createStudent(data) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [accountResult] = await connection.query(
                `
                INSERT INTO tai_khoan
                (username, password_hash, ho_ten, email, kich_hoat)
                VALUES (?, ?, ?, ?, TRUE)
                `,
                [
                    data.username,
                    data.password_hash,
                    data.ho_ten,
                    data.email
                ]
            );

            const taiKhoanId = accountResult.insertId;

            const [roleRows] = await connection.query(
                `
                SELECT id
                FROM vai_tro
                WHERE ten_vai_tro = 'sinh_vien'
                `
            );

            if (roleRows.length === 0) {
                throw new Error('Chưa có vai trò sinh_vien');
            }

            await connection.query(
                `
                INSERT INTO tai_khoan_vai_tro
                (tai_khoan_id, vai_tro_id)
                VALUES (?, ?)
                `,
                [taiKhoanId, roleRows[0].id]
            );

            const [studentResult] = await connection.query(
                `
                INSERT INTO sinh_vien
                (tai_khoan_id, ma_sinh_vien, ho_ten, email, sdt, lop_id)
                VALUES (?, ?, ?, ?, ?, ?)
                `,
                [
                    taiKhoanId,
                    data.ma_sinh_vien,
                    data.ho_ten,
                    data.email,
                    data.sdt,
                    data.lop_id || null
                ]
            );

            await connection.commit();

            return {
                id: studentResult.insertId,
                tai_khoan_id: taiKhoanId
            };
        } catch (error) {
            await connection.rollback();

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Username, email hoặc mã sinh viên đã tồn tại');
            }

            throw error;
        } finally {
            connection.release();
        }
    }

    static async updateStudent(id, data) {
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [studentRows] = await connection.query(
                `
                SELECT tai_khoan_id
                FROM sinh_vien
                WHERE id = ?
                AND deleted_at IS NULL
                `,
                [id]
            );

            if (studentRows.length === 0) {
                throw new Error('Sinh viên không tồn tại');
            }

            const taiKhoanId = studentRows[0].tai_khoan_id;

            await connection.query(
                `
                UPDATE sinh_vien
                SET
                    ma_sinh_vien = COALESCE(?, ma_sinh_vien),
                    ho_ten = COALESCE(?, ho_ten),
                    email = COALESCE(?, email),
                    sdt = COALESCE(?, sdt),
                    lop_id = COALESCE(?, lop_id)
                WHERE id = ?
                `,
                [
                    data.ma_sinh_vien,
                    data.ho_ten,
                    data.email,
                    data.sdt,
                    data.lop_id,
                    id
                ]
            );

            await connection.query(
                `
                UPDATE tai_khoan
                SET
                    ho_ten = COALESCE(?, ho_ten),
                    email = COALESCE(?, email),
                    kich_hoat = COALESCE(?, kich_hoat)
                WHERE id = ?
                `,
                [
                    data.ho_ten,
                    data.email,
                    data.kich_hoat,
                    taiKhoanId
                ]
            );

            await connection.commit();

            return await this.getStudentById(id);
        } catch (error) {
            await connection.rollback();

            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Email hoặc mã sinh viên đã tồn tại');
            }

            throw error;
        } finally {
            connection.release();
        }
    }

    static async deleteStudent(id) {
        const [result] = await db.query(
            `
            UPDATE sinh_vien
            SET deleted_at = NOW()
            WHERE id = ?
            AND deleted_at IS NULL
            `,
            [id]
        );

        return result;
    }

    static async getStudentClasses(id, pagination) {
        const { page, limit, offset } = pagination;

        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM dang_ky_lop dk
            JOIN lop_mon_hoc lmh ON dk.lop_mon_hoc_id = lmh.id
            WHERE dk.sinh_vien_id = ?
            AND lmh.deleted_at IS NULL
            `,
            [id]
        );

        const [rows] = await db.query(
            `
            SELECT
                lmh.id,
                lmh.ma_lop,
                hp.ma_hoc_phan,
                hp.ten_hoc_phan,
                hp.so_tin_chi,
                ky.ten_ky,
                gv.ho_ten AS ten_giang_vien
            FROM dang_ky_lop dk
            JOIN lop_mon_hoc lmh ON dk.lop_mon_hoc_id = lmh.id
            LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            LEFT JOIN ky_hoc ky ON lmh.ky_hoc_id = ky.id
            LEFT JOIN giang_vien gv ON lmh.giang_vien_id = gv.id
            WHERE dk.sinh_vien_id = ?
            AND lmh.deleted_at IS NULL
            ORDER BY lmh.id DESC
            LIMIT ? OFFSET ?
            `,
            [id, limit, offset]
        );

        return pagingData(rows, countRows[0].total, page, limit);
    }

    static async getStudentSchedule(id, pagination) {
        const { page, limit, offset } = pagination;

        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM dang_ky_lop dk
            JOIN thoi_khoa_bieu tkb ON dk.lop_mon_hoc_id = tkb.lop_mon_hoc_id
            JOIN lop_mon_hoc lmh ON tkb.lop_mon_hoc_id = lmh.id
            WHERE dk.sinh_vien_id = ?
            AND lmh.deleted_at IS NULL
            `,
            [id]
        );

        const [rows] = await db.query(
            `
            SELECT
                tkb.id,
                tkb.thu,
                tkb.gio_bat_dau,
                tkb.gio_ket_thuc,
                ph.ten_phong,
                lmh.id AS lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                gv.ho_ten AS ten_giang_vien
            FROM dang_ky_lop dk
            JOIN thoi_khoa_bieu tkb ON dk.lop_mon_hoc_id = tkb.lop_mon_hoc_id
            JOIN lop_mon_hoc lmh ON tkb.lop_mon_hoc_id = lmh.id
            LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            LEFT JOIN giang_vien gv ON lmh.giang_vien_id = gv.id
            LEFT JOIN phong_hoc ph ON tkb.phong_hoc_id = ph.id
            WHERE dk.sinh_vien_id = ?
            AND lmh.deleted_at IS NULL
            ORDER BY tkb.thu ASC, tkb.gio_bat_dau ASC
            LIMIT ? OFFSET ?
            `,
            [id, limit, offset]
        );

        return pagingData(rows, countRows[0].total, page, limit);
    }

    static async getStudentAttendance(id, query, pagination) {
        const { page, limit, offset } = pagination;

        let whereSql = `
            WHERE dd.sinh_vien_id = ?
        `;

        const params = [id];

        if (query.lop_mon_hoc_id) {
            whereSql += ` AND bh.lop_mon_hoc_id = ? `;
            params.push(query.lop_mon_hoc_id);
        }

        if (query.trang_thai) {
            whereSql += ` AND dd.trang_thai = ? `;
            params.push(query.trang_thai);
        }

        const [countRows] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM diem_danh dd
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            ${whereSql}
            `,
            params
        );

        const [rows] = await db.query(
            `
            SELECT
                dd.id,
                dd.buoi_hoc_id,
                dd.trang_thai,
                dd.thoi_gian,
                dd.hop_le_gps,
                dd.hop_le_wifi,
                dd.hop_le,
                dd.ghi_chu,
                bh.ngay_hoc,
                bh.gio_bat_dau,
                bh.gio_ket_thuc,
                lmh.id AS lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                ph.ten_phong
            FROM diem_danh dd
            JOIN buoi_hoc bh ON dd.buoi_hoc_id = bh.id
            JOIN lop_mon_hoc lmh ON bh.lop_mon_hoc_id = lmh.id
            LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            LEFT JOIN phong_hoc ph ON bh.phong_hoc_id = ph.id
            ${whereSql}
            ORDER BY bh.ngay_hoc DESC, bh.gio_bat_dau DESC
            LIMIT ? OFFSET ?
            `,
            [...params, limit, offset]
        );

        return pagingData(rows, countRows[0].total, page, limit);
    }

    static async getStudentStatistics(id) {
        const [summary] = await db.query(
            `
            SELECT
                tk.sinh_vien_id,
                tk.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                tk.tong,
                tk.co_mat,
                tk.vang,
                tk.tre,
                tk.co_phep,
                tk.ti_le_co_mat
            FROM v_thong_ke tk
            JOIN lop_mon_hoc lmh ON tk.lop_mon_hoc_id = lmh.id
            LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            WHERE tk.sinh_vien_id = ?
            `,
            [id]
        );

        const [weekly] = await db.query(
            `
            SELECT
                cct.sinh_vien_id,
                cct.lop_mon_hoc_id,
                lmh.ma_lop,
                hp.ten_hoc_phan,
                cct.tuan_hoc,
                cct.ngay_dau_tuan,
                cct.tong_buoi,
                cct.co_mat,
                cct.vang,
                cct.ti_le_co_mat
            FROM v_chuyen_can_theo_tuan cct
            JOIN lop_mon_hoc lmh ON cct.lop_mon_hoc_id = lmh.id
            LEFT JOIN hoc_phan hp ON lmh.hoc_phan_id = hp.id
            WHERE cct.sinh_vien_id = ?
            ORDER BY cct.tuan_hoc ASC
            `,
            [id]
        );

        return {
            summary,
            weekly
        };
    }
}

module.exports = StudentModel;