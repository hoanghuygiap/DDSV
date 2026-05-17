import { Users, Book, CheckCircle, AlertTriangle, ChevronDown, AlertCircle, Clock, TrendingUp } from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 w-full pb-8">
      
      {/* STATS GRID - 4 COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Tổng sinh viên */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-800">Tổng sinh viên</p>
            <div className="p-2 rounded-md bg-[#1e325c] text-white">
              <Users size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800 mb-2">12,450</h3>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <TrendingUp size={14} className="text-emerald-500" />
              <span className="text-emerald-500">+2.4%</span>
              <span>so với kỳ trước</span>
            </div>
          </div>
        </div>

        {/* Card 2: Lớp học hằng ngày */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-800">Lớp học hằng ngày</p>
            <div className="p-2 rounded-md bg-[#38bdf8] text-white">
              <Book size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-slate-800 mb-2">342</h3>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <Clock size={14} />
              <span>Đang diễn ra: 45</span>
            </div>
          </div>
        </div>

        {/* Card 3: Tỷ lệ chuyên cần */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-800">Tỷ lệ chuyên cần</p>
            <div className="p-2 rounded-md bg-emerald-50 text-emerald-500 border border-emerald-100">
              <CheckCircle size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#007082] mb-3">92.8%</h3>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#38bdf8] h-full rounded-full" style={{ width: '92.8%' }}></div>
            </div>
          </div>
        </div>

        {/* Card 4: Cảnh báo vắng */}
        <div className="bg-white border border-slate-200 border-l-4 border-l-red-500 rounded-lg p-5 shadow-sm flex flex-col justify-between relative">
          <div className="flex justify-between items-start mb-2">
            <p className="text-sm font-semibold text-slate-800">Cảnh báo vắng</p>
            <div className="p-2 rounded-md bg-red-50 text-red-500 border border-red-100">
              <AlertTriangle size={20} strokeWidth={2.5} />
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-red-600 mb-2">84</h3>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
              <span>Sinh viên rủi ro cao (&gt;20%)</span>
            </div>
          </div>
        </div>

      </div>

      {/* MIDDLE SECTION - 2 COLUMNS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Xu hướng điểm danh */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Xu hướng điểm danh</h3>
              <p className="text-sm text-slate-500">Theo từng khoa trong tháng</p>
            </div>
            <button className="flex items-center gap-2 border border-slate-200 rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              Tháng này
              <ChevronDown size={16} className="text-slate-400" />
            </button>
          </div>
          
          <div className="p-6 flex-1 flex flex-col justify-end">
            {/* Chart Simulation */}
            <div className="relative h-64 w-full flex items-end justify-around pb-6 border-b border-slate-100">
              {/* Horizontal grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
                <div className="w-full h-px bg-slate-100"></div>
              </div>

              {/* Bars */}
              <div className="w-12 md:w-16 h-[85%] bg-slate-100 rounded-t-md relative group">
                <div className="absolute bottom-0 w-full bg-[#1e325c] rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: '85%' }}></div>
              </div>
              <div className="w-12 md:w-16 h-[75%] bg-slate-100 rounded-t-md relative group">
                <div className="absolute bottom-0 w-full bg-[#1e325c] rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: '75%' }}></div>
              </div>
              <div className="w-12 md:w-16 h-[60%] bg-slate-100 rounded-t-md relative group">
                <div className="absolute bottom-0 w-full bg-[#1e325c] rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: '60%' }}></div>
              </div>
              <div className="w-12 md:w-16 h-[90%] bg-slate-100 rounded-t-md relative group">
                <div className="absolute bottom-0 w-full bg-[#1e325c] rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: '90%' }}></div>
              </div>
              <div className="w-12 md:w-16 h-[70%] bg-slate-100 rounded-t-md relative group">
                <div className="absolute bottom-0 w-full bg-[#1e325c] rounded-t-md opacity-80 group-hover:opacity-100 transition-opacity" style={{ height: '70%' }}></div>
              </div>
            </div>
            
            {/* X Axis Labels */}
            <div className="flex justify-around pt-4 text-xs font-medium text-slate-500">
              <span className="w-12 md:w-16 text-center">CNTT</span>
              <span className="w-12 md:w-16 text-center">Kinh tế</span>
              <span className="w-12 md:w-16 text-center">Cơ khí</span>
              <span className="w-12 md:w-16 text-center">Ngoại ngữ</span>
              <span className="w-12 md:w-16 text-center">Điện tử</span>
            </div>
          </div>
        </div>

        {/* Right Column: Cảnh báo rủi ro */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col">
          <div className="p-4 border-b border-red-100 bg-red-50/50 flex items-center gap-2 rounded-t-lg">
            <AlertCircle size={20} className="text-red-500" />
            <h3 className="font-bold text-red-600 text-base">Cảnh báo rủi ro</h3>
          </div>
          
          <div className="flex-1 flex flex-col">
            {/* List Item 1 */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">
                  NA
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Nguyễn Văn A</h4>
                  <p className="text-xs text-slate-500 font-medium">20210001 • CNTT</p>
                </div>
              </div>
              <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-xs font-bold">
                Vắng 25%
              </span>
            </div>

            {/* List Item 2 */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">
                  TB
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Trần Thị B</h4>
                  <p className="text-xs text-slate-500 font-medium">20210045 • Kinh tế</p>
                </div>
              </div>
              <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-xs font-bold">
                Vắng 22%
              </span>
            </div>

            {/* List Item 3 */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center text-sm">
                  LC
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Lê Văn C</h4>
                  <p className="text-xs text-slate-500 font-medium">20210102 • Điện tử</p>
                </div>
              </div>
              <span className="bg-red-50 text-red-600 border border-red-100 px-3 py-1 rounded-full text-xs font-bold">
                Vắng 21%
              </span>
            </div>
          </div>
          
          <div className="p-4 mt-auto text-center border-t border-slate-100">
            <button className="text-[#007082] text-sm font-bold hover:underline">
              Xem tất cả 84 sinh viên
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
