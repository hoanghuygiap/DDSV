import { mockStudentScheduleV2 } from "@/mocks/student.mock"
import { 
  ChevronLeft, 
  ChevronRight,
  Clock,
  MapPin,
  User,
  LayoutDashboard,
  Calendar,
  BarChart2,
  ChevronDown,
  ArrowRight
} from "lucide-react"

export default function StudentSchedule() {
  const days = [
    { label: "Thứ 2", date: "16/10" },
    { label: "Thứ 3", date: "17/10" },
    { label: "Thứ 4", date: "18/10" },
    { label: "Thứ 5", date: "19/10" },
    { label: "Thứ 6", date: "20/10" },
    { label: "Thứ 7", date: "21/10" },
    { label: "CN", date: "22/10" },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Thời khóa biểu</h1>
          <p className="text-slate-500 text-sm font-medium">Quản lý lịch học và thực hành hàng tuần</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm cursor-pointer hover:bg-slate-50 transition-colors">
            <span className="text-sm font-bold text-slate-700">Học kỳ 1 - 2024/2025</span>
            <ChevronDown size={16} className="text-slate-400" />
          </div>

          <div className="flex items-center gap-2 bg-white border border-slate-200 p-1 rounded-xl shadow-sm">
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 text-sm font-bold text-slate-700">Tuần 12 (16/10 - 22/10)</span>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* LEGEND & STATUS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#dbeafe]"></div>
            <span className="text-sm font-medium text-slate-500">Lý thuyết</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-md bg-[#cffafe]"></div>
            <span className="text-sm font-medium text-slate-500">Thực hành</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-xs font-bold border border-emerald-100 animate-pulse">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>Đang diễn ra: Mạng máy tính (Phòng D3-201)</span>
        </div>
      </div>

      {/* TIMETABLE TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-400 uppercase text-center border-r border-b border-slate-100 w-24">Giờ</th>
                {days.map((day, idx) => (
                  <th key={idx} className="py-4 px-2 text-center border-r border-b border-slate-100 min-w-[140px]">
                    <p className="text-sm font-bold text-slate-800">{day.label}</p>
                    <p className="text-xs font-bold text-slate-400">{day.date}</p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* MORNING SESSION */}
              <tr>
                <td className="py-10 px-4 text-center border-r border-b border-slate-100 bg-slate-50/30">
                  <p className="font-bold text-slate-800 text-sm">Ca Sáng</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">07:00 - 11:30</p>
                </td>
                {mockStudentScheduleV2.ca_sang.map((item, idx) => (
                  <td key={idx} className="p-2 border-r border-b border-slate-100 align-top h-48">
                    {item.mon && (
                      <div className={`h-full rounded-xl p-3 border shadow-sm transition-all hover:shadow-md cursor-pointer relative overflow-hidden group ${
                        item.type === 'theory' 
                          ? 'bg-blue-50/50 border-blue-100' 
                          : 'bg-cyan-50/50 border-cyan-100'
                      }`}>
                        {item.isLive && (
                           <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping"></div>
                        )}
                        <h5 className="font-bold text-[#1a3a5f] text-[13px] mb-3 leading-tight group-hover:text-[#00a8cc] transition-colors">
                          {item.mon}
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                            <Clock size={12} className="text-slate-400" />
                            {item.thoi_gian}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                            <MapPin size={12} className="text-slate-400" />
                            Phòng {item.phong}
                          </div>
                          {item.giang_vien && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                              <User size={12} className="text-slate-400" />
                              {item.giang_vien}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* AFTERNOON SESSION */}
              <tr>
                <td className="py-10 px-4 text-center border-r border-slate-100 bg-slate-50/30">
                  <p className="font-bold text-slate-800 text-sm">Ca Chiều</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">12:30 - 17:00</p>
                </td>
                {mockStudentScheduleV2.ca_chieu.map((item, idx) => (
                  <td key={idx} className="p-2 border-r border-slate-100 align-top h-48">
                    {item.mon && (
                      <div className={`h-full rounded-xl p-3 border shadow-sm transition-all hover:shadow-md cursor-pointer group ${
                        item.type === 'theory' 
                          ? 'bg-blue-50/50 border-blue-100' 
                          : 'bg-cyan-50/50 border-cyan-100'
                      }`}>
                        <h5 className="font-bold text-[#1a3a5f] text-[13px] mb-3 leading-tight group-hover:text-[#00a8cc] transition-colors">
                          {item.mon}
                        </h5>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                            <Clock size={12} className="text-slate-400" />
                            {item.thoi_gian}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-bold">
                            <MapPin size={12} className="text-slate-400" />
                            Phòng {item.phong}
                          </div>
                        </div>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FOOTER STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
             <Calendar size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng môn học (Tuần này)</p>
            <h3 className="text-2xl font-black text-slate-800">5 Môn</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-5">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
             <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tổng giờ học</p>
            <h3 className="text-2xl font-black text-slate-800">24 Giờ</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#00a8cc]/30 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
               <BarChart2 size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lịch thi sắp tới</p>
              <h3 className="text-sm font-bold text-slate-800">Không có trong 7 ngày tới</h3>
            </div>
          </div>
          <ArrowRight size={20} className="text-slate-300 group-hover:text-[#00a8cc] group-hover:translate-x-1 transition-all" />
        </div>
      </div>

    </div>
  )
}
