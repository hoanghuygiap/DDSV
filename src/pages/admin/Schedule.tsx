import { useEffect, useState } from "react"
import {
  Calendar, Clock, MapPin, Loader2,
  ChevronLeft, ChevronRight, Radio,
  ChevronsLeft, ChevronsRight,
} from "lucide-react"
import api from "@/api/axios"

interface Session {
  id: number
  lop_mon_hoc_id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  phong_hoc_id: number | null
  trang_thai: "sap_dien_ra" | "dang_dien_ra" | "da_ket_thuc" | "huy"
  diem_danh_mo: boolean
  ma_lop: string
  ten_hoc_phan: string | null
  ten_phong: string | null
}

interface Pagination {
  total: number; page: number; limit: number; totalPages: number
}

type FilterMode = "all" | "day" | "week"

const PAGE_SIZE = 50

const STATUS_MAP: Record<string, { label: string; cls: string; dot: string }> = {
  sap_dien_ra:  { label: "Sắp diễn ra",  cls: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  dang_dien_ra: { label: "Đang diễn ra", cls: "bg-blue-50 text-blue-600 border border-blue-100", dot: "bg-blue-500 animate-pulse" },
  da_ket_thuc:  { label: "Đã kết thúc",  cls: "bg-emerald-50 text-emerald-600 border border-emerald-100", dot: "bg-emerald-500" },
  huy:          { label: "Đã hủy",       cls: "bg-red-50 text-red-500 border border-red-100", dot: "bg-red-400" },
}

// ─── helpers ─────────────────────────────────────────────────────────────────
function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function getMonday(d: Date) {
  const r = new Date(d); const dow = r.getDay()
  r.setDate(r.getDate() - (dow === 0 ? 6 : dow - 1)); r.setHours(0, 0, 0, 0); return r
}

function addDays(d: Date, n: number) {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

// Phân tích ngày học từ backend an toàn (tránh lệch timezone)
function parseSessionDate(ngay_hoc: string): string {
  // ngay_hoc có thể là "2026-05-17T00:00:00.000Z" (Date object serialized) hoặc "2026-05-17"
  if (ngay_hoc.length === 10) return ngay_hoc // đã là YYYY-MM-DD
  // Nếu là ISO string, lấy phần ngày theo local time
  const d = new Date(ngay_hoc)
  return toIso(d)
}

function fmtDisplay(iso: string) {
  // Parse với giờ 00:00 local để tránh off-by-one
  const [y, m, day] = iso.split("-").map(Number)
  const d = new Date(y, m - 1, day)
  const days = ["CN", "Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7"]
  return `${days[d.getDay()]}, ${String(day).padStart(2, "0")}/${String(m).padStart(2, "0")}`
}

function fmtFull(iso: string) {
  const [y, m, d] = iso.split("-")
  return `${d}/${m}/${y}`
}

function formatTime(t: string) { return t ? t.slice(0, 5) : "—" }

const DAY_NAMES = ["Th 2", "Th 3", "Th 4", "Th 5", "Th 6", "Th 7", "CN"]

// ─── Component ────────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [sessions, setSessions]   = useState<Session[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 })
  const [page, setPage]           = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState("")

  const [filterMode, setFilterMode] = useState<FilterMode>("all")
  const [selectedDay, setSelectedDay] = useState<string>(toIso(new Date()))
  const [weekStart, setWeekStart] = useState<Date>(() => getMonday(new Date()))

  // ── Single fetch effect ──────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    const params: Record<string, unknown> = { page, limit: PAGE_SIZE }
    if (filterMode === "day") {
      params.date_from = selectedDay
      params.date_to   = selectedDay
    } else if (filterMode === "week") {
      params.date_from = toIso(weekStart)
      params.date_to   = toIso(addDays(weekStart, 6))
    }

    setIsLoading(true)
    setError("")

    api.get("/sessions", { params })
      .then((res) => {
        if (cancelled) return
        setSessions(res.data.data ?? [])
        setPagination(res.data.pagination ?? { total: 0, page, limit: PAGE_SIZE, totalPages: 1 })
      })
      .catch(() => { if (!cancelled) setError("Không thể tải lịch học. Vui lòng thử lại.") })
      .finally(() => { if (!cancelled) setIsLoading(false) })

    return () => { cancelled = true }
  }, [page, filterMode, selectedDay, weekStart])

  // ── Filter action helpers (batch state updates trong cùng event) ─────────
  const setFilter = (mode: FilterMode) => { setFilterMode(mode); setPage(1) }
  const setDay    = (iso: string)        => { setSelectedDay(iso); setPage(1) }
  const setWeek   = (d: Date)            => { setWeekStart(d); setPage(1) }

  // ── Derived ──────────────────────────────────────────────────────────────
  const byDate = sessions.reduce<Record<string, Session[]>>((acc, s) => {
    const day = parseSessionDate(s.ngay_hoc)
    ;(acc[day] ??= []).push(s)
    return acc
  }, {})
  const sortedDates = Object.keys(byDate).sort((a, b) => b.localeCompare(a))

  const liveCount     = sessions.filter((s) => s.trang_thai === "dang_dien_ra").length
  const upcomingCount = sessions.filter((s) => s.trang_thai === "sap_dien_ra").length
  const roomSet       = new Set(sessions.map((s) => s.ten_phong).filter(Boolean))
  const todayIso      = toIso(new Date())

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const goToPage = (p: number) => {
    if (p < 1 || p > pagination.totalPages) return
    setPage(p)
  }

  const pageNumbers = (): (number | "…")[] => {
    const total = pagination.totalPages
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | "…")[] = [1]
    if (page > 3) pages.push("…")
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i)
    if (page < total - 2) pages.push("…")
    pages.push(total)
    return pages
  }

  return (
    <div className="flex flex-col w-full pb-8">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#1e325c]">Thời khoá biểu</h1>
        <p className="text-sm text-slate-500 mt-1">Lịch các buổi học trong hệ thống.</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng buổi học", value: pagination.total.toLocaleString(), icon: Calendar, color: "text-[#1e325c]" },
          { label: "Đang diễn ra",  value: liveCount,     icon: Radio,  color: "text-blue-600" },
          { label: "Sắp diễn ra",   value: upcomingCount, icon: Clock,  color: "text-amber-600" },
          { label: "Phòng sử dụng", value: roomSet.size,  icon: MapPin, color: "text-[#007082]" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <stat.icon size={18} className={stat.color} />
            </div>
            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">

        {/* Mode pills */}
        <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm font-bold">
          {([["all", "Tất cả"], ["day", "Theo ngày"], ["week", "Theo tuần"]] as [FilterMode, string][]).map(([mode, label]) => (
            <button key={mode} onClick={() => setFilter(mode)}
              className={`px-4 py-2 transition-colors ${
                filterMode === mode ? "bg-[#1e325c] text-white" : "text-slate-600 hover:bg-slate-50"
              }`}>
              {label}
            </button>
          ))}
        </div>

        {/* Day picker */}
        {filterMode === "day" && (
          <div className="flex items-center gap-2">
            <button onClick={() => setDay(toIso(addDays(new Date(`${selectedDay}T00:00:00`), -1)))}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ChevronLeft size={15} />
            </button>
            <input type="date" value={selectedDay} onChange={(e) => e.target.value && setDay(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#1e325c]" />
            <button onClick={() => setDay(toIso(addDays(new Date(`${selectedDay}T00:00:00`), 1)))}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ChevronRight size={15} />
            </button>
            <button onClick={() => setDay(todayIso)}
              className="px-3 py-1.5 text-xs font-bold border border-[#1e325c] text-[#1e325c] rounded-lg hover:bg-[#1e325c]/5 transition-colors">
              Hôm nay
            </button>
          </div>
        )}

        {/* Week picker */}
        {filterMode === "week" && (
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setWeek(addDays(weekStart, -7))}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ChevronLeft size={15} />
            </button>
            <div className="flex items-center gap-1">
              {weekDays.map((d, i) => {
                const iso = toIso(d)
                return (
                  <div key={iso}
                    className={`text-center px-2 py-1 rounded-lg text-xs font-medium border ${
                      iso === todayIso
                        ? "bg-[#1e325c] text-white border-[#1e325c]"
                        : "border-slate-200 text-slate-600 bg-white"
                    }`}>
                    <div className="font-bold">{DAY_NAMES[i]}</div>
                    <div className="text-[10px] mt-0.5 opacity-80">{fmtFull(iso).slice(0, 5)}</div>
                  </div>
                )
              })}
            </div>
            <button onClick={() => setWeek(addDays(weekStart, 7))}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded hover:bg-slate-50 transition-colors">
              <ChevronRight size={15} />
            </button>
            <button onClick={() => setWeek(getMonday(new Date()))}
              className="px-3 py-1.5 text-xs font-bold border border-[#1e325c] text-[#1e325c] rounded-lg hover:bg-[#1e325c]/5 transition-colors">
              Tuần này
            </button>
          </div>
        )}

        {/* Result label */}
        {!isLoading && (
          <span className="ml-auto text-sm text-slate-500">
            {filterMode === "day" && (
              <><span className="font-bold text-slate-700">{fmtDisplay(selectedDay)}</span>{" · "}</>
            )}
            {filterMode === "week" && (
              <><span className="font-bold text-slate-700">{fmtFull(toIso(weekDays[0]))} – {fmtFull(toIso(weekDays[6]))}</span>{" · "}</>
            )}
            <span className="font-bold text-slate-700">{pagination.total.toLocaleString()}</span> buổi học
          </span>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {error && <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>}

        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center gap-2 text-slate-400">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-sm">Đang tải lịch học...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400">
              {filterMode === "day"  ? `Không có buổi học nào vào ${fmtDisplay(selectedDay)}.`
               : filterMode === "week" ? "Không có buổi học nào trong tuần này."
               : "Không có buổi học nào."}
            </div>
          ) : (
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">Môn học</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Ngày học</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Thời gian</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Phòng</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Mã lớp</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedDates.map((date) =>
                  byDate[date].map((s, idx) => {
                    const st = STATUS_MAP[s.trang_thai] ?? STATUS_MAP.sap_dien_ra
                    return (
                      <tr key={s.id} className={`hover:bg-slate-50/50 transition-colors ${s.trang_thai === "huy" ? "opacity-50" : ""}`}>
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#1e325c]">{s.ten_hoc_phan || "—"}</p>
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-700">
                          {idx === 0 ? (
                            <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${
                              date === todayIso ? "bg-[#1e325c] text-white" : "bg-slate-100 text-slate-600"
                            }`}>{fmtDisplay(date)}</span>
                          ) : ""}
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 font-medium text-slate-600">
                            <Clock size={14} className="text-slate-400" />
                            {formatTime(s.gio_bat_dau)} – {formatTime(s.gio_ket_thuc)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 font-medium text-slate-700">
                            <MapPin size={14} className="text-slate-400" />
                            {s.ten_phong || <span className="text-slate-300">—</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {s.ma_lop}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${st.cls}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                            {st.label}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* PAGINATION */}
        {!isLoading && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-slate-500">
              Trang <span className="font-bold text-slate-700">{page}</span> /{" "}
              <span className="font-bold text-slate-700">{pagination.totalPages}</span>
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => goToPage(1)} disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronsLeft size={14} />
              </button>
              <button onClick={() => goToPage(page - 1)} disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft size={16} />
              </button>
              {pageNumbers().map((p, idx) =>
                p === "…" ? (
                  <span key={`e${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
                ) : (
                  <button key={p} onClick={() => goToPage(p as number)}
                    className={`w-9 h-9 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                      p === page ? "bg-[#1e325c] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}>
                    {p}
                  </button>
                )
              )}
              <button onClick={() => goToPage(page + 1)} disabled={page >= pagination.totalPages}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronRight size={16} />
              </button>
              <button onClick={() => goToPage(pagination.totalPages)} disabled={page >= pagination.totalPages}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
