import api from "@/api/axios"
import type { Lecturer, LecturerPayload } from "@/types/user.type"

export const LecturerService = {
  /** Lấy tất cả giảng viên */
  getAll: async (): Promise<Lecturer[]> => {
    const res = await api.get("/lecturers")
    return res.data.data
  },

  /** Lấy chi tiết một giảng viên */
  getById: async (id: number): Promise<Lecturer> => {
    const res = await api.get(`/lecturers/${id}`)
    return res.data.data
  },

  /** Tạo giảng viên mới: bước 1 tạo tai_khoan, bước 2 tạo giang_vien */
  create: async (payload: LecturerPayload) => {
    // Bước 1: tạo tài khoản với vai trò giang_vien (roleId=2)
    const userRes = await api.post("/users", {
      username: payload.username,
      password: payload.password,
      ho_ten: payload.ho_ten,
      email: payload.email,
      roleId: 2,
    })
    const tai_khoan_id: number = userRes.data.data.id

    // Bước 2: tạo hồ sơ giảng viên liên kết với tài khoản vừa tạo
    const res = await api.post("/lecturers", {
      tai_khoan_id,
      ma_giang_vien: payload.ma_giang_vien,
      ho_ten: payload.ho_ten,
      email: payload.email,
      sdt: payload.sdt || null,
    })
    return res.data
  },

  /** Cập nhật thông tin giảng viên */
  update: async (id: number, payload: Partial<Pick<Lecturer, "ho_ten" | "email" | "sdt">>) => {
    const res = await api.put(`/lecturers/${id}`, payload)
    return res.data
  },

  /** Xóa mềm giảng viên */
  remove: async (id: number) => {
    const res = await api.delete(`/lecturers/${id}`)
    return res.data
  },

  /** Khóa tài khoản giảng viên */
  lock: async (tai_khoan_id: number, minutes = 15) => {
    const res = await api.patch(`/users/${tai_khoan_id}/lock`, { minutes })
    return res.data
  },

  /** Mở khóa tài khoản giảng viên */
  unlock: async (tai_khoan_id: number) => {
    const res = await api.patch(`/users/${tai_khoan_id}/unlock`)
    return res.data
  },

  /** Lấy lịch giảng dạy */
  getSchedule: async (id: number) => {
    const res = await api.get(`/lecturers/${id}/schedule`)
    return res.data.data
  },

  /** Lấy danh sách lớp phụ trách */
  getCourseClasses: async (id: number) => {
    const res = await api.get(`/lecturers/${id}/course-classes`)
    return res.data.data
  },
}
