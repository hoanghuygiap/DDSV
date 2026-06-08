import api from "@/api/axios"
import type { Notification, Warning } from "../types/system.type"

export const SystemService = {
  // Thông báo
  getNotifications: async (): Promise<Notification[]> => {
    const res = await api.get("/notifications")
    return res.data.data?.data ?? []
  },

  getUserNotifications: async (): Promise<Notification[]> => {
    const res = await api.get("/notifications")
    return res.data.data?.data ?? []
  },

  getNotificationDetail: async (id: number): Promise<Notification> => {
    const res = await api.get(`/notifications/${id}`)
    return res.data.data
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get("/notifications/unread-count")
    return res.data.data?.count ?? 0
  },

  createNotification: async (data: Partial<Notification>) => {
    const res = await api.post("/notifications", data)
    return res.data
  },

  markAsRead: async (id: number) => {
    const res = await api.patch(`/notifications/${id}/read`)
    return res.data
  },

  readAll: async () => {
    const res = await api.patch("/notifications/read-all")
    return res.data
  },

  deleteNotification: async (id: number) => {
    const res = await api.delete(`/notifications/${id}`)
    return res.data
  },

  // Cảnh báo
  getWarnings: async (params?: { sinh_vien_id?: number; lop_mon_hoc_id?: number }): Promise<Warning[]> => {
    const res = await api.get("/warnings", { params })
    return res.data.data?.data ?? []
  },

  getWarningsByStudent: async (studentId: number): Promise<Warning[]> => {
    const res = await api.get(`/warnings/student/${studentId}`)
    return res.data.data ?? []
  },

  getWarningsByCourseClass: async (courseClassId: number): Promise<Warning[]> => {
    const res = await api.get(`/warnings/course-class/${courseClassId}`)
    return res.data.data ?? []
  },

  createWarning: async (data: Partial<Warning>) => {
    const res = await api.post("/warnings", data)
    return res.data
  },

  autoGenerateWarnings: async () => {
    const res = await api.post("/warnings/auto-generate")
    return res.data
  },

  processWarning: async (id: number) => {
    const res = await api.patch(`/warnings/${id}/process`)
    return res.data
  },

  deleteWarning: async (id: number) => {
    const res = await api.delete(`/warnings/${id}`)
    return res.data
  },

  // Không có endpoint backend cho system logs và config
  getSystemLogs: async () => [],
  getConfigs: async () => [],
}
