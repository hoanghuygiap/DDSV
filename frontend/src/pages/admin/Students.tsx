import { useEffect, useState } from "react"
import { Search, UserPlus, Pencil, Trash2, X, Loader2, LockKeyhole, Unlock, ChevronLeft, ChevronRight } from "lucide-react"
import { UserService } from "@/services/user.service"
import type { UserAccount, UserPayload } from "@/types/user.type"

const PAGE_SIZE = 20
const EMPTY_FORM: UserPayload = { username: "", password: "", ho_ten: "", email: "", roleId: 3 }

export default function StudentsPage() {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<UserAccount | null>(null)
  const [form, setForm] = useState<UserPayload>(EMPTY_FORM)
  const [formError, setFormError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<UserAccount | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [lockTarget, setLockTarget] = useState<UserAccount | null>(null)
  const [unlockTarget, setUnlockTarget] = useState<UserAccount | null>(null)
  const [lockMinutes, setLockMinutes] = useState("15")
  const [isLocking, setIsLocking] = useState(false)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fetchUsers = async (p = page) => {
    setIsLoading(true)
    setError("")
    try {
      const res = await UserService.getAll(PAGE_SIZE, (p - 1) * PAGE_SIZE)
      setUsers(res.data ?? [])
      setTotal(res.total ?? res.data?.length ?? 0)
    } catch {
      setError("Không thể tải danh sách tài khoản. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchUsers(page) }, [page])

  // Lọc client-side trên trang hiện tại
  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.ho_ten?.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })

  const handleSearch = () => {
    setSearch(searchInput)
    setPage(1)
  }

  const openCreate = () => {
    setEditTarget(null)
    setForm(EMPTY_FORM)
    setFormError("")
    setShowModal(true)
  }

  const openEdit = (user: UserAccount) => {
    setEditTarget(user)
    setForm({ username: user.username, password: "", ho_ten: user.ho_ten, email: user.email, roleId: 3 })
    setFormError("")
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.ho_ten || !form.email) {
      setFormError("Vui lòng điền đầy đủ các trường bắt buộc.")
      return
    }
    if (!editTarget && !form.username) { setFormError("Tên đăng nhập là bắt buộc."); return }
    if (!editTarget && !form.password) { setFormError("Mật khẩu là bắt buộc."); return }

    setIsSaving(true)
    setFormError("")
    try {
      if (editTarget) {
        await UserService.update(editTarget.id, { ho_ten: form.ho_ten, email: form.email })
      } else {
        await UserService.create({ ...form, roleId: 3 })
      }
      setShowModal(false)
      fetchUsers(page)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Có lỗi xảy ra."
      setFormError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await UserService.remove(deleteTarget.id)
      setDeleteTarget(null)
      fetchUsers(page)
    } catch {
      alert("Xóa thất bại. Vui lòng thử lại.")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleLock = async () => {
    if (!lockTarget) return
    setIsLocking(true)
    try {
      await UserService.lock(lockTarget.id, Number(lockMinutes) || 15)
      setLockTarget(null)
      fetchUsers(page)
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
      await UserService.unlock(unlockTarget.id)
      setUnlockTarget(null)
      fetchUsers(page)
    } catch {
      alert("Mở khóa thất bại.")
    } finally {
      setIsLocking(false)
    }
  }

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return
    setPage(p)
  }

  const pageNumbers = () => {
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
    return pages
  }

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e325c]">Quản lý Sinh viên</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý tài khoản sinh viên trong hệ thống.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72 flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-slate-400" />
              </div>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082] shadow-sm"
                placeholder="Tìm tên, username, email..."
              />
            </div>
            {searchInput && (
              <button
                onClick={() => { setSearchInput(""); setSearch("") }}
                className="px-3 py-2 border border-slate-200 rounded-md text-sm text-slate-500 hover:bg-slate-50"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={openCreate}
            className="flex items-center justify-center gap-2 bg-[#007082] hover:bg-[#005c6b] text-white rounded-md px-4 py-2 text-sm font-bold shadow-sm transition-colors whitespace-nowrap h-[38px]"
          >
            <UserPlus size={18} />
            <span>Thêm sinh viên</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-4">
        {error && <div className="p-4 bg-red-50 border-b border-red-100 text-sm text-red-600">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Họ và Tên</th>
                <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                <th className="px-6 py-4 font-bold tracking-wider">Lần đăng nhập cuối</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Loader2 size={28} className="animate-spin" />
                      <span className="text-sm">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-sm text-slate-400">
                    {search ? "Không tìm thấy sinh viên phù hợp." : "Chưa có sinh viên nào."}
                  </td>
                </tr>
              ) : (
                filtered.map((user) => {
                  const initials = user.ho_ten
                    ? user.ho_ten.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
                    : user.username.slice(0, 2).toUpperCase()
                  return (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#1e325c]/10 flex items-center justify-center font-bold text-sm text-[#1e325c] shrink-0">
                            {initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-[#007082] text-[15px]">{user.ho_ten || "—"}</span>
                            <span className="text-xs text-slate-500 mt-0.5">{user.username}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-[#007082]">{user.email || "—"}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {user.last_login ? new Date(user.last_login).toLocaleString("vi-VN") : "Chưa đăng nhập"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.kich_hoat ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Bị khóa
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          {user.kich_hoat ? (
                            <button onClick={() => { setLockMinutes("15"); setLockTarget(user) }}
                              className="text-slate-400 hover:text-amber-500 transition-colors"
                              title="Khóa tài khoản">
                              <LockKeyhole size={18} />
                            </button>
                          ) : (
                            <button onClick={() => setUnlockTarget(user)}
                              className="text-slate-400 hover:text-emerald-500 transition-colors"
                              title="Mở khóa tài khoản">
                              <Unlock size={18} />
                            </button>
                          )}
                          <button onClick={() => openEdit(user)} className="text-slate-400 hover:text-[#007082] transition-colors" title="Chỉnh sửa">
                            <Pencil size={18} />
                          </button>
                          <button onClick={() => setDeleteTarget(user)} className="text-slate-400 hover:text-red-600 transition-colors" title="Xóa">
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
            Trang {page} / {totalPages || 1} — {total} sinh viên
          </span>
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
                <span key={`ellipsis-${idx}`} className="w-9 h-9 flex items-center justify-center text-slate-400 text-sm">…</span>
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
              disabled={page === totalPages || totalPages === 0}
              className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL THÊM / SỬA */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#1e325c]">{editTarget ? "Chỉnh sửa tài khoản" : "Thêm sinh viên mới"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {formError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{formError}</p>}
              {!editTarget && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Tên đăng nhập <span className="text-red-500">*</span></label>
                    <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="sv_nguyena" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 mb-1 block">Mật khẩu <span className="text-red-500">*</span></label>
                    <input type="password" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                      value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Tối thiểu 6 ký tự" />
                  </div>
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Họ và tên <span className="text-red-500">*</span></label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                  value={form.ho_ten} onChange={(e) => setForm({ ...form, ho_ten: e.target.value })} placeholder="Nguyễn Văn A" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Email <span className="text-red-500">*</span></label>
                <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                  value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="sv@thanglong.edu.vn" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800" disabled={isSaving}>Hủy</button>
              <button onClick={handleSave} disabled={isSaving}
                className="flex items-center gap-2 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg px-5 py-2 text-sm font-bold shadow-sm disabled:opacity-60">
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {editTarget ? "Lưu thay đổi" : "Tạo tài khoản"}
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
                <span className="font-bold text-slate-800">{lockTarget.ho_ten || lockTarget.username}</span>.
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
              <span className="font-bold text-slate-800">{unlockTarget.ho_ten || unlockTarget.username}</span>?
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
              Bạn có chắc muốn xóa tài khoản <span className="font-bold text-slate-800">{deleteTarget.ho_ten || deleteTarget.username}</span>?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm font-medium text-slate-600" disabled={isDeleting}>Hủy</button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isDeleting && <Loader2 size={14} className="animate-spin" />}Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
