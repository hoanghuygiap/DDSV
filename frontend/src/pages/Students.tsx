import { Users, AlertTriangle, ChevronDown, Search, Filter, MoreVertical, ChevronRight } from "lucide-react"
import { mockClassStudents, mockClassHistory } from "../mocks/classManagement.mock"

export default function StudentsPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PRESENT":
        return <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">Có mặt</span>;
      case "ABSENT":
        return <span className="px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">Vắng mặt</span>;
      case "LATE":
        return <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold">Đi muộn</span>;
      case "NOT_YET":
      default:
        return <span className="px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-xs font-bold">Chưa Đ.Danh</span>;
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý Lớp học</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý điểm danh, xem lịch sử và gửi thông báo.</p>
        </div>
        
        <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
          <span>CS101 - Cấu trúc dữ liệu (Thứ 2, 8)</span>
          <ChevronDown size={16} className="text-slate-400 ml-2" />
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Tổng Sinh Viên</p>
            <h3 className="text-3xl font-bold text-[#1e325c]">45</h3>
          </div>
          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-[#1e325c]">
            <Users size={24} />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Tỷ lệ Chuyên cần (TB)</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-[#1e325c]">92%</h3>
              <span className="text-sm font-bold text-emerald-500 mb-1">↑2%</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-500 font-bold text-xl">
            %
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-2">Cần Lưu Ý</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-red-600">3</h3>
              <span className="text-sm font-medium text-red-600">sinh viên vắng &gt; 20%</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-500">
            <AlertTriangle size={24} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT - 2 COLUMNS (70/30 SPLIT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Student List */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="font-bold text-slate-800 text-lg">Danh sách Sinh viên</h3>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                  placeholder="Tìm kiếm..."
                />
              </div>
              <button className="flex items-center gap-2 border border-slate-200 bg-slate-50 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors shrink-0">
                <Filter size={16} />
                Lọc
              </button>
            </div>
          </div>
          
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase text-slate-500 bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">MSSV</th>
                  <th className="px-6 py-4 font-bold tracking-wider">Họ & Tên</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">Tỷ lệ C.Cần</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái (Hôm nay)</th>
                  <th className="px-6 py-4 font-bold tracking-wider text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockClassStudents.map((student, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-700">{student.mssv}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`font-bold ${student.attendanceRate < 80 ? 'text-red-500' : 'text-slate-700'}`}>
                        {student.attendanceRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Notification & History */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          
          {/* Gửi Thông Báo Widget */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
            <h3 className="font-bold text-slate-800 text-lg mb-5">Gửi Thông Báo</h3>
            
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Đến:</label>
                <div className="relative">
                  <select className="appearance-none w-full border border-slate-200 rounded-md pl-3 pr-10 py-2 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082] bg-white">
                    <option>Toàn bộ lớp học</option>
                    <option>Sinh viên vắng mặt</option>
                    <option>Sinh viên có rủi ro</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Nội dung:</label>
                <textarea 
                  className="w-full border border-slate-200 rounded-md p-3 text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082] resize-none" 
                  rows={4}
                  placeholder="Nhập thông báo..."
                ></textarea>
              </div>
              
              <button className="w-full bg-[#007082] hover:bg-[#005c6b] text-white font-bold py-2.5 rounded-md text-sm transition-colors flex items-center justify-center gap-2 mt-2 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                Gửi Alert
              </button>
            </div>
          </div>

          {/* Lịch sử Gần đây Widget */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-slate-800 text-lg">Lịch sử Gần đây</h3>
              <button className="text-sm font-bold text-[#007082] hover:underline">
                Xem lịch
              </button>
            </div>
            
            <div className="flex flex-col gap-3">
              {mockClassHistory.map((history) => (
                <div key={history.id} className="flex items-center gap-4 p-3 border border-slate-100 rounded-lg hover:border-slate-200 hover:shadow-sm transition-all cursor-pointer group">
                  <div className="bg-slate-100 rounded-md p-2 flex flex-col items-center justify-center min-w-[56px]">
                    <span className="text-lg font-black text-[#1e325c] leading-none">{history.dateStr.split(" ")[0]}</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">{history.dateStr.split(" ").slice(1).join(" ")}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{history.week} - {history.type}</h4>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{history.presentCount}/{history.totalCount} Có mặt</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-[#007082] transition-colors" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
