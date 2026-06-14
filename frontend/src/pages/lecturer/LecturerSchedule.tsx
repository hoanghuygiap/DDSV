import { Fragment, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2, ChevronsLeft, ChevronsRight } from "lucide-react"
import { LecturerService } from "@/services/lecturer.service"
import { useAuth } from "@/contexts/AuthContext"
import type { Lecturer } from "@/types/user.type"

// ─── Tiết schedule (Đại học Thăng Long) ──────────────────────────────────────
const TIET_INFO = [
  { tiet: 1, start: 7 * 60 + 0, end: 7 * 60 + 50, label: "07:00-07:50" },
  { tiet: 2, start: 7 * 60 + 50, end: 8 * 60 + 40, label: "07:50-08:40" },
  { tiet: 3, start: 8 * 60 + 40, end: 9 * 60 + 30, label: "08:40-09:30" },
  { tiet: 4, start: 9 * 60 + 45, end: 10 * 60 + 35, label: "09:45-10:35" },
  { tiet: 5, start: 10 * 60 + 35, end: 11 * 60 + 25, label: "10:35-11:25" },
  { tiet: 6, start: 11 * 60 + 25, end: 12 * 60 + 15, label: "11:25-12:15" },
  { tiet: 7, start: 13 * 60 + 30, end: 14 * 60 + 20, label: "13:30-14:20" },
  { tiet: 8, start: 14 * 60 + 20, end: 15 * 60 + 10, label: "14:20-15:10" },
  { tiet: 9, start: 15 * 60 + 30, end: 16 * 60 + 20, label: "15:30-16:20" },
  { tiet: 10, start: 16 * 60 + 20, end: 17 * 60 + 10, label: "16:20-17:10" },
]
const DAY_NAMES = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"]
const DAY_SHORT = ["Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "CN"]

// ─── Types ─────────────────────────────────────────────────────────────────
interface ScheduleItem {
  buoi_hoc_id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  trang_thai: string
  ma_hoc_phan: string
  ten_hoc_phan: string
  lop_mon_hoc_id: number
  ma_lop: string
  ten_phong: string | null
  ten_ky: string
}

interface CourseClass {
  id: number
  ma_lop: string
  ma_hoc_phan: string
  ten_hoc_phan: string
  so_tin_chi: number
  ten_ky: string
  bat_dau: string
  ket_thuc: string
  tong_buoi: number
  so_sinh_vien: number
}

type GridCell =
  | { type: "session"; session: ScheduleItem; startTiet: number; endTiet: number; rowspan: number }
  | { type: "skip" }
  | null

// ─── Helpers ──────────────────────────────────────────────────────────────
function toMins(t: string) {
  const [h, m] = t.split(":").map(Number)
  return h * 60 + m
}

function timeToStartTiet(t: string): number {
  const mins = toMins(t)
  return TIET_INFO.reduce((best, ti) =>
    Math.abs(ti.start - mins) < Math.abs(TIET_INFO[best - 1].start - mins) ? ti.tiet : best
    , 1)
}

function timeToEndTiet(t: string): number {
  const mins = toMins(t)
  return TIET_INFO.reduce((best, ti) =>
    Math.abs(ti.end - mins) < Math.abs(TIET_INFO[best - 1].end - mins) ? ti.tiet : best
    , 1)
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
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

function parseDate(s: string): Date {
  return new Date(s)
}

function fmtDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

function fmtTime(t: string) {
  const [h, m] = t.split(":")
  return `${h}g${m}`
}

function buildWeekGrid(sessions: ScheduleItem[], weekDays: Date[]): Record<number, Record<number, GridCell>> {
  const grid: Record<number, Record<number, GridCell>> = {}
  for (let d = 0; d < 7; d++) {
    grid[d] = {}
    for (let t = 1; t <= 10; t++) grid[d][t] = null
  }
  for (const session of sessions) {
    const sessionDate = parseDate(session.ngay_hoc)
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

// ─── Main Component ─────────────────────────────────────────────────────────
export default function LecturerSchedulePage() {
  const { user } = useAuth()
  const [lecturer, setLecturer] = useState<Lecturer | null>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [activeTab, setActiveTab] = useState<"tuan" | "thu-tiet">("tuan")
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()))
  const [selectedKy, setSelectedKy] = useState<string>("")

  // ── Load lecturer profile ──────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    const load = async () => {
      setIsLoading(true)
      setError("")
      try {
        const all = await LecturerService.getAll()
        const me = all.find((l) => l.username === user.username)
        if (!me) throw new Error("Không tìm thấy hồ sơ giảng viên.")
        setLecturer(me)
        const [sched, classes] = await Promise.all([
          LecturerService.getSchedule(me.id),
          LecturerService.getCourseClasses(me.id),
        ])
        setSchedule(sched ?? [])
        setCourseClasses(classes ?? [])
      } catch (e: unknown) {
        setError((e as Error).message || "Không thể tải lịch giảng dạy.")
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [user])

  // ── Derived: unique semesters ──────────────────────────────────────────
  const semesters = useMemo(() => [...new Set(schedule.map((s) => s.ten_ky))].sort(), [schedule])

  // Default to the most recent semester that has sessions near today
  useEffect(() => {
    if (semesters.length > 0 && !selectedKy) setSelectedKy(semesters[semesters.length - 1])
  }, [semesters])

  // ── Week navigation ────────────────────────────────────────────────────
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)),
    [currentWeekStart]
  )

  const semesterSessions = useMemo(
    () => (selectedKy ? schedule.filter((s) => s.ten_ky === selectedKy) : schedule),
    [schedule, selectedKy]
  )

  const weekSessions = useMemo(
    () =>
      semesterSessions.filter((s) => {
        const d = parseDate(s.ngay_hoc)
        return d >= weekDays[0] && d <= addDays(weekDays[6], 1)
      }),
    [semesterSessions, weekDays]
  )

  const weekGrid = useMemo(() => buildWeekGrid(weekSessions, weekDays), [weekSessions, weekDays])

  const gotoFirstWeek = () => {
    if (semesterSessions.length === 0) return
    const earliest = semesterSessions.reduce((a, b) =>
      parseDate(a.ngay_hoc) < parseDate(b.ngay_hoc) ? a : b
    )
    setCurrentWeekStart(getMonday(parseDate(earliest.ngay_hoc)))
  }

  const gotoLastWeek = () => {
    if (semesterSessions.length === 0) return
    const latest = semesterSessions.reduce((a, b) =>
      parseDate(a.ngay_hoc) > parseDate(b.ngay_hoc) ? a : b
    )
    setCurrentWeekStart(getMonday(parseDate(latest.ngay_hoc)))
  }

  // ── TKB Thứ-Tiết: group by lop_mon_hoc then by (day, time, room) ──────
  const thuTietData = useMemo(() => {
    // Group sessions by lop_mon_hoc_id
    const byClass = new Map<number, { sessions: ScheduleItem[]; cc?: CourseClass }>()
    for (const s of semesterSessions) {
      if (!byClass.has(s.lop_mon_hoc_id)) {
        const cc = courseClasses.find((c) => c.id === s.lop_mon_hoc_id)
        byClass.set(s.lop_mon_hoc_id, { sessions: [], cc })
      }
      byClass.get(s.lop_mon_hoc_id)!.sessions.push(s)
    }
    // For each class, group by (dayOfWeek, gio_bat_dau, ten_phong)
    return Array.from(byClass.entries()).map(([lmhId, { sessions, cc }]) => {
      type SlotKey = string
      const slots = new Map<SlotKey, { dayNum: number; batDau: string; ketThuc: string; phong: string | null; minDate: Date; maxDate: Date }>()
      for (const s of sessions) {
        const d = parseDate(s.ngay_hoc)
        const dow = d.getDay() // 0=Sun, 1=Mon, ...
        const key: SlotKey = `${dow}|${s.gio_bat_dau}|${s.ten_phong ?? ""}`
        if (!slots.has(key)) {
          slots.set(key, { dayNum: dow, batDau: s.gio_bat_dau, ketThuc: s.gio_ket_thuc, phong: s.ten_phong, minDate: d, maxDate: d })
        } else {
          const slot = slots.get(key)!
          if (d < slot.minDate) slot.minDate = d
          if (d > slot.maxDate) slot.maxDate = d
        }
      }
      const first = sessions[0]
      return {
        lmhId,
        ma_lop: first.ma_lop,
        ma_hoc_phan: first.ma_hoc_phan,
        ten_hoc_phan: first.ten_hoc_phan,
        so_tin_chi: cc?.so_tin_chi ?? 0,
        slots: Array.from(slots.values()).sort((a, b) => {
          const da = a.dayNum === 0 ? 7 : a.dayNum
          const db = b.dayNum === 0 ? 7 : b.dayNum
          return da - db || a.batDau.localeCompare(b.batDau)
        }),
      }
    })
  }, [semesterSessions, courseClasses])

  // ─────────────────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full pb-10">

      {/* PAGE TITLE */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-[#185FA5] flex items-center justify-center shrink-0">
          <ChevronRight size={18} className="text-white" />
        </div>
        <h1 className="text-[22px] font-medium text-[#185FA5]">
          Thời khóa biểu
        </h1>
      </div>

      {/* TABS */}
      <div className="flex border-b border-slate-200 mb-0">
        {[
          { key: "tuan", label: "TKB TUẦN" },
          { key: "thu-tiet", label: "TKB THỨ - TIẾT" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as "tuan" | "thu-tiet")}
            className={`px-6 py-3 text-sm font-medium tracking-wide border-b-2 transition-colors ${activeTab === tab.key
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
              <select
                value={selectedKy}
                onChange={(e) => setSelectedKy(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#185FA5] min-w-[180px]"
              >
                <option value="">Tất cả học kỳ</option>
                {semesters.map((ky) => (
                  <option key={ky} value={ky}>{ky}</option>
                ))}
              </select>
            </div>

            <div>
              <div className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 min-w-[200px] bg-white">
                {fmtDate(weekDays[0])}–{fmtDate(weekDays[6])}
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
              {/* <button
                onClick={gotoFirstWeek}
                title="Tuần đầu tiên"
                className="w-9 h-9 flex items-center justify-center border border-[#185FA5] bg-[#185FA5] text-white rounded hover:bg-[#1254a0] transition-colors"
              >
                <ChevronsLeft size={16} />
              </button> */}
              <button
                onClick={() => setCurrentWeekStart((w) => addDays(w, -7))}
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
                onClick={() => setCurrentWeekStart((w) => addDays(w, 7))}
                title="Tuần sau"
                className="w-9 h-9 flex items-center justify-center border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              {/* <button
                onClick={gotoLastWeek}
                title="Tuần cuối cùng"
                className="w-9 h-9 flex items-center justify-center border border-[#185FA5] bg-[#185FA5] text-white rounded hover:bg-[#1254a0] transition-colors"
              >
                <ChevronsRight size={16} />
              </button> */}
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
                  {weekDays.map((day, i) => (
                    <th key={i} className="border border-[#1254a0] px-2 py-3 text-center font-medium text-xs">
                      <div>{DAY_NAMES[i]}</div>
                      <div className="font-normal text-[11px] text-blue-200 mt-0.5">{fmtDate(day)}</div>
                    </th>
                  ))}
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
                      return (
                        <td
                          key={dayIdx}
                          rowSpan={rowspan}
                          className="border border-[#185FA5]/30 align-top p-0"
                          style={{ verticalAlign: "top" }}
                        >
                          <div className="h-full bg-blue-50 border-l-4 border-[#185FA5] p-2 text-[11px] leading-relaxed">
                            <div className="font-medium text-slate-800 mb-0.5 truncate">{session.ten_phong || "—"}</div>
                            <div className="font-medium text-[#185FA5] leading-tight mb-1">
                              {session.ten_hoc_phan}
                              {session.ma_hoc_phan && session.ma_hoc_phan !== "—" && (
                                <span className="font-normal text-[10px] text-slate-500"> ({session.ma_hoc_phan})</span>
                              )}
                            </div>
                            <div className="text-slate-500">LHP: <span className="font-medium text-slate-700">{session.ma_lop}</span></div>
                            <div className="text-slate-500">Tiết: {startTiet}–{endTiet} ({soTiet} tiết)</div>
                            <div className="text-slate-500">Bắt đầu: {fmtTime(session.gio_bat_dau)}</div>
                            {lecturer && (
                              <div className="text-[#185FA5] font-medium mt-0.5 truncate">GV: {lecturer.ho_ten}</div>
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

          {weekSessions.length === 0 && (
            <div className="text-center py-10 text-sm text-slate-400">
              Không có buổi học nào trong tuần này.
            </div>
          )}
        </div>
      )}

      {/* ── TKB THỨ - TIẾT ────────────────────────────────────────────────── */}
      {activeTab === "thu-tiet" && (
        <div className="bg-white border border-slate-200 rounded-b-xl rounded-tr-xl shadow-sm p-4">
          {/* Controls */}
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <select
                value={selectedKy}
                onChange={(e) => setSelectedKy(e.target.value)}
                className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#185FA5] min-w-[180px]"
              >
                <option value="">Tất cả học kỳ</option>
                {semesters.map((ky) => (
                  <option key={ky} value={ky}>{ky}</option>
                ))}
              </select>
            </div>
          </div>

          {selectedKy && (
            <div className="text-xs font-medium text-[#185FA5] mb-3 uppercase">
              Học kỳ: {selectedKy}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs" style={{ minWidth: 900 }}>
              <thead>
                <tr className="bg-[#185FA5] text-white">
                  {["STT", "Mã lớp học phần/Tên lớp học phần", "Số TC", "Mã lớp SV", "Thứ", "Tiết(giờ) bắt đầu", "Phòng học", "Tuần", "Cơ sở", "Địa chỉ"].map((h) => (
                    <th key={h} className="border border-[#1254a0] px-3 py-3 text-left font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {thuTietData.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-10 text-slate-400 border border-slate-200">
                      Không có dữ liệu.
                    </td>
                  </tr>
                ) : (
                  thuTietData.map((item, sttIdx) => {
                    const rowCount = item.slots.length || 1
                    return item.slots.map((slot, slotIdx) => {
                      const startTiet = timeToStartTiet(slot.batDau)
                      const endTiet = timeToEndTiet(slot.ketThuc)
                      const dow = slot.dayNum === 0 ? 7 : slot.dayNum
                      const dayName = dow === 7 ? "Chủ Nhật" : `Thứ ${["", "", "Hai", "Ba", "Tư", "Năm", "Sáu", "Bảy", "Nhật"][dow]}`
                      const tietRange = startTiet === endTiet ? `${startTiet}` : `${startTiet}-${endTiet}`
                      const gioHien = `${tietRange} (${fmtTime(slot.batDau)} - ${fmtTime(slot.ketThuc)})`
                      const tuanRange = `${fmtDate(slot.minDate)} - ${fmtDate(slot.maxDate)}`

                      return (
                        <tr key={`${item.lmhId}-${slotIdx}`} className="hover:bg-slate-50 border-b border-slate-100">
                          {slotIdx === 0 && (
                            <>
                              <td rowSpan={rowCount} className="border border-slate-200 px-3 py-2 text-center font-medium text-slate-700 align-middle">
                                {sttIdx + 1}
                              </td>
                              <td rowSpan={rowCount} className="border border-slate-200 px-3 py-2 align-top">
                                <div className="font-medium text-slate-600">
                                  {item.ma_lop}-{item.ten_hoc_phan}
                                  {lecturer && (
                                    <span className="font-normal">-{lecturer.ho_ten}</span>
                                  )}
                                </div>
                                {lecturer?.email && (
                                  <div className="text-slate-400">(Email: {lecturer.email})</div>
                                )}
                              </td>
                              <td rowSpan={rowCount} className="border border-slate-200 px-3 py-2 text-center font-medium text-slate-700 align-middle">
                                {item.so_tin_chi}
                              </td>
                            </>
                          )}
                          <td className="border border-slate-200 px-3 py-2 text-slate-600">{/* mã lớp sv */}</td>
                          <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700">{dayName}</td>
                          <td className="border border-slate-200 px-3 py-2 text-slate-600">{gioHien}</td>
                          <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700">{slot.phong || "—"}</td>
                          <td className="border border-slate-200 px-3 py-2 text-slate-500 whitespace-nowrap">{tuanRange}</td>
                          <td className="border border-slate-200 px-3 py-2 text-slate-500">Cơ sở chính</td>
                          <td className="border border-slate-200 px-3 py-2 text-slate-500">Đường Nghiêm Xuân Yêm, Đại học Thăng Long</td>
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

