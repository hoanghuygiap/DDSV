import { useEffect, useState } from "react"
import {
  Users, BookOpen, BarChart3, QrCode,
  ChevronRight, Clock, Calendar, Loader2, MapPin
} from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { LecturerService } from "@/services/lecturer.service"

const formatDate = (dateStr: string) => {
  if (!dateStr) return ""
  return new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
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
      <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-sm">Đang tải dữ liệu...</span>
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

  const totalStudents = classes.reduce((s, c) => s + (Number(c.si_so) || 0), 0)
  const avgAttend = classes.length > 0
    ? classes.reduce((s, c) => s + (Number(c.ty_le_co_mat_tb) || 0), 0) / classes.length
    : 0

  return (
    <div className="flex flex-col gap-6 w-full pb-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-medium text-slate-800">Tổng quan giảng dạy</h1>
          <p className="text-sm text-slate-500 mt-0.5">Quản lý các lớp học bạn đang phụ trách trong học kỳ này.</p>
        </div>
        <Link
          to={nextClass?.buoi_hoc_id ? `/dashboard/qr-attendance?sessionId=${nextClass.buoi_hoc_id}` : "#"}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#185FA5] hover:bg-[#1254a0] text-white text-sm font-medium rounded-md transition-colors"
        >
          <QrCode size={15} />
          <span>Điểm danh ngay</span>
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng lớp phụ trách</span>
            <div className="p-2 rounded-lg bg-[#185FA5]/8 text-[#185FA5]"><BookOpen size={16} /></div>
          </div>
          <p className="text-2xl font-medium text-slate-800">{classes.length}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng sinh viên</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Users size={16} /></div>
          </div>
          <p className="text-2xl font-medium text-slate-800">{totalStudents.toLocaleString("vi-VN")}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Chuyên cần TB</span>
            <div className="p-2 rounded-lg bg-green-50 text-green-600"><BarChart3 size={16} /></div>
          </div>
          <p className="text-2xl font-medium text-green-700">{avgAttend.toFixed(1)}%</p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Class list */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-medium text-slate-800">Lớp học phần</h2>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm mã lớp, môn học..."
              className="pl-3 pr-3 py-1.5 border border-slate-200 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#185FA5] focus:border-[#185FA5] w-52"
            />
          </div>

          {filteredClasses.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-xl flex items-center justify-center py-16 text-slate-400 text-sm">
              Không có lớp học phù hợp.
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredClasses.map((cls) => (
                <div key={cls.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:border-[#185FA5]/30 hover:shadow-sm transition-all flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-[#185FA5]/8 text-[#185FA5] flex items-center justify-center shrink-0">
                      <BookOpen size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-slate-800 truncate">{cls.ten_hoc_phan}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{cls.ma_lop} &bull; {cls.ten_ky}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400">Có mặt TB</p>
                      <p className="text-sm font-medium text-green-700">
                        {cls.ty_le_co_mat_tb ? parseFloat(cls.ty_le_co_mat_tb).toFixed(1) : 0}%
                      </p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-slate-400">Sinh viên</p>
                      <p className="text-sm font-medium text-slate-700 flex items-center gap-1">
                        <Users size={12} className="text-slate-400" />{cls.si_so || 0}
                      </p>
                    </div>
                    <Link
                      to={`/dashboard/my-classes/${cls.id}`}
                      className="flex items-center gap-1 text-xs font-medium text-[#185FA5] hover:underline"
                    >
                      Chi tiết <ChevronRight size={13} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link to="/dashboard/my-classes" className="text-xs text-[#185FA5] hover:underline flex items-center gap-0.5 font-medium">
            Xem tất cả lớp học <ChevronRight size={13} />
          </Link>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">

          {/* Next class */}
          <div className="bg-[#185FA5] rounded-xl p-5 text-white">
            <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-3">Buổi học tiếp theo</p>
            {nextClass ? (
              <>
                <p className="font-medium text-white mb-1">{nextClass.ten_hoc_phan}</p>
                <p className="text-blue-200 text-sm mb-1">{nextClass.ma_lop}</p>
                <div className="flex items-center gap-1.5 text-blue-100 text-xs mt-3">
                  <Calendar size={12} />
                  <span>{formatDate(nextClass.ngay_hoc)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-100 text-xs mt-1">
                  <Clock size={12} />
                  <span>{nextClass.gio_bat_dau?.slice(0, 5)} – {nextClass.gio_ket_thuc?.slice(0, 5)}</span>
                </div>
                {nextClass.ten_phong && (
                  <div className="flex items-center gap-1.5 text-blue-100 text-xs mt-1">
                    <MapPin size={12} />
                    <span>Phòng: {nextClass.ten_phong}</span>
                  </div>
                )}
                <Link
                  to={`/dashboard/qr-attendance?sessionId=${nextClass.buoi_hoc_id}`}
                  className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-white/15 hover:bg-white/25 text-white text-sm font-medium rounded-md transition-colors"
                >
                  <QrCode size={15} /> Chuẩn bị điểm danh
                </Link>
              </>
            ) : (
              <p className="text-blue-200 text-sm">Không có lịch dạy sắp tới.</p>
            )}
          </div>

          {/* Recent history */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <h3 className="text-sm font-medium text-slate-800">Lịch sử gần đây</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {recentHistory.length === 0 ? (
                <div className="px-4 py-8 text-center text-slate-400 text-sm">
                  Chưa có lịch sử buổi học.
                </div>
              ) : (
                recentHistory.map((item, idx) => (
                  <div key={idx} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                      <Clock size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 truncate">{item.ten_hoc_phan}</p>
                      <p className="text-xs text-slate-400">
                        {formatDate(item.ngay_hoc)} &bull; {item.gio_bat_dau?.slice(0, 5)}
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">Đã xong</span>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-slate-100">
              <Link
                to="/dashboard/attendance-history"
                className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-md transition-colors"
              >
                Xem tất cả <ChevronRight size={13} />
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  )
}
