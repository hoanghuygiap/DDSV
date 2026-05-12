import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/Login"
import RegisterPage from "./pages/Register"
import ForgotPasswordPage from "./pages/ForgotPassword"
import DashboardLayout from "./layout/DashboardLayout"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<DashboardLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
