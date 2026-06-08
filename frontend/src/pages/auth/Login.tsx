import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { GraduationCap, User, Lock, EyeOff, Eye } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      await login(username, password)
      const pendingToken = sessionStorage.getItem("pending_qr_token")
      const pendingSid = sessionStorage.getItem("pending_qr_session_id")
      if (pendingToken && pendingSid) {
        sessionStorage.removeItem("pending_qr_token")
        sessionStorage.removeItem("pending_qr_session_id")
        navigate(`/dashboard/scan-qr?token=${encodeURIComponent(pendingToken)}&session_id=${pendingSid}`, { replace: true })
      } else {
        navigate("/dashboard", { replace: true })
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden flex w-full max-w-[1000px] min-h-[600px]">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-end w-1/2 p-10 relative overflow-hidden bg-[#1e325c]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2070&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/60 to-transparent" />
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl font-bold text-white leading-tight">
              Hệ thống quản lý chuyên cần thông minh
            </h2>
            <p className="text-slate-300 text-sm font-medium leading-relaxed">
              Tối ưu hóa quy trình điểm danh, nâng cao hiệu quả giảng dạy với công nghệ tiên tiến.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-8">
            <div className="text-[#1e325c]">
              <GraduationCap size={28} strokeWidth={2.5} />
            </div>
            <span className="text-xl font-bold text-[#1e325c]">UniCheck</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Chào mừng trở lại</h1>
            <p className="text-slate-500 text-sm">Đăng nhập để tiếp tục vào hệ thống UniCheck.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-xs font-bold text-slate-700">
                Tên đăng nhập
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <User size={18} />
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className="pl-10 h-12 rounded-lg border-slate-200 bg-slate-50/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Mật khẩu
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu"
                  className="pl-10 pr-10 h-12 rounded-lg border-slate-200 bg-slate-50/50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" className="border-slate-300 text-[#1e325c]" />
                <Label htmlFor="remember" className="text-sm text-slate-600 font-medium cursor-pointer">
                  Ghi nhớ đăng nhập
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm font-bold text-[#1e325c] hover:underline">
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg font-bold text-base shadow-md transition-colors disabled:opacity-60"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

        </div>
      </div>
    </div>
  )
}
