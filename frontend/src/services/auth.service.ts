import api from "@/api/axios"
import type { AuthUser, ChangePasswordPayload } from "@/types/auth.type"

export const AuthService = {
  /** Đăng nhập — trả về token + thông tin user */
  login: async (username: string, password: string) => {
    const res = await api.post("/auth/login", { username, password })
    return res.data as { access_token: string; refresh_token: string; user: AuthUser }
  },

  /** Đăng xuất */
  logout: async () => {
    await api.post("/auth/logout")
  },

  /** Lấy thông tin người dùng hiện tại từ token */
  getMe: async (): Promise<AuthUser> => {
    const res = await api.get("/auth/me")
    return res.data.user
  },

  /** Quên mật khẩu — gửi email reset */
  forgotPassword: async (email: string) => {
    const res = await api.post("/auth/forgot-password", { email })
    return res.data
  },

  /** Đặt lại mật khẩu bằng token */
  resetPassword: async (token: string, new_password: string) => {
    const res = await api.post("/auth/reset-password", { token, new_password })
    return res.data
  },

  /** Đổi mật khẩu (đã đăng nhập) */
  changePassword: async (payload: ChangePasswordPayload) => {
    const res = await api.post("/auth/change-password", payload)
    return res.data
  },
}
