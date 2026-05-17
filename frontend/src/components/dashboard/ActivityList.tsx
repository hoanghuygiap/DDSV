import { ReactNode } from "react"
import { LucideIcon } from "lucide-react"

import { ActivityItem } from "@/types"

interface ActivityListProps {
  title: string
  items: ActivityItem[]
  action?: ReactNode
  className?: string
}

export function ActivityList({ title, items, action, className = "" }: ActivityListProps) {
  return (
    <div className={`bg-white border-2 border-slate-200 rounded-sm shadow-sm ${className}`}>
      <div className="flex justify-between items-center p-5 border-b-2 border-slate-200">
        <h3 className="font-bold text-slate-800 text-lg uppercase tracking-wide">{title}</h3>
        {action && <div>{action}</div>}
      </div>
      <div className="flex flex-col">
        {items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            Không có hoạt động nào
          </div>
        ) : (
          items.map((item, index) => {
            const isLast = index === items.length - 1
            const Icon = item.icon
            
            // Determine styles based on status
            let statusClasses = ""
            let iconClasses = item.iconBgColor || "bg-slate-100"
            let iconIconColor = item.iconColor || "text-slate-600"
            
            if (item.status === "danger") {
              statusClasses = "border-l-4 border-l-red-600 bg-red-50/50"
              iconClasses = "bg-red-100"
              iconIconColor = "text-red-600"
            } else if (item.status === "warning") {
              statusClasses = "border-l-4 border-l-amber-500"
              iconClasses = "bg-amber-100"
              iconIconColor = "text-amber-600"
            } else if (item.status === "success") {
              statusClasses = "border-l-4 border-l-emerald-500"
              iconClasses = "bg-emerald-100"
              iconIconColor = "text-emerald-600"
            } else {
              statusClasses = "border-l-4 border-l-transparent"
            }

            return (
              <div 
                key={item.id} 
                className={`flex gap-4 p-4 hover:bg-slate-50 transition-colors ${
                  !isLast ? "border-b border-slate-100" : ""
                } ${statusClasses}`}
              >
                <div className={`shrink-0 h-10 w-10 rounded-sm flex items-center justify-center ${iconClasses} ${iconIconColor}`}>
                  <Icon size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 text-sm truncate">{item.title}</p>
                  <p className="text-slate-500 text-xs mt-1 truncate">{item.description}</p>
                </div>
                <div className="shrink-0 text-xs font-bold text-slate-400 whitespace-nowrap">
                  {item.time}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
