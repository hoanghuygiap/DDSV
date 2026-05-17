import { mockReports } from "@/mocks/lecturer.mock"
import { BarChart3, Download, TrendingDown, TrendingUp, Users } from "lucide-react"

export default function ClassReport() {
  const chartMax = Math.max(...mockReports.bieu_do_chuyen_can.map(d => d.value));

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5f] tracking-tight">
            Báo cáo Chuyên cần
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Thống kê tình hình đi học của sinh viên các lớp
          </p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors shadow-sm">
          <Download size={18} />
          Xuất báo cáo PDF
        </button>
      </div>

      {/* SUMMARY STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-[#1a3a5f] to-[#2a4d7a] rounded-xl p-6 text-white shadow-md relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
            <BarChart3 size={120} />
          </div>
          <div className="relative z-10">
            <p className="text-blue-200 font-medium text-sm mb-2 uppercase tracking-wider">Tỷ lệ đi học trung bình</p>
            <h2 className="text-4xl font-black mb-4">{mockReports.tong_quan.ti_le_di_hoc}%</h2>
            <div className="flex items-center gap-2 text-sm font-bold bg-white/20 w-fit px-3 py-1.5 rounded-lg backdrop-blur-sm">
              <TrendingUp size={16} className="text-emerald-300" />
              <span>Tốt hơn 5% so với năm ngoái</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <TrendingDown size={24} />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-sm">Sinh viên rủi ro cao</p>
              <h3 className="text-2xl font-bold text-slate-800">{mockReports.tong_quan.sv_canh_bao}</h3>
            </div>
          </div>
          <p className="text-sm text-slate-500">Cần gửi cảnh báo (Vắng &gt; 20%)</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <p className="text-slate-500 font-medium text-sm">Tổng số buổi đã dạy</p>
              <h3 className="text-2xl font-bold text-slate-800">{mockReports.tong_quan.so_buoi_da_day}</h3>
            </div>
          </div>
          <p className="text-sm text-slate-500">Trên {mockReports.tong_quan.tong_so_lop} lớp học phần</p>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-[#1a3a5f] text-lg">Biểu đồ chuyên cần theo tuần</h3>
          <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:border-[#00a8cc]">
            <option>IT4040 - Lập trình Web</option>
            <option>Tất cả lớp học</option>
          </select>
        </div>
        
        <div className="p-8 h-80 flex items-end justify-around gap-4 md:gap-8 border-b border-slate-100 relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-8 pointer-events-none px-8">
            <div className="w-full border-b border-slate-100 border-dashed flex relative"><span className="absolute -left-6 -top-2.5 text-xs text-slate-400">100</span></div>
            <div className="w-full border-b border-slate-100 border-dashed flex relative"><span className="absolute -left-6 -top-2.5 text-xs text-slate-400">75</span></div>
            <div className="w-full border-b border-slate-100 border-dashed flex relative"><span className="absolute -left-6 -top-2.5 text-xs text-slate-400">50</span></div>
            <div className="w-full border-b border-slate-100 border-dashed flex relative"><span className="absolute -left-6 -top-2.5 text-xs text-slate-400">25</span></div>
            <div className="w-full border-b border-slate-200 flex relative"><span className="absolute -left-6 -top-2.5 text-xs text-slate-400">0</span></div>
          </div>

          {/* Bars */}
          {mockReports.bieu_do_chuyen_can.map((item, index) => (
            <div key={index} className="relative flex flex-col items-center flex-1 h-full justify-end z-10 group">
              <div 
                className="w-full max-w-16 bg-[#00a8cc]/20 rounded-t-lg transition-all duration-300 group-hover:bg-[#00a8cc]/30 relative"
                style={{ height: `${(item.value / 100) * 100}%` }}
              >
                <div 
                  className="absolute bottom-0 w-full bg-[#00a8cc] rounded-t-lg transition-all duration-300 group-hover:shadow-[0_0_15px_rgba(0,168,204,0.4)]"
                  style={{ height: `${(item.value / chartMax) * 100}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1a3a5f] text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.value}%
                </div>
              </div>
              <span className="mt-4 text-xs font-bold text-slate-500 uppercase">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
