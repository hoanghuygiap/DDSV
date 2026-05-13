import { StatCard } from "@/components/dashboard/StatCard"
import { ActivityList } from "@/components/dashboard/ActivityList"
import { lecturerCheckinActivities } from "@/mocks/dashboard"
import { 
  Users, 
  CheckCircle, 
  Clock,
  QrCode,
  Calendar,
  UserX
} from "lucide-react"

export function LecturerDashboard() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* HEADER: Action First */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-[#1e325c] tracking-tight mb-2">
          Xin chào, Giảng viên!
        </h1>
        <p className="text-lg text-slate-500 font-medium">
          Hôm nay bạn có 2 ca dạy.
        </p>
      </div>

      {/* TOPOLOGICAL COMMITMENT: Massive Typographic/Action Hero instead of 50/50 */}
      <div className="bg-[#007082] rounded-sm p-8 md:p-12 text-white relative overflow-hidden shadow-lg border-b-8 border-[#005c6b]">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black mb-4 uppercase tracking-widest text-[#a8e6cf]">
            Bắt đầu điểm danh
          </h2>
          <p className="text-xl font-medium mb-8 text-white/90">
            Kích hoạt QR Code động hoặc Check-in bằng GPS cho ca dạy hiện tại (IT4040 - Lập trình Web).
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center gap-3 bg-white text-[#007082] px-8 py-4 rounded-sm font-black text-xl hover:bg-slate-100 transition-colors shadow-md active:translate-y-1">
              <QrCode size={28} strokeWidth={3} />
              TẠO MÃ QR CODE
            </button>
            <button className="flex items-center gap-3 bg-[#005c6b] text-white px-8 py-4 rounded-sm font-bold text-lg hover:bg-[#004a57] transition-colors shadow-md border-2 border-[#004a57] active:translate-y-1">
              <Clock size={24} />
              Dùng GPS
            </button>
          </div>
        </div>
        
        {/* Background decorative element */}
        <div className="absolute right-[-10%] top-[-20%] opacity-10 pointer-events-none transform rotate-12">
          <QrCode size={400} />
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Sinh viên đã đi học" 
          value="85%" 
          icon={CheckCircle} 
          trend="up"
          trendValue="Cao hơn mức TB"
          iconClassName="text-emerald-600 bg-emerald-100"
        />
        <StatCard 
          title="Tổng sinh viên phụ trách" 
          value="180" 
          icon={Users} 
        />
        <StatCard 
          title="Cảnh báo vắng nhiều" 
          value="12" 
          icon={UserX} 
          trend="up"
          trendValue="+3 sinh viên"
          iconClassName="text-red-600 bg-red-100"
        />
      </div>

      {/* TWO COLUMNS, ASYMMETRIC 40/60 */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-slate-200 rounded-sm p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-slate-100">
              <h3 className="font-bold text-slate-800 text-lg uppercase tracking-wide">Lịch dạy hôm nay</h3>
              <Calendar className="text-slate-400" />
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="border-l-4 border-l-[#007082] pl-4 py-2 relative">
                <div className="absolute w-3 h-3 rounded-full bg-[#007082] -left-[8.5px] top-4 border-2 border-white"></div>
                <h4 className="font-bold text-[#1e325c] text-lg">Lập trình Web (IT4040)</h4>
                <p className="text-slate-500 font-medium">08:00 - 10:15 • Phòng D3-101</p>
                <div className="mt-2 inline-flex px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-sm uppercase tracking-wider">Đang diễn ra</div>
              </div>
              
              <div className="border-l-4 border-l-slate-200 pl-4 py-2 relative">
                <div className="absolute w-3 h-3 rounded-full bg-slate-300 -left-[8.5px] top-4 border-2 border-white"></div>
                <h4 className="font-bold text-slate-600 text-lg">Cơ sở dữ liệu (IT3030)</h4>
                <p className="text-slate-500 font-medium">13:00 - 15:15 • Phòng D3-102</p>
                <div className="mt-2 inline-flex px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-sm uppercase tracking-wider">Sắp diễn ra</div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <ActivityList 
            title="Real-time Check-in" 
            items={lecturerCheckinActivities} 
            action={
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            }
          />
        </div>

      </div>
    </div>
  )
}
