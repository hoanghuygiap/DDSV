import { createBrowserRouter, Navigate } from "react-router-dom"
import LoginPage from "@/pages/Login"
import RegisterPage from "@/pages/Register"
import ForgotPasswordPage from "@/pages/ForgotPassword"
import DashboardLayout from "@/layout/DashboardLayout"
import DashboardHome from "@/pages/DashboardHome"
import StudentsPage from "@/pages/Students"
import SchedulePage from "@/pages/Schedule"
import ReportsPage from "@/pages/Reports"
import ProfilePage from "@/pages/Profile"

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
        path: "schedule",
        element: <SchedulePage />,
      },
      {
        path: "reports",
        element: <ReportsPage />,
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
