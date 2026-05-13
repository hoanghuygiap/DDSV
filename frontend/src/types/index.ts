import { LucideIcon } from "lucide-react"

export type Role = "admin" | "lecturer" | "student"

export interface ActivityItem {
  id: string
  title: string
  description: string
  time: string
  icon: LucideIcon
  iconBgColor?: string
  iconColor?: string
  status?: "default" | "warning" | "danger" | "success"
}
