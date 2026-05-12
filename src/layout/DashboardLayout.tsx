import { useState } from "react"
import { NavLink, Outlet, useLocation } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  GraduationCap, 
  Plus, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  BarChart2, 
  UserCircle,
  Briefcase,
  School,
  Bell,
  ClipboardCheck,
  QrCode,
  ClipboardList
} from "lucide-react"

// MENU DỮ LIỆU ĐƯỢC PHÂN THEO ROLE VỚI ĐƯỜNG DẪN (PATH) CỤ THỂ
const MENU_DATA = {
  admin: [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard, path: "/dashboard" },
    { id: "students", label: "Quản lý sinh viên", icon: Users, path: "/dashboard/students" },
    { id: "lecturers", label: "Quản lý giảng viên", icon: Briefcase, path: "/dashboard/lecturers" },
    { id: "classes", label: "Quản lý lớp học", icon: School, path: "/dashboard/classes" },
    { id: "schedule", label: "Lịch học", icon: Calendar, path: "/dashboard/schedule" },
    { id: "reports", label: "Báo cáo", icon: BarChart2, path: "/dashboard/reports" },
    { id: "notifications", label: "Thông báo", icon: Bell, path: "/dashboard/notifications" },
    { id: "profile", label: "Hồ sơ", icon: UserCircle, path: "/dashboard/profile" },
  ],
  lecturer: [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard, path: "/dashboard" },
    { id: "new_attendance", label: "Tạo điểm danh mới", icon: ClipboardCheck, path: "/dashboard/new-attendance" },
    { id: "my_classes", label: "Lớp của tôi", icon: Users, path: "/dashboard/my-classes" },
    { id: "teaching_schedule", label: "Lịch dạy", icon: Calendar, path: "/dashboard/teaching-schedule" },
    { id: "reports", label: "Báo cáo", icon: BarChart2, path: "/dashboard/reports" },
    { id: "notifications", label: "Thông báo", icon: Bell, path: "/dashboard/notifications" },
    { id: "profile", label: "Hồ sơ", icon: UserCircle, path: "/dashboard/profile" },
  ],
  student: [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard, path: "/dashboard" },
    { id: "scan_qr", label: "Quét QR điểm danh", icon: QrCode, path: "/dashboard/scan-qr" },
    { id: "schedule", label: "Lịch học", icon: Calendar, path: "/dashboard/schedule" },
    { id: "attendance", label: "Chuyên cần", icon: ClipboardList, path: "/dashboard/attendance" },
    { id: "notifications", label: "Thông báo", icon: Bell, path: "/dashboard/notifications" },
    { id: "profile", label: "Hồ sơ", icon: UserCircle, path: "/dashboard/profile" },
  ]
}

type Role = "admin" | "lecturer" | "student"

export default function DashboardLayout() {
  const [role, setRole] = useState<Role>("admin")
  const location = useLocation()

  const currentMenu = MENU_DATA[role]
  
  // Tìm title của trang hiện tại dựa trên pathname
  const activeMenuItem = currentMenu.find(item => {
    if (item.path === "/dashboard") {
      return location.pathname === "/dashboard"
    }
    return location.pathname.startsWith(item.path)
  })
  
  const pageTitle = activeMenuItem?.label || "Bảng điều khiển"

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-[#f8f9fa] border-r border-slate-200 flex flex-col px-4 py-6 shadow-sm z-10 shrink-0">
        {/* LOGO AREA */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1e325c] text-white shrink-0">
            <GraduationCap size={24} strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-[#1e325c] font-bold text-lg leading-tight">Đại học Bách Khoa</h1>
            <p className="text-slate-500 text-xs font-medium">Hệ thống Quản lý</p>
          </div>
        </div>

        {/* ROLE TABS (For toggling UI in development) */}
        <div className="mb-6">
          <Tabs value={role} onValueChange={(val) => setRole(val as Role)} className="w-full">
            <TabsList className="grid grid-cols-3 h-auto p-1 bg-slate-200/50">
              <TabsTrigger value="admin" className="text-xs py-2 data-[state=active]:bg-[#1e325c] data-[state=active]:text-white">Admin</TabsTrigger>
              <TabsTrigger value="lecturer" className="text-xs py-2 data-[state=active]:bg-[#1e325c] data-[state=active]:text-white">GV</TabsTrigger>
              <TabsTrigger value="student" className="text-xs py-2 data-[state=active]:bg-[#1e325c] data-[state=active]:text-white">SV</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* PRIMARY ACTION BUTTON (Tùy biến theo Role) */}
        {role === "lecturer" && (
          <button className="flex items-center justify-center gap-2 w-full bg-[#007082] hover:bg-[#005c6b] text-white rounded-md py-3 px-4 font-semibold transition-colors mb-6 shadow-sm">
            <Plus size={20} />
            <span>Tạo điểm danh mới</span>
          </button>
        )}
        
        {role === "student" && (
          <button className="flex items-center justify-center gap-2 w-full bg-[#007082] hover:bg-[#005c6b] text-white rounded-md py-3 px-4 font-semibold transition-colors mb-6 shadow-sm">
            <QrCode size={20} />
            <span>Quét QR điểm danh</span>
          </button>
        )}

        {/* NAVIGATION MENU */}
        <ScrollArea className="flex-1 -mx-2 px-2">
          <nav className="flex flex-col gap-1 pb-6">
            {currentMenu.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors w-full text-left
                    ${isActive 
                      ? "bg-[#1e325c] text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
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
        </ScrollArea>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* HEADER */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {pageTitle}
            </h2>
            <p className="text-sm text-slate-500">
              Khu vực làm việc dành cho {role === 'admin' ? 'Quản trị viên' : role === 'lecturer' ? 'Giảng viên' : 'Sinh viên'}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <Avatar className="h-10 w-10 border border-slate-200">
               <AvatarImage src="https://github.com/shadcn.png" />
               <AvatarFallback className="bg-[#1e325c] text-white">
                  {role === 'admin' ? 'AD' : role === 'lecturer' ? 'GV' : 'SV'}
               </AvatarFallback>
             </Avatar>
          </div>
        </header>

        {/* PAGE CONTENT - RENDERED BY REACT ROUTER OUTLET */}
        <ScrollArea className="flex-1 bg-slate-50">
          <div className="p-8 max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
