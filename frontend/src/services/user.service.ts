import api from "@/api/axios"
import type { UserAccount, UserPayload } from "@/types/user.type"

export interface UsersResponse {
  data: UserAccount[]
  total?: number
}

export const UserService = {
  /** Lấy danh sách tài khoản (phân trang) */
  getAll: async (limit = 10, offset = 0): Promise<UsersResponse> => {
    const res = await api.get("/users", { params: { limit, offset } })
    return res.data
  },

  /** Lấy chi tiết tài khoản */
  getById: async (id: number): Promise<UserAccount> => {
    const res = await api.get(`/users/${id}`)
    return res.data.data ?? res.data
  },

  /** Tạo tài khoản mới */
  create: async (payload: UserPayload) => {
    const res = await api.post("/users", payload)
    return res.data
  },

  /** Cập nhật tài khoản */
  update: async (id: number, payload: Partial<UserPayload>) => {
    const res = await api.put(`/users/${id}`, payload)
    return res.data
  },

  /** Xóa tài khoản */
  remove: async (id: number) => {
    const res = await api.delete(`/users/${id}`)
    return res.data
  },

  /** Khóa tài khoản */
  lock: async (id: number, minutes = 15) => {
    const res = await api.patch(`/users/${id}/lock`, { minutes })
    return res.data
  },

  /** Mở khóa tài khoản */
  unlock: async (id: number) => {
    const res = await api.patch(`/users/${id}/unlock`)
    return res.data
  },

  /** Lấy danh sách vai trò */
  getRoles: async () => {
    const res = await api.get("/roles")
    return res.data
  },
}
