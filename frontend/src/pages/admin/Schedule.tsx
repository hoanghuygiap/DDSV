import { useEffect, useMemo, useRef, useState } from "react"
import {
  ChevronLeft, ChevronRight, Loader2,
  ChevronsLeft, ChevronsRight, Calendar,
  Clock, MapPin, Radio, Filter, X, CheckCircle2,
} from "lucide-react"
import api from "@/api/axios"

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

interface Lecturer {
  id: number
  ho_ten: string
  ma_giang_vien: string
}

interface Semester {
  id: number
  ten_ky: string
  bat_dau: string
  ket_thuc: string
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const PAGE_SIZE = 20

function normalizeLecturerSession(s: Record<string, unknown>): Session {
  return {
    id: s.buoi_hoc_id as number,
    lop_mon_hoc_id: s.lop_mon_hoc_id as number,
    ngay_hoc: s.ngay_hoc as string,
    gio_bat_dau: s.gio_bat_dau as string,
    gio_ket_thuc: s.gio_ket_thuc as string,
    trang_thai: s.trang_thai as Session["trang_thai"],
    diem_danh_mo: (s.diem_danh_mo as boolean) ?? false,
    ma_lop: s.ma_lop as string,
    ten_hoc_phan: s.ten_hoc_phan as string | null,
    ten_phong: s.ten_phong as string | null,
  }
}

function isoDate(ngay: string): string {
  return (ngay ?? "").slice(0, 10)
}

function parseSessionDate(ngay_hoc: string): Date {
  const d = isoDate(ngay_hoc)
  const [y, m, day] = d.split("-").map(Number)
  return new Date(y, m - 1, day)
}

function fmtDate(d: Date) {
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`
}

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

const todayIso = toIso(new Date())

const STATUS_DOT: Record<string, string> = {
  sap_dien_ra:  "bg-slate-400",
  dang_dien_ra: "bg-blue-500 animate-pulse",
  da_ket_thuc:  "bg-green-500",
  huy:          "bg-red-400",
}

function statusLabel(t: string) {
  return t === "sap_dien_ra"  ? "Sắp diễn ra"
       : t === "dang_dien_ra" ? "Đang diễn ra"
       : t === "da_ket_thuc"  ? "Đã kết thúc"
       : "Đã hủy"
}

function sortByProximity(data: Session[]) {
  const now = Date.now()
  data.sort((a, b) => {
    const da = Math.abs(parseSessionDate(a.ngay_hoc).getTime() - now)
    const db = Math.abs(parseSessionDate(b.ngay_hoc).getTime() - now)
    return da - db || a.gio_bat_dau.localeCompare(b.gio_bat_dau)
  })
}

type AppliedFilters = { date: string; lecturerId: string; semesterId: string; status: string }

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SchedulePage() {

  // ── Filter inputs (controlled) ─────────────────────────────────────────────
  const [filterDate,       setFilterDate]       = useState("")
  const [filterLecturerId, setFilterLecturerId] = useState("")
  const [filterSemesterId, setFilterSemesterId] = useState("")
  const [filterStatus,     setFilterStatus]     = useState("")

  // Snapshot of applied filters (updated on "Lọc" click)
  const [applied, setApplied] = useState<AppliedFilters>({
    date: "", lecturerId: "", semesterId: "", status: "",
  })

  // ── Reference data ─────────────────────────────────────────────────────────
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [semesters, setSemesters] = useState<Semester[]>([])
  const semRef = useRef<Semester[]>([])  // always-fresh ref for loadSessions closure

  // ── Session data ───────────────────────────────────────────────────────────
  const [sessions,    setSessions]    = useState<Session[]>([])   // server-side page
  const [clientData,  setClientData]  = useState<Session[]>([])   // full client dataset
  const [pagination,  setPagination]  = useState<Pagination>({
    total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1,
  })
  const [page,    setPage]    = useState(1)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState("")

  // ── Load reference data on mount ───────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get("/lecturers").catch(() => ({ data: [] })),
      api.get("/semesters").catch(() => ({ data: { data: [] } })),
    ]).then(([lvRes, semRes]) => {
      const lvData: Lecturer[] = Array.isArray(lvRes.data)
        ? lvRes.data
        : (lvRes.data?.data ?? [])
      const semData: Semester[] = semRes.data?.data ?? []
      setLecturers(lvData)
      setSemesters(semData)
      semRef.current = semData
    })
  }, [])

  // Keep ref in sync with state
  useEffect(() => { semRef.current = semesters }, [semesters])

  // ── Load sessions whenever applied filters or page change ──────────────────
  useEffect(() => {
    loadSessions(applied, page)
  }, [applied, page]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadSessions(appl: AppliedFilters, pg: number) {
    setLoading(true)
    setError("")

    try {
      const { date, lecturerId, semesterId, status } = appl
      const semester = semesterId
        ? semRef.current.find(s => String(s.id) === semesterId)
        : null

      // ── CLIENT MODE: lecturer or semester selected ──────────────────────────
      // Fetch full dataset, then apply all active filters locally
      if (lecturerId !== "" || semesterId !== "") {
        let data: Session[]

        if (lecturerId !== "") {
          const res = await api.get(`/lecturers/${lecturerId}/schedule`)
          data = (res.data?.data ?? []).map(normalizeLecturerSession)
        } else {
          const res = await api.get("/sessions", { params: { limit: 1000, page: 1 } })
          data = res.data?.data ?? []
        }

        if (date) {
          data = data.filter(s => isoDate(s.ngay_hoc) === date)
        }
        if (semester) {
          const batDau  = isoDate(semester.bat_dau)
          const ketThuc = isoDate(semester.ket_thuc)
          data = data.filter(s => {
            const d = isoDate(s.ngay_hoc)
            return d >= batDau && d <= ketThuc
          })
        }
        if (status) {
          data = data.filter(s => s.trang_thai === status)
        }

        sortByProximity(data)
        setClientData(data)
        setSessions([])
        return
      }

      // ── SERVER MODE: only date/status (or no filters) ───────────────────────
      const params: Record<string, string | number> = { page: pg, limit: PAGE_SIZE }
      if (date)   params.date   = date
      if (status) params.status = status

      const res = await api.get("/sessions", { params })
      const data: Session[] = res.data?.data ?? []
      sortByProximity(data)

      setSessions(data)
      setPagination(
        res.data?.pagination ?? { total: data.length, page: pg, limit: PAGE_SIZE, totalPages: 1 }
      )
      setClientData([])

    } catch {
      setError("Không thể tải danh sách buổi học.")
    } finally {
      setLoading(false)
    }
  }

  // ── Is client-side pagination mode? ───────────────────────────────────────
  const isClientMode = applied.lecturerId !== "" || applied.semesterId !== ""

  // ── Client page slice ──────────────────────────────────────────────────────
  const clientPageData = useMemo(() => {
    if (!isClientMode) return []
    const start = (page - 1) * PAGE_SIZE
    return clientData.slice(start, start + PAGE_SIZE)
  }, [isClientMode, clientData, page])

  const displaySessions = isClientMode ? clientPageData : sessions
  const totalCount  = isClientMode ? clientData.length  : pagination.total
  const totalPages  = isClientMode
    ? Math.max(1, Math.ceil(clientData.length / PAGE_SIZE))
    : pagination.totalPages

  // ── Stats (client mode = full filtered dataset; server mode = current page) ─
  const statsData     = isClientMode ? clientData : sessions
  const liveCount     = statsData.filter(s => s.trang_thai === "dang_dien_ra").length
  const upcomingCount = statsData.filter(s => s.trang_thai === "sap_dien_ra").length
  const doneCount     = statsData.filter(s => s.trang_thai === "da_ket_thuc").length

  // ── Filter helpers ─────────────────────────────────────────────────────────
  const hasApplied    = applied.date !== "" || applied.lecturerId !== "" || applied.semesterId !== "" || applied.status !== ""
  const hasInputDirty = filterDate !== applied.date
    || filterLecturerId !== applied.lecturerId
    || filterSemesterId !== applied.semesterId
    || filterStatus !== applied.status

  function applyFilters() {
    setPage(1)
    setApplied({ date: filterDate, lecturerId: filterLecturerId, semesterId: filterSemesterId, status: filterStatus })
  }

  function clearFilters() {
    setFilterDate("")
    setFilterLecturerId("")
    setFilterSemesterId("")
    setFilterStatus("")
    setPage(1)
    setApplied({ date: "", lecturerId: "", semesterId: "", status: "" })
  }

  // ── Pagination ─────────────────────────────────────────────────────────────
  function goToPage(p: number) {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  function pageNumbers(): (number | "…")[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "…")[] = [1]
    if (page > 3) pages.push("…")
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push("…")
    pages.push(totalPages)
    return pages
  }

  // ─── JSX ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full pb-10" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-[#185FA5]">Danh sách buổi học</h1>
      </div>

      {/* ── STAT CARDS ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng buổi học</p>
            <div className="p-2 rounded-md bg-[#185FA5] text-white">
              <Calendar size={18} strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-slate-800">{totalCount.toLocaleString()}</h3>
          {isClientMode && (
            <p className="text-xs text-slate-400 mt-2 font-normal">Kết quả bộ lọc</p>
          )}
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đang diễn ra</p>
            <div className="p-2 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
              <Radio size={18} strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-blue-600">{liveCount}</h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Sắp diễn ra</p>
            <div className="p-2 rounded-md bg-amber-50 text-amber-600 border border-amber-100">
              <Clock size={18} strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-amber-600">{upcomingCount}</h3>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Đã kết thúc</p>
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
              <CheckCircle2 size={18} strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-emerald-600">{doneCount}</h3>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg shadow-sm">

        {/* ── FILTER BAR ─────────────────────────────────────────────────────── */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-wrap items-end gap-3">

            {/* Ngày học */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Ngày học</label>
              <input
                type="date"
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[160px]"
              />
            </div>

            {/* Giảng viên */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Giảng viên phụ trách</label>
              <select
                value={filterLecturerId}
                onChange={e => setFilterLecturerId(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[220px]"
              >
                <option value="">-- Tất cả giảng viên --</option>
                {lecturers.map(l => (
                  <option key={l.id} value={String(l.id)}>
                    {l.ho_ten} ({l.ma_giang_vien})
                  </option>
                ))}
              </select>
            </div>

            {/* Kì học */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Kì học</label>
              <select
                value={filterSemesterId}
                onChange={e => setFilterSemesterId(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[200px]"
              >
                <option value="">-- Tất cả kì học --</option>
                {semesters.map(s => (
                  <option key={s.id} value={String(s.id)}>
                    {s.ten_ky}
                  </option>
                ))}
              </select>
            </div>

            {/* Trạng thái */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[170px]"
              >
                <option value="">-- Tất cả trạng thái --</option>
                <option value="sap_dien_ra">Sắp diễn ra</option>
                <option value="dang_dien_ra">Đang diễn ra</option>
                <option value="da_ket_thuc">Đã kết thúc</option>
                <option value="huy">Đã hủy</option>
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={applyFilters}
                className={`h-9 px-4 text-white text-sm font-medium rounded-lg flex items-center gap-2 transition-colors ${
                  hasInputDirty
                    ? "bg-[#185FA5] hover:bg-[#1254a0]"
                    : "bg-[#185FA5]/70 hover:bg-[#185FA5]"
                }`}
              >
                <Filter size={14} />
                Lọc kết quả
              </button>
              {hasApplied && (
                <button
                  onClick={clearFilters}
                  className="h-9 px-3 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 text-sm rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <X size={14} />
                  Xóa bộ lọc
                </button>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {hasApplied && (
            <div className="flex flex-wrap gap-2 mt-3">
              {applied.date && (
                <span className="inline-flex items-center gap-1.5 bg-[#185FA5]/10 text-[#185FA5] text-xs px-2.5 py-1 rounded-full font-medium">
                  <Calendar size={11} />
                  {applied.date}
                </span>
              )}
              {applied.lecturerId && (
                <span className="inline-flex items-center gap-1.5 bg-[#185FA5]/10 text-[#185FA5] text-xs px-2.5 py-1 rounded-full font-medium">
                  GV: {lecturers.find(l => String(l.id) === applied.lecturerId)?.ho_ten ?? "—"}
                </span>
              )}
              {applied.semesterId && (
                <span className="inline-flex items-center gap-1.5 bg-[#185FA5]/10 text-[#185FA5] text-xs px-2.5 py-1 rounded-full font-medium">
                  {semesters.find(s => String(s.id) === applied.semesterId)?.ten_ky ?? "—"}
                </span>
              )}
              {applied.status && (
                <span className="inline-flex items-center gap-1.5 bg-[#185FA5]/10 text-[#185FA5] text-xs px-2.5 py-1 rounded-full font-medium">
                  {statusLabel(applied.status)}
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>
        )}

        {/* ── TABLE ───────────────────────────────────────────────────────────── */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 flex flex-col items-center gap-2 text-slate-400">
              <Loader2 size={28} className="animate-spin" />
              <span className="text-sm font-normal">Đang tải danh sách buổi học...</span>
            </div>
          ) : displaySessions.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-400 font-normal">
              {hasApplied
                ? "Không tìm thấy buổi học phù hợp với bộ lọc."
                : "Không có buổi học nào."}
            </div>
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
                {displaySessions.map(s => {
                  const dot = STATUS_DOT[s.trang_thai] ?? "bg-slate-400"
                  const sessionDate = parseSessionDate(s.ngay_hoc)
                  const isToday    = toIso(sessionDate) === todayIso
                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-slate-50/50 transition-colors ${s.trang_thai === "huy" ? "opacity-50" : ""}`}
                    >
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
                          {s.gio_bat_dau.slice(0, 5)} – {s.gio_ket_thuc.slice(0, 5)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1.5 text-slate-700 font-normal">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          {s.ten_phong ?? <span className="text-slate-300">—</span>}
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
                          {statusLabel(s.trang_thai)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* ── PAGINATION ──────────────────────────────────────────────────────── */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-slate-500 font-normal">
              Trang{" "}
              <span className="font-medium text-slate-700">{page}</span>
              {" / "}
              <span className="font-medium text-slate-700">{totalPages}</span>
              {" · "}
              {totalCount.toLocaleString()} buổi học
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsLeft size={14} />
              </button>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {pageNumbers().map((p, idx) =>
                p === "…" ? (
                  <span key={`e${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    className={`w-9 h-9 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                      p === page
                        ? "bg-[#185FA5] text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={page >= totalPages}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
