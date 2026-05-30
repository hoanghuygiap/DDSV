import { useState } from "react"
import { X, Send, Loader2, Bell } from "lucide-react"
import api from "@/api/axios"

interface Props {
  classId: string | number
  classNameStr: string
  onClose: () => void
}

export default function SendNotificationModal({ classId, classNameStr, onClose }: Props) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return

    setSending(true)
    setErrorMsg("")
    try {
      await api.post("/notifications", {
        title,
        content,
        target: {
          type: "course_class",
          course_class_id: classId
        }
      })
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || err.message || "Có lỗi xảy ra khi gửi thông báo")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium text-[#185FA5]">Gửi thông báo lớp</h2>
              <p className="text-sm font-medium text-slate-500">Lớp: {classNameStr}</p>
            </div>
          </div>
          {!success && (
            <button onClick={onClose} disabled={sending} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors disabled:opacity-50">
              <X size={20} />
            </button>
          )}
        </div>

        {/* BODY */}
        <div className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-emerald-600">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <Send size={32} />
              </div>
              <h3 className="text-lg font-medium">Gửi thành công!</h3>
              <p className="text-sm text-slate-500 mt-2 text-center">Toàn bộ sinh viên trong lớp đã nhận được thông báo.</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {errorMsg}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tiêu đề thông báo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Thông báo nghỉ học, Thay đổi lịch học..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={sending}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nội dung chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Nhập nội dung thông báo gửi cho sinh viên..."
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={sending}
                ></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={sending}
                  className="px-5 py-2.5 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={sending || !title.trim() || !content.trim()}
                  className="px-5 py-2.5 bg-[#185FA5] text-white font-medium rounded-md hover:bg-[#1254a0] transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Đang gửi...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Gửi thông báo
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}