import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, Loader2, LockKeyhole, Unlock, Trash2,
  Mail, Calendar, Clock, AlertTriangle, Pencil, X, BookOpen,
} from "lucide-react"
import { UserService } from "@/services/user.service"
import { StudentService, type StudentClass, type StudentProfile } from "@/services/student.service"
import type { UserAccount, UserPayload } from "@/types/user.type"

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [user, setUser] = useState<UserAccount | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null)
  const [classes, setClasses] = useState<StudentClass[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(false)
  const [classesError, setClassesError] = useState("")
  const [error, setError] = useState("")

  const [showLockModal, setShowLockModal] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [lockMinutes, setLockMinutes] = useState("15")
  const [isLocking, setIsLocking] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [showEditModal, setShowEditModal] = useState(false)
  const [editForm, setEditForm] = useState<Pick<UserPayload, "ho_ten" | "email">>({ ho_ten: "", email: "" })
  const [editError, setEditError] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const fetchUser = async () => {
    if (!id) return
    setIsLoading(true)
    setError("")
    try {
      const data = await UserService.getById(Number(id))
      setUser(data)
    } catch {
      setError("Không thể tải thông tin tài khoản.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchClasses = async () => {
    if (!id) return
    setIsLoadingClasses(true)
    setClassesError("")
    try {
      const res = await StudentService.getClassesByAccount(Number(id))
      setStudentProfile(res.student)
      setClasses(res.data)
    } catch {
      setClassesError("Không tìm thấy hồ sơ sinh viên hoặc dữ liệu lớp học.")
    } finally {
      setIsLoadingClasses(false)
    }
  }

  useEffect(() => {
    fetchUser()
    fetchClasses()
  }, [id])

  const handleLock = async () => {
    if (!user) return
    setIsLocking(true)
    try {
      await UserService.lock(user.id, Number(lockMinutes) || 15)
      setShowLockModal(false)
      fetchUser()
    } catch {
      alert("Khóa tài khoản thất bại.")
    } finally {
      setIsLocking(false)
    }
  }

  const handleUnlock = async () => {
    if (!user) return
    setIsLocking(true)
    try {
      await UserService.unlock(user.id)
      setShowUnlockModal(false)
      fetchUser()
    } catch {
      alert("Mở khóa thất bại.")
    } finally {
      setIsLocking(false)
    }
  }

  const handleDelete = async () => {
    if (!user) return
    setIsDeleting(true)
    try {
      await UserService.remove(user.id)
      navigate("/dashboard/students")
    } catch {
      alert("Xóa thất bại.")
    } finally {
      setIsDeleting(false)
    }
  }

  const openEdit = () => {
    if (!user) return
    setEditForm({ ho_ten: user.ho_ten || "", email: user.email || "" })
    setEditError("")
    setShowEditModal(true)
  }

  const handleSaveEdit = async () => {
    if (!user || !editForm.ho_ten || !editForm.email) {
      setEditError("Vui lòng điền đầy đủ thông tin.")
      return
    }
    setIsSaving(true)
    setEditError("")
    try {
      await UserService.update(user.id, editForm)
      setShowEditModal(false)
      fetchUser()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || "Cập nhật thất bại."
      setEditError(msg)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-sm text-red-500">{error || "Không tìm thấy tài khoản."}</p>
        <button onClick={() => navigate("/dashboard/students")}
          className="text-sm text-[#007082] hover:underline">← Quay lại danh sách</button>
      </div>
    )
  }

  const initials = user.ho_ten
    ? user.ho_ten.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase()
    : user.username.slice(0, 2).toUpperCase()

  return (
    <div className="flex flex-col w-full pb-10 max-w-5xl">

      {/* BACK */}
      <button onClick={() => navigate("/dashboard/students")}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#007082] mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Quay lại danh sách sinh viên
      </button>

      {/* HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1e325c]/10 flex items-center justify-center font-bold text-xl text-[#1e325c] shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1e325c]">{user.ho_ten || "Chưa có tên"}</h1>
              <p className="text-sm text-slate-500 mt-0.5">@{user.username}</p>
              <div className="mt-2">
                {user.kich_hoat ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Hoạt động
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Bị khóa
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={openEdit}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">
              <Pencil size={16} /> Chỉnh sửa
            </button>
            {user.kich_hoat ? (
              <button onClick={() => { setLockMinutes("15"); setShowLockModal(true) }}
                className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-600 rounded-lg text-sm font-bold hover:bg-amber-50 transition-colors">
                <LockKeyhole size={16} /> Khóa TK
              </button>
            ) : (
              <button onClick={() => setShowUnlockModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-emerald-300 text-emerald-600 rounded-lg text-sm font-bold hover:bg-emerald-50 transition-colors">
                <Unlock size={16} /> Mở khóa
              </button>
            )}
            <button onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors">
              <Trash2 size={16} /> Xóa
            </button>
          </div>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard icon={<Mail size={18} />} label="Email" value={user.email || "Chưa cập nhật"} />
        <InfoCard icon={<Calendar size={18} />} label="Ngày tạo tài khoản"
          value={user.created_at ? new Date(user.created_at).toLocaleDateString("vi-VN") : "—"} />
        <InfoCard icon={<Clock size={18} />} label="Lần đăng nhập cuối"
          value={user.last_login ? new Date(user.last_login).toLocaleString("vi-VN") : "Chưa đăng nhập"} />
        <InfoCard icon={<AlertTriangle size={18} />} label="Số lần đăng nhập sai"
          value={String(user.failed_attempts ?? 0)}
          valueClass={user.failed_attempts >= 3 ? "text-amber-600" : undefined} />
        {user.lock_until && new Date(user.lock_until) > new Date() && (
          <InfoCard icon={<LockKeyhole size={18} />} label="Tài khoản bị khóa đến"
            value={new Date(user.lock_until).toLocaleString("vi-VN")}
            valueClass="text-red-600" />
        )}
      </div>

      {/* SECTION LỚP HỌC & ĐIỂM DANH */}
      <ClassesSection
        studentProfile={studentProfile}
        classes={classes}
        isLoading={isLoadingClasses}
        error={classesError}
      />

      {/* MODAL CHỈNH SỬA */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-lg font-bold text-[#1e325c]">Chỉnh sửa thông tin</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            <div className="px-6 py-5 space-y-4">
              {editError && <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{editError}</p>}
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Họ và tên <span className="text-red-500">*</span></label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                  value={editForm.ho_ten} onChange={(e) => setEditForm({ ...editForm, ho_ten: e.target.value })} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-1 block">Email <span className="text-red-500">*</span></label>
                <input type="email" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#007082]"
                  value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50/50 rounded-b-xl">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm text-slate-600" disabled={isSaving}>Hủy</button>
              <button onClick={handleSaveEdit} disabled={isSaving}
                className="flex items-center gap-2 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isSaving && <Loader2 size={14} className="animate-spin" />} Lưu thay đổi
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
              <h2 className="text-lg font-bold text-slate-800">Khóa tài khoản</h2>
            </div>
            <div className="px-6 py-5 space-y-4">
              <p className="text-sm text-slate-500">Bạn sắp khóa tài khoản của{" "}
                <span className="font-bold text-slate-800">{user.ho_ten || user.username}</span>.</p>
              <div>
                <label className="text-xs font-bold text-slate-600 mb-2 block">Thời gian khóa</label>
                <div className="flex gap-2 mb-3">
                  {["15", "30", "60"].map((m) => (
                    <button key={m} onClick={() => setLockMinutes(m)}
                      className={`flex-1 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
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
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
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
              <h2 className="text-lg font-bold text-slate-800">Mở khóa tài khoản</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Bạn có chắc muốn mở khóa tài khoản của{" "}
              <span className="font-bold text-slate-800">{user.ho_ten || user.username}</span>?</p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowUnlockModal(false)} className="px-4 py-2 text-sm text-slate-600" disabled={isLocking}>Hủy</button>
              <button onClick={handleUnlock} disabled={isLocking}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
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
            <h2 className="text-lg font-bold text-slate-800 mb-2">Xác nhận xóa</h2>
            <p className="text-sm text-slate-500 mb-6">
              Bạn có chắc muốn xóa tài khoản{" "}
              <span className="font-bold text-slate-800">{user.ho_ten || user.username}</span>? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 text-sm text-slate-600" disabled={isDeleting}>Hủy</button>
              <button onClick={handleDelete} disabled={isDeleting}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-60">
                {isDeleting && <Loader2 size={14} className="animate-spin" />} Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoCard({
  icon, label, value, valueClass,
}: {
  icon: React.ReactNode
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
      <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
        <p className={`text-sm font-bold text-slate-700 ${valueClass || ""}`}>{value}</p>
      </div>
    </div>
  )
}

// ─── Attendance helpers ───────────────────────────────────────────────────────

function getAttendanceStatus(soNghi: number): {
  label: string
  cls: string
  dot: string
} {
  if (soNghi > 2)
    return { label: "Cấm thi", cls: "bg-red-50 text-red-600 border-red-100", dot: "bg-red-500" }
  if (soNghi === 2)
    return { label: "Cảnh báo cấm thi", cls: "bg-amber-50 text-amber-600 border-amber-100", dot: "bg-amber-500" }
  return { label: "Đủ điều kiện", cls: "bg-emerald-50 text-emerald-600 border-emerald-100", dot: "bg-emerald-500" }
}

function AttendanceBadge({ soNghi }: { soNghi: number }) {
  const s = getAttendanceStatus(soNghi)
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

// ─── Classes section ─────────────────────────────────────────────────────────

function ClassesSection({
  studentProfile, classes, isLoading, error,
}: {
  studentProfile: StudentProfile | null
  classes: StudentClass[]
  isLoading: boolean
  error: string
}) {
  // Group classes by semester
  const bySemester = classes.reduce<Record<string, { tenKy: string; batDau: string; items: StudentClass[] }>>(
    (acc, c) => {
      const key = String(c.ky_hoc_id)
      if (!acc[key]) acc[key] = { tenKy: c.ten_ky, batDau: c.bat_dau, items: [] }
      acc[key].items.push(c)
      return acc
    }, {}
  )
  const semesters = Object.values(bySemester).sort(
    (a, b) => new Date(b.batDau).getTime() - new Date(a.batDau).getTime()
  )

  const totalBanned = classes.filter((c) => c.so_buoi_nghi > 2).length
  const totalWarning = classes.filter((c) => c.so_buoi_nghi === 2).length

  return (
    <div className="mt-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <BookOpen size={18} className="text-[#1e325c]" />
          <h2 className="text-base font-bold text-[#1e325c]">Lớp học & Điểm danh</h2>
        </div>
        {studentProfile && (
          <span className="text-xs text-slate-500">
            Mã SV: <span className="font-bold text-slate-700">{studentProfile.ma_sinh_vien}</span>
          </span>
        )}
      </div>

      {/* Summary chips */}
      {!isLoading && !error && classes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-slate-100 text-slate-600 rounded-full px-3 py-1 font-medium">
            {classes.length} lớp đã đăng ký
          </span>
          {totalBanned > 0 && (
            <span className="text-xs bg-red-50 text-red-600 border border-red-100 rounded-full px-3 py-1 font-bold">
              {totalBanned} lớp cấm thi
            </span>
          )}
          {totalWarning > 0 && (
            <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 rounded-full px-3 py-1 font-bold">
              {totalWarning} lớp cảnh báo
            </span>
          )}
        </div>
      )}

      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-slate-400" />
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center text-sm text-slate-400">
          {error}
        </div>
      )}

      {!isLoading && !error && classes.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center text-sm text-slate-400">
          Sinh viên chưa đăng ký lớp học nào.
        </div>
      )}

      {!isLoading && !error && semesters.map((sem) => (
        <div key={sem.tenKy} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden mb-4">
          {/* Semester header */}
          <div className="flex items-center justify-between px-5 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-sm font-bold text-[#1e325c]">{sem.tenKy}</span>
            <span className="text-xs text-slate-400">{sem.items.length} lớp</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-600">
              <thead className="text-[11px] uppercase text-slate-400 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-3 font-bold">Học phần</th>
                  <th className="px-4 py-3 font-bold">Mã lớp</th>
                  <th className="px-4 py-3 font-bold">Giảng viên</th>
                  <th className="px-4 py-3 font-bold text-center">Tổng buổi</th>
                  <th className="px-4 py-3 font-bold text-center">Vắng</th>
                  <th className="px-4 py-3 font-bold text-center">% Vắng</th>
                  <th className="px-4 py-3 font-bold">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sem.items.map((c) => {
                  const pct = c.tong_buoi > 0
                    ? Math.round((c.so_buoi_nghi / c.tong_buoi) * 100)
                    : 0
                  const status = getAttendanceStatus(c.so_buoi_nghi)
                  const isBanned = c.so_buoi_nghi > 2
                  return (
                    <tr key={c.lop_mon_hoc_id}
                      className={`hover:bg-slate-50/50 transition-colors ${isBanned ? "bg-red-50/30" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#007082]">{c.ten_hoc_phan}</p>
                        <p className="text-xs text-slate-400">{c.ma_hoc_phan} · {c.so_tin_chi} TC</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-700">{c.ma_lop}</td>
                      <td className="px-4 py-3 text-slate-500">{c.ten_giang_vien || "—"}</td>
                      <td className="px-4 py-3 text-center font-medium">{c.tong_buoi}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center">
                          <span className={`font-bold ${c.so_buoi_nghi > 0 ? (isBanned ? "text-red-600" : "text-amber-600") : "text-slate-600"}`}>
                            {c.so_buoi_nghi}
                          </span>
                          {c.vang_co_phep > 0 && (
                            <span className="text-[10px] text-slate-400">({c.vang_co_phep} có phép)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className={`text-xs font-bold ${pct >= 30 ? "text-red-600" : pct >= 20 ? "text-amber-600" : "text-slate-600"}`}>
                            {pct}%
                          </span>
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${pct >= 30 ? "bg-red-500" : pct >= 20 ? "bg-amber-400" : "bg-emerald-400"}`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <AttendanceBadge soNghi={c.so_buoi_nghi} />
                        {c.so_tre > 0 && (
                          <p className="text-[10px] text-slate-400 mt-1">{c.so_tre} buổi đi trễ</p>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
