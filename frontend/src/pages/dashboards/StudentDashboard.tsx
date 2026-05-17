import { StatCard } from "@/components/dashboard/StatCard"
import { ActivityList } from "@/components/dashboard/ActivityList"
import { studentScheduleItems, studentNotifications } from "@/mocks/dashboard"
import { 
  ScanLine, 
  Calendar,
  AlertOctagon,
  Percent,
  CheckSquare
} from "lucide-react"

export function StudentDashboard() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER: Action First */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-[#1e325c] tracking-tight mb-2">
            Trang Sinh viên
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Mã SV: 20210001 • Viện Công nghệ thông tin
          </p>
        </div>
        
        {/* MASSIVE ACTION BUTTON - HIGH CONTRAST */}
        <button className="flex items-center gap-4 bg-[#1e325c] hover:bg-[#152342] text-white px-8 py-5 rounded-sm font-black text-xl shadow-lg border-b-4 border-[#152342] active:border-b-0 active:translate-y-1 transition-all">
          <ScanLine size={32} className="text-[#a8e6cf]" strokeWidth={2.5} />
          <span>ĐIỂM DANH NGAY</span>
        </button>
      </div>

      {/* WARNING BANNER - HIGH TENSION (If applicable) */}
      <div className="bg-red-600 text-white p-4 flex items-start gap-4 rounded-sm shadow-md">
        <div className="shrink-0 p-2 bg-white/20 rounded-sm">
          <AlertOctagon size={24} strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-bold text-lg">Cảnh báo: Nguy cơ cấm thi</h3>
          <p className="text-red-100 font-medium text-sm mt-1">
            Bạn đã vắng 3 buổi môn Cơ sở dữ liệu. Giới hạn tối đa là 4 buổi.
          </p>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Tỷ lệ chuyên cần" 
          value="92%" 
          icon={Percent} 
          trend="down"
          trendValue="-2% so với tháng trước"
          iconClassName="text-[#007082] bg-[#007082]/10"
        />
        <StatCard 
          title="Số buổi đã học" 
          value="45" 
          icon={CheckSquare} 
          description="Tổng hợp tất cả môn học"
        />
        <StatCard 
          title="Số buổi vắng" 
          value="4" 
          icon={AlertOctagon} 
          description="Môn vắng nhiều nhất: CSDL (3 buổi)"
          iconClassName="text-red-600 bg-red-100"
          className="border-red-200"
        />
      </div>

      {/* TWO COLUMNS, ASYMMETRIC 50/50 BUT WITH DIFFERENT WEIGHTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* SCHEDULE COLUMN */}
        <div className="bg-white border-2 border-[#1e325c] rounded-sm shadow-sm h-full flex flex-col">
          <div className="flex items-center justify-between p-5 border-b-2 border-[#1e325c] bg-[#1e325c] text-white">
            <h3 className="font-bold text-lg uppercase tracking-wide">Thời khóa biểu hôm nay</h3>
            <Calendar size={20} />
          </div>
          
          <div className="flex flex-col p-5 gap-6 flex-1">
            {studentScheduleItems.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="w-24 shrink-0 font-bold text-slate-800 border-r-2 border-slate-200 pr-4 text-right">
                  {item.time.replace(' - ', '\n')}
                </div>
                <div className="flex-1">
                  <h4 className="font-black text-xl text-[#1e325c]">{item.course}</h4>
                  <p className="text-slate-500 font-medium text-sm mt-1 mb-3">Phòng: {item.room}</p>
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${item.statusColor}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NOTIFICATIONS COLUMN */}
        <div>
          <ActivityList 
            title="Thông báo mới nhất" 
            items={studentNotifications} 
            className="h-full"
          />
        </div>

      </div>
    </div>
  )
}
