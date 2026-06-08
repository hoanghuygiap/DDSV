import { useEffect, useState } from "react"
import { useOutletContext } from "react-router-dom"
import { Plus, Clock, User, Loader2, Bell, Trash2, CheckCheck, X, Send, Users, BookOpen, UserCheck, Globe } from "lucide-react"
import api from "@/api/axios"

interface Notification {
  id: number
  title: string
  content: string
  type: string
  sent_at: string
  is_read?: boolean
}

interface CourseClass {
  id: number
  ma_lop: string
  ten_hoc_phan: string
  ma_hoc_phan: string
}

type TargetType = "all" | "role" | "course_class" | "student_ids"

// ─── Modal Tạo thông báo ──────────────────────────────────────────────────────
function CreateNotificationModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [targetType, setTargetType] = useState<TargetType>("all")
  const [selectedRole, setSelectedRole] = useState("sinh_vien")
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | "">("")
  const [classSearch, setClassSearch] = useState("")
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [studentIdsInput, setStudentIdsInput] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (targetType === "course_class" && courseClasses.length === 0) {
      setLoadingClasses(true)
      api.get("/course-classes", { params: { limit: 200 } })
        .then(res => setCourseClasses(res.data.data?.data ?? res.data.data ?? []))
        .catch(() => { })
        .finally(() => setLoadingClasses(false))
    }
  }, [targetType])

  const filteredClasses = courseClasses.filter(c =>
    c.ma_lop.toLowerCase().includes(classSearch.toLowerCase()) ||
    c.ten_hoc_phan.toLowerCase().includes(classSearch.toLowerCase()) ||
    c.ma_hoc_phan?.toLowerCase().includes(classSearch.toLowerCase())
  )

  const buildTarget = () => {
    if (targetType === "all") return { type: "all" }
    if (targetType === "role") return { type: "role", role: selectedRole }
    if (targetType === "course_class") return { type: "course_class", course_class_id: Number(selectedClassId) }
    if (targetType === "student_ids") {
      const ids = studentIdsInput.split(/[,\s]+/).map(s => Number(s.trim())).filter(Boolean)
      return { type: "student_ids", student_ids: ids }
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!title.trim() || !content.trim()) return
    if (targetType === "course_class" && !selectedClassId) { setError("Vui lòng chọn lớp học phần."); return }
    if (targetType === "student_ids" && !studentIdsInput.trim()) { setError("Vui lòng nhập ID sinh viên."); return }

    setSending(true)
    try {
      await api.post("/notifications", { title, content, target: buildTarget() })
      setSuccess(true)
      setTimeout(() => { onSuccess(); onClose() }, 1800)
    } catch (err: any) {
      setError(err.response?.data?.message || "Gửi thông báo thất bại.")
    } finally {
      setSending(false)
    }
  }

  const TARGET_OPTIONS: { type: TargetType; label: string; desc: string; icon: React.ReactNode }[] = [
    { type: "all",         label: "Tất cả người dùng",  desc: "Gửi đến toàn bộ tài khoản trong hệ thống",      icon: <Globe size={16} /> },
    { type: "role",        label: "Theo vai trò",        desc: "Chọn nhóm: sinh viên, giảng viên, admin",        icon: <Users size={16} /> },
    { type: "course_class",label: "Theo lớp học phần",  desc: "Gửi đến tất cả sinh viên trong một lớp cụ thể",  icon: <BookOpen size={16} /> },
    { type: "student_ids", label: "Sinh viên cụ thể",   desc: "Gửi đến từng sinh viên theo ID",                 icon: <UserCheck size={16} /> },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-[#185FA5]/10 p-2 rounded-lg">
              <Bell size={18} className="text-[#185FA5]" />
            </div>
            <div>
              <h2 className="text-base font-medium text-[#185FA5]">Tạo thông báo mới</h2>
              <p className="text-xs text-slate-500 mt-0.5">Gửi thông báo đến người dùng trong hệ thống</p>
            </div>
          </div>
          {!success && (
            <button onClick={onClose} disabled={sending} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors disabled:opacity-50">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-emerald-600">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                <Send size={28} />
              </div>
              <p className="text-base font-medium">Gửi thông báo thành công!</p>
              <p className="text-sm text-slate-500">Danh sách sẽ tự động cập nhật.</p>
            </div>
          ) : (
            <form id="create-notif-form" onSubmit={handleSend} className="flex flex-col gap-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">{error}</div>
              )}

              {/* Tiêu đề */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  disabled={sending}
                  placeholder="Nhập tiêu đề thông báo..."
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] transition-shadow disabled:opacity-50"
                />
              </div>

              {/* Nội dung */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nội dung <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  disabled={sending}
                  placeholder="Nhập nội dung chi tiết..."
                  className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] transition-shadow resize-none disabled:opacity-50"
                />
              </div>

              {/* Đối tượng nhận */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Đối tượng nhận <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TARGET_OPTIONS.map(opt => (
                    <button
                      key={opt.type}
                      type="button"
                      onClick={() => setTargetType(opt.type)}
                      className={`flex items-start gap-2.5 p-3 rounded-lg border text-left transition-colors ${
                        targetType === opt.type
                          ? "border-[#185FA5] bg-blue-50 text-[#185FA5]"
                          : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <span className={`mt-0.5 shrink-0 ${targetType === opt.type ? "text-[#185FA5]" : "text-slate-400"}`}>
                        {opt.icon}
                      </span>
                      <div>
                        <div className="text-sm font-medium leading-none mb-1">{opt.label}</div>
                        <div className="text-[11px] text-slate-400 leading-tight">{opt.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Theo vai trò */}
              {targetType === "role" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn vai trò</label>
                  <select
                    value={selectedRole}
                    onChange={e => setSelectedRole(e.target.value)}
                    disabled={sending}
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] disabled:opacity-50"
                  >
                    <option value="sinh_vien">Sinh viên</option>
                    <option value="giang_vien">Giảng viên</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              )}

              {/* Theo lớp học phần */}
              {targetType === "course_class" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Chọn lớp học phần</label>
                  {loadingClasses ? (
                    <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                      <Loader2 size={16} className="animate-spin" /> Đang tải danh sách lớp...
                    </div>
                  ) : (
                    <>
                      <input
                        type="text"
                        placeholder="Tìm theo mã lớp hoặc tên học phần..."
                        value={classSearch}
                        onChange={e => setClassSearch(e.target.value)}
                        className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] mb-2"
                      />
                      <div className="border border-slate-200 rounded-lg overflow-hidden max-h-44 overflow-y-auto">
                        {filteredClasses.length === 0 ? (
                          <div className="text-center text-slate-400 text-sm py-6">Không tìm thấy lớp nào.</div>
                        ) : filteredClasses.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => setSelectedClassId(c.id)}
                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors border-b border-slate-100 last:border-0 ${
                              selectedClassId === c.id
                                ? "bg-blue-50 text-[#185FA5]"
                                : "hover:bg-slate-50 text-slate-700"
                            }`}
                          >
                            <span className="font-medium">{c.ma_lop}</span>
                            <span className="text-slate-500 ml-2 text-xs">{c.ten_hoc_phan}</span>
                          </button>
                        ))}
                      </div>
                      {selectedClassId && (
                        <p className="text-xs text-[#185FA5] mt-1.5">
                          Đã chọn: <span className="font-medium">{courseClasses.find(c => c.id === selectedClassId)?.ma_lop}</span>
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Sinh viên cụ thể */}
              {targetType === "student_ids" && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    ID sinh viên <span className="text-slate-400 font-normal text-xs">(phân cách bằng dấu phẩy)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={studentIdsInput}
                    onChange={e => setStudentIdsInput(e.target.value)}
                    disabled={sending}
                    placeholder="VD: 1, 2, 5, 10"
                    className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] transition-shadow resize-none disabled:opacity-50"
                  />
                  <p className="text-xs text-slate-400 mt-1">Nhập ID tài khoản sinh viên (cột id trong bảng sinh_vien)</p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {!success && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              form="create-notif-form"
              disabled={sending || !title.trim() || !content.trim()}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-[#185FA5] hover:bg-[#1254a0] rounded-lg transition-colors shadow-sm disabled:opacity-50"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? "Đang gửi..." : "Gửi thông báo"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { role } = useOutletContext<{ role: string }>()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selected, setSelected] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCreate, setShowCreate] = useState(false)

  const fetchNotifications = async () => {
    setIsLoading(true)
    setError("")
    try {
      const res = await api.get("/notifications")
      const data: Notification[] = res.data.data?.data ?? []
      setNotifications(data)
      if (data.length > 0 && !selected) setSelected(data[0])
    } catch {
      setError("Không thể tải danh sách thông báo.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  const handleSelect = async (notif: Notification) => {
    setSelected(notif)
    if (!notif.is_read) {
      try {
        await api.patch(`/notifications/${notif.id}/read`)
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, is_read: true } : n))
      } catch { /* silent */ }
    }
  }

  const handleReadAll = async () => {
    try {
      await api.patch("/notifications/read-all")
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch { alert("Không thể đánh dấu tất cả đã đọc.") }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa thông báo này?")) return
    setIsDeleting(true)
    try {
      await api.delete(`/notifications/${id}`)
      const updated = notifications.filter(n => n.id !== id)
      setNotifications(updated)
      if (selected?.id === id) setSelected(updated[0] ?? null)
    } catch { alert("Xóa thất bại.") }
    finally { setIsDeleting(false) }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—"
    try {
      return new Date(dateStr).toLocaleString("vi-VN", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      })
    } catch { return dateStr }
  }

  const typeLabel: Record<string, string> = {
    INFO: "Thông tin", WARNING: "Cảnh báo", REMINDER: "Nhắc nhở",
    he_thong: "Hệ thống", lop: "Lớp học", ca_nhan: "Cá nhân"
  }

  const typeBadge: Record<string, string> = {
    INFO:      "bg-sky-50 text-sky-700 border-sky-100",
    WARNING:   "bg-amber-50 text-amber-700 border-amber-100",
    REMINDER:  "bg-violet-50 text-violet-700 border-violet-100",
    he_thong:  "bg-sky-50 text-sky-700 border-sky-100",
    lop:       "bg-emerald-50 text-emerald-700 border-emerald-100",
    ca_nhan:   "bg-violet-50 text-violet-700 border-violet-100",
  }

  return (
    <div className="flex flex-col w-full pb-10">

      {showCreate && (
        <CreateNotificationModal
          onClose={() => setShowCreate(false)}
          onSuccess={() => { setSelected(null); fetchNotifications() }}
        />
      )}

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-[#185FA5]">Thông báo hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các thông báo trong hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          {notifications.some(n => !n.is_read) && (
            <button
              onClick={handleReadAll}
              className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <CheckCheck size={16} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
          {role !== "student" && (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-[#185FA5] hover:bg-[#1254a0] text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm transition-colors whitespace-nowrap"
            >
              <Plus size={18} />
              <span>Tạo thông báo mới</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-md">{error}</div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm">Đang tải thông báo...</span>
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-slate-400">
          <Bell size={40} strokeWidth={1.5} />
          <p className="text-sm font-medium">Chưa có thông báo nào.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-medium tracking-wider w-[50%]">Tiêu đề</th>
                <th className="px-6 py-4 font-medium tracking-wider">Loại</th>
                <th className="px-6 py-4 font-medium tracking-wider">Thời gian</th>
                <th className="px-6 py-4 font-medium tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <tr
                  key={notif.id}
                  onClick={() => handleSelect(notif)}
                  className="transition-colors cursor-pointer hover:bg-slate-50/50 border-l-4 border-l-transparent hover:border-l-[#185FA5]/40"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2">
                      {!notif.is_read && (
                        <span className="mt-1.5 w-2 h-2 rounded-full bg-[#185FA5] shrink-0" />
                      )}
                      <div>
                        <span className="font-medium text-[15px] mb-0.5 block text-slate-700">{notif.title}</span>
                        <span className="text-xs text-slate-400 line-clamp-1">{notif.content}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${typeBadge[notif.type] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                      {typeLabel[notif.type] ?? notif.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">{formatDate(notif.sent_at)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(notif.id) }}
                      disabled={isDeleting}
                      className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-40"
                      title="Xóa thông báo"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dialog chi tiết thông báo */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${typeBadge[selected.type] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                  {typeLabel[selected.type] ?? selected.type}
                </span>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <h2 className="text-lg font-medium text-[#185FA5] leading-snug">{selected.title}</h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock size={14} />
                  <span>Gửi lúc: {formatDate(selected.sent_at)}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {selected.content}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => { handleDelete(selected.id); setSelected(null) }}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 rounded-lg transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} /> Xóa
              </button>
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
