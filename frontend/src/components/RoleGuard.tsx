import { Navigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/types"

function deriveRole(vai_tro: string[]): Role {
  if (vai_tro.includes("admin")) return "admin"
  if (vai_tro.includes("giang_vien")) return "lecturer"
  return "student"
}

export function RoleGuard({ allowed, children }: { allowed: Role[]; children: React.ReactNode }) {
  const { user } = useAuth()
  const role = deriveRole(user?.vai_tro ?? [])

  if (!allowed.includes(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
