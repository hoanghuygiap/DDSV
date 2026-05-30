import { useEffect, useState } from "react"
import { Search, Book, Users, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
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

interface Pagination {
  total: number
  page: number
  limit: number
  totalPages: number
}

const PAGE_SIZE = 20

export default function ClassesPage() {
  const [classes, setClasses] = useState<CourseClass[]>([])
  const [pagination, setPagination] = useState<Pagination>({ total: 0, page: 1, limit: PAGE_SIZE, totalPages: 1 })
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchClasses = async (p: number) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await api.get("/course-classes", { params: { page: p, limit: PAGE_SIZE } })
      const body = res.data
      setClasses(body.data ?? [])
      setPagination(body.pagination ?? { total: 0, page: p, limit: PAGE_SIZE, totalPages: 1 })
    } catch {
      setError("Không thể tải danh sách lớp học. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchClasses(page) }, [page])

  // Client-side filter on current page
  const filtered = search.trim()
    ? classes.filter((c) => {
        const q = search.toLowerCase()
        return (
          c.ma_lop.toLowerCase().includes(q) ||
          (c.ten_hoc_phan ?? "").toLowerCase().includes(q) ||
          (c.ma_hoc_phan ?? "").toLowerCase().includes(q) ||
          (c.ten_giang_vien ?? "").toLowerCase().includes(q)
        )
      })
    : classes

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

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-[#185FA5]">Quản lý Lớp môn học</h1>
          <p className="text-sm text-slate-500 mt-1">Danh sách các lớp học theo học phần và học kỳ.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#185FA5] focus:border-[#185FA5] shadow-sm"
            placeholder="Lọc mã lớp, môn học, giảng viên..."
          />
        </div>
      </div>

      {/* STATS */}
      <div className="mb-6">
        <div className="bg-[#185FA5] rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[120px] max-w-xs">
          <div className="flex justify-between items-start">
            <h3 className="text-blue-200 font-medium text-xs uppercase tracking-wider">Tổng số lớp môn học</h3>
            <Book size={20} className="text-blue-200" />
          </div>
          <h2 className="text-white text-4xl font-medium mt-4">{pagination.total.toLocaleString()}</h2>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>
        )}

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
                    {search ? "Không tìm thấy lớp phù hợp trên trang này." : "Chưa có lớp môn học nào."}
                  </td>
                </tr>
              ) : (
                filtered.map((cls) => (
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
          <span className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-medium text-slate-700">
              {classes.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–{(page - 1) * PAGE_SIZE + classes.length}
            </span>{" "}
            trong <span className="font-medium text-slate-700">{pagination.total.toLocaleString()}</span> lớp
          </span>
          {pagination.totalPages > 1 && (
            <div className="flex items-center gap-1">
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
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
