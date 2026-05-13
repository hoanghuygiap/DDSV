import { 
  Pencil, IdCard, Shield, Lock, EyeOff, Bell, History, 
  LogIn, QrCode, UserCog
} from "lucide-react"
import { mockUserProfile, mockActivityLogs } from "../mocks/profile.mock"

export default function ProfilePage() {
  return (
    <div className="flex flex-col w-full pb-10">
      
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Hồ sơ cá nhân & Cài đặt</h1>
        <p className="text-sm text-slate-500 mt-1">Quản lý thông tin, bảo mật và tùy chọn hệ thống của bạn.</p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Profile Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center">
            {/* Avatar */}
            <div className="relative mb-4 mt-2">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-md overflow-hidden bg-slate-100">
                <img src={mockUserProfile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#007082] text-white rounded-full flex items-center justify-center border-2 border-white hover:bg-[#005c6b] transition-colors shadow-sm">
                <Pencil size={14} />
              </button>
            </div>

            {/* Name & ID */}
            <h2 className="text-lg font-bold text-slate-800 text-center">{mockUserProfile.name}</h2>
            <div className="flex items-center justify-center gap-1.5 text-slate-500 text-sm mt-1 mb-6">
              <IdCard size={16} />
              <span>MGV: {mockUserProfile.id}</span>
            </div>

            {/* Info Details */}
            <div className="w-full flex flex-col gap-4 text-sm mb-6">
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Khoa/Viện</span>
                <span className="text-slate-800 font-semibold">{mockUserProfile.department}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Email Học Thuật</span>
                <span className="text-slate-800 font-semibold">{mockUserProfile.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-slate-400 font-medium">Số điện thoại liên hệ</span>
                <span className="text-slate-800 font-semibold">{mockUserProfile.phone}</span>
              </div>
            </div>

            {/* Edit Button */}
            <button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-md text-sm transition-colors border border-slate-200">
              Chỉnh sửa thông tin
            </button>
          </div>

          {/* Security Banner */}
          <div className="bg-[#1e325c] rounded-xl p-5 shadow-sm flex items-start gap-3">
            <Shield size={24} className="text-[#38bdf8] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-white text-sm mb-1">Bảo mật đa lớp</h3>
              <p className="text-slate-300 text-xs leading-relaxed">
                Tài khoản của bạn được bảo vệ bởi hệ thống xác thực của trường. Đảm bảo không chia sẻ thông tin đăng nhập.
              </p>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Password Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <Lock size={20} className="text-slate-700" />
              <h3 className="font-bold text-slate-800 text-base">Đổi mật khẩu</h3>
            </div>
            
            <form className="flex flex-col gap-4 max-w-lg">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Mật khẩu hiện tại</label>
                <div className="relative">
                  <input 
                    type="password" 
                    defaultValue="........" 
                    className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <EyeOff size={18} />
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Mật khẩu mới</label>
                <input 
                  type="password" 
                  defaultValue="........" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Xác nhận mật khẩu mới</label>
                <input 
                  type="password" 
                  defaultValue="........" 
                  className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#007082] focus:border-[#007082]"
                />
              </div>

              <div className="mt-2">
                <button type="button" className="bg-[#007082] hover:bg-[#005c6b] text-white font-bold py-2 px-5 rounded-md text-sm transition-colors shadow-sm">
                  Cập nhật mật khẩu
                </button>
              </div>
            </form>
          </div>

          {/* Notification Settings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <Bell size={20} className="text-slate-700" />
              <h3 className="font-bold text-slate-800 text-base">Cài đặt thông báo</h3>
            </div>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Email hệ thống</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Nhận báo cáo điểm danh và cảnh báo qua email.</p>
                </div>
                {/* Custom Toggle ON */}
                <div className="w-11 h-6 bg-[#007082] rounded-full relative cursor-pointer flex-shrink-0 shadow-inner">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Thông báo ứng dụng (Push)</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Thông báo tức thời khi có sinh viên quét QR điểm danh.</p>
                </div>
                {/* Custom Toggle ON */}
                <div className="w-11 h-6 bg-[#007082] rounded-full relative cursor-pointer flex-shrink-0 shadow-inner">
                  <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col">
            <div className="flex items-center gap-2 mb-8 pb-4 border-b border-slate-100">
              <History size={20} className="text-slate-700" />
              <h3 className="font-bold text-slate-800 text-base">Nhật ký hoạt động gần đây</h3>
            </div>
            
            <div className="relative pb-6 px-4">
              {/* Vertical line connecting the timeline */}
              <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 -translate-x-1/2 hidden md:block"></div>
              {/* Mobile vertical line */}
              <div className="absolute left-8 top-0 bottom-0 w-px bg-slate-200 block md:hidden"></div>
              
              <div className="flex flex-col gap-8">
                {mockActivityLogs.map((log, index) => {
                  const isLeft = index % 2 !== 0;
                  
                  let IconComponent = LogIn;
                  let iconBgClass = "bg-[#007082] text-white";
                  
                  if (log.type === "qr") {
                    IconComponent = QrCode;
                    iconBgClass = "bg-slate-200 text-slate-600 border-2 border-white";
                  } else if (log.type === "update") {
                    IconComponent = UserCog;
                    iconBgClass = "bg-slate-100 text-slate-500 border-2 border-white";
                  }

                  return (
                    <div key={log.id} className={`flex flex-col md:flex-row items-center justify-between w-full relative ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                      
                      {/* Empty space for alternating side in desktop */}
                      <div className="hidden md:block w-[45%]"></div>
                      
                      {/* Central Icon */}
                      <div className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 hidden md:flex items-center justify-center w-8 h-8 rounded-full shadow-sm ring-4 ring-white bg-white">
                        <div className={`w-full h-full rounded-full flex items-center justify-center ${iconBgClass}`}>
                          <IconComponent size={14} />
                        </div>
                      </div>

                      {/* Content Card */}
                      <div className={`w-full md:w-[45%] pl-12 md:pl-0 ${isLeft ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                        <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                          <h4 className="font-bold text-slate-800 text-sm mb-1">{log.action}</h4>
                          <p className="text-xs text-slate-500 mb-2">{log.details}</p>
                          <span className="text-[10px] font-bold text-slate-400">{log.timestamp}</span>
                        </div>
                      </div>

                      {/* Mobile Icon (visible only on small screens) */}
                      <div className="absolute left-8 -translate-x-1/2 z-10 flex md:hidden items-center justify-center w-6 h-6 rounded-full ring-2 ring-white bg-white top-4">
                        <div className={`w-full h-full rounded-full flex items-center justify-center ${iconBgClass}`}>
                          <IconComponent size={10} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-2 border-t border-slate-100 pt-4">
              <button className="text-[#007082] text-sm font-bold hover:underline">
                Xem toàn bộ nhật ký
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
