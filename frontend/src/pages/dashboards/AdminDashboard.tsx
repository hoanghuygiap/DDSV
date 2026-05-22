import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Users, BookOpen, TrendingUp, AlertTriangle,
  Briefcase, ChevronRight, Loader2, AlertCircle,
  CalendarCheck, School
} from "lucide-react"
import api from "@/api/axios"
import { useAuth } from "@/contexts/AuthContext"

interface Summary {
  totalStudents: number
  sessionsToday: number
  activeSessions: number
  attendanceRate: number
  warningStudents: number
}

interface MonthPoint {
  month: string
  total: number
  present: number
  rate: number
}

interface WarningClass {
  id: number
  code: string
  name: string
  className: string
  absentCount: number
  absenceRate: number
}

interface OverviewData {
  summary: Summary
  monthlyTrend: MonthPoint[]
  warningClasses: WarningClass[]
}

const VI_MONTHS: Record<string, string> = {
  "01": "Th.1", "02": "Th.2", "03": "Th.3",
  "04": "Th.4", "05": "Th.5", "06": "Th.6",
  "07": "Th.7", "08": "Th.8", "09": "Th.9",
  "10": "Th.10", "11": "Th.11", "12": "Th.12",
}

function monthLabel(ym: string) {
  const [, m] = ym.split("-")
  return VI_MONTHS[m] ?? ym
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Chào buổi sáng"
  if (h < 18) return "Chào buổi chiều"
  return "Chào buổi tối"
}

export function AdminDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState<OverviewData | null>(null)
  const [totalClasses, setTotalClasses] = useState<number | null>(null)
  const [totalLecturers, setTotalLecturers] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    Promise.all([
      api.get("/reports/overview"),
      api.get("/course-classes", { params: { page: 1, limit: 1 } }),
      api.get("/lecturers"),
    ])
      .then(([overviewRes, classRes, lecturerRes]) => {
        if (cancelled) return
        setData(overviewRes.data.data)
        setTotalClasses(classRes.data.pagination?.total ?? null)
        const lvArr = lecturerRes.data.data
        setTotalLecturers(Array.isArray(lvArr) ? lvArr.length : null)
      })
      .catch(() => {
        if (!cancelled) setError("Không thể tải dữ liệu bảng điều khiển.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 size={24} className="animate-spin" />
        <span className="text-sm font-medium">Đang tải dữ liệu...</span>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-64 gap-2 text-red-500 text-sm font-medium">
        <AlertCircle size={18} />
        {error || "Có lỗi xảy ra khi tải dữ liệu."}
      </div>
    )
  }

  const { summary, monthlyTrend, warningClasses } = data
  const chartMax = monthlyTrend.length
    ? Math.min(Math.ceil(Math.max(...monthlyTrend.map(m => m.rate), 1) / 10) * 10 + 5, 100)
    : 100

  const firstName = user?.ho_ten?.split(" ").pop() ?? "Admin"

  return (
    <div className="flex flex-col gap-6 w-full pb-10">

      {/* GREETING */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{getGreeting()},</p>
          <h1 className="text-2xl font-bold text-[#1e325c]">{firstName} 👋</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link
          to="/dashboard/reports"
          className="hidden sm:flex items-center gap-2 text-sm font-bold text-[#007082] hover:underline"
        >
          Xem báo cáo đầy đủ
          <ChevronRight size={16} />
        </Link>
      </div>

      {/* STAT CARDS — 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-[#1e325c] rounded-xl p-5 shadow-md flex flex-col justify-between min-h-[120px] relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <Users size={80} strokeWidth={1} className="text-white" />
          </div>
          <div className="flex justify-between items-start">
            <p className="text-[#8ba3cc] text-xs font-bold uppercase tracking-wider">Tổng sinh viên</p>
            <div className="p-1.5 rounded-md bg-white/10">
              <Users size={16} className="text-white" />
            </div>
          </div>
          <h2 className="text-white text-3xl font-bold mt-3">
            {summary.totalStudents.toLocaleString("vi-VN")}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Lớp môn học</p>
            <div className="p-1.5 rounded-md bg-sky-50 border border-sky-100">
              <School size={16} className="text-sky-500" />
            </div>
          </div>
          <h2 className="text-slate-800 text-3xl font-bold mt-3">
            {totalClasses != null ? totalClasses.toLocaleString("vi-VN") : "—"}
          </h2>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px]">
          <div className="flex justify-between items-start">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Tỷ lệ chuyên cần</p>
            <div className="p-1.5 rounded-md bg-emerald-50 border border-emerald-100">
              <TrendingUp size={16} className="text-emerald-500" />
            </div>
          </div>
          <div className="mt-3">
            <h2 className="text-[#007082] text-3xl font-bold">{summary.attendanceRate}%</h2>
            <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${summary.attendanceRate}%`,
                  backgroundColor: summary.attendanceRate >= 80 ? "#10b981" : summary.attendanceRate >= 60 ? "#f59e0b" : "#ef4444"
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-xl p-5 shadow-sm flex flex-col justify-between min-h-[120px] relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 opacity-[0.06]">
            <AlertTriangle size={80} strokeWidth={1.5} className="text-red-600" />
          </div>
          <div className="flex justify-between items-start">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Sinh viên cảnh báo</p>
            <div className="p-1.5 rounded-md bg-red-50 border border-red-100">
              <AlertTriangle size={16} className="text-red-500" />
            </div>
          </div>
          <h2 className="text-red-600 text-3xl font-bold mt-3">
            {summary.warningStudents.toLocaleString("vi-VN")}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Vắng trên 20% số buổi</p>
        </div>

      </div>

      {/* SECONDARY STATS — sessions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-sky-50 border border-sky-100 shrink-0">
            <CalendarCheck size={22} className="text-sky-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buổi học hôm nay</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">{summary.sessionsToday}</p>
          </div>
          {summary.activeSessions > 0 && (
            <div className="ml-auto shrink-0">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {summary.activeSessions} đang mở
              </span>
            </div>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-lg bg-violet-50 border border-violet-100 shrink-0">
            <Briefcase size={22} className="text-violet-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Giảng viên</p>
            <p className="text-2xl font-bold text-slate-800 mt-0.5">
              {totalLecturers != null ? totalLecturers.toLocaleString("vi-VN") : "—"}
            </p>
          </div>
          <Link
            to="/dashboard/lecturers"
            className="ml-auto shrink-0 flex items-center gap-1 text-xs font-bold text-[#007082] hover:underline"
          >
            Xem <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* CHART + WARNING CLASSES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Trend chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Xu hướng chuyên cần</h3>
              <p className="text-xs text-slate-500 mt-0.5">Tỷ lệ có mặt theo tháng (6 tháng gần nhất)</p>
            </div>
            <BookOpen size={18} className="text-slate-300 mt-0.5" />
          </div>

          {monthlyTrend.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm min-h-[180px]">
              Chưa có dữ liệu điểm danh
            </div>
          ) : (
            <div className="flex flex-col flex-1 min-h-[200px]">
              <div className="relative flex items-end justify-around pb-6 border-b border-slate-100" style={{ height: 200 }}>
                {/* Y-axis grid */}
                <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                  {[chartMax, Math.round(chartMax * 0.75), Math.round(chartMax * 0.5), Math.round(chartMax * 0.25)].map(v => (
                    <div key={v} className="flex items-center gap-2 w-full">
                      <span className="text-[10px] text-slate-400 w-6 text-right shrink-0">{v}%</span>
                      <div className="flex-1 h-px bg-slate-100" />
                    </div>
                  ))}
                </div>

                {/* Bars */}
                {monthlyTrend.map(m => {
                  const barH = Math.round((m.rate / chartMax) * 158)
                  const color = m.rate >= 90 ? "#007082" : m.rate >= 75 ? "#1e325c" : "#f59e0b"
                  return (
                    <div
                      key={m.month}
                      className="relative z-10 flex flex-col items-center group"
                      style={{ minWidth: 36 }}
                    >
                      <span className="absolute text-[10px] font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                        style={{ bottom: barH + 6 }}>
                        {m.rate}%
                      </span>
                      <div
                        className="w-9 md:w-12 rounded-t-sm transition-all cursor-default"
                        style={{ height: barH, backgroundColor: color }}
                        title={`${monthLabel(m.month)}: ${m.rate}%`}
                      />
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-around pt-3 text-[11px] font-semibold text-slate-500">
                {monthlyTrend.map(m => (
                  <span key={m.month} className="w-9 md:w-12 text-center">{monthLabel(m.month)}</span>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-4 text-[10px] font-medium text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#007082]" />≥ 90%</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-[#1e325c]" />75–90%</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm inline-block bg-amber-400" />{"< 75%"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Warning classes */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-red-100 bg-red-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-red-500" />
              <h3 className="font-bold text-red-700 text-sm">Lớp cảnh báo vắng cao</h3>
            </div>
            <span className="text-[10px] font-bold text-red-500 uppercase bg-red-100 px-2 py-0.5 rounded">Top 5</span>
          </div>

          <div className="flex-1 flex flex-col divide-y divide-slate-100">
            {warningClasses.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm py-8">
                Không có lớp cảnh báo
              </div>
            ) : (
              warningClasses.map(cls => (
                <div key={cls.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="font-bold text-slate-800 text-sm truncate">{cls.name}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{cls.code} • {cls.className}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <span className="font-bold text-red-600 text-base">{cls.absenceRate}%</span>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Vắng</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/50 text-center">
            <Link to="/dashboard/reports" className="text-[#007082] text-xs font-bold hover:underline">
              Xem báo cáo đầy đủ →
            </Link>
          </div>
        </div>

      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Truy cập nhanh</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/dashboard/students", icon: Users, label: "Sinh viên", color: "text-[#1e325c] bg-[#1e325c]/5 border-[#1e325c]/10" },
            { to: "/dashboard/lecturers", icon: Briefcase, label: "Giảng viên", color: "text-violet-600 bg-violet-50 border-violet-100" },
            { to: "/dashboard/classes", icon: School, label: "Lớp học", color: "text-sky-600 bg-sky-50 border-sky-100" },
            { to: "/dashboard/reports", icon: TrendingUp, label: "Báo cáo", color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-4 py-3.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className={`p-2 rounded-lg border ${item.color} shrink-0`}>
                <item.icon size={18} />
              </div>
              <span className="font-bold text-slate-700 text-sm group-hover:text-[#1e325c] transition-colors">{item.label}</span>
              <ChevronRight size={14} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
