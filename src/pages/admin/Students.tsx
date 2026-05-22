import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search, UserPlus, Pencil, Trash2, X, Loader2,
  LockKeyhole, Unlock, ChevronLeft, ChevronRight,
  SlidersHorizontal,
} from "lucide-react"
import api from "@/api/axios"
import { UserService } from "@/services/user.service"
import { StudentService, type StudentListItem, type StudentCreatePayload } from "@/services/student.service"

interface Faculty { id: number; ten_khoa: string }
interface Major   { id: number; ten_nganh: string; khoa_id: number }

const PAGE_SIZE = 20
const EMPTY_FORM: StudentCreatePayload & { editMode?: boolean } = {
  username: "", password: "", ho_ten: "", email: "", sdt: "", ma_sinh_vien: "",
}

export default function StudentsPage() {
  const navigate = useNavigate()

  const [students, setStudents]   = useState<StudentListItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [keyword, setKeyword]     = useState("")
  const [keywordInput, setKeywordInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError]         = useState("")

  // Filter options
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [majors, setMajors]       = useState<Major[]>([])

  // Active filters
  const [filterKhoa, setFilterKhoa]     = useState<number | "">("")
  const [filterNganh, setFilterNganh]   = useState<number | "">("")
  const [filterStatus, setFilterStatus] = useState<"" | "true" | "false">("")

  // Modal thêm / sửa
  const [showModal, setShowModal]     = useState(false)
  const [editTarget, setEditTarget]   = useState<StudentListItem | null>(null)
  const [form, setForm]               = useState(EMPTY_FORM)
  const [formError, setFormError]     = useState("")
  const [isSaving, setIsSaving]       = useState(false)

  // Modal xóa
  const [deleteTarget, setDeleteTarget] = useState<StudentListItem | null>(null)
  const [isDeleting, setIsDeleting]     = useState(false)

  // Modal khóa / mở khóa
  const [lockTarget, setLockTarget]     = useState<StudentListItem | null>(null)
  const [unlockTarget, setUnlockTarget] = useState<StudentListItem | null>(null)
  const [lockMinutes, setLockMinutes]   = useState("15")
  const [isLocking, setIsLocking]       = useState(false)

  // ─── Load filter options once ────────────────────────────
  useEffect(() => {
    Promise.all([
      api.get("/faculties"),
      api.get("/majors"),
    ]).then(([fRes, mRes]) => {
      setFaculties(fRes.data.data ?? [])
      setMajors(mRes.data.data ?? [])
    }).catch(() => {/* silent — filters just won't populate */})
  }, [])

  // ─── Fetch students ──────────────────────────────────────
  const fetchStudents = async (p: number, kw: string) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await StudentService.getList(p, PAGE_SIZE, kw, {
        khoa_id:  filterKhoa,
        nganh_id: filterNganh,
        kich_hoat: filterStatus,
      })
      setStudents(res.data ?? [])
      setTotal(res.pagination?.total ?? 0)
      setTotalPages(res.pagination?.totalPages ?? 1)
    } catch {
      setError("Không thể tải danh sách sinh viên. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchStudents(page, keyword) }, [page, keyword, filterKhoa, filterNganh, filterStatus])

  // ─── Derived ─────────────────────────────────────────────
  const filteredMajors = majors.filter(m => !filterKhoa || m.khoa_id === filterKhoa)
  const activeFilterCount = (filterKhoa ? 1 : 0) + (filterNganh ? 1 : 0) + (filterStatus !== "" ? 1 : 0)

  // ─── Search ──────────────────────────────────────────────
  const handleSearch = () => { setPage(1); setKeyword(keywordInput) }
  const clearSearch  = () => { setKeywordInput(""); setKeyword(""); setPage(1) }

  const clearAllFilters = () => {
    setFilterKhoa("")
    setFilterNganh("")
    setFilterStatus("")
    setPage(1)
  }

  // ─── Create / Edit ───────────────────────────────────────
  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError("")
    setShowModal(true)
  }

  const openEdit = (sv: StudentListItem) => {
    setEditTarget(sv)
    setForm({ username: sv.username, password: "", ho_ten: sv.ho_ten, email: sv.email, sdt: sv.sdt ?? "", ma_sinh_vien: sv.ma_sinh_vien })
    setFormError("")
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.ho_ten || !form.email) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc."); return
    }
    if (!editTarget) {
      if (!form.username)     { setFormError("Tên đăng nhập là bắt buộc."); return }
      if (!form.password)     { setFormError("Mật khẩu là bắt buộc."); return }
      if (!form.ma_sinh_vien) { setFormError("Mã sinh viên là bắt buộc."); return }
      if (!form.sdt)          { setFormError("Số điện thoại là bắt buộc."); return }
    }

    setIsSaving(true)
    setFormError("")
    try {
      if (editTarget) {
        await UserService.update(editTarget.tai_khoan_id, { ho_ten: form.ho_ten, email: form.email })
      } else {
        await StudentService.create(form)
      }
      setShowModal(false)
      fetchStudents(page, keyword)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Có lỗi xảy ra."
      setFormError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  // ─── Delete ──────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await StudentService.remove(deleteTarget.id)
      setDeleteTarget(null)
      const newPage = students.length === 1 && page > 1 ? page - 1 : page
      setPage(newPage)
      fetchStudents(newPage, keyword)
    } catch {
      alert("Xóa thất bại. Vui lòng thử lại.")
    } finally {
      setIsDeleting(false)
    }
  }

  // ─── Lock / Unlock ───────────────────────────────────────
  const handleLock = async () => {
    if (!lockTarget) return
    setIsLocking(true)
    try {
      await UserService.lock(lockTarget.tai_khoan_id, Number(lockMinutes) || 15)
      setLockTarget(null)
      fetchStudents(page, keyword)
    } catch { alert("Khóa tài khoản thất bại.") }
    finally { setIsLocking(false) }
  }

  const handleUnlock = async () => {
    if (!unlockTarget) return
    setIsLocking(true)
    try {
      await UserService.unlock(unlockTarget.tai_khoan_id)
      setUnlockTarget(null)
      fetchStudents(page, keyword)
    } catch { alert("Mở khóa thất bại.") }
    finally { setIsLocking(false) }
  }

  // ─── Pagination ──────────────────────────────────────────
  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  const pageNumbers = (): (number | "…")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | "…")[] = [1]
    if (page > 3) pages.push("…")
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
    if (page < totalPages - 2) pages.push("…")
    pages.push(totalPages)
    return pages
  }

  // ─── Render ──────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1e325c]">Quản lý Sinh viên</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản sinh viên trong hệ thống.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex gap-2 w-full md:w-80">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082] shadow-sm"
                placeholder="Tên, mã SV, email, SĐT..."
              />
            </div>
            {keywordInput && (
              <button onClick={clearSearch}
                className="px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-500 hover:bg-slate-50">
                <X size={16} />
              </button>
            )}
            <button onClick={handleSearch}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md text-sm font-medium text-slate-600 transition-colors">
              Tìm
            </button>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 bg-[#007082] hover:bg-[#005c6b] text-white rounded-md px-4 py-2 text-sm font-bold shadow-sm transition-colors whitespace-nowrap h-[38px]">
            <UserPlus size={18} />
            <span>Thêm sinh viên</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-4 py-3 mb-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-500 shrink-0">
          <SlidersHorizontal size={15} />
          <span className="text-xs font-bold uppercase tracking-wider">Bộ lọc</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#007082] text-white text-[10px] font-bold flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </div>

        {/* Khoa */}
        <select
          value={filterKhoa}
          onChange={(e) => {
            setFilterKhoa(e.target.value ? Number(e.target.value) : "")
            setFilterNganh("")
            setPage(1)
          }}
          className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#007082] min-w-[160px]"
        >
          <option value="">Tất cả khoa</option>
          {faculties.map(f => (
            <option key={f.id} value={f.id}>{f.ten_khoa}</option>
          ))}
        </select>

        {/* Ngành */}
        <select
          value={filterNganh}
          onChange={(e) => { setFilterNganh(e.target.value ? Number(e.target.value) : ""); setPage(1) }}
          disabled={filteredMajors.length === 0}
          className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#007082] min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Tất cả ngành</option>
          {filteredMajors.map(m => (
            <option key={m.id} value={m.id}>{m.ten_nganh}</option>
          ))}
        </select>

        {/* Trạng thái */}
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value as "" | "true" | "false"); setPage(1) }}
          className="border border-slate-200 rounded-md px-3 py-1.5 text-sm bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-[#007082] min-w-[140px]"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="true">Hoạt động</option>
          <option value="false">Bị khóa</option>
        </select>

        {/* Xóa bộ lọc */}
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-red-600 hover:text-red-700 border border-red-100 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
          >
            <X size={12} />
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-4">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Sinh viên</th>
                <th className="px-6 py-4 font-bold tracking-wider">Mã SV</th>
                <th className="px-6 py-4 font-bold tracking-wider">Email / SĐT</th>
                <th className="px-6 py-4 font-bold tracking-wider">Lớp hành chính</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Thao tác</th>
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
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                    {keyword || activeFilterCount > 0
                      ? "Không tìm thấy sinh viên phù hợp với bộ lọc."
                      : "Chưa có sinh viên nào."}
                  </td>
                </tr>
              ) : (
                students.map((sv) => {
                  const initials = sv.ho_ten
                    ? sv.ho_ten.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
                    : sv.username.slice(0, 2).toUpperCase()
                  return (
                    <tr key={sv.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1e325c]/10 flex items-center justify-center font-bold text-xs text-[#1e325c] shrink-0">
                            {initials}
                          </div>
                          <div>
                            <button
                              onClick={() => navigate(`/dashboard/students/${sv.id}`)}
                              className="font-bold text-[#007082] text-[15px] hover:underline text-left">
                              {sv.ho_ten || "—"}
                            </button>
                            <p className="text-xs text-slate-400">{sv.username}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-mono text-sm text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {sv.ma_sinh_vien || "—"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <p className="text-[#007082] font-medium text-sm">{sv.email || "—"}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{sv.sdt || "—"}</p>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-600">
                        {sv.ten_lop || <span className="text-slate-300">—</span>}
                      </td>

                      <td className="px-6 py-4 text-center">
                        {sv.kich_hoat ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Bị khóa
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          {sv.kich_hoat ? (
                            <button onClick={() => { setLockMinutes("15"); setLockTarget(sv) }}
                              className="text-slate-400 hover:text-amber-500 transition-colors" title="Khóa tài khoản">
                              <LockKeyhole size={17} />
                            </button>
                          ) : (
                            <button onClick={() => setUnlockTarget(sv)}
                              className="text-slate-400 hover:text-emerald-500 transition-colors" title="Mở khóa">
                              <Unlock size={17} />
                            </button>
                          )}
                          <button onClick={() => openEdit(sv)}
                            className="text-slate-400 hover:text-[#007082] transition-colors" title="Chỉnh sửa">
                            <Pencil size={17} />
                          </button>
                          <button onClick={() => setDeleteTarget(sv)}
                            className="text-slate-400 hover:text-red-600 transition-colors" title="Xóa">
                            <Trash2 size={17} />
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

        {/* PAGINATION */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-slate-500">
            Hiển thị{" "}
            <span className="font-bold text-slate-700">
              {students.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–{(page - 1) * PAGE_SIZE + students.length}
            </span>{" "}
            trong <span className="font-bold text-slate-700">{total}</span> sinh viên
          </span>
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
                  className={`w-9 h-9 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                    p === page ? "bg-[#1e325c] text-white" : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}>
                  {p}
                </button>
              )
            )}
            <button onClick={() => goToPage(page + 1)} disabled={page >= totalPages}
              className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL THÊM / SỬA ───────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#1e325c]">
                {editTarget ? "Chỉnh sửa sinh viên" : "Thêm sinh viên mới"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>
              )}

              {!editTarget && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Tên đăng nhập <span className="text-red-500">*</span></label>
                    <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="a12345" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Mật khẩu <span className="text-red-500">*</span></label>
                    <input type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Tối thiểu 6 ký tự" />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Họ và tên <span className="text-red-500">*</span></label>
                  <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                    value={form.ho_ten} onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
                    placeholder="Nguyễn Văn A" />
                </div>
                {!editTarget && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Mã sinh viên <span className="text-red-500">*</span></label>
                    <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.ma_sinh_vien} onChange={(e) => setForm({ ...form, ma_sinh_vien: e.target.value })}
                      placeholder="A12345" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                    value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="sv@thanglong.edu.vn" />
                </div>
                {!editTarget && (
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Số điện thoại <span className="text-red-500">*</span></label>
                    <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.sdt} onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                      placeholder="09xxxxxxxx" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
              <button onClick={() => setShowModal(false)} disabled={isSaving}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Hủy</button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg px-5 py-2 text-sm font-bold shadow-sm disabled:opacity-60">
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {editTarget ? "Lưu thay đổi" : "Tạo sinh viên"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL KHÓA TÀI KHOẢN ────────────────────────────── */}
      {lockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                <LockKeyhole size={20} className="text-amber-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Khóa tài khoản</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-500">
                Bạn sắp khóa tài khoản của{" "}
                <span className="font-bold text-slate-800">{lockTarget.ho_ten || lockTarget.username}</span>.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-2 block">Thời gian khóa</label>
                <div className="flex gap-2 mb-3">
                  {["15", "30", "60"].map((m) => (
                    <button key={m} onClick={() => setLockMinutes(m)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                        lockMinutes === m ? "bg-amber-500 text-white border-amber-500" : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}>
                      {m} phút
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} value={lockMinutes}
                    onChange={(e) => setLockMinutes(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                    placeholder="Tùy chỉnh số phút" />
                  <span className="text-sm text-slate-500 whitespace-nowrap">phút</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
              <button onClick={() => setLockTarget(null)} disabled={isLocking}
                className="px-4 py-2 text-sm font-medium text-slate-600">Hủy</button>
              <button onClick={handleLock} disabled={isLocking}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isLocking && <Loader2 size={14} className="animate-spin" />}
                Khóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL MỞ KHÓA ───────────────────────────────────── */}
      {unlockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                <Unlock size={20} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Mở khóa tài khoản</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc muốn mở khóa tài khoản của{" "}
              <span className="font-bold text-slate-800">{unlockTarget.ho_ten || unlockTarget.username}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setUnlockTarget(null)} disabled={isLocking}
                className="px-4 py-2 text-sm font-medium text-slate-600">Hủy</button>
              <button onClick={handleUnlock} disabled={isLocking}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isLocking && <Loader2 size={14} className="animate-spin" />}
                Mở khóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL XÁC NHẬN XÓA ──────────────────────────────── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Xác nhận xóa</h2>
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc muốn xóa sinh viên{" "}
              <span className="font-bold text-slate-800">{deleteTarget.ho_ten || deleteTarget.username}</span>?
              Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} disabled={isDeleting}
                className="px-4 py-2 text-sm font-medium text-slate-600">Hủy</button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isDeleting && <Loader2 size={14} className="animate-spin" />}
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
