import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Mail, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Loader2 } from "lucide-react"
import api from "@/api/axios"

type Step = "email" | "reset" | "success"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    try {
      const res = await api.post("/auth/forgot-password", { email })
      setResetToken(res.data.resetToken)
      setStep("reset")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || "Email không tồn tại trên hệ thống.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.")
      return
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.")
      return
    }
    setIsLoading(true)
    try {
      await api.post("/auth/reset-password", { resetToken, newPassword })
      setStep("success")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(msg || "Mã xác thực không hợp lệ hoặc đã hết hạn.")
    } finally {
      setIsLoading(false)
    }
  }

  const stepDot = (active: boolean) => (
    <div className={`h-2 w-2 rounded-full transition-colors ${active ? "bg-[#185FA5]" : "bg-slate-200"}`} />
  )

  const stepIndex = step === "email" ? 0 : step === "reset" ? 1 : 2

  return (
    <div
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <div className="bg-white rounded-xl shadow-xl overflow-hidden flex w-full max-w-[1000px] min-h-[600px]">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-10 relative overflow-hidden bg-[#152342]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')" }}
          />
          <div className="absolute inset-0 bg-[#0f172a]/40" />
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl mx-auto w-full">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck size={32} strokeWidth={2} className="text-white" />
              <span className="text-xl font-medium text-white">UniCheck</span>
            </div>
            <p className="text-slate-200 text-sm leading-relaxed font-normal">
              Hệ thống quản lý chuyên cần thông minh, bảo mật và đáng tin cậy. Chúng tôi sẽ hỗ trợ bạn khôi phục quyền truy cập một cách nhanh chóng và an toàn.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-8">
            {stepDot(stepIndex >= 0)}
            {stepDot(stepIndex >= 1)}
            {stepDot(stepIndex >= 2)}
          </div>

          {/* ── STEP 1: Email ────────────────────────────────────── */}
          {step === "email" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-medium text-slate-900 mb-2">Quên mật khẩu</h1>
                <p className="text-slate-500 text-sm font-normal leading-relaxed">
                  Nhập địa chỉ email đã đăng ký. Hệ thống sẽ xác nhận và cho phép bạn tạo mật khẩu mới.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-normal">
                  {error}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleForgot}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-medium text-slate-700">
                    Địa chỉ Email
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Mail size={18} />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      placeholder="example@university.edu.vn"
                      className="pl-10 h-12 rounded-lg border-slate-200 bg-slate-50/50"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg font-medium text-sm shadow-md transition-colors disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang xác nhận...
                    </span>
                  ) : (
                    "Xác nhận email"
                  )}
                </Button>
              </form>

              <div className="mt-8 border-t border-slate-100 pt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 text-sm font-normal text-slate-500 hover:text-[#1e325c] transition-colors group"
                >
                  <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </>
          )}

          {/* ── STEP 2: New password ─────────────────────────────── */}
          {step === "reset" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-medium text-slate-900 mb-2">Tạo mật khẩu mới</h1>
                <p className="text-slate-500 text-sm font-normal leading-relaxed">
                  Email <span className="font-medium text-slate-700">{email}</span> đã được xác nhận.
                  Nhập mật khẩu mới cho tài khoản của bạn.
                </p>
              </div>

              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-normal">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleReset}>
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-medium text-slate-700">
                    Mật khẩu mới
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <Input
                      id="newPassword"
                      type={showNew ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                      className="pl-10 pr-10 h-12 rounded-lg border-slate-200 bg-slate-50/50"
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-medium text-slate-700">
                    Xác nhận mật khẩu
                  </Label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <Lock size={18} />
                    </div>
                    <Input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      placeholder="Nhập lại mật khẩu mới"
                      className="pl-10 pr-10 h-12 rounded-lg border-slate-200 bg-slate-50/50"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showConfirm ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg font-medium text-sm shadow-md transition-colors disabled:opacity-60"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Đang cập nhật...
                    </span>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => { setStep("email"); setError("") }}
                  className="text-sm font-normal text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Nhập email khác
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Success ──────────────────────────────────── */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center text-center py-4">
              <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-500" strokeWidth={1.5} />
              </div>

              <h1 className="text-2xl font-medium text-slate-900 mb-3">Đặt lại thành công!</h1>
              <p className="text-slate-500 text-sm font-normal leading-relaxed max-w-xs">
                Mật khẩu tài khoản của bạn đã được cập nhật. Vui lòng đăng nhập lại bằng mật khẩu mới.
              </p>

              <Button
                onClick={() => navigate("/login")}
                className="mt-8 h-12 px-10 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg font-medium text-sm shadow-md transition-colors"
              >
                Đăng nhập ngay
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
