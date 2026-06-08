import api from "@/api/axios"
import type { Session } from "../types/schedule.type"

export const ScheduleService = {
  // Lấy tất cả buổi học (có thể lọc theo lớp môn học)
  getSchedules: async (params?: { lop_mon_hoc_id?: number }): Promise<Session[]> => {
    const res = await api.get("/sessions", { params })
    return res.data.data ?? []
  },

  getSessions: async (params?: { lop_mon_hoc_id?: number; ngay_hoc?: string }): Promise<Session[]> => {
    const res = await api.get("/sessions", { params })
    return res.data.data ?? []
  },

  getSessionById: async (id: number): Promise<Session> => {
    const res = await api.get(`/sessions/${id}`)
    return res.data.data
  },

  createSession: async (data: Omit<Session, "id" | "trang_thai" | "diem_danh_mo">) => {
    const res = await api.post("/sessions", data)
    return res.data
  },

  updateSession: async (id: number, data: Partial<Session>) => {
    const res = await api.put(`/sessions/${id}`, data)
    return res.data
  },

  deleteSession: async (id: number) => {
    const res = await api.delete(`/sessions/${id}`)
    return res.data
  },

  openAttendance: async (sessionId: number) => {
    const res = await api.patch(`/sessions/${sessionId}/open-attendance`)
    return res.data
  },

  closeAttendance: async (sessionId: number) => {
    const res = await api.patch(`/sessions/${sessionId}/close-attendance`)
    return res.data
  },

  changeRoom: async (sessionId: number, phong_hoc_id: number) => {
    const res = await api.patch(`/sessions/${sessionId}/change-room`, { phong_hoc_id })
    return res.data
  },

  // Không có endpoint riêng cho lịch nghỉ, trả về mảng rỗng
  getLeaveSchedules: async () => {
    return []
  },
}
