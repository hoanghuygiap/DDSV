import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Users, TrendingUp, AlertTriangle,
  ChevronRight, School, CheckCircle2, Loader2
} from "lucide-react"
import api from "@/api/axios"

interface Warning {
  id: number
  student_id: number
  course_class_id?: number
  type: string
  content: string
  processed: boolean | number
  created_at: string
  ma_sinh_vien?: string
  student_name?: string
}

interface ClassReport {
  lop_mon_hoc_id: number
  ma_lop: string
  ten_hoc_phan: string
  tong_luot_diem_danh: number
  co_mat: number
  vang: number
  ti_le_co_mat: number
}

interface SummaryStats {
  totalStudents: number
  totalClasses: number
  attendanceRate: number
  warningCount: number
}

export function AdminDashboard() {
  const [stats, setStats] = useState<SummaryStats>({
    totalStudents: 0, totalClasses: 0, attendanceRate: 0, warningCount: 0
  })
  const [warnings, setWarnings] = useState<Warning[]>([])
  const [classData, setClassData] = useState<ClassReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    Promise.allSettled([
      api.get("/students", { params: { page: 1, limit: 1 } }),
      api.get("/course-classes", { params: { page: 1, limit: 1 } }),
      api.get("/warnings"),
      api.get("/reports/by-course-class"),
    ])
    .then(([stuRes, clsRes, warnRes, reportRes]) => {
      const totalStudents = stuRes.status === "fulfilled" ? (stuRes.value.data.data?.pagination?.total ?? 0) : 0
      const totalClasses  = clsRes.status === "fulfilled" ? (clsRes.value.data.data?.pagination?.total ?? 0) : 0
      const allWarnings: Warning[] = warnRes.status === "fulfilled" ? (warnRes.value.data.data?.data ?? []) : []
      const allClasses: ClassReport[] = reportRes.status === "fulfilled" ? (reportRes.value.data.data ?? []) : []

      const totalAtt     = allClasses.reduce((s, r) => s + (Number(r.tong_luot_diem_danh) || 0), 0)
      const totalPresent = allClasses.reduce((s, r) => s + (Number(r.co_mat) || 0), 0)
      const attendanceRate = totalAtt > 0 ? Math.round(totalPresent / totalAtt * 1000) / 10 : 0
      const warningCount = allWarnings.filter(w => !w.processed).length

      setStats({ totalStudents, totalClasses, attendanceRate, warningCount })
      setWarnings(allWarnings.filter(w => !w.processed).slice(0, 4))
      setClassData(allClasses)
    })
    .finally(() => {
      setIsLoading(false)
      setTimeout(() => setAnimate(true), 100)
    })
  }, [])

  const topAbsentClasses = [...classData]
    .filter(r => Number(r.tong_luot_diem_danh) > 0)
    .map(r => ({
      ...r,
      absenceRate: Math.round(Number(r.vang) / Number(r.tong_luot_diem_danh) * 1000) / 10
    }))
    .sort((a, b) => b.absenceRate - a.absenceRate)
    .slice(0, 5)

  if (isLoading) return (
    <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
      <Loader2 size={20} className="animate-spin" />
      <span className="text-sm">Đang tải dữ liệu...</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 w-full pb-8">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-medium text-slate-800">Tổng quan hệ thống</h1>
          <p className="text-sm text-slate-500 mt-0.5">Dữ liệu học tập và chuyên cần toàn trường</p>
        </div>
        <Link
          to="/dashboard/students"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#185FA5] hover:bg-[#1254a0] text-white text-sm font-medium rounded-md transition-colors"
        >
          <Users size={15} />
          <span>Quản lý sinh viên</span>
        </Link>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng sinh viên</span>
            <div className="p-2 rounded-lg bg-[#185FA5]/8 text-[#185FA5]"><Users size={16} /></div>
          </div>
          <p className="text-2xl font-medium text-slate-800">{stats.totalStudents.toLocaleString("vi-VN")}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Lớp môn học</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><School size={16} /></div>
          </div>
          <p className="text-2xl font-medium text-slate-800">{stats.totalClasses.toLocaleString("vi-VN")}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tỷ lệ chuyên cần</span>
            <div className="p-2 rounded-lg bg-green-50 text-green-600"><CheckCircle2 size={16} /></div>
          </div>
          <p className="text-2xl font-medium text-green-700">{stats.attendanceRate.toFixed(1)}%</p>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-700 ease-out"
              style={{ width: animate ? `${stats.attendanceRate}%` : "0%" }}
            />
          </div>
        </div>

        <div className="bg-white border border-l-4 border-red-200 border-l-red-500 rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Cảnh báo vắng</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-500"><AlertTriangle size={16} /></div>
          </div>
          <p className="text-2xl font-medium text-red-600">{stats.warningCount}</p>
          <p className="text-xs text-slate-400">Cảnh báo chưa xử lý</p>
        </div>

      </div>

      {/* MIDDLE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Bar chart - top vắng */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-medium text-slate-800">Top lớp vắng nhiều nhất</h3>
              <p className="text-xs text-slate-400 mt-0.5">Theo tỷ lệ vắng</p>
            </div>
            <Link to="/dashboard/reports"
              className="text-xs text-[#185FA5] hover:underline flex items-center gap-0.5 font-medium">
              Xem báo cáo <ChevronRight size={13} />
            </Link>
          </div>

          {topAbsentClasses.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
              Chưa có dữ liệu điểm danh
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {topAbsentClasses.map((cls, idx) => (
                <div key={cls.lop_mon_hoc_id} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-medium flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-700 truncate">{cls.ten_hoc_phan}</span>
                      <span className={`text-xs font-medium ml-2 shrink-0 ${cls.absenceRate >= 25 ? "text-red-600" : cls.absenceRate >= 15 ? "text-orange-500" : "text-slate-500"}`}>
                        {cls.absenceRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${cls.absenceRate >= 25 ? "bg-red-500" : cls.absenceRate >= 15 ? "bg-orange-400" : "bg-green-500"}`}
                        style={{ width: animate ? `${Math.min(cls.absenceRate, 100)}%` : "0%" }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">{cls.ma_lop}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Warnings panel */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-red-500" />
              <h3 className="text-sm font-medium text-slate-800">Cảnh báo chưa xử lý</h3>
            </div>
            {stats.warningCount > 0 && (
              <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium">
                {stats.warningCount}
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col divide-y divide-slate-100">
            {warnings.length === 0 ? (
              <div className="flex-1 flex items-center justify-center py-10 text-slate-400 text-sm">
                Không có cảnh báo
              </div>
            ) : (
              warnings.map((w) => {
                const name = w.student_name ?? `SV #${w.student_id}`
                const initials = name.split(" ").slice(-2).map((x: string) => x[0]).join("").toUpperCase()
                return (
                  <div key={w.id} className="px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center text-xs font-medium text-red-600 shrink-0">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">{w.content}</p>
                    </div>
                    <span className="shrink-0 px-2 py-0.5 bg-red-50 text-red-600 text-[11px] font-medium rounded">
                      {w.type}
                    </span>
                  </div>
                )
              })
            )}
          </div>

          <div className="p-3 border-t border-slate-100">
            <Link to="/dashboard/reports"
              className="flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-medium rounded-md transition-colors">
              Xem tất cả <ChevronRight size={13} />
            </Link>
          </div>
        </div>

      </div>

      {/* QUICK LINKS */}
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Truy cập nhanh</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: "/dashboard/students", label: "Sinh viên",    icon: Users,       color: "text-[#185FA5] bg-[#185FA5]/8" },
            { to: "/dashboard/classes",  label: "Lớp học",      icon: School,      color: "text-blue-600 bg-blue-50" },
            { to: "/dashboard/reports",  label: "Báo cáo",      icon: TrendingUp,  color: "text-green-600 bg-green-50" },
            { to: "/dashboard/profile",  label: "Tài khoản",    icon: Users,       color: "text-slate-600 bg-slate-100" },
          ].map((item) => (
            <Link
              key={item.to} to={item.to}
              className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-[#185FA5]/30 hover:shadow-sm transition-all group"
            >
              <div className={`p-2 rounded-lg ${item.color} shrink-0`}>
                <item.icon size={15} />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-[#185FA5] transition-colors">
                {item.label}
              </span>
              <ChevronRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" />
            </Link>
          ))}
        </div>
      </div>

    </div>
  )
}
