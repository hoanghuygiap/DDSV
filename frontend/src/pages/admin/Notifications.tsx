import { useState } from "react"
import { Plus, Clock, User } from "lucide-react"

const notifications = [
  {
    id: "1",
    title: "Thông báo lịch thi học kỳ II",
    summary: "Lịch thi chính thức học kỳ II năm học 2023-2024",
    target: "Toàn trường",
    date: "15/05/2024",
    status: "SENT",
    sender: "Ban Đào Tạo",
    content: "Trường Đại học Thăng Long thông báo lịch thi học kỳ II năm học 2023-2024 chính thức được công bố. Sinh viên vui lòng kiểm tra lịch thi trên hệ thống và chuẩn bị đầy đủ giấy tờ cần thiết.",
  },
  {
    id: "2",
    title: "Cảnh báo vắng học quá 20%",
    summary: "Danh sách sinh viên có tỷ lệ vắng cao",
    target: "Sinh viên có rủi ro",
    date: "14/05/2024",
    status: "SENT",
    sender: "Phòng Quản lý SV",
    content: "Kính gửi các sinh viên trong danh sách cảnh báo,\n\nTỷ lệ vắng mặt của bạn đã vượt quá 20% số buổi học quy định. Nếu tình trạng này tiếp tục, bạn có thể bị cấm thi theo quy định của nhà trường. Vui lòng liên hệ giảng viên phụ trách để biết thêm thông tin.",
  },
  {
    id: "3",
    title: "Thay đổi phòng học tuần 15",
    summary: "Cập nhật phòng học cho một số lớp",
    target: "IT-K15",
    date: "13/05/2024",
    status: "SENDING",
    sender: "Phòng Quản trị",
    content: "Thông báo thay đổi phòng học tuần 15 cho các lớp IT-K15:\n- IT3230-01: Chuyển từ D3-501 sang D3-502\n- IT2150-02: Chuyển từ B1-302 sang B1-304",
  },
]

export default function NotificationsPage() {
  const [selected, setSelected] = useState(notifications[1])

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1e325c]">Thông báo hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các thông báo đã gửi cho sinh viên và giảng viên.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-3 py-2 text-xs font-medium">
            Chức năng đang phát triển
          </div>
          <button className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-900 rounded-md px-5 py-2.5 text-sm font-bold shadow-sm transition-colors whitespace-nowrap">
            <Plus size={18} />
            <span>Tạo thông báo mới</span>
          </button>
        </div>
      </div>

      {/* TWO COLUMNS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Notification List */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider w-[40%]">Tiêu đề</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Đối tượng</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Ngày gửi</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {notifications.map((notif) => {
                  const isActive = notif.id === selected.id
                  return (
                    <tr
                      key={notif.id}
                      onClick={() => setSelected(notif)}
                      className={`transition-colors cursor-pointer ${isActive ? "bg-slate-50 border-l-4 border-l-[#1e325c]" : "hover:bg-slate-50/50 border-l-4 border-l-transparent"}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className={`font-bold text-[15px] mb-0.5 ${isActive ? "text-[#1e325c]" : "text-slate-700"}`}>
                            {notif.title}
                          </span>
                          <span className="text-xs text-slate-500">{notif.summary}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                          {notif.target}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-600">{notif.date}</td>
                      <td className="px-6 py-5 text-center">
                        {notif.status === "SENT" ? (
                          <span className="inline-flex px-3 py-1 text-emerald-600 border border-emerald-200 rounded-full text-[11px] font-bold bg-emerald-50">
                            Đã gửi
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1 text-[#38bdf8] border border-[#bae6fd] rounded-full text-[11px] font-bold bg-[#f0f9ff]">
                            Đang gửi
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Notification Detail */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col h-fit">
          <h3 className="font-bold text-[#1e325c] text-lg mb-6">Chi tiết thông báo</h3>

          <h2 className="text-xl font-bold text-[#1e325c] mb-4 leading-tight">{selected.title}</h2>

          <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <Clock size={16} />
              <span>Gửi lúc: {selected.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
              <User size={16} />
              <span>Người gửi: {selected.sender}</span>
            </div>
          </div>

          <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
            {selected.content}
          </div>
        </div>
      </div>
    </div>
  )
}
