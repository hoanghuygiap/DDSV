import { createBrowserRouter, Navigate } from "react-router-dom"
import LoginPage from "@/pages/auth/Login"
import RegisterPage from "@/pages/auth/Register"
import ForgotPasswordPage from "@/pages/auth/ForgotPassword"
import DashboardLayout from "@/layout/DashboardLayout"
import DashboardHome from "@/pages/DashboardHome"
import ProtectedRoute from "@/components/ProtectedRoute"

// Admin Pages
import StudentsPage from "@/pages/admin/Students"
import SchedulePage from "@/pages/admin/Schedule"
import ReportsPage from "@/pages/admin/Reports"
import ProfilePage from "@/pages/admin/Profile"
import LecturersPage from "@/pages/admin/Lecturers"
import ClassesPage from "@/pages/admin/Classes"
import NotificationsPage from "@/pages/admin/Notifications"

// Lecturer Pages
import MyClasses from "@/pages/lecturer/MyClasses"
import ClassDetail from "@/pages/lecturer/ClassDetail"
import LiveAttendanceQR from "@/pages/lecturer/LiveAttendanceQR"
import AttendanceHistory from "@/pages/lecturer/AttendanceHistory"
import ClassReport from "@/pages/lecturer/ClassReport"

// Student Pages
import StudentReport from "@/pages/student/StudentReport"
import StudentSchedule from "@/pages/student/StudentSchedule"
import ScanQR from "@/pages/student/ScanQR"

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
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },

  // Tất cả routes trong dashboard đều yêu cầu đăng nhập
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
          { index: true, element: <DashboardHome /> },

          // Admin
          { path: "students", element: <StudentsPage /> },
          { path: "lecturers", element: <LecturersPage /> },
          { path: "classes", element: <ClassesPage /> },
          { path: "schedule", element: <SchedulePage /> },
          { path: "reports", element: <ReportsPage /> },
          { path: "notifications", element: <NotificationsPage /> },
          { path: "profile", element: <ProfilePage /> },

          // Lecturer
          { path: "my-classes", element: <MyClasses /> },
          { path: "my-classes/:id", element: <ClassDetail /> },
          { path: "new-attendance", element: <LiveAttendanceQR /> },
          { path: "attendance-history", element: <AttendanceHistory /> },
          { path: "class-reports", element: <ClassReport /> },

          // Student
          { path: "student-reports", element: <StudentReport /> },
          { path: "student-schedule", element: <StudentSchedule /> },
          { path: "scan-qr", element: <ScanQR /> },

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
    ],
  },
])
