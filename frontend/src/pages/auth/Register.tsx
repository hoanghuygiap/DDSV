import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, User, Lock, EyeOff, Eye, Mail, BadgeCent, Users, ArrowRight, ShieldCheck } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden flex w-full max-w-[1100px] min-h-[650px]">
        
        {/* LEFT SIDE - IMAGE SECTION */}
        <div className="hidden md:flex flex-col justify-between w-[45%] p-10 relative overflow-hidden bg-[#1e325c]">
          {/* BACKGROUND IMAGE PLACEHOLDER */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop')",
              backgroundPosition: "center" 
            }}
          />
          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
          
          {/* LOGO */}
          <div className="relative z-10 flex flex-col gap-2">
             <div className="flex items-center gap-2">
               <div className="text-white">
                 <GraduationCap size={28} strokeWidth={2.5} />
               </div>
               <span className="text-2xl font-bold text-white">UniCheck</span>
             </div>
             <p className="text-slate-300 text-sm">Hệ thống quản lý chuyên cần thông minh</p>
          </div>

          <div className="relative z-10">
            <p className="text-white text-lg font-medium italic leading-relaxed">
              "Kết nối giảng đường số. Quản lý minh bạch, điểm danh dễ dàng, nâng cao chất lượng học tập."
            </p>
          </div>
        </div>

        {/* RIGHT SIDE - FORM SECTION */}
        <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col justify-center bg-white">
          
          {/* HEADINGS */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Tạo tài khoản mới</h1>
            <p className="text-slate-500 text-sm">
              Vui lòng điền thông tin bên dưới để đăng ký hệ thống.
            </p>
          </div>

          {/* REGISTER FORM */}
          <form className="space-y-5">
            {/* ROW 1: Họ tên & Mã số */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-xs font-bold text-slate-700">Họ và tên</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <User size={18} />
                  </div>
                  <Input 
                    id="fullname" 
                    placeholder="Nguyễn Văn A" 
                    className="pl-10 h-11 rounded-lg border-slate-200 bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentid" className="text-xs font-bold text-slate-700">Mã số SV/GV</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <BadgeCent size={18} />
                  </div>
                  <Input 
                    id="studentid" 
                    placeholder="Ví dụ: 2012345" 
                    className="pl-10 h-11 rounded-lg border-slate-200 bg-slate-50/50"
                  />
                </div>
              </div>
            </div>

            {/* ROW 2: Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email trường (@hcmut.edu.vn)</Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="nguyen.vana@hcmut.edu.vn" 
                  className="pl-10 h-11 rounded-lg border-slate-200 bg-slate-50/50"
                />
              </div>
            </div>

            {/* ROW 3: Vai trò */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-bold text-slate-700">Vai trò</Label>
              <div className="relative">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none">
                    <Users size={18} />
                 </div>
                 <Select>
                  <SelectTrigger className="pl-10 h-11 rounded-lg border-slate-200 bg-slate-50/50 w-full">
                    <SelectValue placeholder="Chọn vai trò của bạn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lecturer">Giảng viên</SelectItem>
                    <SelectItem value="student">Sinh viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ROW 4: Mật khẩu & Xác nhận */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">Mật khẩu</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock size={18} />
                  </div>
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 rounded-lg border-slate-200 bg-slate-50/50"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-xs font-bold text-slate-700">Xác nhận mật khẩu</Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <ShieldCheck size={18} />
                  </div>
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-10 pr-10 h-11 rounded-lg border-slate-200 bg-slate-50/50"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox id="terms" className="mt-0.5 border-slate-300 text-[#1e325c]" />
              <Label htmlFor="terms" className="text-xs text-slate-600 font-medium leading-relaxed">
                Tôi đồng ý với các <a href="#" className="text-[#007082] hover:underline font-bold">điều khoản sử dụng</a> và <a href="#" className="text-[#007082] hover:underline font-bold">chính sách bảo mật</a>.
              </Label>
            </div>

            {/* Button */}
            <Button className="w-full h-12 bg-[#001e3d] hover:bg-[#152342] text-white rounded-lg font-bold text-base shadow-md transition-colors mt-4 flex items-center justify-center gap-2">
              <span>Đăng ký</span>
              <ArrowRight size={18} />
            </Button>
          </form>

          {/* FOOTER LINK */}
          <div className="mt-8 text-center text-sm">
            <span className="text-slate-500">Đã có tài khoản? </span>
            <Link to="/login" className="font-bold text-[#007082] hover:underline transition-colors">
              Đăng nhập
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  )
}
