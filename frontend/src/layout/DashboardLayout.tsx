import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  GraduationCap,
  LogOut,
  UserCircle,
  Bell,
  ChevronRight,
  Mail,
  Menu,
  X,
} from "lucide-react"
import { MENU_DATA } from "@/constants"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/types"
import { useEffect, useRef, useState } from "react"

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
    ? user.ho_ten
        .split(" ")
        .slice(-2)
        .map((w) => w[0])
        .join("")
        .toUpperCase()
    : role === "admin"
    ? "AD"
    : role === "lecturer"
    ? "GV"
    : "SV"

  const [showMenu, setShowMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate("/login", { replace: true })
  }

  return (
    <div
      className="flex h-screen bg-slate-50 overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static
          top-0 left-0 z-50
          h-full w-64
          bg-[#0f2d4a]
          flex flex-col shrink-0
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Mobile close */}
        <div className="md:hidden flex justify-end px-4 pt-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-white hover:bg-white/10"
          >
            <X size={22} />
          </button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#185FA5] shrink-0">
            <GraduationCap size={20} strokeWidth={2} className="text-white" />
          </div>
          <div>
            <p className="text-white text-sm font-medium leading-tight">
              Đại học Thăng Long
            </p>
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
              <p className="text-white text-sm font-medium truncate">
                {user?.ho_ten || "—"}
              </p>
              <p className="text-slate-400 text-xs truncate">
                {role === "admin"
                  ? "Quản trị viên"
                  : role === "lecturer"
                  ? "Giảng viên"
                  : "Sinh viên"}
              </p>
            </div>
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
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-[#185FA5] text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={16}
                      className={isActive ? "text-white" : "text-slate-500"}
                    />
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
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-3 md:px-6 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden rounded-md p-1 text-slate-700 hover:bg-slate-100"
            >
              <Menu size={22} />
            </button>

            <h2 className="text-base font-medium text-slate-800 truncate">
              {pageTitle}
            </h2>
          </div>

          {/* Avatar + dropdown */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="focus:outline-none"
            >
              <Avatar className="h-8 w-8 border-2 border-[#185FA5]/30 cursor-pointer hover:ring-2 hover:ring-[#185FA5]/40 transition-all">
                <AvatarFallback className="bg-[#185FA5] text-white text-xs font-medium">
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
            </button>

            {showMenu && (
              <div
                className="absolute right-0 top-10 z-50 w-64 max-w-[calc(100vw-24px)] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden"
                style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
              >
                {/* User info */}
                <div className="px-4 py-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarFallback className="bg-[#185FA5] text-white text-sm font-medium">
                        {avatarInitials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {user?.ho_ten || "—"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {role === "admin"
                          ? "Quản trị viên"
                          : role === "lecturer"
                          ? "Giảng viên"
                          : "Sinh viên"}
                      </p>
                    </div>
                  </div>

                  {user?.email && (
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <Mail size={12} className="text-slate-400 shrink-0" />
                      <span className="text-xs text-slate-500 truncate">
                        {user.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <button
                    onClick={() => {
                      navigate("/dashboard/profile")
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserCircle size={16} className="text-slate-400" />
                      <span className="font-normal">Hồ sơ cá nhân</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </button>

                  <button
                    onClick={() => {
                      navigate("/dashboard/notifications")
                      setShowMenu(false)
                    }}
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bell size={16} className="text-slate-400" />
                      <span className="font-normal">Thông báo</span>
                    </div>
                    <ChevronRight size={14} className="text-slate-300" />
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-slate-100 py-1.5">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={16} />
                    <span className="font-normal">Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto min-h-0 bg-slate-50">
          <div className="p-3 md:p-6 w-full max-w-full">
            <Outlet context={{ role }} />
          </div>
        </div>
      </main>
    </div>
  )
}