import api from "@/api/axios"
import type { Classroom, ClassroomWifi, Device } from "../types/facility.type"

export const FacilityService = {
  // Phòng học
  getClassrooms: async (): Promise<Classroom[]> => {
    const res = await api.get("/rooms")
    return res.data.data ?? []
  },

  createClassroom: async (data: Omit<Classroom, "id">) => {
    const res = await api.post("/rooms", data)
    return res.data
  },

  updateClassroom: async (id: number, data: Partial<Classroom>) => {
    const res = await api.put(`/rooms/${id}`, data)
    return res.data
  },

  deleteClassroom: async (id: number) => {
    const res = await api.delete(`/rooms/${id}`)
    return res.data
  },

  // WiFi của phòng học
  getClassroomWifis: async (roomId: number): Promise<ClassroomWifi[]> => {
    const res = await api.get(`/rooms/${roomId}/wifi`)
    return res.data.data ?? []
  },

  addWifi: async (roomId: number, data: { bssid: string }) => {
    const res = await api.post(`/rooms/${roomId}/wifi`, data)
    return res.data
  },

  deleteWifi: async (roomId: number, wifiId: number) => {
    const res = await api.delete(`/rooms/${roomId}/wifi/${wifiId}`)
    return res.data
  },

  // Thiết bị
  getDevices: async (): Promise<Device[]> => {
    const res = await api.get("/devices/my")
    return res.data.data ?? []
  },

  registerDevice: async (data: { device_id: string; platform: string; push_token?: string }) => {
    const res = await api.post("/devices/register", data)
    return res.data
  },

  updatePushToken: async (data: { push_token: string }) => {
    const res = await api.put("/devices/push-token", data)
    return res.data
  },

  deleteDevice: async (id: number) => {
    const res = await api.delete(`/devices/${id}`)
    return res.data
  },
}
