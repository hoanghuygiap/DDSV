import { StatCard } from "@/components/dashboard/StatCard"
import { ActivityList } from "@/components/dashboard/ActivityList"
import { adminWarningStudents, adminRecentActivities } from "@/mocks/dashboard"
import { 
  Users, 
  School, 
  BookOpen, 
  AlertTriangle
} from "lucide-react"

export function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8">
      {/* HEADER SECTION - NO SAFE SPLIT, ASYMMETRIC */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-[#1e325c] tracking-tight mb-2">
            Tổng quan hệ thống
          </h1>
          <p className="text-lg text-slate-500 font-medium">
            Thống kê dữ liệu toàn trường học kỳ 2024.1
          </p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#007082] hover:bg-[#005c6b] text-white px-6 py-4 rounded-sm font-bold text-lg shadow-md border-b-4 border-[#005c6b] active:border-b-0 active:translate-y-1 transition-all">
          <School size={24} strokeWidth={2.5} />
          <span>Tạo lớp hành chính mới</span>
        </button>
      </div>

      {/* STATS GRID - 4 COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng Sinh viên" 
          value="12,450" 
          icon={Users} 
          trend="up"
          trendValue="120 học kỳ này"
        />
        <StatCard 
          title="Tổng Giảng viên" 
          value="450" 
          icon={School} 
          trend="neutral"
          trendValue="Không đổi"
        />
        <StatCard 
          title="Lớp học phần" 
          value="1,240" 
          icon={BookOpen} 
        />
        <StatCard 
          title="Nguy cơ cấm thi" 
          value="156" 
          icon={AlertTriangle} 
          trend="down"
          trendValue="-12% so với tuần trước"
          iconClassName="text-red-600 bg-red-100"
        />
      </div>

      {/* TWO COLUMNS, ASYMMETRIC 70/30 SPLIT (ANTI-SAFE-SPLIT) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* PLACEHOLDER FOR CHART */}
          <div className="bg-[#1e325c] border-2 border-[#1e325c] rounded-sm p-6 text-white shadow-md flex flex-col justify-between min-h-[320px] relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="font-black text-2xl mb-1 uppercase tracking-wider text-slate-200">Biểu đồ chuyên cần</h3>
              <p className="text-slate-400 font-medium">Tỷ lệ đi học toàn trường theo tuần</p>
            </div>
            
            {/* Mockup Chart Visual */}
            <div className="relative z-10 flex items-end gap-3 h-40 mt-8 w-full border-b-2 border-white/20 pb-2">
              {[40, 65, 55, 80, 70, 90, 85].map((h, i) => (
                <div key={i} className="flex-1 bg-white/20 hover:bg-[#007082] transition-colors rounded-t-sm" style={{ height: `${h}%` }}></div>
              ))}
            </div>
            
            {/* Background decorative element */}
            <div className="absolute -right-20 -bottom-20 opacity-10">
              <BarChart2Icon size={300} />
            </div>
          </div>

          <ActivityList 
            title="Hoạt động hệ thống gần đây" 
            items={adminRecentActivities} 
          />
        </div>

        <div className="lg:col-span-1">
          <ActivityList 
            title="Cảnh báo cấm thi" 
            items={adminWarningStudents} 
            className="h-full border-red-200"
            action={
              <button className="text-xs font-bold text-red-600 uppercase hover:underline">
                Xem tất cả
              </button>
            }
          />
        </div>
      </div>
    </div>
  )
}

function BarChart2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" x2="18" y1="20" y2="10" />
      <line x1="12" x2="12" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="14" />
    </svg>
  )
}
