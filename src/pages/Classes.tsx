import { PlusCircle, ChevronDown, ListFilter, Book, Users } from "lucide-react"
import { mockClasses } from "../mocks/classes.mock"

export default function ClassesPage() {
  return (
    <div className="flex flex-col w-full pb-10">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e325c]">Quản lý Lớp học</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý danh sách, giảng viên và sĩ số các lớp học trong học kỳ.</p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#1e325c] hover:bg-[#152342] text-white rounded-md px-5 py-2.5 text-sm font-bold shadow-sm transition-colors whitespace-nowrap">
          <PlusCircle size={18} />
          <span>Add New Class</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row justify-between items-end gap-4 mb-6">
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          {/* Semester Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-700">Semester</label>
            <div className="flex items-center justify-between gap-2 border border-slate-300 bg-white rounded-md px-3 py-2 text-sm font-medium text-slate-700 sm:w-56 cursor-pointer hover:bg-slate-50">
              <span>Học kỳ I - 2023-2024</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
          
          {/* Department Filter */}
          <div className="flex flex-col gap-1.5 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-700">Department</label>
            <div className="flex items-center justify-between gap-2 border border-slate-300 bg-white rounded-md px-3 py-2 text-sm font-medium text-slate-700 sm:w-56 cursor-pointer hover:bg-slate-50">
              <span>Khoa Khoa học Máy tính</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 text-slate-600 font-medium hover:text-slate-800 transition-colors py-2 px-1">
          <ListFilter size={18} />
          <span>More Filters</span>
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-100/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Class Name</th>
                <th className="px-6 py-4 font-bold tracking-wider">Class Code</th>
                <th className="px-6 py-4 font-bold tracking-wider">Instructor</th>
                <th className="px-6 py-4 font-bold tracking-wider">Students</th>
                <th className="px-6 py-4 font-bold tracking-wider">Schedule</th>
                <th className="px-6 py-4 font-bold tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockClasses.map((cls) => (
                <tr key={cls.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1e325c] text-[15px] mb-0.5">{cls.name}</span>
                      <span className="text-xs text-slate-500">{cls.major}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-medium text-slate-700">{cls.code}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${cls.instructorColor}`}>
                        {cls.instructorInitials}
                      </div>
                      <span className="font-medium text-slate-700">{cls.instructorName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-800">{cls.students}</td>
                  <td className="px-6 py-5 font-medium text-slate-600">{cls.schedule}</td>
                  <td className="px-6 py-5">
                    {cls.status === "Active" ? (
                      <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-bold">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold">
                        Inactive
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">Showing 1-4 of 24 classes</span>
          <div className="flex items-center gap-1.5">
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 transition-colors">
              &lt;
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded bg-[#1e325c] text-white font-bold">
              1
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              2
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              3
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* BOTTOM WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Classes Card */}
        <div className="bg-[#1e325c] rounded-xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden min-h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="text-[#8ba3cc] font-bold text-xs uppercase tracking-wider">Tổng số lớp</h3>
            <Book size={20} className="text-[#8ba3cc]" />
          </div>
          <div className="mt-8">
            <h2 className="text-white text-4xl font-bold">24</h2>
          </div>
        </div>

        {/* Avg Students Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Sĩ số trung bình</h3>
            <Users size={20} className="text-[#007082]" />
          </div>
          <div className="mt-8">
            <h2 className="text-slate-800 text-4xl font-bold">78</h2>
          </div>
        </div>

        {/* Image Card */}
        <div className="bg-slate-800 rounded-xl shadow-sm relative overflow-hidden min-h-[160px] group">
          {/* Simulated Image Background */}
          <div className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-50 transition-opacity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1577416412292-747c6607f055?q=80&w=2070&auto=format&fit=crop')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          
          <div className="absolute bottom-4 left-4 right-4 z-10">
            <h3 className="text-white font-bold text-lg leading-tight">Phòng học tiêu chuẩn</h3>
            <p className="text-slate-300 text-xs mt-1">Đã cấu hình hệ thống quét QR</p>
          </div>
        </div>

      </div>

    </div>
  )
}
