import { Fragment, useEffect, useMemo, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, Loader2, LockKeyhole, Unlock, Trash2,
  Mail, Phone, Calendar, BookOpen, Users, X, GraduationCap,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
} from "lucide-react"
import { LecturerService } from "@/services/lecturer.service"
import api from "@/api/axios"
import type { Lecturer } from "@/types/user.type"

interface ClassStudent {
  id: number
  ma_sinh_vien: string
  ho_ten: string
  ten_lop: string | null
}

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
}

type Tab = "info" | "schedule" | "classes"
type ScheduleView = "tuan" | "thu-tiet"
type GridCell =
  | { type: "session"; session: ScheduleItem; startTiet: number; endTiet: number; rowspan: number }
  | { type: "skip" }
  | null

// ─── Tiết schedule ────────────────────────────────────────────────────────────
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

function toMins(t: string) { const [h, m] = t.split(":").map(Number); return h * 60 + m }
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
function getMonday(d: Date) {
  const day = new Date(d); const dow = day.getDay()
  day.setDate(day.getDate() - (dow === 0 ? 6 : dow - 1)); day.setHours(0,0,0,0); return day
}
function addDays(d: Date, n: number) { const r = new Date(d); r.setDate(r.getDate() + n); return r }
function isSameDate(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function fmtDate(d: Date) {
  return `${String(d.getDate()).padStart(2,"0")}/${String(d.getMonth()+1).padStart(2,"0")}/${d.getFullYear()}`
}
function fmtTime(t: string) { const [h, m] = t.split(":"); return `${h}g${m}` }

function buildWeekGrid(sessions: ScheduleItem[], weekDays: Date[]): Record<number, Record<number, GridCell>> {
  const grid: Record<number, Record<number, GridCell>> = {}
  for (let d = 0; d < 7; d++) { grid[d] = {}; for (let t = 1; t <= 10; t++) grid[d][t] = null }
  for (const session of sessions) {
    const sessionDate = new Date(session.ngay_hoc)
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LecturerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [lecturer, setLecturer] = useState<Lecturer | null>(null)
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingTab, setIsLoadingTab] = useState(false)
  const [scheduleLoaded, setScheduleLoaded] = useState(false)
  const [classesLoaded, setClassesLoaded] = useState(false)
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<Tab>("info")

  // schedule sub-state
  const [scheduleView, setScheduleView] = useState<ScheduleView>("tuan")
  const [selectedKy, setSelectedKy] = useState("")
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getMonday(new Date()))

  const [showLockModal, setShowLockModal] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [lockMinutes, setLockMinutes] = useState("15")
  const [isLocking, setIsLocking] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // student list modal
  const [selectedClass, setSelectedClass] = useState<CourseClass | null>(null)
  const [classStudents, setClassStudents] = useState<ClassStudent[]>([])
  const [studentsLoading, setStudentsLoading] = useState(false)
  const [studentsTotal, setStudentsTotal] = useState(0)

  const fetchLecturer = async () => {
    if (!id) return
    setIsLoading(true); setError("")
    try {
      const data = await LecturerService.getById(Number(id))
      setLecturer(data)
    } catch { setError("Không thể tải thông tin giảng viên.") }
    finally { setIsLoading(false) }
  }

  useEffect(() => { fetchLecturer() }, [id])

  const handleTabChange = async (tab: Tab) => {
    setActiveTab(tab)
    if (tab === "schedule" && !scheduleLoaded) {
      setIsLoadingTab(true)
      try {
        const [schedData, classData] = await Promise.all([
          LecturerService.getSchedule(Number(id)),
          LecturerService.getCourseClasses(Number(id)),
        ])
        setSchedule(schedData ?? [])
        setCourseClasses(classData ?? [])
        setScheduleLoaded(true)
        setClassesLoaded(true)
      } catch { setSchedule([]) }
      finally { setIsLoadingTab(false) }
    }
    if (tab === "classes" && !classesLoaded) {
      setIsLoadingTab(true)
      try {
        const data = await LecturerService.getCourseClasses(Number(id))
        setCourseClasses(data ?? [])
        setClassesLoaded(true)
      } catch { setCourseClasses([]) }
      finally { setIsLoadingTab(false) }
    }
  }

  const handleLock = async () => {
    if (!lecturer) return; setIsLocking(true)
    try { await LecturerService.lock(lecturer.tai_khoan_id, Number(lockMinutes) || 15); setShowLockModal(false); fetchLecturer() }
    catch { alert("Khóa tài khoản thất bại.") }
    finally { setIsLocking(false) }
  }

  const handleUnlock = async () => {
    if (!lecturer) return; setIsLocking(true)
    try { await LecturerService.unlock(lecturer.tai_khoan_id); setShowUnlockModal(false); fetchLecturer() }
    catch { alert("Mở khóa thất bại.") }
    finally { setIsLocking(false) }
  }

  const openStudents = async (cls: CourseClass) => {
    setSelectedClass(cls)
    setClassStudents([])
    setStudentsTotal(0)
    setStudentsLoading(true)
    try {
      const res = await api.get(`/course-classes/${cls.id}/students`, { params: { limit: 200 } })
      setClassStudents(res.data.data ?? [])
      setStudentsTotal(res.data.pagination?.total ?? 0)
    } catch { /* keep empty */ }
    finally { setStudentsLoading(false) }
  }

  const handleDelete = async () => {
    if (!lecturer) return; setIsDeleting(true)
    try { await LecturerService.remove(lecturer.id); navigate("/dashboard/lecturers") }
    catch { alert("Xóa thất bại.") }
    finally { setIsDeleting(false) }
  }

  // ── Derived from schedule ──────────────────────────────────────────────────
  const semesters = useMemo(() => [...new Set(schedule.map((s) => s.ten_ky))].sort(), [schedule])
  useEffect(() => {
    if (semesters.length > 0 && !selectedKy) setSelectedKy(semesters[semesters.length - 1])
  }, [semesters])

  const weekDays = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i)), [currentWeekStart])
  const semesterSessions = useMemo(
    () => (selectedKy ? schedule.filter((s) => s.ten_ky === selectedKy) : schedule),
    [schedule, selectedKy]
  )
  const weekSessions = useMemo(
    () => semesterSessions.filter((s) => { const d = new Date(s.ngay_hoc); return d >= weekDays[0] && d <= addDays(weekDays[6], 1) }),
    [semesterSessions, weekDays]
  )
  const weekGrid = useMemo(() => buildWeekGrid(weekSessions, weekDays), [weekSessions, weekDays])

  const gotoFirstWeek = () => {
    if (!semesterSessions.length) return
    const earliest = semesterSessions.reduce((a, b) => new Date(a.ngay_hoc) < new Date(b.ngay_hoc) ? a : b)
    setCurrentWeekStart(getMonday(new Date(earliest.ngay_hoc)))
  }
  const gotoLastWeek = () => {
    if (!semesterSessions.length) return
    const latest = semesterSessions.reduce((a, b) => new Date(a.ngay_hoc) > new Date(b.ngay_hoc) ? a : b)
    setCurrentWeekStart(getMonday(new Date(latest.ngay_hoc)))
  }

  // ── TKB Thứ-Tiết ──────────────────────────────────────────────────────────
  const thuTietData = useMemo(() => {
    const byClass = new Map<number, { sessions: ScheduleItem[] }>()
    for (const s of semesterSessions) {
      if (!byClass.has(s.lop_mon_hoc_id)) byClass.set(s.lop_mon_hoc_id, { sessions: [] })
      byClass.get(s.lop_mon_hoc_id)!.sessions.push(s)
    }
    return Array.from(byClass.entries()).map(([lmhId, { sessions }]) => {
      type SlotKey = string
      const slots = new Map<SlotKey, { dayNum: number; batDau: string; ketThuc: string; phong: string | null; minDate: Date; maxDate: Date }>()
      for (const s of sessions) {
        const d = new Date(s.ngay_hoc); const dow = d.getDay()
        const key: SlotKey = `${dow}|${s.gio_bat_dau}|${s.ten_phong ?? ""}`
        if (!slots.has(key)) slots.set(key, { dayNum: dow, batDau: s.gio_bat_dau, ketThuc: s.gio_ket_thuc, phong: s.ten_phong, minDate: d, maxDate: d })
        else {
          const slot = slots.get(key)!
          if (d < slot.minDate) slot.minDate = d
          if (d > slot.maxDate) slot.maxDate = d
        }
      }
      const first = sessions[0]
      const cc = courseClasses.find((c) => c.id === lmhId)
      return {
        lmhId, ma_lop: first.ma_lop, ma_hoc_phan: first.ma_hoc_phan, ten_hoc_phan: first.ten_hoc_phan,
        so_tin_chi: cc?.so_tin_chi ?? 0,
        slots: Array.from(slots.values()).sort((a, b) => {
          const da = a.dayNum === 0 ? 7 : a.dayNum; const db = b.dayNum === 0 ? 7 : b.dayNum
          return da - db || a.batDau.localeCompare(b.batDau)
        }),
      }
    })
  }, [semesterSessions, courseClasses])

  // ─────────────────────────────────────────────────────────────────────────────
  if (isLoading) return <div className="flex items-center justify-center py-32"><Loader2 size={32} className="animate-spin text-slate-400" /></div>
  if (error || !lecturer) return (
    <div className="flex flex-col items-center justify-center py-32 gap-3">
      <p className="text-sm text-red-500">{error || "Không tìm thấy giảng viên."}</p>
      <button onClick={() => navigate("/dashboard/lecturers")} className="text-sm text-[#185FA5] hover:underline">← Quay lại danh sách</button>
    </div>
  )

  const initials = lecturer.ho_ten.split(" ").slice(-2).map((w: string) => w[0]).join("").toUpperCase()
  const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "info", label: "Thông tin", icon: <Users size={15} /> },
    { key: "schedule", label: "Lịch giảng dạy", icon: <Calendar size={15} /> },
    { key: "classes", label: "Lớp phụ trách", icon: <BookOpen size={15} /> },
  ]

  return (
    <div className="flex flex-col w-full pb-10">

      {/* BACK */}
      <button onClick={() => navigate("/dashboard/lecturers")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#185FA5] mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Quay lại danh sách giảng viên
      </button>

      {/* HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#185FA5]/10 flex items-center justify-center font-medium text-xl text-[#185FA5] shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-medium text-[#185FA5]">{lecturer.ho_ten}</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Mã GV: <span className="font-medium text-slate-700">{lecturer.ma_giang_vien}</span>
                {" · "}@{lecturer.username}
              </p>
              <div className="mt-2">
                {lecturer.kich_hoat ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-medium border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Bị khóa
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {lecturer.kich_hoat ? (
              <button onClick={() => { setLockMinutes("15"); setShowLockModal(true) }}
                className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-600 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors">
                <LockKeyhole size={16} /> Khóa TK
              </button>
            ) : (
              <button onClick={() => setShowUnlockModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-emerald-300 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                <Unlock size={16} /> Mở khóa
              </button>
            )}
            <button onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
              <Trash2 size={16} /> Xóa
            </button>
          </div>
        </div>
      </div>

      {/* TABS CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-[#185FA5] text-[#185FA5]"
                  : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* TAB THÔNG TIN */}
          {activeTab === "info" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoItem icon={<Mail size={18} />} label="Email" value={lecturer.email} />
              <InfoItem icon={<Phone size={18} />} label="Số điện thoại" value={lecturer.sdt || "Chưa cập nhật"} />
              <InfoItem icon={<Calendar size={18} />} label="Ngày tham gia"
                value={lecturer.created_at ? new Date(lecturer.created_at).toLocaleDateString("vi-VN") : "—"} />
              <InfoItem icon={<Users size={18} />} label="Mã giảng viên" value={lecturer.ma_giang_vien} />
            </div>
          )}

          {/* TAB LỊCH GIẢNG DẠY */}
          {activeTab === "schedule" && (
            isLoadingTab ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
            ) : (
              <div>
                {/* Sub-tabs */}
                <div className="flex border-b border-slate-200 mb-4">
                  {([["tuan", "TKB TUẦN"], ["thu-tiet", "TKB THỨ - TIẾT"]] as [ScheduleView, string][]).map(([key, label]) => (
                    <button key={key} onClick={() => setScheduleView(key)}
                      className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                        scheduleView === key ? "border-[#185FA5] text-[#185FA5]" : "border-transparent text-slate-500 hover:text-slate-700"
                      }`}>{label}</button>
                  ))}
                </div>

                {/* Controls */}
                <div className="flex flex-wrap items-end gap-3 mb-4">
                  <div>
                    <select value={selectedKy} onChange={(e) => setSelectedKy(e.target.value)}
                      className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#185FA5] min-w-[180px]">
                      <option value="">Tất cả học kỳ</option>
                      {semesters.map((ky) => <option key={ky} value={ky}>{ky}</option>)}
                    </select>
                  </div>

                  {scheduleView === "tuan" && (
                    <>
                      <div>
                        <div className="border border-slate-300 rounded px-3 py-1.5 text-sm text-slate-700 min-w-[200px] bg-white">
                          {fmtDate(weekDays[0])} – {fmtDate(weekDays[6])}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 ml-1">
                        <button onClick={gotoFirstWeek} title="Tuần đầu tiên"
                          className="w-8 h-8 flex items-center justify-center border border-[#185FA5] bg-[#185FA5] text-white rounded hover:bg-[#1254a0] transition-colors">
                          <ChevronsLeft size={14} />
                        </button>
                        <button onClick={() => setCurrentWeekStart((w) => addDays(w, -7))} title="Tuần trước"
                          className="w-8 h-8 flex items-center justify-center border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors">
                          <ChevronLeft size={14} />
                        </button>
                        <button onClick={() => setCurrentWeekStart(getMonday(new Date()))}
                          className="h-8 px-3 border border-[#185FA5] bg-[#185FA5] text-white text-xs font-medium rounded hover:bg-[#1254a0] transition-colors">
                          Hiện tại
                        </button>
                        <button onClick={() => setCurrentWeekStart((w) => addDays(w, 7))} title="Tuần sau"
                          className="w-8 h-8 flex items-center justify-center border border-slate-300 text-slate-600 rounded hover:bg-slate-50 transition-colors">
                          <ChevronRight size={14} />
                        </button>
                        <button onClick={gotoLastWeek} title="Tuần cuối cùng"
                          className="w-8 h-8 flex items-center justify-center border border-[#185FA5] bg-[#185FA5] text-white rounded hover:bg-[#1254a0] transition-colors">
                          <ChevronsRight size={14} />
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* ── TKB TUẦN ── */}
                {scheduleView === "tuan" && (
                  <>
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full border-collapse text-xs" style={{ minWidth: 760 }}>
                        <thead>
                          <tr className="bg-[#185FA5] text-white">
                            <th className="border border-[#1254a0] px-2 py-3 w-12 text-center font-medium text-xs" style={{ minWidth: 68 }}>
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
                                if (!cell) return <td key={dayIdx} className="border border-slate-100 bg-white" style={{ height: 52 }} />
                                const { session, startTiet, endTiet, rowspan } = cell
                                const soTiet = endTiet - startTiet + 1
                                const isLive = session.trang_thai === "dang_dien_ra"
                                const isDone = session.trang_thai === "da_ket_thuc"
                                const isCancelled = session.trang_thai === "huy"
                                return (
                                  <td key={dayIdx} rowSpan={rowspan}
                                    className={`border border-[#185FA5]/25 align-top p-0 ${isCancelled ? "opacity-40" : ""}`}
                                    style={{ verticalAlign: "top" }}>
                                    <div className={`h-full border-l-4 p-2 text-[11px] leading-relaxed ${
                                      isLive ? "bg-blue-50 border-[#185FA5]" :
                                      isDone ? "bg-green-50 border-green-500" :
                                      isCancelled ? "bg-slate-50 border-slate-300" :
                                      "bg-blue-50/50 border-[#185FA5]/60"
                                    }`}>
                                      <div className="font-medium text-slate-800 mb-0.5 truncate">{session.ten_phong || "—"}</div>
                                      <div className="font-medium text-[#185FA5] leading-tight mb-1 truncate">
                                        {session.ten_hoc_phan}
                                        {session.ma_hoc_phan && session.ma_hoc_phan !== "—" && (
                                          <span className="font-normal text-[10px] text-slate-500"> ({session.ma_hoc_phan})</span>
                                        )}
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
                    {weekSessions.length === 0 && (
                      <p className="text-center text-sm text-slate-400 py-10">Không có buổi học nào trong tuần này.</p>
                    )}
                  </>
                )}

                {/* ── TKB THỨ - TIẾT ── */}
                {scheduleView === "thu-tiet" && (
                  <>
                    {selectedKy && (
                      <div className="text-xs font-medium text-[#185FA5] mb-3 uppercase">
                        Học kỳ: {selectedKy}
                      </div>
                    )}
                    <div className="overflow-x-auto rounded-lg border border-slate-200">
                      <table className="w-full border-collapse text-xs" style={{ minWidth: 900 }}>
                        <thead>
                          <tr className="bg-[#185FA5] text-white">
                            {["STT", "Mã lớp học phần/Tên lớp học phần", "Số TC", "Mã lớp SV", "Thứ", "Tiết(giờ) bắt đầu", "Phòng học", "Tuần", "Cơ sở", "Địa chỉ"].map((h) => (
                              <th key={h} className="border border-[#1254a0] px-3 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {thuTietData.length === 0 ? (
                            <tr><td colSpan={10} className="text-center py-10 text-slate-400 border border-slate-200">Không có dữ liệu.</td></tr>
                          ) : thuTietData.map((item, sttIdx) => {
                            const rowCount = item.slots.length || 1
                            return item.slots.map((slot, slotIdx) => {
                              const startTiet = timeToStartTiet(slot.batDau)
                              const endTiet = timeToEndTiet(slot.ketThuc)
                              const dow = slot.dayNum === 0 ? 7 : slot.dayNum
                              const dayName = dow === 7 ? "Chủ Nhật" : `Thứ ${["","","Hai","Ba","Tư","Năm","Sáu","Bảy","Nhật"][dow]}`
                              const tietRange = startTiet === endTiet ? `${startTiet}` : `${startTiet}-${endTiet}`
                              const gioHien = `${tietRange} (${fmtTime(slot.batDau)} - ${fmtTime(slot.ketThuc)})`
                              const tuanRange = `${fmtDate(slot.minDate)} - ${fmtDate(slot.maxDate)}`
                              return (
                                <tr key={`${item.lmhId}-${slotIdx}`} className="hover:bg-slate-50 border-b border-slate-100">
                                  {slotIdx === 0 && (
                                    <>
                                      <td rowSpan={rowCount} className="border border-slate-200 px-3 py-2 text-center font-medium text-slate-700 align-middle">{sttIdx + 1}</td>
                                      <td rowSpan={rowCount} className="border border-slate-200 px-3 py-2 align-top">
                                        <div className="font-medium text-slate-600">
                                          {item.ma_lop}-{item.ten_hoc_phan}
                                          {lecturer && <span className="font-normal">-{lecturer.ho_ten}</span>}
                                        </div>
                                        {lecturer?.email && (
                                          <div className="text-slate-400">(Email: {lecturer.email})</div>
                                        )}
                                      </td>
                                      <td rowSpan={rowCount} className="border border-slate-200 px-3 py-2 text-center font-medium text-slate-700 align-middle">{item.so_tin_chi || "—"}</td>
                                    </>
                                  )}
                                  <td className="border border-slate-200 px-3 py-2 text-slate-600"></td>
                                  <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700">{dayName}</td>
                                  <td className="border border-slate-200 px-3 py-2 text-slate-600">{gioHien}</td>
                                  <td className="border border-slate-200 px-3 py-2 font-medium text-slate-700">{slot.phong || "—"}</td>
                                  <td className="border border-slate-200 px-3 py-2 text-slate-500 whitespace-nowrap">{tuanRange}</td>
                                  <td className="border border-slate-200 px-3 py-2 text-slate-500">Cơ sở chính</td>
                                  <td className="border border-slate-200 px-3 py-2 text-slate-500">Đường Nghiêm Xuân Yêm, Đại học Thăng Long</td>
                                </tr>
                              )
                            })
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            )
          )}

          {/* TAB LỚP PHỤ TRÁCH */}
          {activeTab === "classes" && (
            isLoadingTab ? (
              <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-slate-400" /></div>
            ) : courseClasses.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12">Chưa có lớp phụ trách.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-medium">Mã lớp</th>
                      <th className="px-4 py-3 font-medium">Học phần</th>
                      <th className="px-4 py-3 font-medium text-center">Tín chỉ</th>
                      <th className="px-4 py-3 font-medium">Kỳ học</th>
                      <th className="px-4 py-3 font-medium">Thời gian</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courseClasses.map((cls) => (
                      <tr key={cls.id}
                        onClick={() => openStudents(cls)}
                        className="hover:bg-[#185FA5]/5 cursor-pointer transition-colors group">
                        <td className="px-4 py-3 font-medium text-[#185FA5] group-hover:text-[#185FA5]">{cls.ma_lop}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#185FA5]">{cls.ten_hoc_phan}</p>
                          <p className="text-xs text-slate-400">{cls.ma_hoc_phan}</p>
                        </td>
                        <td className="px-4 py-3 text-center font-medium">{cls.so_tin_chi}</td>
                        <td className="px-4 py-3">{cls.ten_ky}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {cls.bat_dau ? new Date(cls.bat_dau).toLocaleDateString("vi-VN") : "—"}
                          {" – "}
                          {cls.ket_thuc ? new Date(cls.ket_thuc).toLocaleDateString("vi-VN") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-xs text-[#185FA5] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            <Users size={13} /> Xem DS
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>

      {/* MODAL DANH SÁCH SINH VIÊN */}
      {selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-6 py-4 border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#185FA5]/10 flex items-center justify-center shrink-0">
                  <GraduationCap size={20} className="text-[#185FA5]" />
                </div>
                <div>
                  <h2 className="text-base font-medium text-slate-800">{selectedClass.ten_hoc_phan}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lớp: <span className="font-medium text-slate-700">{selectedClass.ma_lop}</span>
                    {" · "}{selectedClass.ten_ky}
                    {studentsTotal > 0 && <> · <span className="font-medium text-[#185FA5]">{studentsTotal} sinh viên</span></>}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedClass(null)}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0">
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto flex-1">
              {studentsLoading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                  <Loader2 size={24} className="animate-spin" />
                  <span className="text-sm">Đang tải danh sách...</span>
                </div>
              ) : classStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2 text-slate-400">
                  <Users size={32} className="opacity-30" />
                  <p className="text-sm">Chưa có sinh viên đăng ký lớp này.</p>
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-200 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 font-medium w-10 text-center">STT</th>
                      <th className="px-4 py-3 font-medium">Mã sinh viên</th>
                      <th className="px-4 py-3 font-medium">Họ tên</th>
                      <th className="px-4 py-3 font-medium">Lớp hành chính</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classStudents.map((sv, idx) => (
                      <tr key={sv.id} className="hover:bg-slate-50/60">
                        <td className="px-6 py-3 text-center text-slate-400 text-xs">{idx + 1}</td>
                        <td className="px-4 py-3 font-mono font-medium text-slate-700">{sv.ma_sinh_vien}</td>
                        <td className="px-4 py-3 font-medium text-slate-800">{sv.ho_ten}</td>
                        <td className="px-4 py-3 text-slate-500">{sv.ten_lop || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl shrink-0 flex justify-end">
              <button onClick={() => setSelectedClass(null)}
                className="px-5 py-2 text-sm text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KHÓA */}
      {showLockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <LockKeyhole size={20} className="text-amber-500" />
              </div>
              <h2 className="text-lg font-medium text-slate-800">Khóa tài khoản</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-500">Bạn sắp khóa tài khoản của{" "}
                <span className="font-medium text-slate-800">{lecturer.ho_ten}</span>.</p>
              <div>
                <label className="text-xs font-medium text-slate-600 mb-2 block">Thời gian khóa</label>
                <div className="flex gap-2 mb-3">
                  {["15", "30", "60"].map((m) => (
                    <button key={m} onClick={() => setLockMinutes(m)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                        lockMinutes === m ? "bg-amber-500 text-white border-amber-500" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}>{m} phút</button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={lockMinutes} onChange={(e) => setLockMinutes(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400" />
                  <span className="text-sm text-slate-500 whitespace-nowrap">phút</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
              <button onClick={() => setShowLockModal(false)} className="px-4 py-2 text-sm text-slate-600" disabled={isLocking}>Hủy</button>
              <button onClick={handleLock} disabled={isLocking}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-60">
                {isLocking && <Loader2 size={14} className="animate-spin" />} Khóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MỞ KHÓA */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Unlock size={20} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-medium text-slate-800">Mở khóa tài khoản</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc muốn mở khóa tài khoản của{" "}
              <span className="font-medium text-slate-800">{lecturer.ho_ten}</span>?</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowUnlockModal(false)} className="px-4 py-2 text-sm text-slate-600" disabled={isLocking}>Hủy</button>
              <button onClick={handleUnlock} disabled={isLocking}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-60">
                {isLocking && <Loader2 size={14} className="animate-spin" />} Mở khóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÓA */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-medium text-slate-800 mb-2">Xác nhận xóa</h2>
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc muốn xóa giảng viên{" "}
              <span className="font-medium text-slate-800">{lecturer.ho_ten}</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm text-slate-600" disabled={isDeleting}>Hủy</button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 text-sm font-medium disabled:opacity-60">
                {isDeleting && <Loader2 size={14} className="animate-spin" />} Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-sm font-medium text-slate-700">{value}</p>
      </div>
    </div>
  )
}
