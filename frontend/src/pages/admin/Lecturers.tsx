import { Search, UserPlus, Pencil, Trash2, Star } from "lucide-react"
import { mockLecturers } from "../../mocks/lecturers.mock"

export default function LecturersPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold border border-emerald-100">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Đang công tác
          </span>
        );
      case "ON_LEAVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-xs font-bold border border-amber-100">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Nghỉ phép
          </span>
        );
      case "RETIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-bold border border-red-100">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
            Nghỉ hưu
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e325c]">Quản lý Giảng viên</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý và cập nhật thông tin giảng viên trong khoa.</p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md text-sm bg-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082] shadow-sm"
              placeholder="Tìm kiếm giảng viên..."
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-[#007082] hover:bg-[#005c6b] text-white rounded-md px-4 py-2 text-sm font-bold shadow-sm transition-colors whitespace-nowrap h-[38px]">
            <UserPlus size={18} />
            <span>Add New Faculty</span>
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Họ và Tên</th>
                <th className="px-6 py-4 font-bold tracking-wider">Mã GV</th>
                <th className="px-6 py-4 font-bold tracking-wider">Khoa / Bộ môn</th>
                <th className="px-6 py-4 font-bold tracking-wider">Email</th>
                <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
                <th className="px-6 py-4 font-bold tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLecturers.map((lecturer) => (
                <tr key={lecturer.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${lecturer.avatarColor} shrink-0`}>
                        {lecturer.avatarText}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#007082] text-[15px]">{lecturer.name}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{lecturer.title}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{lecturer.code}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{lecturer.department}</td>
                  <td className="px-6 py-4 font-medium text-[#007082]">{lecturer.email}</td>
                  <td className="px-6 py-4 flex justify-center mt-1">
                    {getStatusBadge(lecturer.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button className="text-slate-400 hover:text-slate-600 transition-colors">
                        <Pencil size={18} />
                      </button>
                      <button className="text-slate-400 hover:text-red-600 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-sm text-slate-500 font-medium">Hiển thị 5 trên 48 giảng viên</span>
          <div className="flex items-center gap-1.5">
            <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 shadow-sm">
              &lt;
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-[#1e325c] text-white font-bold shadow-sm">
              1
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
              2
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
              3
            </button>
            <span className="text-slate-400 px-1">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
              10
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Widget 1 */}
        <div className="md:col-span-2 bg-[#1e325c] rounded-xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

          <div className="relative z-10">
            <h3 className="text-white font-bold text-lg">Tóm tắt nhân sự Faculty</h3>
            <p className="text-[#8ba3cc] text-sm mt-1">Cập nhật lần cuối: Hôm nay, 10:30 AM</p>
          </div>

          <div className="flex items-end justify-between mt-8 relative z-10">
            <div className="flex gap-10">
              <div>
                <p className="text-[#8ba3cc] text-xs font-bold uppercase tracking-wider mb-1">Tổng số</p>
                <h2 className="text-white text-4xl font-bold">148</h2>
              </div>
              <div>
                <p className="text-[#8ba3cc] text-xs font-bold uppercase tracking-wider mb-1">Hoạt động</p>
                <h2 className="text-white text-4xl font-bold">132</h2>
              </div>
            </div>

            <button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-md px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors backdrop-blur-sm">
              Xem chi tiết
            </button>
          </div>
        </div>

        {/* Widget 2 */}
        <div className="bg-[#38bdf8] rounded-xl p-6 shadow-md flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>

          <div className="w-12 h-12 bg-[#1e325c] rounded-full flex items-center justify-center text-[#38bdf8] mb-4 relative z-10 shadow-sm">
            <Star size={24} className="fill-current" />
          </div>

          <h3 className="text-[#1e325c] font-bold text-lg mb-2 relative z-10">Thành tích Khoa</h3>
          <p className="text-[#1e325c]/80 text-sm font-medium relative z-10">
            Đã hoàn thành 95% chỉ tiêu điểm danh trong học kỳ này.
          </p>
        </div>

      </div>

    </div>
  )
}
