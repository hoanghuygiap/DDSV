import { useEffect, useState } from "react"
import {
  Search, Book, Users, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight, Loader2, Filter, X,
} from "lucide-react"
import api from "@/api/axios"

interface CourseClass {
  id: number
  ma_lop: string
  ma_hoc_phan: string | null
  ten_hoc_phan: string | null
  ma_giang_vien: string | null
  ten_giang_vien: string | null
  ten_ky: string | null
  so_sinh_vien: number
}

interface Semester {
  id: number
  ten_ky: string
  bat_dau: string
  ket_thuc: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const PAGE_SIZE = 20

type AppliedFilters = { keyword: string; semesterId: string }

export default function ClassesPage() {
  const [classes,    setClasses]    = useState<CourseClass[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 })
  const [page,       setPage]       = useState(1)
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState("")

  const [semesters,       setSemesters]       = useState<Semester[]>([])
  const [inputKeyword,    setInputKeyword]    = useState("")
  const [inputSemesterId, setInputSemesterId] = useState("")
  const [applied,         setApplied]         = useState<AppliedFilters>({ keyword: "", semesterId: "" })

  // Load semester list once
  useEffect(() => {
    api.get("/semesters")
      .then(res => setSemesters(res.data?.data ?? []))
      .catch(() => {})
  }, [])

  // Load classes whenever page or applied filters change
  useEffect(() => {
    fetchClasses(page, applied)
  }, [page, applied]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchClasses(p: number, appl: AppliedFilters) {
    setIsLoading(true)
    setError("")
    try {
      const params: Record<string, string | number> = { page: p, limit: PAGE_SIZE }
      if (appl.keyword)    params.keyword     = appl.keyword
      if (appl.semesterId) params.semester_id = appl.semesterId

      const res = await api.get("/course-classes", { params })
      setClasses(res.data?.data ?? [])
      setPagination(res.data?.pagination ?? { total: 0, page: p, limit: PAGE_SIZE, totalPages: 1 })
    } catch {
      setError("Không thể tải danh sách lớp học. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  // Client-side filter fallback (covers cases where API ignores params)
  const filtered = (() => {
    let data = classes
    if (applied.keyword) {
      const q = applied.keyword.toLowerCase()
      data = data.filter(c =>
        c.ma_lop.toLowerCase().includes(q) ||
        (c.ten_hoc_phan ?? "").toLowerCase().includes(q) ||
        (c.ma_hoc_phan  ?? "").toLowerCase().includes(q) ||
        (c.ten_giang_vien ?? "").toLowerCase().includes(q)
      )
    }
    if (applied.semesterId) {
      const sem = semesters.find(s => String(s.id) === applied.semesterId)
      if (sem) data = data.filter(c => c.ten_ky === sem.ten_ky)
    }
    return data
  })()

  const hasApplied    = applied.keyword !== "" || applied.semesterId !== ""
  const hasInputDirty = inputKeyword !== applied.keyword || inputSemesterId !== applied.semesterId

  function applyFilters() {
    setPage(1)
    setApplied({ keyword: inputKeyword, semesterId: inputSemesterId })
  }

  function clearFilters() {
    setInputKeyword("")
    setInputSemesterId("")
    setPage(1)
    setApplied({ keyword: "", semesterId: "" })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") applyFilters()
  }

  function goToPage(p: number) {
    if (p < 1 || p > pagination.totalPages) return
    setPage(p)
  }

  function pageNumbers(): (number | "…")[] {
    const total = pagination.totalPages
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
    const pages: (number | "…")[] = [1]
    if (page > 3) pages.push("…")
    for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) pages.push(i)
    if (page < total - 2) pages.push("…")
    pages.push(total)
    return pages
  }

  const semesterName = applied.semesterId
    ? semesters.find(s => String(s.id) === applied.semesterId)?.ten_ky ?? "—"
    : ""

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-[22px] font-medium text-[#185FA5]">Quản lý Lớp môn học</h1>
        <p className="text-sm text-slate-500 mt-1">Danh sách các lớp học theo học phần và học kỳ.</p>
      </div>

      {/* STAT CARD */}
      <div className="mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between max-w-xs">
          <div className="flex justify-between items-start mb-3">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng lớp môn học</p>
            <div className="p-2 rounded-md bg-[#185FA5] text-white">
              <Book size={18} strokeWidth={2} />
            </div>
          </div>
          <h3 className="text-3xl font-medium text-slate-800">{pagination.total.toLocaleString("vi-VN")}</h3>
          {hasApplied && (
            <p className="text-xs text-slate-400 mt-2">Kết quả bộ lọc: {filtered.length} lớp trang này</p>
          )}
        </div>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">

        {/* FILTER BAR */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex flex-wrap items-end gap-3">

            {/* Keyword */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Tìm kiếm</label>
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={inputKeyword}
                  onChange={e => setInputKeyword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Mã lớp, môn học, giảng viên..."
                  className="h-9 pl-9 pr-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[240px]"
                />
              </div>
            </div>

            {/* Học kỳ */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Học kỳ</label>
              <select
                value={inputSemesterId}
                onChange={e => setInputSemesterId(e.target.value)}
                className="h-9 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[200px]"
              >
                <option value="">-- Tất cả học kỳ --</option>
                {semesters.map(s => (
                  <option key={s.id} value={String(s.id)}>{s.ten_ky}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
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

          {/* Active chips */}
          {hasApplied && (
            <div className="flex flex-wrap gap-2 mt-3">
              {applied.keyword && (
                <span className="inline-flex items-center gap-1.5 bg-[#185FA5]/10 text-[#185FA5] text-xs px-2.5 py-1 rounded-full font-medium">
                  <Search size={11} />
                  {applied.keyword}
                </span>
              )}
              {applied.semesterId && (
                <span className="inline-flex items-center gap-1.5 bg-[#185FA5]/10 text-[#185FA5] text-xs px-2.5 py-1 rounded-full font-medium">
                  {semesterName}
                </span>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>
        )}

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase text-slate-500 bg-slate-100/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider">Môn học</th>
                <th className="px-6 py-4 font-medium tracking-wider">Mã lớp</th>
                <th className="px-6 py-4 font-medium tracking-wider">Giảng viên</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">Mã GV</th>
                <th className="px-6 py-4 font-medium tracking-wider text-center">Số SV</th>
                <th className="px-6 py-4 font-medium tracking-wider">Học kỳ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 size={28} className="animate-spin" />
                      <span className="text-sm">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                    {hasApplied ? "Không tìm thấy lớp phù hợp với bộ lọc." : "Chưa có lớp môn học nào."}
                  </td>
                </tr>
              ) : (
                filtered.map(cls => (
                  <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#185FA5]">{cls.ten_hoc_phan || "—"}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{cls.ma_hoc_phan || "—"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {cls.ma_lop}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      {cls.ten_giang_vien || <span className="text-slate-300">Chưa phân công</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cls.ma_giang_vien
                        ? <span className="font-mono text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{cls.ma_giang_vien}</span>
                        : <span className="text-slate-300">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 font-medium text-[#185FA5]">
                        <Users size={14} className="text-slate-400" />
                        {cls.so_sinh_vien}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {cls.ten_ky ? (
                        <span className="inline-flex px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-medium">
                          {cls.ten_ky}
                        </span>
                      ) : (
                        <span className="text-slate-300 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-slate-500 font-normal">
            Trang{" "}
            <span className="font-medium text-slate-700">{page}</span>
            {" / "}
            <span className="font-medium text-slate-700">{pagination.totalPages}</span>
            {" · "}
            {pagination.total.toLocaleString("vi-VN")} lớp
          </span>
          {pagination.totalPages > 1 && (
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
          )}
        </div>
      </div>
    </div>
  )
}
