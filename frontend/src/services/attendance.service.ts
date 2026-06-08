import api from "@/api/axios"
import type { Attendance, QrToken, QrScanHistory } from "../types/attendance.type"

export const AttendanceService = {
  // Điểm danh theo buổi học
  getAttendances: async (sessionId: number): Promise<Attendance[]> => {
    const res = await api.get(`/attendance/session/${sessionId}`)
    return res.data.data ?? []
  },

  // Điểm danh theo sinh viên
  getByStudent: async (studentId: number): Promise<Attendance[]> => {
    const res = await api.get(`/attendance/student/${studentId}`)
    return res.data.data ?? []
  },

  // Check-in điểm danh
  checkin: async (data: { buoi_hoc_id: number; qr_token?: string; latitude?: number; longitude?: number }) => {
    const res = await api.post("/attendance/checkin", data)
    return res.data
  },

  // Điểm danh thủ công (giảng viên/admin)
  manual: async (data: { buoi_hoc_id: number; sinh_vien_id: number; trang_thai: string; ghi_chu?: string }) => {
    const res = await api.post("/attendance/manual", data)
    return res.data
  },

  // Tự động đánh vắng khi kết thúc buổi
  autoAbsent: async (sessionId: number) => {
    const res = await api.post("/attendance/auto-absent", { buoi_hoc_id: sessionId })
    return res.data
  },

  // Cập nhật trạng thái điểm danh
  update: async (id: number, data: Partial<Attendance>) => {
    const res = await api.put(`/attendance/${id}`, data)
    return res.data
  },

  // Xóa bản ghi điểm danh
  remove: async (id: number) => {
    const res = await api.delete(`/attendance/${id}`)
    return res.data
  },

  // Thống kê điểm danh
  getStatistics: async (params?: { lop_mon_hoc_id?: number; ky_hoc_id?: number }) => {
    const res = await api.get("/attendance/statistics", { params })
    return res.data.data
  },

  // Xuất Excel
  exportExcel: async (params?: { lop_mon_hoc_id?: number }) => {
    const res = await api.get("/attendance/export-excel", { params, responseType: "blob" })
    return res.data
  },

  // Realtime điểm danh của buổi
  getRealtime: async (sessionId: number): Promise<Attendance[]> => {
    const res = await api.get(`/attendance/realtime/${sessionId}`)
    return res.data.data ?? []
  },

  // QR: lấy QR hiện tại của buổi
  getQrTokens: async (sessionId: number): Promise<QrToken[]> => {
    const res = await api.get(`/qr/current/${sessionId}`)
    return res.data.data ? [res.data.data] : []
  },

  // QR: lịch sử QR của buổi
  getQrScanHistories: async (sessionId: number): Promise<QrScanHistory[]> => {
    const res = await api.get(`/qr/history/${sessionId}`)
    return res.data.data ?? []
  },

  // QR: tạo QR cho buổi
  generateQr: async (sessionId: number) => {
    const res = await api.post("/qr/generate", { buoi_hoc_id: sessionId })
    return res.data.data
  },

  // QR: làm mới QR
  refreshQr: async (sessionId: number) => {
    const res = await api.post("/qr/refresh", { buoi_hoc_id: sessionId })
    return res.data.data
  },

  // QR: quét QR điểm danh
  scanQr: async (data: { token: string; latitude?: number; longitude?: number; wifi_bssid?: string }) => {
    const res = await api.post("/qr/scan", data)
    return res.data
  },
}
