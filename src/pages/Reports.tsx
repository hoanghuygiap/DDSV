import { ChevronDown, Filter, Download, MoreVertical, Radio } from "lucide-react"
import { mockWarningClasses, mockSubjectAttendance } from "../mocks/reports.mock"

export default function ReportsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NORMAL":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Bình thường
          </span>
        );
      case "HIGH_RISK":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Nguy cơ cao
          </span>
        );
      case "WATCHING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Theo dõi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Phân tích dữ liệu học thuật</h1>
          <p className="text-sm text-slate-500 mt-1">Dữ liệu tổng hợp từ 12 khoa và 450 lớp học toàn trường.</p>
        </div>
        
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">Học kỳ</label>
            <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-3 py-2 text-sm font-medium text-slate-600 shadow-sm w-48 justify-between cursor-pointer hover:bg-slate-50">
              <span>Học kỳ II - 2023-2024</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-500">Khoa</label>
            <div className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-3 py-2 text-sm font-medium text-slate-600 shadow-sm w-40 justify-between cursor-pointer hover:bg-slate-50">
              <span>Tất cả khoa</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 bg-[#1e325c] hover:bg-[#152342] text-white rounded-md px-4 py-2 text-sm font-bold shadow-sm transition-colors h-[38px]">
            <Filter size={16} />
            <span>Áp dụng bộ lọc</span>
          </button>
        </div>
      </div>

      {/* TOP 4 STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tổng buổi vắng</p>
          <h3 className="text-3xl font-bold text-red-600 mb-2">12,482</h3>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-red-600">↑12%</span>
            <span className="text-slate-500">so với học kỳ trước</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tỷ lệ chuyên cần</p>
          <h3 className="text-3xl font-bold text-[#007082] mb-2">91.4%</h3>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="font-bold text-emerald-500">↓0.5%</span>
            <span className="text-slate-500">duy trì mức ổn định</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Sinh viên cảnh báo</p>
          <h3 className="text-3xl font-bold text-amber-600 mb-2">342</h3>
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500">Vắng trên 20% số buổi</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-blue-50 opacity-50 pointer-events-none">
            <Radio size={100} strokeWidth={1} />
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Điểm danh Live</p>
          <h3 className="text-3xl font-bold text-[#1e325c] mb-2 relative z-10">1,204</h3>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#38bdf8] relative z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse"></span>
            Đang diễn ra hiện tại
          </div>
        </div>
      </div>

      {/* MIDDLE 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Left Column: Bar Chart Simulation */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Tỷ lệ chuyên cần theo khoa</h3>
              <p className="text-sm text-slate-500 mt-1">So sánh hiệu suất tham gia giữa các đơn vị</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
          
          <div className="flex-1 flex flex-col justify-end min-h-[240px]">
            {/* Chart Area */}
            <div className="relative h-48 w-full flex items-end justify-around pb-6 border-b border-slate-100">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
              </div>

              {/* Bars */}
              <div className="w-8 md:w-12 lg:w-14 h-[95%] bg-[#e2e8f0] hover:bg-[#cbd5e1] rounded-t-sm transition-colors relative z-10"></div>
              <div className="w-8 md:w-12 lg:w-14 h-[88%] bg-[#e2e8f0] hover:bg-[#cbd5e1] rounded-t-sm transition-colors relative z-10"></div>
              <div className="w-8 md:w-12 lg:w-14 h-[92%] bg-[#e2e8f0] hover:bg-[#cbd5e1] rounded-t-sm transition-colors relative z-10"></div>
              <div className="w-8 md:w-12 lg:w-14 h-[85%] bg-[#e2e8f0] hover:bg-[#cbd5e1] rounded-t-sm transition-colors relative z-10"></div>
              <div className="w-8 md:w-12 lg:w-14 h-[75%] bg-[#e2e8f0] hover:bg-[#cbd5e1] rounded-t-sm transition-colors relative z-10"></div>
              <div className="w-8 md:w-12 lg:w-14 h-[80%] bg-[#e2e8f0] hover:bg-[#cbd5e1] rounded-t-sm transition-colors relative z-10"></div>
              <div className="w-8 md:w-12 lg:w-14 h-[65%] bg-[#e2e8f0] hover:bg-[#cbd5e1] rounded-t-sm transition-colors relative z-10"></div>
            </div>
            
            {/* X-Axis Labels */}
            <div className="flex justify-around pt-4 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">
              <span className="w-8 md:w-12 lg:w-14 text-center">CNTT</span>
              <span className="w-8 md:w-12 lg:w-14 text-center">Cơ khí</span>
              <span className="w-8 md:w-12 lg:w-14 text-center">Điện</span>
              <span className="w-8 md:w-12 lg:w-14 text-center">Kinh tế</span>
              <span className="w-8 md:w-12 lg:w-14 text-center">Dệt may</span>
              <span className="w-8 md:w-12 lg:w-14 text-center">Hoá học</span>
              <span className="w-8 md:w-12 lg:w-14 text-center">XD</span>
            </div>
          </div>
        </div>

        {/* Right Column: Warning List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Cảnh báo tỷ lệ vắng</h3>
            <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Top 5</span>
          </div>
          
          <div className="flex flex-col gap-4 flex-1">
            {mockWarningClasses.map((item) => (
              <div key={item.id} className="flex justify-between items-center group">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#007082] transition-colors">{item.code} - {item.name}</h4>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">Lớp: {item.className}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-red-600">{item.absenceRate}%</span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Vắng</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 border-2 border-slate-200 hover:border-slate-300 text-slate-600 font-bold py-2 rounded-md text-sm transition-colors">
            Xem chi tiết danh sách
          </button>
        </div>

      </div>

      {/* BOTTOM SECTION: TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-8">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h3 className="font-bold text-slate-800 text-lg">Chi tiết chuyên cần theo môn học</h3>
          <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Download size={16} />
            <span>Xuất báo cáo (Excel)</span>
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-xs uppercase text-slate-500 bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Mã môn học</th>
                <th className="px-6 py-4 font-bold tracking-wider">Tên môn học</th>
                <th className="px-6 py-4 font-bold tracking-wider">Giảng viên</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Số buổi vắng</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Tỷ lệ vắng</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockSubjectAttendance.map((subject) => (
                <tr key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{subject.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{subject.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{subject.lecturer}</td>
                  <td className="px-6 py-4 text-right font-medium">{subject.absentCount}</td>
                  <td className="px-6 py-4 text-right font-medium">{subject.absenceRate}%</td>
                  <td className="px-6 py-4 flex justify-center">
                    {getStatusBadge(subject.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Hiển thị 1-10 của 128 môn học</span>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1e325c] text-white font-bold">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
              3
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="text-center">
        <p className="text-xs font-medium text-slate-400">
          © 2024 UniCheck Management System • Dữ liệu được cập nhật thời gian thực từ hệ thống QR Gateway.
        </p>
      </div>

    </div>
  )
}
