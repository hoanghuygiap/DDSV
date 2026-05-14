import { mockLecturerClasses } from "@/mocks/lecturer.mock"
import { Search, BookOpen, Users, MapPin, MoreVertical, ExternalLink } from "lucide-react"
import { Link } from "react-router-dom"

export default function MyClasses() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5f] tracking-tight">
            Danh sách Lớp học
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Quản lý các lớp học phần bạn đang phụ trách
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Tìm mã lớp, tên môn..." 
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc] w-full md:w-64"
            />
          </div>
          <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc]">
            <option>Kỳ hiện tại (20251)</option>
            <option>Kỳ trước (20242)</option>
          </select>
        </div>
      </div>

      {/* TABLE/LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Lớp / Học phần</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Lịch học</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Sĩ số</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ lệ đi học</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockLecturerClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <Link to={`/dashboard/my-classes/${cls.id}`} className="font-bold text-[#1a3a5f] hover:text-[#00a8cc] transition-colors">
                          {cls.ten_hoc_phan}
                        </Link>
                        <p className="text-sm text-slate-500 font-medium">{cls.ma_lop} • {cls.so_tin_chi} TC</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-slate-700">{cls.thoi_gian}</span>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        Phòng {cls.phong_hoc}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-slate-400" />
                      <span className="font-semibold text-slate-700">{cls.so_sinh_vien}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-sm font-bold text-[#00a8cc]">{cls.ty_le_chuyen_can}%</span>
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-[#00a8cc]" 
                          style={{ width: `${cls.ty_le_chuyen_can}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${
                      cls.trang_thai === 'Đang diễn ra' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                        : cls.trang_thai === 'Chưa bắt đầu'
                        ? 'bg-slate-100 text-slate-600 border border-slate-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}>
                      {cls.trang_thai}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/dashboard/my-classes/${cls.id}`} className="p-2 text-slate-400 hover:text-[#00a8cc] hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger" title="Xem chi tiết">
                        <ExternalLink size={18} />
                      </Link>
                      <button className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-500 flex justify-between items-center">
          <span>Hiển thị {mockLecturerClasses.length} lớp học</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Trước</button>
            <button className="px-3 py-1 border border-[#00a8cc] rounded bg-[#00a8cc] text-white">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  )
}
