import { Calendar, Clock, MapPin, Users } from "lucide-react"

const scheduleItems = [
  { id: 1, subject: "Lập trình Web Cơ bản", code: "IT3230", room: "D3-501", day: "Thứ 2", time: "07:30 - 10:00", lecturer: "Nguyễn Văn A", students: 42, status: "ongoing" },
  { id: 2, subject: "Cơ sở dữ liệu", code: "IT2150", room: "B1-302", day: "Thứ 3", time: "13:30 - 16:00", lecturer: "Trần Thị B", students: 38, status: "upcoming" },
  { id: 3, subject: "Giải tích 1", code: "MT1001", room: "A2-201", day: "Thứ 4", time: "07:30 - 10:00", lecturer: "Lê Văn C", students: 55, status: "upcoming" },
  { id: 4, subject: "Mạng máy tính", code: "IT3150", room: "D2-405", day: "Thứ 5", time: "10:15 - 12:45", lecturer: "Phạm Thị D", students: 30, status: "upcoming" },
  { id: 5, subject: "Kỹ thuật lập trình", code: "IT1050", room: "B3-101", day: "Thứ 6", time: "07:30 - 10:00", lecturer: "Nguyễn Văn A", students: 48, status: "upcoming" },
]

export default function SchedulePage() {
  const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6"]

  return (
    <div className="flex flex-col w-full pb-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e325c]">Thời khoá biểu</h1>
          <p className="text-sm text-slate-500 mt-1">Lịch giảng dạy toàn trường trong tuần hiện tại.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-4 py-2.5 text-sm font-medium">
          Chức năng đang phát triển
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng buổi học / tuần", value: scheduleItems.length, icon: Calendar, color: "text-[#1e325c]" },
          { label: "Đang diễn ra", value: scheduleItems.filter(s => s.status === "ongoing").length, icon: Clock, color: "text-emerald-600" },
          { label: "Tổng sinh viên", value: scheduleItems.reduce((s, i) => s + i.students, 0), icon: Users, color: "text-[#007082]" },
          { label: "Phòng học", value: new Set(scheduleItems.map(s => s.room)).size, icon: MapPin, color: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <stat.icon size={18} className={stat.color} />
            </div>
            <h3 className={`text-3xl font-bold ${stat.color}`}>{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* SCHEDULE TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-lg">Lịch học theo ngày</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Môn học</th>
                <th className="px-6 py-4 font-bold tracking-wider">Ngày học</th>
                <th className="px-6 py-4 font-bold tracking-wider">Thời gian</th>
                <th className="px-6 py-4 font-bold tracking-wider">Phòng</th>
                <th className="px-6 py-4 font-bold tracking-wider">Giảng viên</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Sĩ số</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {days.map((day) => {
                const dayItems = scheduleItems.filter(s => s.day === day)
                if (dayItems.length === 0) return null
                return dayItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#1e325c] text-[14px]">{item.subject}</span>
                        <span className="text-xs text-slate-500">{item.code}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-700">
                      {idx === 0 ? day : ""}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600 flex items-center gap-1.5">
                      <Clock size={14} className="text-slate-400" />
                      {item.time}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 font-medium text-slate-700">
                        <MapPin size={14} className="text-slate-400" />
                        {item.room}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">{item.lecturer}</td>
                    <td className="px-6 py-4 text-center font-bold text-slate-800">{item.students}</td>
                    <td className="px-6 py-4 text-center">
                      {item.status === "ongoing" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                          Đang học
                        </span>
                      ) : (
                        <span className="inline-flex px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                          Sắp tới
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
