import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, UserPlus, Pencil, Trash2, X, Loader2, ChevronLeft, ChevronRight, LockKeyhole, Unlock } from "lucide-react"
import { LecturerService } from "@/services/lecturer.service"
import type { Lecturer, LecturerPayload } from "@/types/user.type"

const PAGE_SIZE = 20
const EMPTY_FORM: LecturerPayload = {
  username: "",
  password: "",
  ho_ten: "",
  email: "",
  sdt: "",
  ma_giang_vien: "",
}

export default function LecturersPage() {
  const navigate = useNavigate()
  const [lecturers, setLecturers] = useState<Lecturer[]>([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Lecturer | null>(null)
  const [form, setForm] = useState<LecturerPayload>(EMPTY_FORM)
  const [formError, setFormError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Lecturer | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [lockTarget, setLockTarget] = useState<Lecturer | null>(null)
  const [unlockTarget, setUnlockTarget] = useState<Lecturer | null>(null)
  const [lockMinutes, setLockMinutes] = useState("15")
  const [isLocking, setIsLocking] = useState(false)

  // Derived: filter + paginate client-side
  const filtered = lecturers.filter((l) => {
    const q = search.toLowerCase()
    return (
      l.ho_ten.toLowerCase().includes(q) ||
      l.ma_giang_vien.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
    )
  })
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const fetchLecturers = async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await LecturerService.getAll()
      setLecturers(data)
    } catch {
      setError("Không thể tải danh sách giảng viên. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchLecturers() }, [])

  // Reset về trang 1 khi search thay đổi
  useEffect(() => { setPage(1) }, [search])

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError("")
    setShowModal(true)
  }

  const openEdit = (lecturer: Lecturer) => {
    setEditTarget(lecturer)
    setForm({
      username: lecturer.username,
      password: "",
      ho_ten: lecturer.ho_ten,
      email: lecturer.email,
      sdt: lecturer.sdt || "",
      ma_giang_vien: lecturer.ma_giang_vien,
    })
    setFormError("")
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.ho_ten || !form.email || !form.ma_giang_vien) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc.")
      return
    }
    if (!editTarget && !form.username) { setFormError("Tên đăng nhập là bắt buộc khi tạo mới."); return }
    if (!editTarget && !form.password) { setFormError("Mật khẩu là bắt buộc khi tạo mới."); return }

    setIsSaving(true)
    setFormError("")
    try {
      if (editTarget) {
        await LecturerService.update(editTarget.id, {
          ho_ten: form.ho_ten,
          email: form.email,
          sdt: form.sdt || undefined,
        })
      } else {
        await LecturerService.create(form)
      }
      setShowModal(false)
      fetchLecturers()
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Có lỗi xảy ra. Vui lòng thử lại."
      setFormError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLock = async () => {
    if (!lockTarget) return
    setIsLocking(true)
    try {
      await LecturerService.lock(lockTarget.tai_khoan_id, Number(lockMinutes) || 15)
      setLockTarget(null)
      fetchLecturers()
    } catch {
      alert("Khóa tài khoản thất bại.")
    } finally {
      setIsLocking(false)
    }
  }

  const handleUnlock = async () => {
    if (!unlockTarget) return
    setIsLocking(true)
    try {
      await LecturerService.unlock(unlockTarget.tai_khoan_id)
      setUnlockTarget(null)
      fetchLecturers()
    } catch {
      alert("Mở khóa thất bại.")
    } finally {
      setIsLocking(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await LecturerService.remove(deleteTarget.id)
      setDeleteTarget(null)
      fetchLecturers()
    } catch {
      alert("Xóa thất bại. Vui lòng thử lại.")
    } finally {
      setIsDeleting(false)
    }
  }

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

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e325c]">Quản lý Giảng viên</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và cập nhật thông tin giảng viên trong hệ thống.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082] shadow-sm"
              placeholder="Tìm theo tên, mã GV, email..."
            />
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 bg-[#007082] hover:bg-[#005c6b] text-white rounded-md px-4 py-2 text-sm font-bold shadow-sm transition-colors whitespace-nowrap h-[38px]"
          >
            <UserPlus size={18} />
            <span>Thêm giảng viên</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-6">
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Họ và Tên</th>
                <th className="px-6 py-4 font-bold tracking-wider">Mã GV</th>
                <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                <th className="px-6 py-4 font-bold tracking-wider">Số điện thoại</th>
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
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-sm text-slate-400">
                    {search ? "Không tìm thấy giảng viên phù hợp." : "Chưa có giảng viên nào."}
                  </td>
                </tr>
              ) : (
                paginated.map((lecturer) => {
                  const initials = lecturer.ho_ten
                    .split(" ")
                    .slice(-2)
                    .map((w: string) => w[0])
                    .join("")
                    .toUpperCase()
                  return (
                    <tr key={lecturer.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1e325c]/10 flex items-center justify-center font-bold text-sm text-[#1e325c] shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <button onClick={() => navigate(`/dashboard/lecturers/${lecturer.id}`)}
                              className="font-bold text-[#007082] text-[15px] text-left hover:underline">
                              {lecturer.ho_ten}
                            </button>
                            <span className="text-xs text-slate-500 mt-0.5">{lecturer.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{lecturer.ma_giang_vien}</td>
                      <td className="px-6 py-4 font-medium text-[#007082]">{lecturer.email}</td>
                      <td className="px-6 py-4 text-slate-600">{lecturer.sdt || "—"}</td>
                      <td className="px-6 py-4 text-center">
                        {lecturer.kich_hoat ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Bị khóa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          {lecturer.kich_hoat ? (
                            <button onClick={() => { setLockMinutes("15"); setLockTarget(lecturer) }}
                              className="text-slate-400 hover:text-amber-500 transition-colors"
                              title="Khóa tài khoản">
                              <LockKeyhole size={18} />
                            </button>
                          ) : (
                            <button onClick={() => setUnlockTarget(lecturer)}
                              className="text-slate-400 hover:text-emerald-500 transition-colors"
                              title="Mở khóa tài khoản">
                              <Unlock size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => openEdit(lecturer)}
                            className="text-slate-400 hover:text-[#007082] transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(lecturer)}
                            className="text-slate-400 hover:text-red-600 transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
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

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-sm text-slate-500 font-medium">
            Trang {page} / {totalPages || 1} — {filtered.length} giảng viên
          </span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {pageNumbers().map((p, idx) =>
                p === "…" ? (
                  <span key={`e-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => goToPage(p as number)}
                    className={`w-9 h-9 flex items-center justify-center rounded text-sm font-bold transition-colors ${
                      p === page
                        ? "bg-[#1e325c] text-white"
                        : "border border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL THÊM / SỬA */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#1e325c]">
                {editTarget ? "Chỉnh sửa giảng viên" : "Thêm giảng viên mới"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              {!editTarget && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">
                      Tên đăng nhập <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="vd: gv_nguyen"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">
                      Mật khẩu <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Tối thiểu 6 ký tự"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                  value={form.ho_ten}
                  onChange={(e) => setForm({ ...form, ho_ten: e.target.value })}
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="gv@thanglong.edu.vn"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1 block">
                    Mã giảng viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                    value={form.ma_giang_vien}
                    onChange={(e) => setForm({ ...form, ma_giang_vien: e.target.value })}
                    placeholder="CTI001"
                    disabled={!!editTarget}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Số điện thoại</label>
                <input
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                  value={form.sdt}
                  onChange={(e) => setForm({ ...form, sdt: e.target.value })}
                  placeholder="0901234567"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                disabled={isSaving}
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg px-5 py-2 text-sm font-bold shadow-sm transition-colors disabled:opacity-60"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {editTarget ? "Lưu thay đổi" : "Tạo giảng viên"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KHÓA TÀI KHOẢN */}
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
                <span className="font-bold text-slate-800">{lockTarget.ho_ten}</span>.
              </p>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-2 block">Thời gian khóa</label>
                <div className="flex gap-2 mb-3">
                  {["15", "30", "60"].map((m) => (
                    <button key={m} onClick={() => setLockMinutes(m)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                        lockMinutes === m
                          ? "bg-amber-500 text-white border-amber-500"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}>
                      {m} phút
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={1}
                    value={lockMinutes}
                    onChange={(e) => setLockMinutes(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-amber-400"
                    placeholder="Tùy chỉnh số phút"
                  />
                  <span className="text-sm text-slate-500 whitespace-nowrap">phút</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
              <button onClick={() => setLockTarget(null)} className="px-4 py-2 text-sm font-medium text-slate-600" disabled={isLocking}>Hủy</button>
              <button onClick={handleLock} disabled={isLocking}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isLocking && <Loader2 size={14} className="animate-spin" />}
                Khóa tài khoản
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MỞ KHÓA TÀI KHOẢN */}
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
              <span className="font-bold text-slate-800">{unlockTarget.ho_ten}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setUnlockTarget(null)} className="px-4 py-2 text-sm font-medium text-slate-600" disabled={isLocking}>Hủy</button>
              <button onClick={handleUnlock} disabled={isLocking}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isLocking && <Loader2 size={14} className="animate-spin" />}
                Mở khóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL XÁC NHẬN XÓA */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-2">Xác nhận xóa</h2>
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc muốn xóa giảng viên{" "}
              <span className="font-bold text-slate-800">{deleteTarget.ho_ten}</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                disabled={isDeleting}
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 text-sm font-bold shadow-sm transition-colors disabled:opacity-60"
              >
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
