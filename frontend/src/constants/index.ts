import { 
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

export const MENU_DATA = {
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
