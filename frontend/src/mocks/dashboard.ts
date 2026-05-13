import { 
  AlertTriangle, 
  CalendarCheck, 
  UserPlus, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertOctagon, 
  Bell 
} from "lucide-react"
import { ActivityItem } from "@/types"

export const adminWarningStudents: ActivityItem[] = [
  {
    id: "1",
    title: "Nguyễn Văn A - 20210001",
    description: "Nghỉ 4/15 buổi - Lập trình Web",
    time: "Hôm nay",
    icon: AlertTriangle,
    status: "danger"
  },
  {
    id: "2",
    title: "Trần Thị B - 20210002",
    description: "Nghỉ 3/15 buổi - Cơ sở dữ liệu",
    time: "Hôm qua",
    icon: AlertTriangle,
    status: "warning"
  },
  {
    id: "3",
    title: "Lê Văn C - 20210003",
    description: "Nghỉ 4/15 buổi - Cấu trúc dữ liệu",
    time: "2 ngày trước",
    icon: AlertTriangle,
    status: "danger"
  }
]

export const adminRecentActivities: ActivityItem[] = [
  {
    id: "1",
    title: "TS. Nguyễn Huy Hoàng",
    description: "Đã cập nhật điểm danh lớp IT4040",
    time: "10 phút trước",
    icon: CalendarCheck,
    iconBgColor: "bg-[#007082]/10",
    iconColor: "text-[#007082]"
  },
  {
    id: "2",
    title: "Admin",
    description: "Tạo mới tài khoản giảng viên",
    time: "1 giờ trước",
    icon: UserPlus,
    iconBgColor: "bg-[#1e325c]/10",
    iconColor: "text-[#1e325c]"
  },
  {
    id: "3",
    title: "Hệ thống",
    description: "Đồng bộ dữ liệu học kỳ 2024.1 hoàn tất",
    time: "3 giờ trước",
    icon: Settings,
    iconBgColor: "bg-slate-200",
    iconColor: "text-slate-700"
  }
]

export const lecturerCheckinActivities: ActivityItem[] = [
  {
    id: "1",
    title: "Phạm Quang D",
    description: "20210004 - Lập trình Web (IT4040)",
    time: "Vừa xong",
    icon: CheckCircle,
    status: "success"
  },
  {
    id: "2",
    title: "Nguyễn Thị E",
    description: "20210005 - Lập trình Web (IT4040)",
    time: "1 phút trước",
    icon: CheckCircle,
    status: "success"
  },
  {
    id: "3",
    title: "Lê Hữu F",
    description: "20210006 - Cơ sở dữ liệu (IT3030)",
    time: "2 giờ trước",
    icon: XCircle,
    status: "danger"
  }
]

export const studentScheduleItems = [
  {
    course: "Lập trình Web (IT4040)",
    time: "08:00 - 10:15",
    room: "D3-101",
    status: "Tới giờ điểm danh",
    statusColor: "bg-[#007082] text-white"
  },
  {
    course: "Cơ sở dữ liệu (IT3030)",
    time: "13:00 - 15:15",
    room: "D3-102",
    status: "Sắp diễn ra",
    statusColor: "bg-slate-200 text-slate-700"
  }
]

export const studentNotifications: ActivityItem[] = [
  {
    id: "1",
    title: "Cảnh báo vắng học",
    description: "Bạn đã vắng 3/15 buổi môn Cơ sở dữ liệu. Vắng thêm 1 buổi sẽ bị cấm thi.",
    time: "Hôm qua",
    icon: AlertOctagon,
    status: "danger"
  },
  {
    id: "2",
    title: "Nhắc nhở học phí",
    description: "Vui lòng hoàn thành học phí trước 15/06/2026",
    time: "3 ngày trước",
    icon: Bell,
    status: "warning"
  }
]
