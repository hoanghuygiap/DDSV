import { Fragment, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2, ChevronsLeft, ChevronsRight } from "lucide-react"
import api from "@/api/axios"
import { useAuth } from "@/contexts/AuthContext"

// ─── Tiết schedule (Đại học Thăng Long) ──────────────────────────────────────
const TIET_INFO = [
  { tiet: 1,  start: 7  * 60 + 0,  end: 7  * 60 + 50, label: "07:00-07:50" },
  { tiet: 2,  start: 7  * 60 + 50, end: 8  * 60 + 40, label: "07:50-08:40" },
  { tiet: 3,  start: 8  * 60 + 40, end: 9  * 60 + 30, label: "08:40-09:30" },
  { tiet: 4,  start: 9  * 60 + 45, end: 10 * 60 + 35, label: "09:45-10:35" },
  { tiet: 5,  start: 10 * 60 + 35, end: 11 * 60 + 25, label: "10:35-11:25" },
  { tiet: 6,  start: 11 * 60 + 25, end: 12 * 60 + 15, label: "11:25-12:15" },
  { tiet: 7,  start: 13 * 60 + 30, end: 14 * 60 + 20, label: "13:30-14:20" },
  { tiet: 8,  start: 14 * 60 + 20, end: 15 * 60 + 10, label: "14:20-15:10" },
  { tiet: 9,  start: 15 * 60 + 30, end: 16 * 60 + 20, label: "15:30-16:20" },
  { tiet: 10, start: 16 * 60 + 20, end: 17 * 60 + 10, label: "16:20-17:10" },
]

const DAY_NAMES = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]

// ─── Types ────────────────────────────────────────────────────────────────────
interface ScheduleItem {
  id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  ten_hoc_phan: string
  ten_phong: string | null
  ma_lop: string
  ten_giang_vien: string | null
  trang_thai_bh: string | null   // session status (dang_dien_ra / sap_dien_ra)
  trang_thai_dd: string | null   // attendance status (co_mat / vang / tre)
}

type GridCell =
  | { type: "session"; item: ScheduleItem; startTiet: number; endTiet: number; rowspan: number }
  | { type: "skip" }
  | null

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
  const r = new Date(d)
  r.setDate(r.getDate() + n)
  return r
}

function isSameDate(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function parseDate(s: string): Date { return new Date(s) }

function fmtDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

function fmtTime(t: string) {
  const [h, m] = t.split(":")
  return `${h}g${m}`
}

function buildWeekGrid(items: ScheduleItem[], weekDays: Date[]): Record<number, Record<number, GridCell>> {
  const grid: Record<number, Record<number, GridCell>> = {}
  for (let d = 0; d < 7; d++) {
    grid[d] = {}
    for (let t = 1; t <= 10; t++) grid[d][t] = null
  }
  for (const item of items) {
    const sessionDate = parseDate(item.ngay_hoc)
    const dayIdx = weekDays.findIndex((wd) => isSameDate(wd, sessionDate))
    if (dayIdx === -1) continue
    const startTiet = timeToStartTiet(item.gio_bat_dau)
    const endTiet   = timeToEndTiet(item.gio_ket_thuc)
    const rowspan   = Math.max(1, endTiet - startTiet + 1)
    if (grid[dayIdx][startTiet] !== null) continue  // skip overlaps
    grid[dayIdx][startTiet] = { type: "session", item, startTiet, endTiet, rowspan }
    for (let t = startTiet + 1; t <= endTiet; t++) grid[dayIdx][t] = { type: "skip" }
  }
  return grid
}

const DD_BADGE: Record<string, string> = {
  co_mat:  "bg-emerald-100 text-emerald-700",
  vang:    "bg-red-100 text-red-600",
  tre:     "bg-orange-100 text-orange-600",
  co_phep: "bg-sky-100 text-sky-700",
}
const DD_LABEL: Record<string, string> = {
  co_mat: "Có mặt", vang: "Vắng", tre: "Đi muộn", co_phep: "Có phép",
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function StudentSchedule() {
  useAuth()

  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState("")
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])

  const [activeTab, setActiveTab]           = useState<"tuan" | "thu-tiet">("tuan")
  const [currentWeekStart, setWeekStart]    = useState(() => getMonday(new Date()))

  // ── Load data ──────────────────────────────────────────────────────────────
  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    setError("")
    try {
      // 1. Dashboard → sinh_vien_id + upcoming sessions
      const dash     = await api.get("/dashboard/student")
      const dashData = dash.data.data
      const sinhVienId: number | undefined = dashData?.sinh_vien_id

      const upcomingRaw: any[] = dashData?.upcoming_sessions ?? []
      const upcoming: ScheduleItem[] = upcomingRaw.map((s: any) => ({
        id:             s.id,
        ngay_hoc:       s.ngay_hoc,
        gio_bat_dau:    s.gio_bat_dau,
        gio_ket_thuc:   s.gio_ket_thuc,
        ten_hoc_phan:   s.ten_hoc_phan,
        ten_phong:      s.ten_phong ?? null,
        ma_lop:         s.ma_lop,
        ten_giang_vien: s.ten_giang_vien ?? null,
        trang_thai_bh:  s.trang_thai ?? null,
        trang_thai_dd:  null,
      }))

      // 2. Attendance records (past sessions)
      let past: ScheduleItem[] = []
      if (sinhVienId) {
        try {
          const attRes = await api.get(`/attendance/student/${sinhVienId}`, {
            params: { limit: 500, page: 1 },
          })
          const attList: any[] = attRes.data?.data?.data ?? []
          past = attList.map((a: any) => ({
            id:             a.id,
            ngay_hoc:       a.ngay_hoc,
            gio_bat_dau:    a.gio_bat_dau,
            gio_ket_thuc:   a.gio_ket_thuc,
            ten_hoc_phan:   a.ten_hoc_phan,
            ten_phong:      a.ten_phong ?? null,
            ma_lop:         a.ma_lop,
            ten_giang_vien: null,
            trang_thai_bh:  null,
            trang_thai_dd:  a.trang_thai ?? null,
          }))
        } catch { /* silent */ }
      }

      // 3. Merge: index upcoming by date+start, overlay on past
      const key = (s: ScheduleItem) =>
        `${s.ngay_hoc?.split("T")[0]}_${s.gio_bat_dau}_${s.ten_hoc_phan}`

      const merged = new Map<string, ScheduleItem>()
      for (const s of past)     merged.set(key(s), s)
      for (const s of upcoming) {
        const k = key(s)
        if (merged.has(k)) {
          // keep lecturer name from upcoming, keep attendance status from past
          merged.set(k, { ...merged.get(k)!, ten_giang_vien: s.ten_giang_vien, trang_thai_bh: s.trang_thai_bh })
        } else {
          merged.set(k, s)
        }
      }
      setSchedule(Array.from(merged.values()))
    } catch {
      setError("Không thể tải thời khóa biểu. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  // ── Week ───────────────────────────────────────────────────────────────────
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  )

  const weekItems = useMemo(() => {
    return schedule.filter((s) => {
      const d = parseDate(s.ngay_hoc)
      return d >= weekDays[0] && d <= addDays(weekDays[6], 1)
    })
  }, [schedule, weekDays])

  const weekGrid = useMemo(() => buildWeekGrid(weekItems, weekDays), [weekItems, weekDays])

  function gotoFirst() {
    if (schedule.length === 0) return
    const earliest = schedule.reduce((a, b) => parseDate(a.ngay_hoc) < parseDate(b.ngay_hoc) ? a : b)
    setWeekStart(getMonday(parseDate(earliest.ngay_hoc)))
  }
  function gotoLast() {
    if (schedule.length === 0) return
    const latest = schedule.reduce((a, b) => parseDate(a.ngay_hoc) > parseDate(b.ngay_hoc) ? a : b)
    setWeekStart(getMonday(parseDate(latest.ngay_hoc)))
  }

  // ── TKB Thứ-Tiết: group by (ma_lop, day_of_week, gio_bat_dau, ten_phong) ─
  const thuTietData = useMemo(() => {
    type SlotKey = string
    // Group by lop_mon_hoc (ma_lop + ten_hoc_phan)
    const byClass = new Map<string, { items: ScheduleItem[] }>()
    for (const s of schedule) {
      const classKey = `${s.ma_lop}||${s.ten_hoc_phan}`
      if (!byClass.has(classKey)) byClass.set(classKey, { items: [] })
      byClass.get(classKey)!.items.push(s)
    }

    return Array.from(byClass.entries()).map(([, { items }]) => {
      const first = items[0]
      // Derive recurring time slots
      const slots = new Map<SlotKey, {
        dayNum: number; batDau: string; ketThuc: string
        phong: string | null; minDate: Date; maxDate: Date
        gv: string | null
      }>()
      for (const s of items) {
        const d   = parseDate(s.ngay_hoc)
        const dow = d.getDay()
        const sk: SlotKey = `${dow}|${s.gio_bat_dau}|${s.ten_phong ?? ""}`
        if (!slots.has(sk)) {
          slots.set(sk, {
            dayNum: dow, batDau: s.gio_bat_dau, ketThuc: s.gio_ket_thuc,
            phong: s.ten_phong, minDate: d, maxDate: d,
            gv: s.ten_giang_vien ?? null,
          })
        } else {
          const sl = slots.get(sk)!
          if (d < sl.minDate) sl.minDate = d
          if (d > sl.maxDate) sl.maxDate = d
          if (!sl.gv && s.ten_giang_vien) sl.gv = s.ten_giang_vien
        }
      }
      return {
        ma_lop:       first.ma_lop,
        ten_hoc_phan: first.ten_hoc_phan,
        slots: Array.from(slots.values()).sort((a, b) => {
          const da = a.dayNum === 0 ? 7 : a.dayNum
          const db = b.dayNum === 0 ? 7 : b.dayNum
          return da - db || a.batDau.localeCompare(b.batDau)
        }),
      }
    })
  }, [schedule])

  // ── Render ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-2">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full pb-10" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>

      {/* PAGE TITLE */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-[#185FA5] flex items-center justify-center shrink-0">
          <ChevronRight size={18} className="text-white" />
        </div>
        <h1 className="text-[22px] font-medium text-[#185FA5]">Thời khóa biểu</h1>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 mb-0">
        {[
          { key: "tuan",     label: "TKB TUẦN" },
          { key: "thu-tiet", label: "TKB THỨ - TIẾT" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "tuan" | "thu-tiet")}
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

      {/* ── TKB TUẦN ──────────────────────────────────────────────────────── */}
      {activeTab === "tuan" && (
        <div className="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl shadow-sm p-4">
          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <div className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 min-w-[210px] bg-white">
                {fmtDate(weekDays[0])} – {fmtDate(weekDays[6])}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={gotoFirst}
                title="Tuần đầu tiên"
                className="w-9 h-9 flex items-center justify-center border border-[#185FA5] bg-[#185FA5] text-white rounded hover:bg-[#1254a0] transition-colors"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                onClick={() => setWeekStart((w) => addDays(w, -7))}
                title="Tuần trước"
                className="w-9 h-9 flex items-center justify-center border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setWeekStart(getMonday(new Date()))}
                className="h-9 px-4 border border-[#185FA5] bg-[#185FA5] text-white text-sm font-medium rounded hover:bg-[#1254a0] transition-colors"
              >
                Hiện tại
              </button>
              <button
                onClick={() => setWeekStart((w) => addDays(w, 7))}
                title="Tuần sau"
                className="w-9 h-9 flex items-center justify-center border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={gotoLast}
                title="Tuần cuối cùng"
                className="w-9 h-9 flex items-center justify-center border border-[#185FA5] bg-[#185FA5] text-white rounded hover:bg-[#1254a0] transition-colors"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
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
                    const isToday = isSameDate(day, new Date())
                    return (
                      <th
                        key={i}
                        className={`border border-[#1254a0] px-2 py-3 text-center font-medium text-xs ${
                          isToday ? "bg-[#1254a0]" : ""
                        }`}
                      >
                        <div>{DAY_NAMES[i]}</div>
                        <div className={`font-normal text-[11px] mt-0.5 ${isToday ? "text-yellow-300" : "text-blue-200"}`}>
                          {fmtDate(day)}
                        </div>
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
                      if (!cell) {
                        return (
                          <td key={dayIdx} className="border border-slate-100 bg-white" style={{ height: 52 }} />
                        )
                      }
                      const { item, startTiet, endTiet, rowspan } = cell
                      const soTiet = endTiet - startTiet + 1
                      const isOngoing = item.trang_thai_bh === "dang_dien_ra"
                      return (
                        <td
                          key={dayIdx}
                          rowSpan={rowspan}
                          className="border border-[#185FA5]/30 align-top p-0"
                        >
                          <div className={`h-full border-l-4 border-[#185FA5] p-2 text-[11px] leading-relaxed ${
                            isOngoing ? "bg-blue-100" : "bg-blue-50"
                          }`}>
                            {isOngoing && (
                              <div className="flex items-center gap-1 mb-1">
                                <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                                <span className="text-[10px] text-orange-600 font-medium">Đang diễn ra</span>
                              </div>
                            )}
                            <div className="font-medium text-slate-800 mb-0.5 truncate">{item.ten_phong || "—"}</div>
                            <div className="font-medium text-[#185FA5] leading-tight mb-1">{item.ten_hoc_phan}</div>
                            <div className="text-slate-500">LHP: <span className="font-medium text-slate-700">{item.ma_lop}</span></div>
                            <div className="text-slate-500">Tiết: {startTiet}–{endTiet} ({soTiet} tiết)</div>
                            <div className="text-slate-500">Bắt đầu: {fmtTime(item.gio_bat_dau)}</div>
                            {item.ten_giang_vien && (
                              <div className="text-[#185FA5] font-medium mt-0.5 truncate">
                                GV: {item.ten_giang_vien}
                              </div>
                            )}
                            {item.trang_thai_dd && (
                              <div className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${DD_BADGE[item.trang_thai_dd] ?? ""}`}>
                                {DD_LABEL[item.trang_thai_dd] ?? item.trang_thai_dd}
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

          {weekItems.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-400">
              Không có buổi học nào trong tuần này.
            </div>
          )}
        </div>
      )}

      {/* ── TKB THỨ - TIẾT ────────────────────────────────────────────────── */}
      {activeTab === "thu-tiet" && (
        <div className="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs" style={{ minWidth: 800 }}>
              <thead>
                <tr className="bg-[#185FA5] text-white">
                  {["STT", "Mã lớp / Tên môn học", "Thứ", "Tiết (giờ) bắt đầu", "Phòng học", "Tuần học", "Giảng viên"].map((h) => (
                    <th key={h} className="border border-[#1254a0] px-3 py-3 text-left font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {thuTietData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 border border-slate-200">
                      Không có dữ liệu.
                    </td>
                  </tr>
                ) : (
                  thuTietData.map((item, sttIdx) => {
                    const rowCount = item.slots.length || 1
                    return item.slots.map((slot, slotIdx) => {
                      const startTiet = timeToStartTiet(slot.batDau)
                      const endTiet   = timeToEndTiet(slot.ketThuc)
                      const dow       = slot.dayNum === 0 ? 8 : slot.dayNum  // CN=8
                      const dayNames  = ["", "", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
                      const dayName   = dayNames[dow] ?? `Thứ ${dow}`
                      const tietRange = startTiet === endTiet ? `${startTiet}` : `${startTiet}-${endTiet}`
                      const gioHien   = `${tietRange} (${fmtTime(slot.batDau)}–${fmtTime(slot.ketThuc)})`
                      const tuanRange = `${fmtDate(slot.minDate)} – ${fmtDate(slot.maxDate)}`

                      return (
                        <tr key={`${sttIdx}-${slotIdx}`} className="hover:bg-slate-50 border-b border-slate-100">
                          {slotIdx === 0 && (
                            <>
                              <td
                                rowSpan={rowCount}
                                className="border border-slate-200 px-3 py-2 text-center font-medium text-slate-700 align-middle"
                              >
                                {sttIdx + 1}
                              </td>
                              <td
                                rowSpan={rowCount}
                                className="border border-slate-200 px-3 py-2 align-middle"
                              >
                                <div className="font-medium text-[#185FA5]">{item.ma_lop}</div>
                                <div className="text-slate-600 mt-0.5">{item.ten_hoc_phan}</div>
                              </td>
                            </>
                          )}
                          <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700 whitespace-nowrap">{dayName}</td>
                          <td className="border border-slate-200 px-3 py-2 text-slate-600 whitespace-nowrap">{gioHien}</td>
                          <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700">{slot.phong || "—"}</td>
                          <td className="border border-slate-200 px-3 py-2 text-slate-500 whitespace-nowrap">{tuanRange}</td>
                          <td className="border border-slate-200 px-3 py-2 text-slate-500">{slot.gv || "—"}</td>
                        </tr>
                      )
                    })
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
