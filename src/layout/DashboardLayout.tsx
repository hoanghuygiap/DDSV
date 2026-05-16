import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GraduationCap, Plus, QrCode, LogOut } from "lucide-react"
import { MENU_DATA } from "@/constants"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/types"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  // Suy ra vai trò từ thông tin user thực tế
  const role: Role = user?.vai_tro?.includes("admin")
    ? "admin"
    : user?.vai_tro?.includes("giang_vien")
    ? "lecturer"
    : "student"

  const currentMenu = MENU_DATA[role]

  const activeMenuItem = currentMenu.find((item) => {
    if (item.path === "/dashboard") return location.pathname === "/dashboard"
    return location.pathname.startsWith(item.path)
  })

  const pageTitle = activeMenuItem?.label || "Bảng điều khiển"

  // Tạo chữ viết tắt avatar từ tên thật
  const avatarInitials = user?.ho_ten
    ? user.ho_ten
        .split(" ")
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : role === "admin" ? "AD" : role === "lecturer" ? "GV" : "SV"

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">

      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#f8f9fa] border-r border-slate-200 flex flex-col px-4 py-6 shadow-sm z-10 shrink-0">

        {/* LOGO */}
        <div className="flex items-center gap-3 px-2 mb-8 shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e325c] text-white shrink-0">
            <GraduationCap size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-[#1e325c] font-bold text-lg leading-tight">Đại học Thăng Long</h1>
            <p className="text-slate-500 text-xs font-medium">Hệ thống Quản lý</p>
          </div>
        </div>

        {/* USER INFO */}
        <div className="mb-6 px-2 shrink-0">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
            <Avatar className="h-9 w-9 shrink-0">
              <AvatarFallback className="bg-[#1e325c] text-white text-xs font-bold">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.ho_ten || "—"}</p>
              <p className="text-xs text-slate-500 truncate">
                {role === "admin" ? "Quản trị viên" : role === "lecturer" ? "Giảng viên" : "Sinh viên"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="text-slate-400 hover:text-red-500 transition-colors shrink-0"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* PRIMARY ACTION */}
        {role === "lecturer" && (
          <button className="shrink-0 flex items-center justify-center gap-2 w-full bg-[#007082] hover:bg-[#005c6b] text-white rounded-sm py-3 px-4 font-bold transition-colors mb-6 shadow-md border-b-4 border-[#005c6b] active:border-b-0 active:translate-y-1">
            <Plus size={20} strokeWidth={3} />
            <span>Tạo điểm danh mới</span>
          </button>
        )}

        {role === "student" && (
          <button className="shrink-0 flex items-center justify-center gap-2 w-full bg-[#007082] hover:bg-[#005c6b] text-white rounded-sm py-3 px-4 font-bold transition-colors mb-6 shadow-md border-b-4 border-[#005c6b] active:border-b-0 active:translate-y-1">
            <QrCode size={20} strokeWidth={3} />
            <span>Quét QR điểm danh</span>
          </button>
        )}

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto min-h-0 -mx-2 px-2">
          <nav className="flex flex-col gap-1 pb-6">
            {currentMenu.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors w-full text-left
                    ${isActive ? "bg-[#1e325c] text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={20} className={isActive ? "text-white" : "text-slate-500"} />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="w-1/4">
            <h2 className="text-xl font-bold text-slate-800">{pageTitle}</h2>
          </div>

          <div className="flex-1 flex justify-center max-w-2xl px-4">
            <div className="relative w-full max-w-xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#007082] focus:border-[#007082] sm:text-sm transition-colors"
                placeholder="Tìm kiếm sinh viên, lớp học..."
              />
            </div>
          </div>

          <div className="w-1/4 flex items-center justify-end gap-5">
            <button className="text-slate-500 hover:text-slate-700 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            </button>
            <Avatar className="h-9 w-9 border border-slate-200 cursor-pointer">
              <AvatarFallback className="bg-[#1e325c] text-white text-xs">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="flex-1 overflow-auto min-h-0 bg-slate-50">
          <div className="p-6 w-full">
            <Outlet context={{ role }} />
          </div>
        </div>
      </main>
    </div>
  )
}
