import { mockAttendanceHistory } from "@/mocks/lecturer.mock"
import { Calendar as CalendarIcon, Filter, Search, ChevronDown, CheckCircle2, AlertCircle } from "lucide-react"

export default function AttendanceHistory() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5f] tracking-tight">
            Lịch sử Điểm danh
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Xem lại danh sách các buổi học đã diễn ra
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Môn học</label>
            <div className="relative">
              <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc]">
                <option>Tất cả môn học</option>
                <option>IT4040 - Lập trình Web</option>
                <option>IT3030 - Cơ sở dữ liệu</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
          
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Thời gian</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <input type="date" className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc]" />
            </div>
          </div>
          
          <div className="relative">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Trạng thái</label>
            <div className="relative">
              <select className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc]">
                <option>Tất cả</option>
                <option>Hoàn thành</option>
                <option>Có sự cố</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
            </div>
          </div>
        </div>
        
        <div className="flex items-end gap-2 md:w-auto">
          <button className="flex items-center justify-center gap-2 bg-[#00a8cc] hover:bg-[#008ba8] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm w-full md:w-auto">
            <Filter size={16} />
            Áp dụng
          </button>
        </div>
      </div>

      {/* HISTORY LIST */}
      <div className="flex flex-col gap-4">
        {mockAttendanceHistory.map((session) => (
          <div key={session.id} className="bg-white border border-slate-200 rounded-xl shadow-sm hover:border-[#00a8cc]/50 transition-all p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
            
            <div className="flex items-start gap-4 flex-1">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex flex-col items-center justify-center shrink-0 border border-blue-100">
                <span className="text-xs font-bold uppercase">{new Date(session.ngay).toLocaleDateString('vi-VN', { month: 'short' })}</span>
                <span className="text-lg font-black">{new Date(session.ngay).getDate()}</span>
              </div>
              
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-[#1a3a5f] text-lg">IT4040 - Lập trình Web</h3>
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold border border-slate-200">
                    Phòng {session.phong_hoc}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={14} />
                    {session.thoi_gian_bat_dau} - {session.thoi_gian_ket_thuc}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-4 md:gap-2 justify-between md:items-end border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 shrink-0">
              <div className="flex gap-4">
                <div className="text-center md:text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Có mặt</p>
                  <p className="text-lg font-black text-emerald-600 flex items-center gap-1 justify-center md:justify-end">
                    <CheckCircle2 size={16} /> {session.so_sv_co_mat}
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Vắng</p>
                  <p className="text-lg font-black text-red-500 flex items-center gap-1 justify-center md:justify-end">
                    {session.so_sv_vang > 0 && <AlertCircle size={16} />} {session.so_sv_vang}
                  </p>
                </div>
              </div>
              <button className="text-sm font-bold text-[#00a8cc] hover:underline mt-auto">
                Xem chi tiết &rarr;
              </button>
            </div>
            
          </div>
        ))}
      </div>

    </div>
  )
}
