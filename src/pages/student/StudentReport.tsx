import { useEffect, useMemo, useState } from "react"
import {
  Calendar, ChevronLeft, ChevronRight, Download,
  Filter, GraduationCap, CheckCircle2, AlertTriangle,
  Loader2, FileText, Eye,
} from "lucide-react"
import api from "@/api/axios"
import { useAuth } from "@/contexts/AuthContext"

// ─── Types ────────────────────────────────────────────────────────────────────
interface Summary {
  total_sessions: number
  co_mat: number
  tre: number
  vang: number
  co_phep: number
  attendance_rate: number
}

interface AttendanceRecord {
  id: number
  trang_thai: "co_mat" | "vang" | "tre" | "co_phep"
  ghi_chu: string | null
  ngay_hoc: string
  gio_bat_dau: string
  ten_hoc_phan: string
  ten_phong: string | null
  ten_ky?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const PAGE_SIZE = 10

function fmtDate(d: string) {
  if (!d) return "—"
  const dt = new Date(d)
  const day = String(dt.getDate()).padStart(2, "0")
  const month = String(dt.getMonth() + 1).padStart(2, "0")
  const year = dt.getFullYear()
  return `${day}/${month}/${year}`
}



function attendanceLabel(rate: number) {
  if (rate >= 90) return { text: "Tốt", cls: "bg-[#185FA5] text-white" }
  if (rate >= 75) return { text: "Khá", cls: "bg-emerald-600 text-white" }
  return { text: "Yếu", cls: "bg-red-500 text-white" }
}

const STATUS_MAP: Record<string, { label: string; badge: string }> = {
  co_mat: { label: "Có mặt", badge: "bg-emerald-50 text-emerald-700 border border-emerald-100" },
  vang: { label: "Vắng mặt", badge: "bg-red-50 text-red-600 border border-red-100" },
  tre: { label: "Đi muộn", badge: "bg-orange-50 text-orange-600 border border-orange-100" },
  co_phep: { label: "Có phép", badge: "bg-sky-50 text-sky-600 border border-sky-100" },
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentReport() {
  const { user } = useAuth()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [summary, setSummary] = useState<Summary | null>(null)
  const [records, setRecords] = useState<AttendanceRecord[]>([])

  // filters
  const [termFilter, setTerm] = useState("all")
  const [subjectFilter, setSubj] = useState("all")
  const [applied, setApplied] = useState({ term: "all", subject: "all" })

  // pagination
  const [page, setPage] = useState(1)

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError("")
    try {
      // 1. Dashboard → summary + sinh_vien_id
      const dash = await api.get("/dashboard/student")
      const dashData = dash.data.data
      setSummary(dashData?.summary ?? null)

      const sinhVienId: number | undefined = dashData?.sinh_vien_id
      if (!sinhVienId) return

      // 2. Lấy lịch sử điểm danh (tối đa 200 bản ghi)
      const att = await api.get(`/attendance/student/${sinhVienId}`, {
        params: { limit: 200, page: 1 },
      })
      setRecords(att.data?.data?.data ?? [])
    } catch {
      setError("Không thể tải dữ liệu điểm danh. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  // ── Derived filter options ─────────────────────────────────────────────────
  const terms = useMemo(() => {
    const set = new Set(records.map(r => r.ten_ky).filter(Boolean) as string[])
    return Array.from(set).sort().reverse()
  }, [records])

  const subjects = useMemo(() => {
    const set = new Set(records.map(r => r.ten_hoc_phan).filter(Boolean))
    return Array.from(set).sort()
  }, [records])

  // ── Filtered + paginated records ───────────────────────────────────────────
  const filtered = useMemo(() => {
    return records.filter(r => {
      const okTerm = applied.term === "all" || r.ten_ky === applied.term
      const okSubject = applied.subject === "all" || r.ten_hoc_phan === applied.subject
      return okTerm && okSubject
    })
  }, [records, applied])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function applyFilter() {
    setApplied({ term: termFilter, subject: subjectFilter })
    setPage(1)
  }

  // ── Export PDF ─────────────────────────────────────────────────────────────
  function exportPDF() { window.print() }

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={28} className="animate-spin text-[#185FA5]" />
      </div>
    )
  }

  const rate = Math.round(summary?.attendance_rate ?? 0)
  const rateLabel = attendanceLabel(rate)
  const totalAbs = (summary?.vang ?? 0)
  const totalLate = (summary?.tre ?? 0)

  return (
    <div
      className="flex flex-col gap-5 w-full pb-10"
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    >
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-medium text-slate-800">Lịch sử điểm danh</h1>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-normal mt-0.5">
            <Calendar size={14} />
            <span>{user?.ho_ten ?? "Sinh viên"}</span>
          </div>
        </div>
        <button
          onClick={exportPDF}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Download size={16} />
          Xuất PDF
        </button>
      </div>

      {/* ── Error ───────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      {/* ── Stat cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total sessions */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <GraduationCap size={22} className="text-[#185FA5]" />
          </div>
          <div>
            <p className="text-xs font-normal text-slate-500 mb-0.5">Tổng số buổi học</p>
            <p className="text-3xl font-medium text-slate-800">{summary?.total_sessions ?? 0}</p>
          </div>
        </div>

        {/* Attendance rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-cyan-50 flex items-center justify-center shrink-0">
            <CheckCircle2 size={22} className="text-cyan-600" />
          </div>
          <div>
            <p className="text-xs font-normal text-slate-500 mb-0.5">Tỷ lệ chuyên cần</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-medium text-cyan-600">{rate}%</p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${rateLabel.cls}`}>
                {rateLabel.text}
              </span>
            </div>
          </div>
        </div>

        {/* Absent / Late */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle size={22} className="text-red-500" />
          </div>
          <div>
            <p className="text-xs font-normal text-slate-500 mb-0.5">Vắng mặt / Đi muộn</p>
            <p className="text-3xl font-medium text-slate-800">
              <span className="text-red-500">{totalAbs}</span>
              <span className="text-slate-400 text-2xl mx-1">/</span>
              {totalLate}
            </p>
          </div>
        </div>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          {/* Học kỳ */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">
              Học kỳ
            </label>
            <select
              value={termFilter}
              onChange={e => setTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-shadow"
            >
              <option value="all">Tất cả các học kỳ</option>
              {terms.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="md:col-span-2">
            <label className="block text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-1.5">
              Môn học
            </label>
            <select
              value={subjectFilter}
              onChange={e => setSubj(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm font-normal text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] transition-shadow"
            >
              <option value="all">Tất cả môn học</option>
              {subjects.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Apply */}
          <div>
            <button
              onClick={applyFilter}
              className="w-full flex items-center justify-center gap-2 bg-[#185FA5] hover:bg-[#1254a0] text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
            >
              <Filter size={15} />
              Lọc kết quả
            </button>
          </div>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="py-3 px-5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">Ngày</th>
                <th className="py-3 px-5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">Môn học</th>
                <th className="py-3 px-5 text-left text-xs font-medium text-slate-500 whitespace-nowrap">Phòng</th>
                <th className="py-3 px-5 text-center text-xs font-medium text-slate-500 whitespace-nowrap">Trạng thái</th>
                <th className="py-3 px-5 text-center text-xs font-medium text-slate-500 whitespace-nowrap">Minh chứng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-slate-400 font-normal">
                    Không có dữ liệu điểm danh.
                  </td>
                </tr>
              ) : paged.map(r => {
                const st = STATUS_MAP[r.trang_thai] ?? { label: r.trang_thai, badge: "bg-slate-100 text-slate-600" }
                return (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Ngày */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm font-normal">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        {fmtDate(r.ngay_hoc)}
                      </div>
                    </td>

                    {/* Môn học */}
                    <td className="py-3.5 px-5 text-sm font-medium text-slate-800 max-w-[200px]">
                      <span className="line-clamp-2">{r.ten_hoc_phan}</span>
                    </td>

                    {/* Phòng */}
                    <td className="py-3.5 px-5 text-sm font-normal text-slate-500 whitespace-nowrap">
                      {r.ten_phong ?? "—"}
                    </td>

                    {/* Trạng thái */}
                    <td className="py-3.5 px-5">
                      <div className="flex justify-center">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${st.badge}`}>
                          {st.label}
                        </span>
                      </div>
                    </td>

                    {/* Minh chứng */}
                    <td className="py-3.5 px-5">
                      <div className="flex justify-center">
                        {r.trang_thai === "vang" ? (
                          <button className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-normal transition-colors">
                            <FileText size={12} />
                            Nộp phép
                          </button>
                        ) : r.trang_thai === "tre" && r.ghi_chu ? (
                          <button
                            title={r.ghi_chu}
                            className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-normal transition-colors"
                          >
                            <Eye size={12} />
                            Xem lý do
                          </button>
                        ) : (
                          <span className="text-slate-300 text-sm">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ──────────────────────────────────────────────── */}
        <div className="px-5 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-slate-400 font-normal">
            Hiển thị {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1} -{" "}
            {Math.min(page * PAGE_SIZE, filtered.length)} trong số {filtered.length} mục
          </p>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "…")[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push("…")
                acc.push(p)
                return acc
              }, [])
              .map((p, i) =>
                p === "…" ? (
                  <span key={`dot-${i}`} className="px-1 text-slate-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`h-8 w-8 rounded-md text-sm font-medium transition-colors ${page === p
                        ? "bg-[#185FA5] text-white"
                        : "text-slate-500 hover:bg-slate-50 border border-slate-200"
                      }`}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-md border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
