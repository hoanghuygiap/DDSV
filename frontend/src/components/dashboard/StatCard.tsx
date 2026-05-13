import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: "up" | "down" | "neutral"
  trendValue?: string
  className?: string
  iconClassName?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  className = "",
  iconClassName = "text-[#1e325c]"
}: StatCardProps) {
  return (
    <div className={`bg-white border-2 border-slate-200 rounded-sm p-5 shadow-sm hover:shadow-md transition-shadow ${className}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-slate-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-sm bg-slate-100 ${iconClassName}`}>
          <Icon size={24} strokeWidth={2.5} />
        </div>
      </div>
      
      {(description || trendValue) && (
        <div className="flex items-center gap-2 text-sm mt-4 pt-4 border-t-2 border-slate-100">
          {trendValue && (
            <span className={`font-bold ${
              trend === "up" ? "text-emerald-600" : 
              trend === "down" ? "text-red-600" : "text-slate-600"
            }`}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "−"} {trendValue}
            </span>
          )}
          {description && <span className="text-slate-500 font-medium">{description}</span>}
        </div>
      )}
    </div>
  )
}
