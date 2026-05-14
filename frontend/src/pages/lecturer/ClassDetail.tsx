import { useParams, Link } from "react-router-dom"
import { mockLecturerClasses, mockClassStudents } from "@/mocks/lecturer.mock"
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  QrCode, 
  UserCheck, 
  UserX, 
  Clock, 
  MoreVertical 
} from "lucide-react"

export default function ClassDetail() {
  const { id } = useParams();
  // Trong thực tế sẽ gọi API, ở đây dùng mock tạm
  const cls = mockLecturerClasses.find(c => c.id === Number(id)) || mockLecturerClasses[0];

  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      
      {/* HEADER & BREADCRUMB */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link to="/dashboard/my-classes" className="hover:text-[#00a8cc] flex items-center gap-1">
            <ArrowLeft size={16} />
            Quay lại
          </Link>
          <span>/</span>
          <span>Chi tiết lớp học</span>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-[#1a3a5f] tracking-tight">
                {cls.ten_hoc_phan}
              </h1>
              <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border border-blue-200">
                {cls.ma_lop}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              Phòng {cls.phong_hoc} • {cls.thoi_gian} • {cls.so_tin_chi} Tín chỉ
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2.5 rounded-lg font-semibold text-sm transition-colors">
              <Download size={18} />
              <span>Xuất danh sách</span>
            </button>
            <Link to={`/dashboard/new-attendance?classId=${cls.id}`} className="flex items-center gap-2 bg-[#00a8cc] hover:bg-[#008ba8] text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors shadow-sm">
              <QrCode size={18} />
              <span>Điểm danh ngay</span>
            </Link>
          </div>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Sinh Viên</p>
            <p className="text-xl font-bold text-[#1a3a5f]">{cls.so_sinh_vien}</p>
          </div>
        </div>
        
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserCheck size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tỷ lệ đi học TB</p>
            <p className="text-xl font-bold text-emerald-600">{cls.ty_le_chuyen_can}%</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <UserX size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nguy cơ cấm thi</p>
            <p className="text-xl font-bold text-orange-600">3 SV</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Số buổi đã dạy</p>
            <p className="text-xl font-bold text-[#1a3a5f]">12/15</p>
          </div>
        </div>
      </div>

      {/* STUDENT LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1">
        
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-[#1a3a5f] text-lg">Danh sách sinh viên</h3>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
              {mockClassStudents.length}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm MSSV, Tên..." 
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc] w-full sm:w-56"
              />
            </div>
            <button className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              <Filter size={16} />
              <span className="hidden sm:inline">Lọc</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider w-12 text-center">STT</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Thông tin Sinh viên</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Lớp quản lý</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Số buổi vắng</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Tỷ lệ vắng</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Hôm nay</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockClassStudents.map((sv, index) => (
                <tr key={sv.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="py-4 px-6 text-center text-slate-500 font-medium">{index + 1}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 font-bold flex items-center justify-center shrink-0 border border-slate-200">
                        {sv.ho_ten.split(' ').pop()?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-[#1a3a5f]">{sv.ho_ten}</h4>
                        <p className="text-xs text-slate-500">{sv.ma_sv}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-medium text-slate-700">{sv.lop_quan_ly}</span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`font-bold text-lg ${sv.so_buoi_vang > 2 ? 'text-red-500' : sv.so_buoi_vang > 0 ? 'text-orange-500' : 'text-slate-700'}`}>
                      {sv.so_buoi_vang}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold ${
                      sv.ty_le_vang >= 20 
                        ? 'bg-red-50 text-red-600 border border-red-200' 
                        : sv.ty_le_vang > 0 
                          ? 'bg-orange-50 text-orange-600 border border-orange-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                    }`}>
                      {sv.ty_le_vang}%
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {sv.trang_thai_hom_nay === 'PRESENT' && (
                      <span className="inline-flex w-3 h-3 bg-emerald-500 rounded-full" title="Có mặt"></span>
                    )}
                    {sv.trang_thai_hom_nay === 'ABSENT' && (
                      <span className="inline-flex w-3 h-3 bg-red-500 rounded-full" title="Vắng mặt"></span>
                    )}
                    {sv.trang_thai_hom_nay === 'LATE' && (
                      <span className="inline-flex w-3 h-3 bg-orange-500 rounded-full" title="Đi muộn"></span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-[#00a8cc] hover:bg-blue-50 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-500 flex justify-between items-center">
          <span>Hiển thị 1-10 trên 65 sinh viên</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-400 cursor-not-allowed">Trước</button>
            <button className="px-3 py-1 border border-[#00a8cc] rounded bg-[#00a8cc] text-white">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">3</button>
            <button className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50">Sau</button>
          </div>
        </div>

      </div>

    </div>
  )
}

function Users(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  )
}
