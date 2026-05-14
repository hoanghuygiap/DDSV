import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { mockLecturerClasses } from "@/mocks/lecturer.mock"
import { ArrowLeft, QrCode, RefreshCcw, Wifi, MapPin, StopCircle, UserCheck } from "lucide-react"

export default function LiveAttendanceQR() {
  const [searchParams] = useSearchParams();
  const classId = searchParams.get("classId");
  const cls = mockLecturerClasses.find(c => c.id === Number(classId)) || mockLecturerClasses[0];

  const [timeLeft, setTimeLeft] = useState(15);
  const [attendedCount, setAttendedCount] = useState(0);

  // Simulate QR refresh timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Simulate students checking in real-time
  useEffect(() => {
    if (attendedCount < cls.so_sinh_vien) {
      const studentTimer = setTimeout(() => {
        setAttendedCount(prev => prev + 1);
      }, Math.random() * 5000 + 1000);
      return () => clearTimeout(studentTimer);
    }
  }, [attendedCount, cls.so_sinh_vien]);

  return (
    <div className="flex flex-col gap-6 w-full pb-8 h-[calc(100vh-80px)]">
      
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/dashboard/my-classes/${cls.id}`} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#00a8cc] hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-[#1a3a5f] tracking-tight">
                Điểm danh: {cls.ten_hoc_phan}
              </h1>
              <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-bold border border-emerald-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                LIVE
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">{cls.ma_lop} • Ca học hiện tại</p>
          </div>
        </div>

        <button className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors border border-red-200">
          <StopCircle size={18} />
          Kết thúc điểm danh
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* QR SECTION */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Decorative background */}
          <div className="absolute inset-0 bg-[#f8f9fa] z-0"></div>
          <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#1a3a5f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 w-full max-w-md flex flex-col items-center">
            
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full aspect-square flex items-center justify-center relative mb-8">
              {/* QR Code with updated style to match Student's Scan area */}
              <div className="w-full h-full border-4 border-[#1a3a5f] rounded-lg p-2 flex items-center justify-center bg-white relative overflow-hidden">
                <div className="w-full h-full bg-[#f0f7ff] flex items-center justify-center relative overflow-hidden">
                   <QrCode size={200} className="text-[#1a3a5f]" strokeWidth={1.2} />
                   {/* Scanning line animation with shadow/glow */}
                   <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00a8cc] animate-[scan_3s_ease-in-out_infinite] shadow-[0_4px_10px_rgba(0,168,204,0.5)] z-10"></div>
                </div>
              </div>

              {/* Timer indicator */}
              <div className="absolute -bottom-4 bg-[#1a3a5f] text-white px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                <RefreshCcw size={14} className={timeLeft <= 3 ? "animate-spin" : ""} />
                Làm mới sau {timeLeft}s
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#1a3a5f] mb-2 text-center">Quét để điểm danh</h2>
            <p className="text-slate-500 font-medium text-center mb-6">
              Yêu cầu sinh viên sử dụng app UniCheck để quét mã này.
            </p>

            <div className="flex gap-4 w-full">
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                <Wifi className="text-blue-600" />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Mạng hợp lệ</p>
                  <p className="text-sm font-bold text-blue-700">HUST_Student</p>
                </div>
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Phòng học</p>
                  <p className="text-sm font-bold text-blue-700">{cls.phong_hoc}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* LIVE STATS & RECENT LOGS */}
        <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
          
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 shrink-0">
            <h3 className="font-bold text-[#1a3a5f] text-lg mb-4">Tiến độ điểm danh</h3>
            
            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-black text-[#00a8cc]">{attendedCount}</span>
              <span className="text-slate-500 font-medium mb-1">/ {cls.so_sinh_vien} SV</span>
            </div>
            
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
              <div 
                className="h-full bg-[#00a8cc] transition-all duration-500 rounded-full"
                style={{ width: `${(attendedCount / cls.so_sinh_vien) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center gap-2 text-sm text-emerald-600 font-bold bg-emerald-50 p-3 rounded-lg border border-emerald-100">
              <UserCheck size={18} />
              Đạt {(attendedCount / cls.so_sinh_vien * 100).toFixed(1)}% sĩ số
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-[#1a3a5f] text-base">Check-in gần nhất</h3>
            </div>
            
            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
              {Array.from({ length: Math.min(attendedCount, 10) }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg bg-emerald-50/30 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <UserCheck size={14} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Sinh viên ẩn danh {attendedCount - i}</h4>
                      <p className="text-xs text-slate-500">202100{Math.floor(Math.random() * 90) + 10}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600">Vừa xong</span>
                </div>
              ))}
              
              {attendedCount === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center">
                  <QrCode size={48} className="mb-4 opacity-20" />
                  <p className="font-medium">Chưa có sinh viên nào điểm danh</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      `}</style>
    </div>
  )
}
