import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-[#1e325c] mb-4">Đăng ký tài khoản</h1>
        <p className="text-slate-500 mb-8">Trang đăng ký đang được xây dựng.</p>
        <Link to="/login">
          <Button className="w-full bg-[#1e325c] hover:bg-[#152342] text-white">
            Quay lại Đăng nhập
          </Button>
        </Link>
      </div>
    </div>
  )
}
