import { useState } from "react"
import { Lock, Shield, EyeOff, Eye, Loader2, CheckCircle2, History, LogIn, UserCog, QrCode } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import api from "@/api/axios"

const activityLogs = [
  { id: "1", type: "login", action: "Đăng nhập hệ thống", details: "Trình duyệt Chrome, Windows 11", timestamp: "Hôm nay, 08:32" },
  { id: "2", type: "qr", action: "Xem báo cáo điểm danh", details: "Báo cáo tổng hợp học kỳ II", timestamp: "Hôm nay, 08:35" },
  { id: "3", type: "update", action: "Cập nhật thông tin cá nhân", details: "Thay đổi địa chỉ email", timestamp: "Hôm qua, 14:20" },
  { id: "4", type: "login", action: "Đăng nhập hệ thống", details: "Trình duyệt Chrome, Windows 11", timestamp: "Hôm qua, 08:10" },
]

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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-[#1e325c] flex items-center justify-center mb-4 mt-2">
              <span className="text-white text-3xl font-bold">{avatarInitials}</span>
            </div>

            <h2 className="text-lg font-bold text-slate-800 text-center">{user?.ho_ten || "—"}</h2>
            <p className="text-slate-500 text-sm mt-1 mb-6">@{user?.username}</p>

            <div className="w-full flex flex-col gap-4 text-sm mb-6">
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

          {/* Security Banner */}
          <div className="bg-[#1e325c] rounded-xl p-5 shadow-sm flex items-start gap-3">
            <Shield size={24} className="text-[#38bdf8] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Bảo mật đa lớp</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Tài khoản được bảo vệ bởi JWT với thời hạn 15 phút. Không chia sẻ thông tin đăng nhập.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* Password Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
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

          {/* Activity Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <History size={20} className="text-slate-700" />
              <h3 className="font-bold text-slate-800 text-base">Nhật ký hoạt động gần đây</h3>
            </div>

            <div className="flex flex-col gap-4">
              {activityLogs.map((log) => {
                let IconComponent = LogIn
                let iconBg = "bg-[#007082] text-white"
                if (log.type === "qr") { IconComponent = QrCode; iconBg = "bg-slate-200 text-slate-600" }
                if (log.type === "update") { IconComponent = UserCog; iconBg = "bg-slate-100 text-slate-500" }
                return (
                  <div key={log.id} className="flex items-start gap-4 p-3 border border-slate-100 rounded-lg hover:border-slate-200 transition-all">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}>
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-sm">{log.action}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{log.details}</p>
                    </div>
                    <span className="text-[11px] font-bold text-slate-400 shrink-0">{log.timestamp}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
