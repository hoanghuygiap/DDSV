import { useState, ReactNode } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
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

// MENU DỮ LIỆU ĐƯỢC PHÂN THEO ROLE
const MENU_DATA = {
  admin: [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "students", label: "Quản lý sinh viên", icon: Users },
    { id: "lecturers", label: "Quản lý giảng viên", icon: Briefcase },
    { id: "classes", label: "Quản lý lớp học", icon: School },
    { id: "schedule", label: "Lịch học", icon: Calendar },
    { id: "reports", label: "Báo cáo", icon: BarChart2 },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "profile", label: "Hồ sơ", icon: UserCircle },
  ],
  lecturer: [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "new_attendance", label: "Tạo điểm danh mới", icon: ClipboardCheck },
    { id: "my_classes", label: "Lớp của tôi", icon: Users },
    { id: "teaching_schedule", label: "Lịch dạy", icon: Calendar },
    { id: "reports", label: "Báo cáo", icon: BarChart2 },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "profile", label: "Hồ sơ", icon: UserCircle },
  ],
  student: [
    { id: "dashboard", label: "Bảng điều khiển", icon: LayoutDashboard },
    { id: "scan_qr", label: "Quét QR điểm danh", icon: QrCode },
    { id: "schedule", label: "Lịch học", icon: Calendar },
    { id: "attendance", label: "Chuyên cần", icon: ClipboardList },
    { id: "notifications", label: "Thông báo", icon: Bell },
    { id: "profile", label: "Hồ sơ", icon: UserCircle },
  ]
}

type Role = "admin" | "lecturer" | "student"

export default function DashboardLayout({ children }: { children?: ReactNode }) {
  const [role, setRole] = useState<Role>("admin")
  const [activeMenu, setActiveMenu] = useState("dashboard")

  const currentMenu = MENU_DATA[role]

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
          <Tabs value={role} onValueChange={(val) => {
            setRole(val as Role)
            setActiveMenu("dashboard")
          }} className="w-full">
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
              const isActive = activeMenu === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md font-medium transition-colors w-full text-left
                    ${isActive 
                      ? "bg-[#1e325c] text-white shadow-md" 
                      : "text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <Icon size={20} className={isActive ? "text-white" : "text-slate-500"} />
                  <span>{item.label}</span>
                </button>
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
              {currentMenu.find(m => m.id === activeMenu)?.label || "Trang chủ"}
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

        {/* PAGE CONTENT */}
        <ScrollArea className="flex-1 bg-slate-50">
          <div className="p-8 max-w-7xl mx-auto h-full">
            {children ? children : (
              <div className="border-4 border-dashed border-slate-200 rounded-xl h-[600px] flex flex-col items-center justify-center text-slate-400 bg-white/50">
                <LayoutDashboard size={48} className="mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-slate-600">Phần Main (Nội dung trang)</h3>
                <p>Nội dung của trang "{currentMenu.find(m => m.id === activeMenu)?.label}" sẽ hiển thị ở đây.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  )
}
