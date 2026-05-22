import { createBrowserRouter, Navigate } from "react-router-dom"
import LoginPage from "@/pages/auth/Login"
import RegisterPage from "@/pages/auth/Register"
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
import ClassDetailPage from "@/pages/lecturer/ClassDetail"

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
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      {
        path: "students",
        element: <StudentsPage />,
      },
      {
        path: "students/:id",
        element: <StudentDetailPage />,
      },
      {
        path: "lecturers",
        element: <LecturersPage />,
      },
      {
        path: "lecturers/:id",
        element: <LecturerDetailPage />,
      },
      {
        path: "classes",
        element: <ClassesPage />,
      },
      {
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "lecturer-schedule",
        element: <LecturerSchedulePage />,
      },
      {
        path: "my-classes/:id",
        element: <ClassDetailPage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
      },
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
