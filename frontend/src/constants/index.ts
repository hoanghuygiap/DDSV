import {
  LayoutDashboard,
  Users,
  Calendar,
  BarChart2,
  UserCircle,
  Briefcase,
  School,
  Bell,
  QrCode,
} from "lucide-react"

export const MENU_DATA = {
  admin: [
    { id: "dashboard",     label: "Bảng điều khiển",   icon: LayoutDashboard, path: "/dashboard" },
    { id: "students",      label: "Quản lý sinh viên",  icon: Users,           path: "/dashboard/students" },
    { id: "lecturers",     label: "Quản lý giảng viên", icon: Briefcase,       path: "/dashboard/lecturers" },
    { id: "classes",       label: "Quản lý lớp học",    icon: School,          path: "/dashboard/classes" },
    { id: "schedule",      label: "Lịch học",           icon: Calendar,        path: "/dashboard/schedule" },
    { id: "reports",       label: "Báo cáo",            icon: BarChart2,       path: "/dashboard/reports" },
    { id: "notifications", label: "Thông báo",          icon: Bell,            path: "/dashboard/notifications" },
    { id: "profile",       label: "Hồ sơ",              icon: UserCircle,      path: "/dashboard/profile" },
  ],
  lecturer: [
    { id: "dashboard",     label: "Bảng điều khiển",   icon: LayoutDashboard, path: "/dashboard" },
    { id: "schedule",      label: "Thời khóa biểu",    icon: Calendar,        path: "/dashboard/lecturer-schedule" },
    { id: "my_classes",    label: "Lớp của tôi",        icon: Users,           path: "/dashboard/my-classes" },
    { id: "reports",       label: "Báo cáo",            icon: BarChart2,       path: "/dashboard/class-report" },
    { id: "profile",       label: "Hồ sơ",              icon: UserCircle,      path: "/dashboard/profile" },
  ],
  student: [
    { id: "dashboard",     label: "Bảng điều khiển",   icon: LayoutDashboard, path: "/dashboard" },
    { id: "scan_qr",       label: "Quét QR điểm danh", icon: QrCode,          path: "/dashboard/scan-qr" },
    { id: "schedule",      label: "Lịch học",           icon: Calendar,        path: "/dashboard/student-schedule" },
    { id: "reports",       label: "Báo cáo",            icon: BarChart2,       path: "/dashboard/student-reports" },
    { id: "notifications", label: "Thông báo",          icon: Bell,            path: "/dashboard/notifications" },
    { id: "profile",       label: "Hồ sơ",              icon: UserCircle,      path: "/dashboard/profile" },
  ],
}
