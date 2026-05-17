import {
  Clock, MapPin, Edit3, Power, Users, UserCheck, AlertTriangle,
  ShieldCheck, Search, CheckCircle2, MapPinOff, QrCode
} from "lucide-react"
import { mockLiveStudents } from "../../mocks/liveAttendance.mock"

export default function SchedulePage() {
  return (
    <div className="flex flex-col w-full pb-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded text-xs font-bold">
              Đang diễn ra
            </span>
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
              <Clock size={14} />
              <span>08:00 - 10:30, Hôm nay</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">Lập trình Web Cơ bản (IT3230)</h1>

          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
            <MapPin size={16} />
            <span>Phòng D3-501</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border border-slate-300 bg-white rounded-md px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            <Edit3 size={16} />
            <span>Sửa thủ công</span>
          </button>
          <button className="flex items-center gap-2 border border-[#c12a2a] bg-[#c12a2a] rounded-md px-4 py-2 text-sm font-bold text-white hover:bg-[#a52222] transition-colors shadow-sm">
            <Power size={16} />
            <span>Kết thúc phiên</span>
          </button>
        </div>
      </div>

      {/* MAIN GRID - 12 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT COLUMN (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* QR Code Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-6">
              <h3 className="font-bold text-slate-800">Quét mã để điểm danh</h3>
              <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 px-2 py-1 rounded-full text-xs font-bold text-blue-600">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
                Trực tiếp
              </div>
            </div>

            {/* Fake QR Image */}
            <div className="w-48 h-48 border-4 border-slate-800 p-2 mb-6 rounded-sm relative flex flex-col justify-between">
              <div className="flex justify-between h-1/3">
                <div className="w-12 h-12 border-4 border-slate-800"></div>
                <div className="w-12 h-full bg-slate-800"></div>
                <div className="w-12 h-12 border-4 border-slate-800"></div>
              </div>
              <div className="flex justify-between h-1/4">
                <div className="w-full h-4 border-4 border-slate-800 my-auto"></div>
              </div>
              <div className="flex justify-between h-1/3">
                <div className="w-12 h-12 border-4 border-slate-800"></div>
                <div className="w-8 h-full bg-slate-800 ml-4"></div>
                <div className="w-12 h-12 border-4 border-slate-800"></div>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-500 mb-2">Mã xác thực hiện tại</p>
            <div className="w-full bg-slate-100/80 border border-slate-200 rounded-lg py-3 text-center mb-6">
              <span className="text-4xl font-black text-[#1e325c] tracking-widest">842 911</span>
            </div>

            <div className="w-full flex items-center justify-between border border-slate-200 bg-slate-50 rounded-md px-4 py-3 text-sm font-medium text-slate-600">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-400" />
                <span>Làm mới sau:</span>
              </div>
              <span className="font-bold text-slate-800">00:15</span>
            </div>
          </div>

          {/* Anti-cheat Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={20} className="text-[#007082]" />
              <h3 className="font-bold text-slate-800">Cài đặt chống gian lận</h3>
            </div>

            <div className="flex flex-col gap-5">
              {/* Setting 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Kiểm tra GPS</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Yêu cầu SV trong bán kính 50m</p>
                </div>
                {/* Custom Toggle ON */}
                <div className="w-10 h-5 bg-[#007082] rounded-full relative cursor-pointer flex-shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>

              <div className="h-px w-full bg-slate-100"></div>

              {/* Setting 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Chỉ cho phép Wi-Fi trường</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Bắt buộc dùng: HUST_Student</p>
                </div>
                {/* Custom Toggle OFF */}
                <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer flex-shrink-0">
                  <div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm border border-slate-200"></div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div className="h-12 w-12 rounded-full bg-[#1e325c] flex items-center justify-center text-white shrink-0">
                <Users size={20} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-500 mb-1">Tổng sĩ số</p>
                <h3 className="text-2xl font-bold text-slate-800">120</h3>
              </div>
            </div>

            <div className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div className="h-12 w-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                <UserCheck size={20} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-500 mb-1">Đã điểm danh</p>
                <h3 className="text-2xl font-bold text-slate-800">85</h3>
              </div>
            </div>

            <div className="bg-white border border-slate-200 border-l-4 border-l-amber-500 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div className="h-12 w-12 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-500 mb-1">Cảnh báo GPS</p>
                <h3 className="text-2xl font-bold text-slate-800">3</h3>
              </div>
            </div>
          </div>

          {/* LIST TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="font-bold text-slate-800 text-lg">Danh sách điểm danh (Live)</h3>
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-200 rounded-md text-sm bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                  placeholder="Tìm MSSV hoặc Tên..."
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs uppercase text-slate-500 bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-bold tracking-wider">MSSV</th>
                    <th className="px-6 py-4 font-bold tracking-wider">Họ và Tên</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-center">Thời gian</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-center">Trạng thái</th>
                    <th className="px-6 py-4 font-bold tracking-wider text-center">Xác thực GPS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockLiveStudents.map((student, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-700">{student.mssv}</td>
                      <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                      <td className="px-6 py-4 text-center font-medium">{student.time}</td>
                      <td className="px-6 py-4 text-center">
                        {student.status === "PRESENT" ? (
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
                            Có mặt
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold">
                            Đi muộn
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center flex justify-center">
                        {student.gpsValid ? (
                          <CheckCircle2 size={18} className="text-emerald-500" />
                        ) : (
                          <MapPinOff size={18} className="text-amber-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
