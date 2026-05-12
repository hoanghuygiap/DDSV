import { LayoutDashboard } from "lucide-react"

export default function DashboardHome() {
  return (
    <div className="border-4 border-dashed border-slate-200 rounded-xl h-[600px] flex flex-col items-center justify-center text-slate-400 bg-white/50">
      <LayoutDashboard size={48} className="mb-4 opacity-50" />
      <h3 className="text-xl font-bold text-slate-600">Bảng điều khiển</h3>
      <p>Chào mừng bạn đến với hệ thống quản lý chuyên cần thông minh UniCheck.</p>
    </div>
  )
}
