import { Users } from "lucide-react"

export default function StudentsPage() {
  return (
    <div className="border-4 border-dashed border-slate-200 rounded-xl h-[600px] flex flex-col items-center justify-center text-slate-400 bg-white/50">
      <Users size={48} className="mb-4 opacity-50" />
      <h3 className="text-xl font-bold text-slate-600">Quản lý Sinh viên</h3>
      <p>Trang quản lý thông tin sinh viên.</p>
    </div>
  )
}
