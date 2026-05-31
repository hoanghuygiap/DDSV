import { createBrowserRouter, Navigate } from "react-router-dom"
import { RoleGuard } from "@/components/RoleGuard"
import LoginPage from "@/pages/auth/Login"

import ForgotPasswordPage from "@/pages/auth/ForgotPassword"
import DashboardLayout from "@/layout/DashboardLayout"
import DashboardHome from "@/pages/DashboardHome"
import StudentsPage from "@/pages/admin/Students"
import StudentDetailPage from "@/pages/admin/StudentDetail"
import SchedulePage from "@/pages/admin/Schedule"
import ReportsPage from "@/pages/admin/Reports"
import ProfilePage from "@/pages/admin/Profile"
import LecturersPage from "@/pages/admin/Lecturers"
import LecturerDetailPage from "@/pages/admin/LecturerDetail"
import ClassesPage from "@/pages/admin/Classes"
import NotificationsPage from "@/pages/admin/Notifications"
import LecturerSchedulePage from "@/pages/lecturer/LecturerSchedule"
import MyClassesPage from "@/pages/lecturer/MyClasses"
import ClassDetailPage from "@/pages/lecturer/ClassDetail"
import LiveAttendanceQRPage from "@/pages/lecturer/LiveAttendanceQR"
import StudentReportPage from "@/pages/student/StudentReport"
import StudentSchedulePage from "@/pages/student/StudentSchedule"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },

  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },

      // ── Admin only ─────────────────────────────────────────────
      {
        path: "students",
        element: <RoleGuard allowed={["admin"]}><StudentsPage /></RoleGuard>,
      },
      {
        path: "students/:id",
        element: <RoleGuard allowed={["admin"]}><StudentDetailPage /></RoleGuard>,
      },
      {
        path: "lecturers",
        element: <RoleGuard allowed={["admin"]}><LecturersPage /></RoleGuard>,
      },
      {
        path: "lecturers/:id",
        element: <RoleGuard allowed={["admin"]}><LecturerDetailPage /></RoleGuard>,
      },
      {
        path: "classes",
        element: <RoleGuard allowed={["admin"]}><ClassesPage /></RoleGuard>,
      },
      {
        path: "schedule",
        element: <RoleGuard allowed={["admin"]}><SchedulePage /></RoleGuard>,
      },
      {
        path: "reports",
        element: <RoleGuard allowed={["admin"]}><ReportsPage /></RoleGuard>,
      },

      // ── Lecturer only ──────────────────────────────────────────
      {
        path: "lecturer-schedule",
        element: <RoleGuard allowed={["lecturer"]}><LecturerSchedulePage /></RoleGuard>,
      },
      {
        path: "my-classes",
        element: <RoleGuard allowed={["lecturer"]}><MyClassesPage /></RoleGuard>,
      },
      {
        path: "my-classes/:id",
        element: <RoleGuard allowed={["lecturer"]}><ClassDetailPage /></RoleGuard>,
      },
      {
        path: "qr-attendance",
        element: <RoleGuard allowed={["lecturer"]}><LiveAttendanceQRPage /></RoleGuard>,
      },
      {
        path: "student-reports",
        element: <RoleGuard allowed={["student"]}><StudentReportPage /></RoleGuard>,
      },
      {
        path: "student-schedule",
        element: <RoleGuard allowed={["student"]}><StudentSchedulePage /></RoleGuard>,
      },

      // ── Shared (all roles) ─────────────────────────────────────
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
      {
        path: "*",
        element: (
          <div className="flex items-center justify-center h-full text-slate-400">
            Trang đang được xây dựng...
          </div>
        ),
      },
    ],
  },
])
