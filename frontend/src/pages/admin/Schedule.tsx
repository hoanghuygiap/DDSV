import { Fragment, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2, ChevronsLeft, ChevronsRight, Calendar, Clock, MapPin, Radio } from "lucide-react"
import api from "@/api/axios"

// ─── Tiết schedule (Đại học Thăng Long) ──────────────────────────────────────
const TIET_INFO = [
  { tiet: 1,  start: 7*60+0,   end: 7*60+50,  label: "07:00-07:50" },
  { tiet: 2,  start: 7*60+50,  end: 8*60+40,  label: "07:50-08:40" },
  { tiet: 3,  start: 8*60+40,  end: 9*60+30,  label: "08:40-09:30" },
  { tiet: 4,  start: 9*60+45,  end: 10*60+35, label: "09:45-10:35" },
  { tiet: 5,  start: 10*60+35, end: 11*60+25, label: "10:35-11:25" },
  { tiet: 6,  start: 11*60+25, end: 12*60+15, label: "11:25-12:15" },
  { tiet: 7,  start: 13*60+30, end: 14*60+20, label: "13:30-14:20" },
  { tiet: 8,  start: 14*60+20, end: 15*60+10, label: "14:20-15:10" },
  { tiet: 9,  start: 15*60+30, end: 16*60+20, label: "15:30-16:20" },
  { tiet: 10, start: 16*60+20, end: 17*60+10, label: "16:20-17:10" },
]
const DAY_NAMES = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Session {
  id: number
  lop_mon_hoc_id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  trang_thai: "sap_dien_ra" | "dang_dien_ra" | "da_ket_thuc" | "huy"
  diem_danh_mo: boolean
  ma_lop: string
  ten_hoc_phan: string | null
  ten_phong: string | null
}

interface Pagination {
  total: number; page: number; limit: number; totalPages: number
}

type GridCell =
  | { type: "session"; session: Session; startTiet: number; endTiet: number; rowspan: number }
  | { type: "skip" }
  | null

// ─── Helpers ───────────────────────────────────────────────────────────────────
function toMins(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function timeToStartTiet(t: string) {
  const mins = toMins(t)
  return TIET_INFO.reduce((best, ti) =>
    Math.abs(ti.start - mins) < Math.abs(TIET_INFO[best - 1].start - mins) ? ti.tiet : best, 1)
}

function timeToEndTiet(t: string) {
  const mins = toMins(t)
  return TIET_INFO.reduce((best, ti) =>
    Math.abs(ti.end - mins) < Math.abs(TIET_INFO[best - 1].end - mins) ? ti.tiet : best, 1)
}

function getMonday(d: Date): Date {
  const day = new Date(d)
  const dow = day.getDay()
  day.setDate(day.getDate() - (dow === 0 ? 6 : dow - 1))
  day.setHours(0, 0, 0, 0)
  return day
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d); r.setDate(r.getDate() + n); return r
}

function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function parseSessionDate(ngay_hoc: string): Date {
  if (ngay_hoc.length === 10) {
    const [y, m, d] = ngay_hoc.split("-").map(Number)
    return new Date(y, m - 1, d)
  }
  const d = new Date(ngay_hoc)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`
}

function fmtDate(d: Date) {
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
}

function fmtTime(t: string) {
  const [h, m] = t.split(":")
  return `${h}g${m}`
}

function buildWeekGrid(sessions: Session[], weekDays: Date[]): Record<number, Record<number, GridCell>> {
  const grid: Record<number, Record<number, GridCell>> = {}
  for (let d = 0; d < 7; d++) {
    grid[d] = {}
    for (let t = 1; t <= 10; t++) grid[d][t] = null
  }
  for (const session of sessions) {
    const sessionDate = parseSessionDate(session.ngay_hoc)
    const dayIdx = weekDays.findIndex((wd) => isSameDate(wd, sessionDate))
    if (dayIdx === -1) continue
    const startTiet = timeToStartTiet(session.gio_bat_dau)
    const endTiet = timeToEndTiet(session.gio_ket_thuc)
    const rowspan = Math.max(1, endTiet - startTiet + 1)
    grid[dayIdx][startTiet] = { type: "session", session, startTiet, endTiet, rowspan }
    for (let t = startTiet + 1; t <= endTiet; t++) grid[dayIdx][t] = { type: "skip" }
  }
  return grid
}

const STATUS_DOT: Record<string, string> = {
  sap_dien_ra:  "bg-slate-400",
  dang_dien_ra: "bg-blue-500 animate-pulse",
  da_ket_thuc:  "bg-green-500",
  huy:          "bg-red-400",
}

const PAGE_SIZE = 50

// ─── Main Component ────────────────────────────────────────────────────────────
export default function SchedulePage() {
  const [activeTab, setActiveTab] = useState<"tuan" | "danh-sach">("tuan")
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()))

  // Weekly sessions
  const [weekSessions, setWeekSessions] = useState<Session[]>([])
  const [weekLoading, setWeekLoading] = useState(true)

  // List sessions
  const [sessions, setSessions] = useState<Session[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState("")

  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  )

  // Fetch weekly sessions
  useEffect(() => {
    if (activeTab !== "tuan") return
    let cancelled = false
    setWeekLoading(true)
    api.get("/sessions", {
      params: {
        date_from: toIso(weekDays[0]),
        date_to: toIso(weekDays[6]),
        limit: 200,
      }
    })
      .then(res => {
        if (!cancelled) setWeekSessions(res.data.data ?? [])
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setWeekLoading(false) })
    return () => { cancelled = true }
  }, [activeTab, currentWeekStart])

  // Fetch list sessions
  useEffect(() => {
    if (activeTab !== "danh-sach") return
    let cancelled = false
    setListLoading(true)
    setError("")
    api.get("/sessions", { params: { page, limit: PAGE_SIZE } })
      .then(res => {
        if (!cancelled) {
          setSessions(res.data.data ?? [])
          setPagination(res.data.pagination ?? { total: 0, page, limit: PAGE_SIZE, totalPages: 1 })
        }
      })
      .catch(() => { if (!cancelled) setError("Không thể tải danh sách buổi học.") })
      .finally(() => { if (!cancelled) setListLoading(false) })
    return () => { cancelled = true }
  }, [activeTab, page])

  const weekGrid = useMemo(() => buildWeekGrid(weekSessions, weekDays), [weekSessions, weekDays])

  const todayIso = toIso(new Date())

  // Derived stats for list
  const liveCount = sessions.filter(s => s.trang_thai === "dang_dien_ra").length
  const upcomingCount = sessions.filter(s => s.trang_thai === "sap_dien_ra").length

  // ── Pagination for list ────────────────────────────────────────────────────
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
    <div className="flex flex-col w-full pb-10">

      {/* PAGE TITLE */}
      <div className="flex items-center gap-3 mb-5">
        <h1 className="text-[22px] font-medium text-[#185FA5]">Thời khóa biểu</h1>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 mb-0">
        {[
          { key: "tuan",       label: "TKB TUẦN" },
          { key: "danh-sach", label: "DANH SÁCH BUỔI HỌC" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "tuan" | "danh-sach")}
            className={`px-6 py-3 text-sm font-medium tracking-wide border-b-2 transition-colors ${
              activeTab === tab.key
                ? "border-[#185FA5] text-[#185FA5]"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── TKB TUẦN ──────────────────────────────────────────────────────────── */}
      {activeTab === "tuan" && (
        <div className="bg-white border border-slate-200 rounded-b-lg rounded-tr-lg shadow-sm p-4">

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-500 font-medium border border-slate-300 px-2 py-0.5 rounded-t rounded-b-none -mb-px bg-white relative z-10">
                Tuần
              </label>
              <div className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 min-w-[200px] bg-white">
                {fmtDate(weekDays[0])}–{fmtDate(weekDays[6])}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <button
                onClick={() => setCurrentWeekStart(w => addDays(w, -7))}
                title="Tuần trước"
                className="w-9 h-9 flex items-center justify-center border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCurrentWeekStart(getMonday(new Date()))}
                className="h-9 px-4 border border-[#185FA5] bg-[#185FA5] text-white text-sm font-medium rounded hover:bg-[#1254a0] transition-colors"
              >
                Hiện tại
              </button>
              <button
                onClick={() => setCurrentWeekStart(w => addDays(w, 7))}
                title="Tuần sau"
                className="w-9 h-9 flex items-center justify-center border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {weekLoading && (
              <Loader2 size={16} className="animate-spin text-slate-400 ml-2" />
            )}
          </div>

          {/* Weekly Grid */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs" style={{ minWidth: 800 }}>
              <thead>
                <tr className="bg-[#185FA5] text-white">
                  <th className="border border-[#1254a0] px-2 py-3 text-center font-medium text-xs" style={{ minWidth: 68 }}>
                    <div>Tiết</div>
                    <div className="font-normal text-[10px] text-blue-200 mt-0.5">Giờ học</div>
                  </th>
                  {weekDays.map((day, i) => {
                    const iso = toIso(day)
                    const isToday = iso === todayIso
                    return (
                      <th key={i} className={`border border-[#1254a0] px-2 py-3 text-center font-medium text-xs ${isToday ? "bg-white/15" : ""}`}>
                        <div>{DAY_NAMES[i]}</div>
                        <div className={`font-normal text-[11px] mt-0.5 ${isToday ? "text-white" : "text-blue-200"}`}>
                          {fmtDate(day)}
                        </div>
                        {isToday && (
                          <div className="text-[9px] font-medium mt-0.5 text-yellow-200">Hôm nay</div>
                        )}
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {TIET_INFO.map(({ tiet, label }) => (
                  <tr key={tiet}>
                    <td className="border border-slate-200 text-center bg-blue-50 py-2 px-1" style={{ minWidth: 68 }}>
                      <div className="font-medium text-[#185FA5] text-sm leading-none">{tiet}</div>
                      <div className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">{label}</div>
                    </td>
                    {Array.from({ length: 7 }, (_, dayIdx) => {
                      const cell = weekGrid[dayIdx]?.[tiet] ?? null
                      if (cell?.type === "skip") return <Fragment key={dayIdx} />
                      if (!cell) return (
                        <td key={dayIdx} className="border border-slate-100 bg-white" style={{ height: 52 }} />
                      )
                      const { session, startTiet, endTiet, rowspan } = cell
                      const soTiet = endTiet - startTiet + 1
                      const isLive = session.trang_thai === "dang_dien_ra"
                      const isDone = session.trang_thai === "da_ket_thuc"
                      const isCancelled = session.trang_thai === "huy"
                      return (
                        <td
                          key={dayIdx}
                          rowSpan={rowspan}
                          className={`border border-[#185FA5]/25 align-top p-0 ${isCancelled ? "opacity-40" : ""}`}
                          style={{ verticalAlign: "top" }}
                        >
                          <div className={`h-full border-l-4 p-2 text-[11px] leading-relaxed ${
                            isLive ? "bg-blue-50 border-[#185FA5]" :
                            isDone ? "bg-green-50 border-green-500" :
                            isCancelled ? "bg-slate-50 border-slate-300" :
                            "bg-blue-50/50 border-[#185FA5]/60"
                          }`}>
                            <div className="font-medium text-slate-800 mb-0.5 truncate">{session.ten_phong || "—"}</div>
                            <div className="font-medium text-[#185FA5] leading-tight mb-1 truncate">
                              {session.ten_hoc_phan || "—"}
                            </div>
                            <div className="text-slate-500">LHP: <span className="font-medium text-slate-700">{session.ma_lop}</span></div>
                            <div className="text-slate-500">Tiết: {startTiet}–{endTiet} ({soTiet} tiết)</div>
                            <div className="text-slate-500">Bắt đầu: {fmtTime(session.gio_bat_dau)}</div>
                            {isLive && (
                              <div className="flex items-center gap-1 mt-0.5 text-blue-600 font-medium">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse inline-block" />
                                Đang diễn ra
                              </div>
                            )}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!weekLoading && weekSessions.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-400">
              Không có buổi học nào trong tuần này.
            </div>
          )}
        </div>
      )}

      {/* ── DANH SÁCH BUỔI HỌC ────────────────────────────────────────────────── */}
      {activeTab === "danh-sach" && (
        <div className="bg-white border border-slate-200 rounded-b-lg rounded-tr-lg shadow-sm">

          {/* Quick stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 border-b border-slate-100">
            {[
              { label: "Tổng buổi học", value: pagination.total.toLocaleString(), icon: Calendar, color: "text-[#185FA5]", bg: "bg-[#185FA5]/8" },
              { label: "Đang diễn ra",  value: liveCount,     icon: Radio,   color: "text-blue-600",  bg: "bg-blue-50" },
              { label: "Sắp diễn ra",   value: upcomingCount, icon: Clock,   color: "text-amber-600", bg: "bg-amber-50" },
              { label: "Trang hiện tại", value: `${page}/${pagination.totalPages}`, icon: MapPin, color: "text-slate-600", bg: "bg-slate-100" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-lg">
                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color} shrink-0`}>
                  <stat.icon size={15} />
                </div>
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className={`text-base font-medium ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {error && <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>}

          <div className="overflow-x-auto">
            {listLoading ? (
              <div className="py-16 flex flex-col items-center gap-2 text-slate-400">
                <Loader2 size={28} className="animate-spin" />
                <span className="text-sm">Đang tải danh sách buổi học...</span>
              </div>
            ) : sessions.length === 0 ? (
              <div className="py-16 text-center text-sm text-slate-400">Không có buổi học nào.</div>
            ) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider">Môn học</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Ngày học</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Thời gian</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Phòng</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Mã lớp</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sessions.map((s) => {
                    const dot = STATUS_DOT[s.trang_thai] ?? "bg-slate-400"
                    const sessionDate = parseSessionDate(s.ngay_hoc)
                    const isToday = toIso(sessionDate) === todayIso
                    return (
                      <tr key={s.id} className={`hover:bg-slate-50/50 transition-colors ${s.trang_thai === "huy" ? "opacity-50" : ""}`}>
                        <td className="px-6 py-4">
                          <p className="font-medium text-[#185FA5]">{s.ten_hoc_phan || "—"}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                            isToday ? "bg-[#185FA5] text-white" : "bg-slate-100 text-slate-600"
                          }`}>
                            {fmtDate(sessionDate)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 font-medium text-slate-600">
                            <Clock size={13} className="text-slate-400" />
                            {s.gio_bat_dau.slice(0,5)} – {s.gio_ket_thuc.slice(0,5)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-slate-700">
                            <MapPin size={13} className="text-slate-400" />
                            {s.ten_phong || <span className="text-slate-300">—</span>}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {s.ma_lop}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                            <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
                            {s.trang_thai === "sap_dien_ra"  ? "Sắp diễn ra"  :
                             s.trang_thai === "dang_dien_ra" ? "Đang diễn ra" :
                             s.trang_thai === "da_ket_thuc"  ? "Đã kết thúc"  :
                             "Đã hủy"}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* PAGINATION */}
          {!listLoading && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-sm text-slate-500">
                Trang <span className="font-medium text-slate-700">{page}</span> /{" "}
                <span className="font-medium text-slate-700">{pagination.totalPages}</span>
                {" · "}{pagination.total.toLocaleString()} buổi học
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
                      className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                        p === page ? "bg-[#185FA5] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-100"
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
      )}

    </div>
  )
}
