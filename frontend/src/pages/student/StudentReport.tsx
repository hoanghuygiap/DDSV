import { mockStudentAttendanceHistoryV2, mockStudentStats } from "@/mocks/student.mock"
import { 
  Calendar, 
  ChevronDown, 
  Download, 
  Filter, 
  FileText, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

export default function StudentReport() {
  return (
    <div className="flex flex-col gap-6 w-full pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Lịch sử điểm danh</h1>
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium mt-1">
            <Calendar size={16} />
            <span>Học kỳ 1 - Năm học 2023-2024</span>
          </div>
        </div>
        
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm transition-all shadow-sm">
          <Download size={18} />
          <span>Xuất PDF</span>
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1a3a5f] flex items-center justify-center shrink-0">
            <GraduationCap size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Tổng số buổi học</p>
            <h3 className="text-3xl font-bold text-slate-800">{mockStudentStats.tong_buoi_hoc}</h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Tỷ lệ chuyên cần</p>
              <div className="flex items-center gap-2">
                <h3 className="text-3xl font-bold text-cyan-600">{mockStudentStats.ty_le_chuyen_can}%</h3>
                <span className="bg-[#1a3a5f] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Tốt</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
            <AlertCircle size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Vắng mặt / Đi muộn</p>
            <h3 className="text-3xl font-bold text-slate-800">
              <span className="text-red-500">{mockStudentStats.so_buoi_vang}</span> / {mockStudentStats.so_buoi_muon}
            </h3>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Tháng</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#00a8cc]">
                <option>Tất cả các tháng</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block">Môn học</label>
            <div className="relative">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 appearance-none focus:outline-none focus:border-[#00a8cc]">
                <option>Tất cả môn học</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            </div>
          </div>

          <div className="flex items-end">
            <button className="w-full bg-[#1a3a5f] hover:bg-[#254a75] text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
              <Filter size={18} />
              <span>Lọc kết quả</span>
            </button>
          </div>
        </div>
      </div>

      {/* ATTENDANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Ngày</th>
                <th className="py-4 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Môn học</th>
                <th className="py-4 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Phòng</th>
                <th className="py-4 px-6 text-left text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Giảng viên</th>
                <th className="py-4 px-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Trạng thái</th>
                <th className="py-4 px-6 text-center text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">Minh chứng</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockStudentAttendanceHistoryV2.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-sm">{item.ngay}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-bold text-slate-800 text-sm">{item.mon_hoc}</td>
                  <td className="py-4 px-6 text-slate-500 text-sm font-medium">{item.phong}</td>
                  <td className="py-4 px-6 text-slate-500 text-sm font-medium">{item.giang_vien}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        item.trang_thai === 'PRESENT' 
                          ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                          : item.trang_thai === 'ABSENT'
                          ? 'bg-red-50 text-red-500 border border-red-100'
                          : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {item.trang_thai === 'PRESENT' ? 'Có mặt' : item.trang_thai === 'ABSENT' ? 'Vắng mặt' : 'Đi muộn'}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex justify-center">
                      {item.minh_chung ? (
                        <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold transition-all">
                          {item.trang_thai === 'ABSENT' ? <FileText size={14} /> : <Eye size={14} />}
                          {item.minh_chung}
                        </button>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-400">Hiển thị 1 - 5 trong số 42 mục</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
              <ChevronLeft size={18} />
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#1a3a5f] text-white text-sm font-bold flex items-center justify-center">1</button>
            <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-bold flex items-center justify-center">2</button>
            <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-slate-50 text-sm font-bold flex items-center justify-center">3</button>
            <span className="text-slate-400 px-1">...</span>
            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
