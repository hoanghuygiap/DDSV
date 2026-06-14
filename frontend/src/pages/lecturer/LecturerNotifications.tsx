// import { useEffect, useState } from "react"
// import { Bell, BookOpen, Loader2, Send, X, Clock } from "lucide-react"
// import api from "@/api/axios"

// interface CourseClass {
//   id: number
//   ma_lop: string
//   ten_hoc_phan: string
//   ma_hoc_phan?: string
// }

// interface Notification {
//   id: number
//   title: string
//   content: string
//   type: string
//   sent_at: string
// }

// export default function LecturerNotificationsPage() {
//   const [title, setTitle] = useState("")
//   const [content, setContent] = useState("")
//   const [courseClasses, setCourseClasses] = useState<CourseClass[]>([])
//   const [selectedClassId, setSelectedClassId] = useState<number | "">("")
//   const [notifications, setNotifications] = useState<Notification[]>([])
//   const [loading, setLoading] = useState(false)
//   const [sending, setSending] = useState(false)
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [selected, setSelected] = useState<Notification | null>(null)

//   const fetchClasses = async () => {
//     try {
//       const res = await api.get("/course-classes", { params: { limit: 200 } })
//       setCourseClasses(res.data.data?.data ?? res.data.data ?? [])
//     } catch {
//       setError("Không thể tải danh sách lớp học phần.")
//     }
//   }

//   const fetchNotifications = async () => {
//     setLoading(true)
//     try {
//       const res = await api.get("/notifications")
//       setNotifications(res.data.data?.data ?? [])
//     } catch {
//       setError("Không thể tải danh sách thông báo.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchClasses()
//     fetchNotifications()
//   }, [])

//   const handleSend = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setError("")
//     setSuccess("")

//     if (!title.trim()) {
//       setError("Vui lòng nhập tiêu đề.")
//       return
//     }

//     if (!content.trim()) {
//       setError("Vui lòng nhập nội dung.")
//       return
//     }

//     if (!selectedClassId) {
//       setError("Vui lòng chọn lớp học phần.")
//       return
//     }

//     setSending(true)

//     try {
//       await api.post("/notifications", {
//         title,
//         content,
//         target: {
//           type: "course_class",
//           course_class_id: Number(selectedClassId),
//         },
//       })

//       setTitle("")
//       setContent("")
//       setSelectedClassId("")
//       setSuccess("Gửi thông báo thành công.")
//       fetchNotifications()
//     } catch (err: any) {
//       setError(err.response?.data?.message || "Gửi thông báo thất bại.")
//     } finally {
//       setSending(false)
//     }
//   }

//   const formatDate = (dateStr: string) => {
//     if (!dateStr) return "—"
//     return new Date(dateStr).toLocaleString("vi-VN", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   return (
//     <div className="flex flex-col gap-6 pb-10">
//       <div>
//         <h1 className="text-[22px] font-medium text-[#185FA5]">
//           Thông báo đến lớp của tôi
//         </h1>
//         <p className="text-sm text-slate-500 mt-1">
//           Gửi thông báo riêng đến từng lớp học phần bạn đang phụ trách.
//         </p>
//       </div>

//       {error && (
//         <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
//           {error}
//         </div>
//       )}

//       {success && (
//         <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-lg">
//           {success}
//         </div>
//       )}

//       <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
//         <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
//           <div className="bg-[#185FA5]/10 p-2 rounded-lg">
//             <Bell size={18} className="text-[#185FA5]" />
//           </div>
//           <div>
//             <h2 className="text-base font-medium text-[#185FA5]">
//               Tạo thông báo mới
//             </h2>
//             <p className="text-xs text-slate-500">
//               Thông báo sẽ được gửi đến sinh viên trong lớp đã chọn.
//             </p>
//           </div>
//         </div>

//         <form onSubmit={handleSend} className="p-6 flex flex-col gap-5">
//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1.5">
//               Tiêu đề <span className="text-red-500">*</span>
//             </label>
//             <input
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="VD: Nghỉ học buổi ngày 20/06"
//               className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5]"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1.5">
//               Lớp học phần <span className="text-red-500">*</span>
//             </label>
//             <select
//               value={selectedClassId}
//               onChange={(e) =>
//                 setSelectedClassId(e.target.value ? Number(e.target.value) : "")
//               }
//               className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5]"
//             >
//               <option value="">-- Chọn lớp học phần --</option>
//               {courseClasses.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.ma_lop} - {c.ten_hoc_phan}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-slate-700 mb-1.5">
//               Nội dung <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               rows={5}
//               value={content}
//               onChange={(e) => setContent(e.target.value)}
//               placeholder="Nhập nội dung thông báo..."
//               className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] resize-none"
//             />
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={sending}
//               className="flex items-center gap-2 bg-[#185FA5] hover:bg-[#1254a0] text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50"
//             >
//               {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
//               {sending ? "Đang gửi..." : "Gửi thông báo"}
//             </button>
//           </div>
//         </form>
//       </div>

//       <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
//         <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
//           <BookOpen size={18} className="text-[#185FA5]" />
//           <h2 className="text-base font-medium text-[#185FA5]">
//             Danh sách thông báo
//           </h2>
//         </div>

//         {loading ? (
//           <div className="flex items-center justify-center h-40 gap-2 text-slate-400">
//             <Loader2 size={20} className="animate-spin" />
//             <span className="text-sm">Đang tải...</span>
//           </div>
//         ) : notifications.length === 0 ? (
//           <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
//             Chưa có thông báo nào.
//           </div>
//         ) : (
//           <table className="w-full text-left text-sm">
//             <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
//               <tr>
//                 <th className="px-6 py-3 font-medium">Tiêu đề</th>
//                 <th className="px-6 py-3 font-medium">Nội dung</th>
//                 <th className="px-6 py-3 font-medium">Thời gian</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-slate-100">
//               {notifications.map((n) => (
//                 <tr
//                   key={n.id}
//                   onClick={() => setSelected(n)}
//                   className="hover:bg-slate-50 cursor-pointer"
//                 >
//                   <td className="px-6 py-4 font-medium text-slate-700">
//                     {n.title}
//                   </td>
//                   <td className="px-6 py-4 text-slate-500 line-clamp-1">
//                     {n.content}
//                   </td>
//                   <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
//                     {formatDate(n.sent_at)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>

//       {selected && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
//             <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
//               <h2 className="text-base font-medium text-[#185FA5]">
//                 Chi tiết thông báo
//               </h2>
//               <button
//                 onClick={() => setSelected(null)}
//                 className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-6 flex flex-col gap-4">
//               <h3 className="text-lg font-medium text-slate-800">
//                 {selected.title}
//               </h3>

//               <div className="flex items-center gap-2 text-xs text-slate-500">
//                 <Clock size={14} />
//                 <span>Gửi lúc: {formatDate(selected.sent_at)}</span>
//               </div>

//               <div className="border-t pt-4 text-sm text-slate-600 whitespace-pre-line leading-relaxed">
//                 {selected.content}
//               </div>
//             </div>

//             <div className="px-6 py-4 border-t bg-slate-50 flex justify-end">
//               <button
//                 onClick={() => setSelected(null)}
//                 className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
//               >
//                 Đóng
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


import { useEffect, useState } from "react"
import { Bell, BookOpen, Loader2, Send, X, Clock } from "lucide-react"
import api from "@/api/axios"

interface CourseClass {
  id: number
  ma_lop: string
  ten_hoc_phan: string
  ma_hoc_phan?: string
}

interface Notification {
  id: number
  title: string
  content: string
  type: string
  sent_at: string
}

export default function LecturerNotificationsPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [courseClasses, setCourseClasses] = useState<CourseClass[]>([])
  const [selectedClassId, setSelectedClassId] = useState<number | "">("")
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingClasses, setLoadingClasses] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selected, setSelected] = useState<Notification | null>(null)

  const fetchClasses = async () => {
    setLoadingClasses(true)
    try {
      const res = await api.get("/course-classes/my")
      setCourseClasses(res.data.data ?? [])
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách lớp học phần.")
    } finally {
      setLoadingClasses(false)
    }
  }

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const res = await api.get("/notifications/sent")
      setNotifications(res.data.data?.data ?? res.data.data ?? [])
    } catch (err: any) {
      setError(err.response?.data?.message || "Không thể tải danh sách thông báo.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClasses()
    fetchNotifications()
  }, [])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề.")
      return
    }

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung.")
      return
    }

    if (!selectedClassId) {
      setError("Vui lòng chọn lớp học phần.")
      return
    }

    setSending(true)

    try {
      await api.post("/notifications", {
        title,
        content,
        target: {
          type: "course_class",
          course_class_id: Number(selectedClassId),
        },
      })

      setTitle("")
      setContent("")
      setSelectedClassId("")
      setSuccess("Gửi thông báo thành công.")
      fetchNotifications()
    } catch (err: any) {
      setError(err.response?.data?.message || "Gửi thông báo thất bại.")
    } finally {
      setSending(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—"
    return new Date(dateStr).toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div>
        <h1 className="text-[22px] font-medium text-[#185FA5]">
          Thông báo đến lớp của tôi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Gửi thông báo riêng đến từng lớp học phần đang phụ trách.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm rounded-lg">
          {success}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="bg-[#185FA5]/10 p-2 rounded-lg">
            <Bell size={18} className="text-[#185FA5]" />
          </div>
          <div>
            <h2 className="text-base font-medium text-[#185FA5]">
              Tạo thông báo mới
            </h2>
            <p className="text-xs text-slate-500">
              Chỉ gửi đến sinh viên trong lớp bạn phụ trách.
            </p>
          </div>
        </div>

        <form onSubmit={handleSend} className="p-6 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Nghỉ học buổi ngày 20/06"
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Lớp học phần <span className="text-red-500">*</span>
            </label>

            {loadingClasses ? (
              <div className="flex items-center gap-2 text-slate-400 text-sm py-2">
                <Loader2 size={16} className="animate-spin" />
                Đang tải lớp phụ trách...
              </div>
            ) : (
              <select
                value={selectedClassId}
                onChange={(e) =>
                  setSelectedClassId(e.target.value ? Number(e.target.value) : "")
                }
                className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5]"
              >
                <option value="">-- Chọn lớp học phần --</option>
                {courseClasses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.ma_lop} - {c.ten_hoc_phan}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Nhập nội dung thông báo..."
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/30 focus:border-[#185FA5] resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={sending}
              className="flex items-center gap-2 bg-[#185FA5] hover:bg-[#1254a0] text-white rounded-lg px-5 py-2.5 text-sm font-medium disabled:opacity-50"
            >
              {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              {sending ? "Đang gửi..." : "Gửi thông báo"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <BookOpen size={18} className="text-[#185FA5]" />
          <h2 className="text-base font-medium text-[#185FA5]">
            Danh sách thông báo
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40 gap-2 text-slate-400">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">Đang tải...</span>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
            Chưa có thông báo nào.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
              <tr>
                <th className="px-6 py-3 font-medium">Tiêu đề</th>
                <th className="px-6 py-3 font-medium">Nội dung</th>
                <th className="px-6 py-3 font-medium">Thời gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notifications.map((n) => (
                <tr
                  key={n.id}
                  onClick={() => setSelected(n)}
                  className="hover:bg-slate-50 cursor-pointer"
                >
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {n.title}
                  </td>
                  <td className="px-6 py-4 text-slate-500 line-clamp-1">
                    {n.content}
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(n.sent_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-base font-medium text-[#185FA5]">
                Chi tiết thông báo
              </h2>
              <button
                onClick={() => setSelected(null)}
                className="p-1.5 hover:bg-slate-200 rounded-full text-slate-400"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <h3 className="text-lg font-medium text-slate-800">
                {selected.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock size={14} />
                <span>Gửi lúc: {formatDate(selected.sent_at)}</span>
              </div>

              <div className="border-t pt-4 text-sm text-slate-600 whitespace-pre-line leading-relaxed">
                {selected.content}
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
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