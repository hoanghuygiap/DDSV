import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft, Loader2, LockKeyhole, Unlock, Trash2,
  Mail, Phone, Calendar, BookOpen, Users,
} from "lucide-react"
import { LecturerService } from "@/services/lecturer.service"
import type { Lecturer } from "@/types/user.type"

interface ScheduleItem {
  buoi_hoc_id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  trang_thai: string
  ma_hoc_phan: string
  ten_hoc_phan: string
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

  const [showLockModal, setShowLockModal] = useState(false)
  const [showUnlockModal, setShowUnlockModal] = useState(false)
  const [lockMinutes, setLockMinutes] = useState("15")
  const [isLocking, setIsLocking] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchLecturer = async () => {
    if (!id) return
    setIsLoading(true)
    setError("")
    try {
      const data = await LecturerService.getById(Number(id))
      setLecturer(data)
    } catch {
      setError("Không thể tải thông tin giảng viên.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchLecturer() }, [id])

  const handleTabChange = async (tab: Tab) => {
    setActiveTab(tab)
    if (tab === "schedule" && !scheduleLoaded) {
      setIsLoadingTab(true)
      try {
        const data = await LecturerService.getSchedule(Number(id))
        setSchedule(data ?? [])
        setScheduleLoaded(true)
      } catch {
        setSchedule([])
      } finally {
        setIsLoadingTab(false)
      }
    }
    if (tab === "classes" && !classesLoaded) {
      setIsLoadingTab(true)
      try {
        const data = await LecturerService.getCourseClasses(Number(id))
        setCourseClasses(data ?? [])
        setClassesLoaded(true)
      } catch {
        setCourseClasses([])
      } finally {
        setIsLoadingTab(false)
      }
    }
  }

  const handleLock = async () => {
    if (!lecturer) return
    setIsLocking(true)
    try {
      await LecturerService.lock(lecturer.tai_khoan_id, Number(lockMinutes) || 15)
      setShowLockModal(false)
      fetchLecturer()
    } catch {
      alert("Khóa tài khoản thất bại.")
    } finally {
      setIsLocking(false)
    }
  }

  const handleUnlock = async () => {
    if (!lecturer) return
    setIsLocking(true)
    try {
      await LecturerService.unlock(lecturer.tai_khoan_id)
      setShowUnlockModal(false)
      fetchLecturer()
    } catch {
      alert("Mở khóa thất bại.")
    } finally {
      setIsLocking(false)
    }
  }

  const handleDelete = async () => {
    if (!lecturer) return
    setIsDeleting(true)
    try {
      await LecturerService.remove(lecturer.id)
      navigate("/dashboard/lecturers")
    } catch {
      alert("Xóa thất bại.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error || !lecturer) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-3">
        <p className="text-sm text-red-500">{error || "Không tìm thấy giảng viên."}</p>
        <button onClick={() => navigate("/dashboard/lecturers")}
          className="text-sm text-[#007082] hover:underline">← Quay lại danh sách</button>
      </div>
    )
  }

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
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#007082] mb-6 w-fit transition-colors">
        <ArrowLeft size={16} /> Quay lại danh sách giảng viên
      </button>

      {/* HEADER CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1e325c]/10 flex items-center justify-center font-bold text-xl text-[#1e325c] shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1e325c]">{lecturer.ho_ten}</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Mã GV: <span className="font-bold text-slate-700">{lecturer.ma_giang_vien}</span>
                {" · "}@{lecturer.username}
              </p>
              <div className="mt-2">
                {lecturer.kich_hoat ? (
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
            {lecturer.kich_hoat ? (
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

      {/* TABS CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.key
                  ? "border-[#007082] text-[#007082] bg-[#007082]/5"
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
              <div className="flex justify-center py-12">
                <Loader2 size={24} className="animate-spin text-slate-400" />
              </div>
            ) : schedule.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12">Chưa có lịch giảng dạy.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">Ngày học</th>
                      <th className="px-4 py-3 font-bold">Giờ</th>
                      <th className="px-4 py-3 font-bold">Học phần</th>
                      <th className="px-4 py-3 font-bold">Lớp</th>
                      <th className="px-4 py-3 font-bold">Phòng</th>
                      <th className="px-4 py-3 font-bold">Kỳ học</th>
                      <th className="px-4 py-3 font-bold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {schedule.map((item) => (
                      <tr key={item.buoi_hoc_id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium">{new Date(item.ngay_hoc).toLocaleDateString("vi-VN")}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {item.gio_bat_dau?.slice(0, 5)} – {item.gio_ket_thuc?.slice(0, 5)}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#007082]">{item.ten_hoc_phan}</p>
                          <p className="text-xs text-slate-400">{item.ma_hoc_phan}</p>
                        </td>
                        <td className="px-4 py-3 font-medium">{item.ma_lop}</td>
                        <td className="px-4 py-3">{item.ten_phong || "—"}</td>
                        <td className="px-4 py-3 text-slate-500">{item.ten_ky}</td>
                        <td className="px-4 py-3"><ScheduleStatusBadge status={item.trang_thai} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* TAB LỚP PHỤ TRÁCH */}
          {activeTab === "classes" && (
            isLoadingTab ? (
              <div className="flex justify-center py-12">
                <Loader2 size={24} className="animate-spin text-slate-400" />
              </div>
            ) : courseClasses.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-12">Chưa có lớp phụ trách.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-600">
                  <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">Mã lớp</th>
                      <th className="px-4 py-3 font-bold">Học phần</th>
                      <th className="px-4 py-3 font-bold text-center">Tín chỉ</th>
                      <th className="px-4 py-3 font-bold">Kỳ học</th>
                      <th className="px-4 py-3 font-bold">Thời gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courseClasses.map((cls) => (
                      <tr key={cls.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-[#1e325c]">{cls.ma_lop}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#007082]">{cls.ten_hoc_phan}</p>
                          <p className="text-xs text-slate-400">{cls.ma_hoc_phan}</p>
                        </td>
                        <td className="px-4 py-3 text-center font-bold">{cls.so_tin_chi}</td>
                        <td className="px-4 py-3">{cls.ten_ky}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          {cls.bat_dau ? new Date(cls.bat_dau).toLocaleDateString("vi-VN") : "—"}
                          {" – "}
                          {cls.ket_thuc ? new Date(cls.ket_thuc).toLocaleDateString("vi-VN") : "—"}
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
                <span className="font-bold text-slate-800">{lecturer.ho_ten}</span>.</p>
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
              <span className="font-bold text-slate-800">{lecturer.ho_ten}</span>?</p>
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
              Bạn có chắc muốn xóa giảng viên{" "}
              <span className="font-bold text-slate-800">{lecturer.ho_ten}</span>? Hành động này không thể hoàn tác.
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

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
      <div className="text-slate-400 mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  )
}

function ScheduleStatusBadge({ status }: { status: string }) {
  const MAP: Record<string, { cls: string; label: string }> = {
    da_hoc: { cls: "bg-emerald-50 text-emerald-600 border-emerald-100", label: "Đã học" },
    sap_hoc: { cls: "bg-blue-50 text-blue-600 border-blue-100", label: "Sắp học" },
    huy: { cls: "bg-red-50 text-red-600 border-red-100", label: "Đã hủy" },
  }
  const s = MAP[status] ?? { cls: "bg-slate-50 text-slate-500 border-slate-100", label: status }
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
      {s.label}
    </span>
  )
}
