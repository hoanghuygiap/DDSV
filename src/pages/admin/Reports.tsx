import { Download, Radio } from "lucide-react"

const departmentStats = [
  { name: "CNTT", rate: 95 },
  { name: "Cơ khí", rate: 88 },
  { name: "Điện", rate: 92 },
  { name: "Kinh tế", rate: 85 },
  { name: "Dệt may", rate: 75 },
  { name: "Hoá học", rate: 80 },
  { name: "XD", rate: 65 },
]

const warningClasses = [
  { id: 1, code: "IT3230", name: "Lập trình Web", className: "IT-K15-A", absenceRate: 28 },
  { id: 2, code: "MT1001", name: "Giải tích 1", className: "TH-K14-B", absenceRate: 25 },
  { id: 3, code: "IT2150", name: "Cơ sở dữ liệu", className: "IT-K15-C", absenceRate: 22 },
  { id: 4, code: "EE2030", name: "Điện tử cơ bản", className: "DT-K15-A", absenceRate: 21 },
  { id: 5, code: "EC1010", name: "Kinh tế vi mô", className: "KT-K14-D", absenceRate: 20 },
]

const subjectAttendance = [
  { id: 1, code: "IT3230", name: "Lập trình Web Cơ bản", lecturer: "Nguyễn Văn A", absentCount: 142, absenceRate: 28, status: "HIGH_RISK" },
  { id: 2, code: "MT1001", name: "Giải tích 1", lecturer: "Lê Văn C", absentCount: 118, absenceRate: 25, status: "HIGH_RISK" },
  { id: 3, code: "IT2150", name: "Cơ sở dữ liệu", lecturer: "Trần Thị B", absentCount: 95, absenceRate: 18, status: "WATCHING" },
  { id: 4, code: "EE2030", name: "Điện tử cơ bản", lecturer: "Phạm Thị D", absentCount: 82, absenceRate: 15, status: "WATCHING" },
  { id: 5, code: "EC1010", name: "Kinh tế vi mô", lecturer: "Hoàng Văn E", absentCount: 45, absenceRate: 8, status: "NORMAL" },
  { id: 6, code: "IT1050", name: "Kỹ thuật lập trình", lecturer: "Nguyễn Văn A", absentCount: 30, absenceRate: 6, status: "NORMAL" },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "NORMAL":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Bình thường
        </span>
      )
    case "HIGH_RISK":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Nguy cơ cao
        </span>
      )
    case "WATCHING":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Theo dõi
        </span>
      )
    default:
      return null
  }
}

export default function ReportsPage() {
  const maxRate = Math.max(...departmentStats.map(d => d.rate))

  return (
    <div className="flex flex-col w-full pb-10">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Phân tích dữ liệu học thuật</h1>
          <p className="text-sm text-slate-500 mt-1">Dữ liệu tổng hợp từ các khoa và lớp học toàn trường.</p>
        </div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-md px-4 py-2.5 text-sm font-medium">
          Chức năng đang phát triển — Dữ liệu mẫu
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
            <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
            Đang diễn ra hiện tại
          </div>
        </div>
      </div>

      {/* MIDDLE 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="mb-8">
            <h3 className="font-bold text-slate-800 text-lg">Tỷ lệ chuyên cần theo khoa</h3>
            <p className="text-sm text-slate-500 mt-1">So sánh hiệu suất tham gia giữa các đơn vị</p>
          </div>

          <div className="flex-1 flex flex-col justify-end min-h-[240px]">
            <div className="relative h-48 w-full flex items-end justify-around pb-6 border-b border-slate-100">
              <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                {[100, 75, 50, 25].map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 w-6 text-right">{v}</span>
                    <div className="flex-1 h-px bg-slate-100" />
                  </div>
                ))}
              </div>
              {departmentStats.map((d) => (
                <div
                  key={d.name}
                  className="w-8 md:w-10 lg:w-12 rounded-t-sm transition-all relative z-10"
                  style={{
                    height: `${(d.rate / maxRate) * 85}%`,
                    backgroundColor: d.rate >= 90 ? "#007082" : d.rate >= 80 ? "#1e325c" : "#f59e0b",
                  }}
                  title={`${d.name}: ${d.rate}%`}
                />
              ))}
            </div>
            <div className="flex justify-around pt-4 text-[10px] sm:text-xs font-semibold text-slate-500 uppercase">
              {departmentStats.map((d) => (
                <span key={d.name} className="w-8 md:w-10 lg:w-12 text-center">{d.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Warning List */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 text-lg">Cảnh báo tỷ lệ vắng</h3>
            <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Top 5</span>
          </div>
          <div className="flex flex-col gap-4 flex-1">
            {warningClasses.map((item) => (
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
        </div>
      </div>

      {/* TABLE */}
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
              {subjectAttendance.map((subject) => (
                <tr key={subject.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{subject.code}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{subject.name}</td>
                  <td className="px-6 py-4 font-medium text-slate-600">{subject.lecturer}</td>
                  <td className="px-6 py-4 text-right font-medium">{subject.absentCount}</td>
                  <td className="px-6 py-4 text-right font-medium">{subject.absenceRate}%</td>
                  <td className="px-6 py-4 flex justify-center">{getStatusBadge(subject.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-500">Hiển thị {subjectAttendance.length} môn học</span>
        </div>
      </div>
    </div>
  )
}
