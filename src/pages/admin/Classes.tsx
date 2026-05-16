import { Book, Users } from "lucide-react"

const classes = [
  { id: 1, name: "Lập trình Web", major: "Công nghệ thông tin", code: "IT3230-01", instructorName: "Nguyễn Văn A", instructorInitials: "NA", instructorColor: "bg-blue-100 text-blue-700", students: 42, schedule: "Thứ 2, 7:30 - 10:00", status: "Active" },
  { id: 2, name: "Cơ sở dữ liệu", major: "Công nghệ thông tin", code: "IT2150-02", instructorName: "Trần Thị B", instructorInitials: "TB", instructorColor: "bg-purple-100 text-purple-700", students: 38, schedule: "Thứ 3, 13:30 - 16:00", status: "Active" },
  { id: 3, name: "Giải tích 1", major: "Toán - Tin", code: "MT1001-01", instructorName: "Lê Văn C", instructorInitials: "LC", instructorColor: "bg-emerald-100 text-emerald-700", students: 55, schedule: "Thứ 4, 7:30 - 10:00", status: "Active" },
  { id: 4, name: "Mạng máy tính", major: "Công nghệ thông tin", code: "IT3150-03", instructorName: "Phạm Thị D", instructorInitials: "PD", instructorColor: "bg-amber-100 text-amber-700", students: 30, schedule: "Thứ 5, 10:15 - 12:45", status: "Inactive" },
]

export default function ClassesPage() {
  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1e325c]">Quản lý Lớp học</h1>
          <p className="text-sm text-slate-500 mt-1">Quản lý danh sách, giảng viên và sĩ số các lớp học trong học kỳ.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-4 py-2.5 text-sm font-medium">
          Chức năng đang phát triển
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-[11px] uppercase text-slate-500 bg-slate-100/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-bold tracking-wider">Tên lớp</th>
                <th className="px-6 py-4 font-bold tracking-wider">Mã lớp</th>
                <th className="px-6 py-4 font-bold tracking-wider">Giảng viên</th>
                <th className="px-6 py-4 font-bold tracking-wider">Sĩ số</th>
                <th className="px-6 py-4 font-bold tracking-wider">Lịch học</th>
                <th className="px-6 py-4 font-bold tracking-wider">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {classes.map((cls) => (
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
                      <span className="inline-flex px-3 py-1 bg-emerald-50 text-emerald-600 rounded text-xs font-bold">Đang học</span>
                    ) : (
                      <span className="inline-flex px-3 py-1 bg-red-50 text-red-600 rounded text-xs font-bold">Kết thúc</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm text-slate-500">Hiển thị {classes.length} lớp học (dữ liệu mẫu)</span>
        </div>
      </div>

      {/* BOTTOM WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1e325c] rounded-xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden min-h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="text-[#8ba3cc] font-bold text-xs uppercase tracking-wider">Tổng số lớp</h3>
            <Book size={20} className="text-[#8ba3cc]" />
          </div>
          <div className="mt-8">
            <h2 className="text-white text-4xl font-bold">{classes.length}</h2>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[160px]">
          <div className="flex justify-between items-start">
            <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">Sĩ số trung bình</h3>
            <Users size={20} className="text-[#007082]" />
          </div>
          <div className="mt-8">
            <h2 className="text-slate-800 text-4xl font-bold">
              {Math.round(classes.reduce((s, c) => s + c.students, 0) / classes.length)}
            </h2>
          </div>
        </div>
      </div>
    </div>
  )
}
