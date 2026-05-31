import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, QrCode, MapPin, Loader2, ChevronRight } from "lucide-react"
import api from "@/api/axios"
import { useAuth } from "@/contexts/AuthContext"

// ─── Types ────────────────────────────────────────────────────────────────────
interface DashboardSummary {
  total_sessions: number
  co_mat: number
  tre: number
  vang: number
  co_phep: number
  attendance_rate: number
}

interface UpcomingSession {
  id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  trang_thai: "sap_dien_ra" | "dang_dien_ra"
  ma_lop: string
  ten_hoc_phan: string
  ten_phong: string | null
  ten_giang_vien: string | null
}

interface Warning {
  id: number
  loai: string
  noi_dung: string
  da_xu_ly: number
  tao_luc: string
}

interface AttendanceRecord {
  id: number
  ngay_hoc: string
  gio_bat_dau: string
  ten_hoc_phan: string
  ten_phong: string | null
  trang_thai: "co_mat" | "vang" | "tre" | "co_phep"
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const todayISO = () => new Date().toISOString().split("T")[0]

function sessionDate(ngay_hoc: string) {
  return ngay_hoc.includes("T") ? ngay_hoc.split("T")[0] : ngay_hoc
}

function fmtTime(t: string) { return t?.slice(0, 5) ?? "—" }

function fmtDateShort(d: string) {
  if (!d) return "—"
  const dt = new Date(d)
  return `${dt.getDate()} Th${dt.getMonth() + 1}`
}

function greet() {
  const h = new Date().getHours()
  return h < 12 ? "Chào buổi sáng" : h < 18 ? "Chào buổi chiều" : "Chào buổi tối"
}

function todayLabel() {
  const d = new Date()
  const thu = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"][d.getDay()]
  return `${thu}, ${d.getDate()} Th${d.getMonth() + 1}`
}

// ─── Circular donut chart ─────────────────────────────────────────────────────
function DonutChart({ rate }: { rate: number }) {
  const r = 48
  const circ = 2 * Math.PI * r
  const filled = circ * (Math.min(Math.max(rate, 0), 100) / 100)

  return (
    <svg
      width="136" height="136" viewBox="0 0 136 136"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* Track */}
      <circle cx="68" cy="68" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
      {/* Progress */}
      <circle
        cx="68" cy="68" r={r}
        fill="none"
        stroke="#185FA5"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${circ - filled}`}
        transform="rotate(-90 68 68)"
      />
      {/* Center */}
      <text x="68" y="63" textAnchor="middle" fontSize="24" fontWeight="500" fill="#1e293b">
        {rate}%
      </text>
      <text x="68" y="80" textAnchor="middle" fontSize="11" fill="#94a3b8">
        Chuyên cần
      </text>
    </svg>
  )
}

// ─── Status colors (table — plain text, no pill) ──────────────────────────────
const STATUS_TXT: Record<string, { label: string; color: string }> = {
  co_mat:  { label: "Có mặt",   color: "text-green-600" },
  vang:    { label: "Vắng mặt", color: "text-red-500" },
  tre:     { label: "Đi muộn",  color: "text-amber-600" },
  co_phep: { label: "Có phép",  color: "text-blue-600" },
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading]       = useState(true)
  const [summary, setSummary]       = useState<DashboardSummary | null>(null)
  const [todaySessions, setToday]   = useState<UpcomingSession[]>([])
  const [warnings, setWarnings]     = useState<Warning[]>([])
  const [recentAtt, setRecentAtt]   = useState<AttendanceRecord[]>([])
  const [hasAtt, setHasAtt]         = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      // 1. Dashboard endpoint — tự tìm sinh_vien qua JWT
      const res  = await api.get("/dashboard/student")
      const data = res.data.data

      setSummary(data.summary ?? null)
      setWarnings((data.warnings ?? []).filter((w: Warning) => !w.da_xu_ly))

      const today = todayISO()
      setToday(
        (data.upcoming_sessions ?? [])
          .filter((s: UpcomingSession) => sessionDate(s.ngay_hoc) === today)
          .sort((a: UpcomingSession, b: UpcomingSession) =>
            a.gio_bat_dau.localeCompare(b.gio_bat_dau)
          )
      )

      // 2. Lịch sử điểm danh — tìm sinh_vien.id qua search
      try {
        const svRes = await api.get("/students", {
          params: { keyword: user?.email, limit: 20 },
        })
        const mine = (svRes.data?.data ?? []).find(
          (s: any) => s.tai_khoan_id === user?.id
        )
        if (mine) {
          const attRes = await api.get(`/attendance/student/${mine.id}`, {
            params: { limit: 5 },
          })
          setRecentAtt((attRes.data?.data ?? []).slice(0, 5))
          setHasAtt(true)
        }
      } catch { /* 403 — không có quyền */ }

    } catch (err) {
      console.error("StudentDashboard error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#185FA5]" />
      </div>
    )
  }

  const rate = Math.round(summary?.attendance_rate ?? 0)

  return (
    <div className="space-y-4 pb-8" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* ── Greeting ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-medium text-slate-800">
          {greet()},{" "}
          <span className="font-medium text-slate-800">{user?.ho_ten ?? "Sinh viên"}</span>
        </h1>
        <p className="text-sm text-slate-500 mt-0.5 font-normal">
          Tổng quan học tập và điểm danh của bạn hôm nay.
        </p>
      </div>

      {/* ── Cảnh báo chuyên cần ──────────────────────────────────────── */}
      {warnings.length > 0 && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
          <div className="shrink-0 mt-0.5 h-6 w-6 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle size={13} className="text-red-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-red-700">Cảnh báo chuyên cần</p>
            {warnings.map(w => (
              <p key={w.id} className="text-xs text-red-600 font-normal mt-0.5 leading-relaxed">
                {w.noi_dung}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* ── Two-column: Điểm danh + Lịch hôm nay ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Tổng quan Điểm danh */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-sm font-medium text-slate-700 mb-4">Tổng quan Điểm danh</p>

          {summary ? (
            <div className="flex flex-col items-center gap-4">
              {/* Donut chart */}
              <DonutChart rate={rate} />

              {/* Stats row — horizontal, below chart */}
              <div className="w-full flex items-center border border-slate-100 rounded-lg overflow-hidden">
                <div className="flex-1 flex flex-col items-center py-3">
                  <span className="text-lg font-medium text-slate-800">{summary.co_mat}</span>
                  <span className="text-xs text-slate-500 font-normal mt-0.5">Có mặt</span>
                </div>
                <div className="w-px self-stretch bg-slate-100" />
                <div className="flex-1 flex flex-col items-center py-3">
                  <span className="text-lg font-medium text-red-500">{summary.vang}</span>
                  <span className="text-xs text-slate-500 font-normal mt-0.5">Vắng mặt</span>
                </div>
                <div className="w-px self-stretch bg-slate-100" />
                <div className="flex-1 flex flex-col items-center py-3">
                  <span className="text-lg font-medium text-amber-500">{summary.tre}</span>
                  <span className="text-xs text-slate-500 font-normal mt-0.5">Đi muộn</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center text-sm text-slate-400 font-normal">
              Chưa có dữ liệu điểm danh.
            </div>
          )}
        </div>

        {/* Lịch học hôm nay */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-slate-700">Lịch học hôm nay</p>
            <span className="text-xs text-slate-400 font-normal">{todayLabel()}</span>
          </div>

          {todaySessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center text-lg">
                📅
              </div>
              <p className="text-sm text-slate-400 font-normal">Không có lịch học hôm nay</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todaySessions.map(s => {
                const ongoing = s.trang_thai === "dang_dien_ra"
                return (
                  <div key={s.id} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">

                    {/* Time column */}
                    <div className="shrink-0 w-[52px]">
                      <p className="text-sm font-medium text-slate-800 leading-tight">
                        {fmtTime(s.gio_bat_dau)}
                      </p>
                      <p className="text-xs text-slate-400 font-normal leading-tight mt-0.5">
                        {fmtTime(s.gio_ket_thuc)}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {ongoing && (
                          <span className="h-2 w-2 rounded-full bg-orange-500 shrink-0" />
                        )}
                        <p className="text-sm font-medium text-slate-800 truncate">
                          {s.ten_hoc_phan}
                        </p>
                      </div>

                      {s.ten_phong && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin size={11} className="text-slate-400 shrink-0" />
                          <span className="text-xs text-slate-500 font-normal">{s.ten_phong}</span>
                        </div>
                      )}

                      {ongoing && (
                        <button
                          onClick={() => navigate("/dashboard/scan-qr")}
                          className="mt-2 inline-flex items-center gap-1.5 bg-[#185FA5] hover:bg-[#1254a0] text-white text-xs px-3 py-1.5 rounded-md transition-colors font-normal"
                        >
                          <QrCode size={13} />
                          Quét mã Check-in
                        </button>
                      )}
                    </div>

                    {/* Status badge — right aligned */}
                    {!ongoing && (
                      <div className="shrink-0">
                        <span className="text-xs text-slate-400 font-normal bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                          Sắp diễn ra
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Lịch sử điểm danh gần đây ────────────────────────────────── */}
      {(hasAtt || warnings.length === 0) && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-700">Lịch sử điểm danh gần đây</p>
            <button
              onClick={() => navigate("/dashboard/student-reports")}
              className="flex items-center gap-0.5 text-xs text-[#185FA5] hover:underline font-normal"
            >
              Xem tất cả <ChevronRight size={13} />
            </button>
          </div>

          {!hasAtt || recentAtt.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-400 font-normal">
              Chưa có lịch sử điểm danh.
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left py-3 px-5 text-xs font-medium text-slate-500">Môn học</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-slate-500">Ngày / Giờ</th>
                  <th className="text-left py-3 px-5 text-xs font-medium text-slate-500">Phòng</th>
                  <th className="text-right py-3 px-5 text-xs font-medium text-slate-500">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAtt.map(att => {
                  const st = STATUS_TXT[att.trang_thai] ?? { label: att.trang_thai, color: "text-slate-500" }
                  return (
                    <tr key={att.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-5 text-sm text-slate-700 font-medium">
                        {att.ten_hoc_phan}
                      </td>
                      <td className="py-3 px-5 text-sm text-slate-500 font-normal">
                        {fmtDateShort(att.ngay_hoc)}
                        {att.gio_bat_dau && (
                          <span className="ml-2">{fmtTime(att.gio_bat_dau)}</span>
                        )}
                      </td>
                      <td className="py-3 px-5 text-sm text-slate-500 font-normal">
                        {att.ten_phong ?? "—"}
                      </td>
                      <td className={`py-3 px-5 text-sm font-normal text-right ${st.color}`}>
                        {st.label}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
