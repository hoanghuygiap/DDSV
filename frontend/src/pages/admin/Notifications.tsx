import { Plus, Pencil, Trash2, Clock, User } from "lucide-react"
import { mockNotifications } from "../../mocks/notifications.mock"

export default function NotificationsPage() {
  const activeNotification = mockNotifications.find(n => n.id === "2"); // Hardcode selected notification for demo

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1e325c]">Thông báo hệ thống</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và theo dõi các thông báo đã gửi cho sinh viên và giảng viên.</p>
        </div>

        <button className="flex items-center gap-2 bg-[#38bdf8] hover:bg-[#0ea5e9] text-slate-900 rounded-md px-5 py-2.5 text-sm font-bold shadow-sm transition-colors whitespace-nowrap">
          <Plus size={18} />
          <span>Tạo thông báo mới</span>
        </button>
      </div>

      {/* TWO COLUMNS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Notification List (7 cols) */}
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
                {mockNotifications.map((notif) => {
                  const isActive = notif.id === "2";
                  return (
                    <tr
                      key={notif.id}
                      className={`transition-colors cursor-pointer ${isActive ? 'bg-slate-50 border-l-4 border-l-[#1e325c]' : 'hover:bg-slate-50/50 border-l-4 border-l-transparent'}`}
                    >
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className={`font-bold text-[15px] mb-0.5 ${isActive ? 'text-[#1e325c]' : 'text-slate-700'}`}>{notif.title}</span>
                          <span className="text-xs text-slate-500">{notif.summary}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                          {notif.target}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-medium text-slate-600 w-32">
                        {notif.date.includes("\n") ? (
                          <div className="flex flex-col">
                            {notif.date.split('\n').map((line, i) => <span key={i}>{line}</span>)}
                          </div>
                        ) : (
                          notif.date
                        )}
                      </td>
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
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Notification Details (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col h-fit">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-[#1e325c] text-lg">Chi tiết thông báo</h3>
            <div className="flex items-center gap-3">
              <button className="text-slate-400 hover:text-slate-700 transition-colors">
                <Pencil size={18} />
              </button>
              <button className="text-slate-400 hover:text-red-600 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {activeNotification && (
            <div className="flex flex-col">
              {/* Image Banner */}
              {activeNotification.imageUrl && (
                <div className="w-full h-48 rounded-lg overflow-hidden mb-6 relative">
                  <img src={activeNotification.imageUrl} alt="Notification Cover" className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold flex items-center gap-1.5 shadow-sm text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]"></span>
                    Live
                  </div>
                </div>
              )}

              {/* Title */}
              <h2 className="text-2xl font-bold text-[#1e325c] mb-4 leading-tight">
                {activeNotification.title}
              </h2>

              {/* Meta Info */}
              <div className="flex flex-col gap-2 mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <Clock size={16} />
                  <span>Gửi lúc: {activeNotification.date.replace('\n', ' ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
                  <User size={16} />
                  <span>Người gửi: {activeNotification.sender}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {activeNotification.content}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
