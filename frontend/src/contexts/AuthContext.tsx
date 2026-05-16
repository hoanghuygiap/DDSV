import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import api from "@/api/axios"

export interface AuthUser {
  id: number
  username: string
  ho_ten: string
  email: string
  kich_hoat: boolean
  vai_tro: string[]   // ["admin"] | ["giang_vien"] | ["sinh_vien"]
}

interface AuthContextValue {
  user: AuthUser | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Khôi phục session khi tải lại trang
  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      setIsLoading(false)
      return
    }
    api
      .get("/auth/me")
      .then((res) => {
        const raw = res.data.data
        setUser({
          ...raw,
          // /auth/me trả vai_tro là chuỗi GROUP_CONCAT — cần split
          vai_tro: raw.vai_tro
            ? (typeof raw.vai_tro === "string" ? raw.vai_tro.split(",") : raw.vai_tro)
            : [],
        })
      })
      .catch(() => {
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (username: string, password: string) => {
    // Backend: { success, message, data: { user, accessToken, refreshToken } }
    const res = await api.post("/auth/login", { username, password })
    const { user: userData, accessToken, refreshToken } = res.data.data

    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
    setUser({
      ...userData,
      vai_tro: Array.isArray(userData.vai_tro) ? userData.vai_tro : (userData.vai_tro ?? "").split(",").filter(Boolean),
    })
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } finally {
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth phải dùng bên trong AuthProvider")
  return ctx
}
