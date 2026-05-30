import { useEffect, useState } from "react"
import { Plus, Clock, User, Loader2, Bell, Trash2, CheckCheck } from "lucide-react"
import api from "@/api/axios"

interface Notification {
  id: number
  tieu_de: string
  noi_dung: string
  loai: string
  gui_luc: string
  da_doc?: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [selected, setSelected] = useState<Notification | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

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
    if (!notif.da_doc) {
      try {
        await api.patch(`/notifications/${notif.id}/read`)
        setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, da_doc: true } : n))
      } catch { /* silent */ }
    }
  }

  const handleReadAll = async () => {
    try {
      await api.patch("/notifications/read-all")
      setNotifications(prev => prev.map(n => ({ ...n, da_doc: true })))
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

  const loaiLabel: Record<string, string> = {
    INFO: "Thông tin", WARNING: "Cảnh báo", REMINDER: "Nhắc nhở"
  }

  const loaiBadge: Record<string, string> = {
    INFO:     "bg-sky-50 text-sky-700 border-sky-100",
    WARNING:  "bg-amber-50 text-amber-700 border-amber-100",
    REMINDER: "bg-violet-50 text-violet-700 border-violet-100",
  }

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-[#185FA5]">Thông báo hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các thông báo trong hệ thống.</p>
        </div>
        <div className="flex items-center gap-3">
          {notifications.some(n => !n.da_doc) && (
            <button
              onClick={handleReadAll}
              className="flex items-center gap-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              <CheckCheck size={16} />
              Đánh dấu tất cả đã đọc
            </button>
          )}
          <button className="flex items-center gap-2 bg-[#185FA5] hover:bg-[#1254a0] text-white rounded-md px-5 py-2.5 text-sm font-medium shadow-sm transition-colors whitespace-nowrap">
            <Plus size={18} />
            <span>Tạo thông báo mới</span>
          </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Danh sách thông báo */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-medium tracking-wider w-[45%]">Tiêu đề</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Loại</th>
                    <th className="px-6 py-4 font-medium tracking-wider">Thời gian</th>
                    <th className="px-6 py-4 font-medium tracking-wider text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notifications.map((notif) => {
                    const isActive = notif.id === selected?.id
                    return (
                      <tr
                        key={notif.id}
                        onClick={() => handleSelect(notif)}
                        className={`transition-colors cursor-pointer ${
                          isActive
                            ? "bg-slate-50 border-l-4 border-l-[#185FA5]"
                            : "hover:bg-slate-50/50 border-l-4 border-l-transparent"
                        }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-start gap-2">
                            {!notif.da_doc && (
                              <span className="mt-1 w-2 h-2 rounded-full bg-[#185FA5] shrink-0" />
                            )}
                            <div>
                              <span className={`font-medium text-[15px] mb-0.5 block ${isActive ? "text-[#185FA5]" : "text-slate-700"}`}>
                                {notif.tieu_de}
                              </span>
                              <span className="text-xs text-slate-400 line-clamp-1">{notif.noi_dung}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${loaiBadge[notif.loai] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                            {loaiLabel[notif.loai] ?? notif.loai}
                          </span>
                        </td>
                        <td className="px-6 py-5 font-medium text-slate-600 text-xs whitespace-nowrap">
                          {formatDate(notif.gui_luc)}
                        </td>
                        <td className="px-6 py-5 text-right">
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
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Chi tiết thông báo */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col h-fit">
            {selected ? (
              <>
                <h3 className="font-medium text-[#185FA5] text-lg mb-4">Chi tiết thông báo</h3>
                <h2 className="text-xl font-medium text-[#185FA5] mb-4 leading-tight">{selected.tieu_de}</h2>
                <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <Clock size={16} />
                    <span>Gửi lúc: {formatDate(selected.gui_luc)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                    <User size={16} />
                    <span>Loại: {loaiLabel[selected.loai] ?? selected.loai}</span>
                  </div>
                </div>
                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {selected.noi_dung}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
                <Bell size={32} strokeWidth={1.5} />
                <p className="text-sm">Chọn một thông báo để xem chi tiết</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
