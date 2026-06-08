import { useEffect, useRef, useState } from "react"
import { useParams, Link } from "react-router-dom"
import {
  ArrowLeft, Search, Loader2, Users, UserCheck, UserX, BookOpen,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Bell
} from "lucide-react"
import api from "@/api/axios"
import { useAuth } from "@/contexts/AuthContext"
import { LecturerService } from "@/services/lecturer.service"
import SendNotificationModal from "./SendNotificationModal"

// ─── Types ────────────────────────────────────────────────────────────────────
interface ClassSummary {
  id: number
  ma_lop: string
  ma_hoc_phan: string
  ten_hoc_phan: string
  so_tin_chi: number
  ten_ky: string
  ten_giang_vien: string
  so_sinh_vien: number
  tong_buoi_da_day: number
  ty_le_co_mat_tb: number | null
  si_so: number
  so_luong_nguy_co: number
}

interface StudentRow {
  id: number
  ma_sinh_vien: string
  ho_ten: string
  ten_lop: string | null
  tong_buoi: number
  so_buoi_vang: number
  so_buoi_co_mat: number
  so_buoi_tre: number
  so_buoi_co_phep: number
  ty_le_vang: number | null
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const PAGE_SIZE = 15

// ─── Helpers ──────────────────────────────────────────────────────────────────
function riskBadge(tyLeVang: number | null) {
  const val = tyLeVang ?? 0
  if (val >= 20) return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600 border border-red-200">⚠ Cấm thi</span>
  if (val >= 10) return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-600 border border-orange-200">Cảnh báo</span>
  return <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Bình thường</span>
}

function vangColor(v: number | null) {
  const val = v ?? 0
  if (val >= 20) return "text-red-600 font-medium"
  if (val >= 10) return "text-orange-500 font-medium"
  return "text-slate-700"
}

// ─── Pagination bar ────────────────────────────────────────────────────────────
function PaginationBar({ pag, onChange }: { pag: Pagination; onChange: (p: number) => void }) {
  const { page, totalPages, total, limit } = pag
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  const pages: (number | "…")[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (page > 3) pages.push("…")
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push("…")
    pages.push(totalPages)
  }

  const btn = (disabled: boolean, onClick: () => void, children: React.ReactNode, title?: string) => (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
    >
      {children}
    </button>
  )

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/60 text-xs text-slate-500">
      <span>Hiển thị {from}–{to} / {total} sinh viên</span>
      <div className="flex items-center gap-1">
        {btn(page === 1, () => onChange(1), <ChevronsLeft size={14} />, "Trang đầu")}
        {btn(page === 1, () => onChange(page - 1), <ChevronLeft size={14} />, "Trang trước")}
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`e${i}`} className="px-1 text-slate-400">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p as number)}
              className={`w-8 h-8 rounded border text-xs font-medium transition-colors ${p === page
                ? "border-[#185FA5] bg-[#185FA5] text-white"
                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
            >
              {p}
            </button>
          )
        )}
        {btn(page === totalPages, () => onChange(page + 1), <ChevronRight size={14} />, "Trang sau")}
        {btn(page === totalPages, () => onChange(totalPages), <ChevronsRight size={14} />, "Trang cuối")}
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
import SessionManager from "./SessionManager"
import StudentHistoryModal from "./StudentHistoryModal"

export default function ClassDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState<"SESSIONS" | "STUDENTS">("SESSIONS")

  const [summary, setSummary] = useState<ClassSummary | null>(null)
  const [students, setStudents] = useState<StudentRow[]>([])
  const [pag, setPag] = useState<Pagination | null>(null)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [inputVal, setInputVal] = useState("")
  const [loadSum, setLoadSum] = useState(true)
  const [loadStd, setLoadStd] = useState(true)
  const [error, setError] = useState("")
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // State for manual attendance
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [addSvCode, setAddSvCode] = useState("")
  const [addingSv, setAddingSv] = useState(false)
  const [reloadTick, setReloadTick] = useState(0)

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addSvCode.trim()) return
    setAddingSv(true)
    try {
      await api.post(`/course-classes/${id}/register`, { ma_sinh_vien: addSvCode.trim() })
      alert("Thêm sinh viên thành công!")
      setAddSvCode("")
      setReloadTick(prev => prev + 1)
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi thêm sinh viên.")
    } finally {
      setAddingSv(false)
    }
  }

  const handleRemoveStudent = async (sv: StudentRow) => {
    if (!confirm(`Bạn có chắc muốn xoá/hủy đăng ký sinh viên ${sv.ho_ten} (${sv.ma_sinh_vien}) khỏi lớp này?`)) return
    try {
      await api.delete(`/course-classes/${id}/register/${sv.id}`)
      alert("Xoá sinh viên thành công!")
      setReloadTick(prev => prev + 1)
    } catch (err: any) {
      alert(err.response?.data?.message || "Có lỗi xảy ra khi xoá sinh viên.")
    }
  }

  // Fetch summary via LecturerService
  useEffect(() => {
    if (!id || !user) return
    let cancelled = false
    setLoadSum(true)

    const fetchSummary = async () => {
      try {
        const allLecturers = await LecturerService.getAll()
        const me = allLecturers.find((l) => l.username === user.username)
        if (!me) throw new Error("Giảng viên không hợp lệ")

        const classes = await LecturerService.getCourseClasses(me.id)
        const myClass = classes?.find((c: any) => c.id.toString() === id)
        if (!myClass) throw new Error("Không tìm thấy lớp học.")

        if (!cancelled) setSummary(myClass as any)
      } catch (err: any) {
        if (!cancelled) setError("Lỗi khi tải thông tin lớp: " + err.message)
      } finally {
        if (!cancelled) setLoadSum(false)
      }
    }
    fetchSummary()
    return () => { cancelled = true }
  }, [id, user, reloadTick])

  // Fetch students (page + keyword)
  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoadStd(true)
    api.get(`/course-classes/${id}/students`, {
      params: { page, limit: PAGE_SIZE, keyword },
    })
      .then(res => {
        if (!cancelled) {
          setStudents(res.data.data ?? [])
          setPag(res.data.pagination ?? null)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err)
          setError(prev => prev || "Không thể tải danh sách sinh viên.")
        }
      })
      .finally(() => { if (!cancelled) setLoadStd(false) })
    return () => { cancelled = true }
  }, [id, page, keyword, reloadTick])

  // Debounce search
  const handleSearch = (val: string) => {
    setInputVal(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      setKeyword(val.trim())
    }, 350)
  }

  const handlePageChange = (p: number) => setPage(p)

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loadSum && !summary) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={28} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error && !summary) {
    return <div className="text-center py-20 text-sm text-red-500">{error}</div>
  }

  const attendRate = Number(summary?.ty_le_co_mat_tb ?? 0)
  const doneRatio = summary
    ? `${summary.tong_buoi_da_day} buổi đã học`
    : "—"

  return (
    <div className="flex flex-col gap-5 w-full pb-10">

      {/* BREADCRUMB */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link to="/dashboard/my-classes" className="hover:text-[#185FA5] flex items-center gap-1 transition-colors">
          <ArrowLeft size={15} />
          Quay lại
        </Link>
        <span>/</span>
        <span className="text-slate-700">Chi tiết chuyên cần</span>
      </div>

      {/* HEADER */}
      {summary && (
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-medium text-[#185FA5] tracking-tight">{summary.ten_hoc_phan}</h1>
              <span className="bg-blue-50 text-[#185FA5] px-2.5 py-0.5 rounded text-xs font-medium border border-blue-100">
                {summary.ma_lop}
              </span>
              <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-xs font-medium">
                {summary.ma_hoc_phan}
              </span>
            </div>
            <p className="text-sm text-slate-500">
              {summary.ten_giang_vien} &bull; {summary.so_tin_chi} tín chỉ &bull; {summary.ten_ky}
            </p>
          </div>
          <button
            onClick={() => setShowNotificationModal(true)}
            className="flex items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium px-4 py-2 rounded-lg transition-colors border border-blue-200 shadow-sm self-start mt-2 md:mt-0"
          >
            <Bell size={18} /> Gửi thông báo
          </button>
        </div>
      )}

      {/* STAT CARDS */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Users size={22} />} color="blue" label="Tổng sinh viên" value={summary.si_so} />
          <StatCard
            icon={<UserCheck size={22} />}
            color="emerald"
            label="Tỷ lệ chuyên cần TB"
            value={`${attendRate ?? 0}%`}
          />
          <StatCard
            icon={<UserX size={22} />}
            color="red"
            label="Nguy cơ cấm thi (≥20%)"
            value={summary.so_luong_nguy_co}
          />
          <StatCard icon={<BookOpen size={22} />} color="indigo" label="Tiến độ" value={doneRatio} />
        </div>
      )}

      {/* TABS */}
      <div className="flex items-center gap-6 border-b border-slate-200 mt-2">
        <button
          onClick={() => setActiveTab("SESSIONS")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "SESSIONS" ? "text-[#185FA5]" : "text-slate-500 hover:text-slate-700"}`}
        >
          Quản lý buổi học
          {activeTab === "SESSIONS" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#185FA5] rounded-t-lg" />}
        </button>
        <button
          onClick={() => setActiveTab("STUDENTS")}
          className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === "STUDENTS" ? "text-[#185FA5]" : "text-slate-500 hover:text-slate-700"}`}
        >
          Danh sách sinh viên
          {activeTab === "STUDENTS" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#185FA5] rounded-t-lg" />}
        </button>
      </div>

      {activeTab === "SESSIONS" && (
        <SessionManager classId={Number(id)} />
      )}

      {activeTab === "STUDENTS" && (
        <>
          {/* STUDENT TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mt-1">

            {/* Toolbar */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/40">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-[#185FA5] text-base">Danh sách chuyên cần</h3>
                {pag && (
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-medium">
                    {pag.total}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <form onSubmit={handleAddStudent} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={addSvCode}
                    onChange={(e) => setAddSvCode(e.target.value)}
                    placeholder="Mã SV để thêm (VD: SV001)"
                    className="pl-3 pr-2 py-1.5 border border-slate-300 rounded text-sm w-48 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 uppercase"
                    disabled={addingSv}
                  />
                  <button
                    type="submit"
                    disabled={addingSv || !addSvCode.trim()}
                    className="bg-emerald-600 text-white text-sm font-medium px-3 py-1.5 rounded hover:bg-emerald-700 disabled:opacity-60 transition"
                  >
                    {addingSv ? "..." : "+ Thêm"}
                  </button>
                </form>

                <div className="relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={inputVal}
                    onChange={e => handleSearch(e.target.value)}
                    placeholder="Tìm MSSV, họ tên..."
                    className="pl-8 pr-4 py-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:border-[#185FA5] focus:ring-1 focus:ring-[#185FA5] w-56"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#185FA5] text-white text-xs">
                    {["STT", "MSSV", "Họ và tên", "Tổng buổi", "Vắng", "Trễ", "Phép", "Có mặt", "Tỷ lệ vắng", "Trạng thái", "Thao tác"].map(h => (
                      <th key={h} className="py-3 px-4 font-medium whitespace-nowrap border-r border-[#1254a0] last:border-r-0">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadStd ? (
                    <tr>
                      <td colSpan={11} className="py-16 text-center">
                        <Loader2 size={22} className="animate-spin text-slate-400 mx-auto" />
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-14 text-center text-sm text-slate-400">
                        {keyword ? "Không tìm thấy sinh viên phù hợp." : "Chưa có sinh viên trong lớp này."}
                      </td>
                    </tr>
                  ) : (
                    students.map((sv, idx) => {
                      const stt = ((page - 1) * PAGE_SIZE) + idx + 1
                      const vang = Number(sv.so_buoi_vang ?? 0)
                      const rate = Number(sv.ty_le_vang ?? 0)
                      return (
                        <tr key={sv.id} className={`hover:bg-slate-50 transition-colors ${rate >= 20 ? "bg-red-50/40" : ""}`}>
                          <td className="py-3 px-4 text-slate-500 text-center font-medium">{stt}</td>
                          <td className="py-3 px-4 font-mono font-medium text-slate-700 text-xs">{sv.ma_sinh_vien}</td>
                          <td className="py-3 px-4 font-medium text-slate-800">{sv.ho_ten}</td>
                          <td className="py-3 px-4 text-center text-slate-600">{sv.tong_buoi}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={vangColor(sv.ty_le_vang)}>{vang}</span>
                          </td>
                          <td className="py-3 px-4 text-center text-amber-600">{sv.so_buoi_tre ?? 0}</td>
                          <td className="py-3 px-4 text-center text-blue-600">{sv.so_buoi_co_phep ?? 0}</td>
                          <td className="py-3 px-4 text-center text-emerald-700">{sv.so_buoi_co_mat ?? 0}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`text-sm ${vangColor(sv.ty_le_vang)}`}>{rate.toFixed(1)}%</span>
                          </td>
                          <td className="py-3 px-4">{riskBadge(sv.ty_le_vang)}</td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setSelectedStudent(sv)}
                                className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-indigo-100 hover:bg-indigo-100 transition-colors flex items-center gap-1"
                                title="Xem LS Chuyên cần & Sửa"
                              >
                                Chi tiết
                              </button>
                              <button
                                onClick={() => handleRemoveStudent(sv)}
                                className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-100 hover:bg-red-100 transition-colors"
                                title="Xoá sinh viên khỏi lớp"
                              >
                                Xoá
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pag && pag.totalPages > 1 && (
              <PaginationBar pag={pag} onChange={handlePageChange} />
            )}
            {pag && pag.totalPages <= 1 && students.length > 0 && (
              <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-400">
                Tổng {pag.total} sinh viên
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 px-1">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-red-50 border border-red-200 inline-block" />
              Cấm thi: vắng ≥ 20%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-orange-50 border border-orange-200 inline-block" />
              Cảnh báo: vắng 10–20%
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-50 border border-emerald-200 inline-block" />
              Bình thường: vắng &lt; 10%
            </span>
          </div>
        </>
      )}

      {selectedStudent && (
        <StudentHistoryModal
          student={selectedStudent}
          classId={id as string}
          onClose={() => setSelectedStudent(null)}
          onUpdateSuccess={() => {
            // Tải lại 2 list nếu có sửa đổi
            setLoadStd(true)
            api.get(`/course-classes/${id}/students`, {
              params: { page, limit: PAGE_SIZE, keyword },
            }).then(res => {
              setStudents(res.data.data ?? [])
              setPag(res.data.pagination ?? null)
            }).finally(() => setLoadStd(false))
          }}
        />
      )}

      {showNotificationModal && summary && (
        <SendNotificationModal
          classId={id as string}
          classNameStr={summary.ten_hoc_phan + " (" + summary.ma_lop + ")"}
          onClose={() => setShowNotificationModal(false)}
        />
      )}
    </div>
  )
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
const COLOR_MAP = {
  blue: { wrap: "bg-blue-50 text-blue-600", text: "text-[#185FA5]" },
  emerald: { wrap: "bg-emerald-50 text-emerald-600", text: "text-emerald-700" },
  red: { wrap: "bg-red-50 text-red-500", text: "text-red-600" },
  indigo: { wrap: "bg-indigo-50 text-indigo-600", text: "text-indigo-700" },
} as const

function StatCard({
  icon, color, label, value,
}: {
  icon: React.ReactNode
  color: keyof typeof COLOR_MAP
  label: string
  value: string | number
}) {
  const c = COLOR_MAP[color]
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${c.wrap}`}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wide leading-tight">{label}</p>
        <p className={`text-lg font-medium mt-0.5 ${c.text}`}>{value}</p>
      </div>
    </div>
  )
}
