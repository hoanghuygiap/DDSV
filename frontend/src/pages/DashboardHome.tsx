import { useOutletContext } from "react-router-dom"
import { AdminDashboard } from "@/pages/dashboards/AdminDashboard"
import { LecturerDashboard } from "@/pages/dashboards/LecturerDashboard"
import { StudentDashboard } from "@/pages/dashboards/StudentDashboard"

type Role = "admin" | "lecturer" | "student"

export default function DashboardHome() {
  const { role } = useOutletContext<{ role: Role }>()

  if (role === "admin") return <AdminDashboard />
  if (role === "lecturer") return <LecturerDashboard />
  if (role === "student") return <StudentDashboard />

  return <div>Vui lòng chọn vai trò hợp lệ.</div>
}
