import { useEffect, useState } from "react"
import {
  Users,
  MapPin,
  BookOpen,
  Calendar,
  ChevronRight,
  QrCode,
  BarChart3,
  Search,
  Clock,
  Loader2
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { LecturerService } from "@/services/lecturer.service"

const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
}

export function LecturerDashboard() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<any[]>([])
  const [schedule, setSchedule] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!user) return
    let active = true
    const fetchData = async () => {
      try {
        const allLecturers = await LecturerService.getAll()
        const me = allLecturers.find((l: any) => l.username === user.username)
        if (!me) throw new Error("Lecturer not found")

        const [clsData, schData] = await Promise.all([
          LecturerService.getCourseClasses(me.id),
          LecturerService.getSchedule(me.id)
        ])

        if (active) {
          setClasses(clsData || [])

          const sorted = [...(schData || [])].sort((a, b) => {
            const dtA = new Date(`${a.ngay_hoc.split("T")[0]}T${a.gio_bat_dau}`)
            const dtB = new Date(`${b.ngay_hoc.split("T")[0]}T${b.gio_bat_dau}`)
            return dtA.getTime() - dtB.getTime()
          })
          setSchedule(sorted)
          setLoading(false)
        }
      } catch (err) {
        if (active) {
          console.error(err)
          setLoading(false)
        }
      }
    }
    fetchData()
    return () => { active = false }
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-[#00a8cc]" size={40} />
      </div>
    )
  }

  const now = new Date()
  const nextClass = schedule.find(s => {
    const dt = new Date(`${s.ngay_hoc.split("T")[0]}T${s.gio_bat_dau}`)
    return dt >= now
  })

  const recentHistory = schedule
    .filter(s => new Date(`${s.ngay_hoc.split("T")[0]}T${s.gio_bat_dau}`) < now)
    .reverse()
    .slice(0, 3)

  const filteredClasses = classes.filter(c =>
    (c.ma_lop || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.ten_hoc_phan || "").toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4)

  return (
    <div className="flex flex-col gap-8 w-full pb-10">

      {/* HERO / HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-[#00a8cc] font-bold text-sm uppercase tracking-[0.2em] mb-2">
            <div className="w-8 h-[2px] bg-[#00a8cc]"></div>
            Đại học Bách Khoa
          </div>
          <h1 className="text-4xl font-black text-[#1a3a5f] tracking-tight mb-2">
            Tổng quan giảng dạy
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Quản lý các lớp học bạn đang phụ trách giảng dạy trong học kỳ này.
            Theo dõi chuyên cần và thực hiện điểm danh QR thời gian thực.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden lg:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã lớp, môn học..."
              className="pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#00a8cc] focus:ring-4 focus:ring-[#00a8cc]/10 w-64 transition-all"
            />
          </div>
          <Link to={nextClass?.buoi_hoc_id ? `/dashboard/qr-attendance?sessionId=${nextClass.buoi_hoc_id}` : "#"} className="flex items-center gap-2 bg-[#00a8cc] hover:bg-[#008ba8] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-[#00a8cc]/20 hover:-translate-y-0.5 active:translate-y-0">
            <QrCode size={18} />
            <span>Điểm danh ngay</span>
          </Link>
        </div>
      </div>

      {/* CLASS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {filteredClasses.length > 0 ? filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-[#00a8cc]/30 transition-all group flex flex-col sm:flex-row gap-6 relative overflow-hidden">
            {/* Background accent */}
            <div className="absolute right-0 top-0 w-24 h-24 bg-[#00a8cc]/5 rounded-bl-full transform translate-x-12 -translate-y-12 transition-all group-hover:scale-150"></div>

            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#1a3a5f] flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-[#00a8cc] group-hover:text-white transition-colors duration-300">
              <BookOpen size={28} />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-black text-[#1a3a5f] group-hover:text-[#00a8cc] transition-colors">
                    {cls.ten_hoc_phan}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100">
                    {cls.ma_lop}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-bold mb-6 flex items-center gap-1">
                  Học kỳ {cls.ten_ky} • {cls.so_tin_chi} Tín chỉ
                </p>

                <div className="grid grid-cols-3 gap-4 mb-2">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Đăng ký</span>
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <Users size={14} className="text-[#00a8cc]" />
                      {cls.si_so || 0} SV
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Đã dạy</span>
                    <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#00a8cc]" />
                      {cls.tong_buoi_da_day || 0} Buổi
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Có mặt TB</span>
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                      <BarChart3 size={14} />
                      {cls.ty_le_co_mat_tb ? parseFloat(cls.ty_le_co_mat_tb).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-200"></div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">+{Math.max(0, (cls.si_so || 0) - 3)}</span>
                </div>
                <Link to={`/dashboard/my-classes/${cls.id}`} className="text-xs font-black text-[#00a8cc] flex items-center gap-1 hover:gap-2 transition-all uppercase tracking-wider">
                  Chi tiết lớp học <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-2 text-center text-slate-400 py-10 border border-dashed border-slate-200 rounded-xl">
            Không có lớp học nào khớp với tìm kiếm.
          </div>
        )}
      </div>

      {/* RECENT HISTORY & SCHEDULE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* RECENT HISTORY */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#1a3a5f]">Lịch sử hoàn thành gần đây</h2>
            <Link to="/dashboard/attendance-history" className="text-sm font-bold text-slate-500 hover:text-[#00a8cc]">Xem tất cả</Link>
          </div>

          <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-50">
              {recentHistory.length > 0 ? recentHistory.map((item, idx) => (
                <div key={idx} className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{item.ten_hoc_phan} ({item.ma_lop})</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {formatDate(item.ngay_hoc)} - {item.gio_bat_dau?.slice(0, 5)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">Đã kết thúc</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </div>
              )) : (
                <div className="p-10 text-center text-slate-400 text-sm">Chưa có lịch sử buổi học nào.</div>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR WIDGET */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <h2 className="text-2xl font-black text-[#1a3a5f]">Lịch dạy tiếp theo</h2>
          <div className="bg-gradient-to-br from-[#1a3a5f] to-[#2a4d7a] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
              <Calendar size={120} />
            </div>
            {nextClass ? (
              <div className="relative z-10">
                <span className="bg-white/20 text-blue-100 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 mb-4 inline-block">
                  SẮP DIỄN RA
                </span>
                <h3 className="text-xl font-bold mb-1">{nextClass.ten_hoc_phan}</h3>
                <p className="text-blue-200 font-medium mb-6">
                  {formatDate(nextClass.ngay_hoc)} • {nextClass.gio_bat_dau.slice(0, 5)} - {nextClass.gio_ket_thuc.slice(0, 5)}
                  <br />
                  <span className="text-sm mt-1 inline-block">Phòng: {nextClass.ten_phong || "Chưa xếp"}</span>
                </p>

                <div className="flex flex-col gap-4 mb-8">
                  <div className="w-full bg-white/10 rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                    <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">Mã lớp</p>
                    <p className="font-black">{nextClass.ma_lop}</p>
                  </div>
                </div>

                <Link to={`/dashboard/qr-attendance?sessionId=${nextClass.buoi_hoc_id}`} className="w-full bg-[#00a8cc] hover:bg-[#008ba8] text-white py-4 rounded-2xl font-black text-center transition-all shadow-lg inline-block">
                  CHUẨN BỊ ĐIỂM DANH
                </Link>
              </div>
            ) : (
              <div className="relative z-10 text-center py-10 opacity-70">
                <p>Không có lịch dạy sắp tới.</p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  )
}
