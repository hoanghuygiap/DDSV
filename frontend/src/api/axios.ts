import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
})

// Gắn access token vào mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Tự động refresh token khi nhận 401/403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    // 401 = không có token → thẳng về login
    if (status === 401) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    // 403 = token hết hạn → thử refresh
    if (status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem("refresh_token")
        if (!refreshToken) throw new Error("no refresh token")

        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/auth/refresh-token`,
          { refreshToken }
        )
        // Backend: { success, data: { accessToken, refreshToken } }
        const { accessToken, refreshToken: newRefresh } = res.data.data
        localStorage.setItem("access_token", accessToken)
        if (newRefresh) localStorage.setItem("refresh_token", newRefresh)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch {
        // Refresh thất bại — xóa token, chuyển về login
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        window.location.href = "/login"
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
