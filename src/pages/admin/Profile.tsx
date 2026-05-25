import { useState } from "react"
import { Lock, EyeOff, Eye, Loader2, CheckCircle2, } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/api/axios"



export default function ProfilePage() {
  const { user } = useAuth()

  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [pwError, setPwError] = useState("")
  const [pwSuccess, setPwSuccess] = useState("")

  const avatarInitials = user?.ho_ten
    ? user.ho_ten.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
    : "AD"

  const handleChangePassword = async () => {
    setPwError("")
    setPwSuccess("")
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwError("Vui lòng điền đầy đủ tất cả các trường.")
      return
    }
    if (newPassword !== confirmPassword) {
      setPwError("Mật khẩu mới và xác nhận không khớp.")
      return
    }
    if (newPassword.length < 6) {
      setPwError("Mật khẩu mới phải có ít nhất 6 ký tự.")
      return
    }
    setIsSaving(true)
    try {
      await api.post("/auth/change-password", { currentPassword, newPassword })
      setPwSuccess("Đổi mật khẩu thành công!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Đổi mật khẩu thất bại. Vui lòng kiểm tra lại mật khẩu hiện tại."
      setPwError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân & Cài đặt</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin, bảo mật và tùy chọn hệ thống của bạn.</p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-5xl items-stretch pb-6">

        {/* LEFT COLUMN */}
        <div className="md:col-span-5 flex flex-col gap-6 h-full">

          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm flex flex-col items-center h-full">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-md bg-[#1e325c] flex items-center justify-center mb-5 mt-2">
              <span className="text-white text-3xl font-bold">{avatarInitials}</span>
            </div>

            <h2 className="text-xl font-bold text-slate-800 text-center">{user?.ho_ten || "—"}</h2>
            <p className="text-slate-500 text-sm mt-1 mb-8">@{user?.username}</p>

            <div className="w-full flex flex-col gap-5 text-sm mb-4">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Vai trò</span>
                <span className="text-slate-800 font-semibold capitalize">
                  {user?.vai_tro?.includes("admin") ? "Quản trị viên" : user?.vai_tro?.join(", ") || "—"}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Email</span>
                <span className="text-slate-800 font-semibold">{user?.email || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Tên đăng nhập</span>
                <span className="text-slate-800 font-semibold">{user?.username || "—"}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Trạng thái</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Hoạt động
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="md:col-span-7 flex flex-col gap-6 h-full">

          {/* Password Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <Lock size={20} className="text-slate-700" />
              <h3 className="font-bold text-slate-800 text-base">Đổi mật khẩu</h3>
            </div>

            {pwError && (
              <p className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {pwError}
              </p>
            )}
            {pwSuccess && (
              <p className="mb-4 text-sm text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 flex items-center gap-2">
                <CheckCircle2 size={16} />
                {pwSuccess}
              </p>
            )}

            <div className="flex flex-col gap-4 max-w-lg">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Mật khẩu mới</label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full border border-slate-200 rounded-md px-3 py-2 pr-10 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới"
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                />
              </div>

              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#007082] hover:bg-[#005c6b] text-white font-bold py-2 px-5 rounded-md text-sm transition-colors shadow-sm disabled:opacity-60"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  Cập nhật mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
