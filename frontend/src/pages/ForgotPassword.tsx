import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden flex w-full max-w-[1000px] min-h-[600px]">
        
        {/* LEFT SIDE - IMAGE SECTION */}
        <div className="hidden md:flex flex-col justify-center w-1/2 p-10 relative overflow-hidden bg-[#152342]">
          {/* BACKGROUND IMAGE PLACEHOLDER */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')",
              backgroundPosition: "center" 
            }}
          />
          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-[#0f172a]/40" />
          
          {/* INFO CARD */}
          <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl mx-auto w-full">
             <div className="flex items-center gap-3 mb-6">
               <div className="text-white">
                 <ShieldCheck size={32} strokeWidth={2} />
               </div>
               <span className="text-xl font-bold text-white tracking-wide">UniCheck</span>
             </div>
             <p className="text-slate-200 text-sm leading-relaxed font-medium">
               Hệ thống quản lý chuyên cần thông minh, bảo mật và đáng tin cậy. Chúng tôi sẽ hỗ trợ bạn khôi phục quyền truy cập vào tài khoản một cách nhanh chóng và an toàn.
             </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM SECTION */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white">
          
          {/* HEADINGS */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#1e325c] mb-3">Quên mật khẩu</h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Vui lòng nhập địa chỉ email hoặc mã số nhân viên/sinh viên đã đăng ký. Chúng tôi sẽ gửi một liên kết để bạn đặt lại mật khẩu.
            </p>
          </div>

          {/* FORGOT PASSWORD FORM */}
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-xs font-bold text-slate-700">Email hoặc Mã số</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <Input 
                  id="identifier" 
                  placeholder="VD: student@university.edu.vn" 
                  className="pl-10 h-11 rounded-lg border-slate-200 bg-white"
                />
              </div>
            </div>

            <Button className="w-full h-11 bg-[#1e325c] hover:bg-[#152342] text-white rounded-lg font-bold text-sm shadow-md transition-colors">
              Gửi yêu cầu
            </Button>
          </form>

          {/* DIVIDER */}
          <div className="my-8 border-t border-slate-100"></div>

          {/* BACK TO LOGIN LINK */}
          <div className="text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center gap-2 text-sm font-bold text-[#1e325c] hover:text-[#007082] transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span>Quay lại đăng nhập</span>
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  )
}
