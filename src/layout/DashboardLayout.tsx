import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { GraduationCap, LogOut } from "lucide-react"
import { MENU_DATA } from "@/constants"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/types"

export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

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

  const avatarInitials = user?.ho_ten
    ? user.ho_ten.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
    : role === "admin" ? "AD" : role === "lecturer" ? "GV" : "SV"

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0f2d4a] flex flex-col shrink-0">

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#185FA5] shrink-0">
            <GraduationCap size={20} strokeWidth={2} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">Đại học Thăng Long</p>
            <p className="text-slate-400 text-xs mt-0.5">Quản lý học tập</p>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-[#185FA5] text-white text-xs font-medium">
                {avatarInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{user?.ho_ten || "—"}</p>
              <p className="text-slate-400 text-xs truncate">
                {role === "admin" ? "Quản trị viên" : role === "lecturer" ? "Giảng viên" : "Sinh viên"}
              </p>
            </div>
            <button onClick={handleLogout} title="Đăng xuất"
              className="text-slate-500 hover:text-red-400 transition-colors shrink-0">
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-0.5">
          {currentMenu.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === "/dashboard"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-[#185FA5] text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/8"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon size={16} className={isActive ? "text-white" : "text-slate-500"} />
                    <span className="font-medium">{item.label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">

        {/* Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-base font-medium text-slate-800">{pageTitle}</h2>
          <Avatar className="h-8 w-8 border border-slate-200 cursor-pointer">
            <AvatarFallback className="bg-[#185FA5] text-white text-xs font-medium">
              {avatarInitials}
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-0 bg-slate-50">
          <div className="p-6 w-full">
            <Outlet context={{ role }} />
          </div>
        </div>
      </main>
    </div>
  )
}
