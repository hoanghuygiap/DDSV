import { useState, useEffect } from "react"
import { 
  QrCode, 
  Camera, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Info,
  CheckCircle2,
  AlertTriangle,
  Keyboard,
  ArrowRight,
  Wifi,
  RefreshCcw
} from "lucide-react"

export default function ScanQR() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanStatus, setScanStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [manualCode, setManualCode] = useState("");
  const [timeLeft, setTimeLeft] = useState(15);

  // Mock refresh timer matching lecturer screen
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev <= 1 ? 15 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode === "842911") {
      setScanStatus('success');
      setIsScanning(false);
    } else {
      setScanStatus('error');
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-8 h-[calc(100vh-80px)]">
      
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#1a3a5f] tracking-tight">Quét mã QR</h1>
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-200">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              SCANNING
            </span>
          </div>
          <p className="text-sm text-slate-500 font-medium">Cung cấp bởi UniCheck Anti-Cheat System</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold">
          <Clock size={16} />
          <span>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* SCANNER SECTION (Matching Lecturer's QR Section style) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
          {/* Decorative background matching Lecturer's screen */}
          <div className="absolute inset-0 bg-[#f8f9fa] z-0"></div>
          <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#1a3a5f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
          
          <div className="relative z-10 w-full max-w-md flex flex-col items-center">
            
            <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100 w-full aspect-square flex items-center justify-center relative mb-8">
              {/* Central Frame matching Lecturer's border style */}
              <div className="w-full h-full border-4 border-[#1a3a5f] rounded-lg p-2 flex items-center justify-center bg-white relative overflow-hidden">
                {scanStatus === 'success' ? (
                  <div className="flex flex-col items-center gap-4 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 text-white">
                      <CheckCircle2 size={56} />
                    </div>
                    <h3 className="text-2xl font-black text-[#1a3a5f]">THÀNH CÔNG</h3>
                  </div>
                ) : (
                  <div className="w-full h-full bg-[#f0f7ff] rounded-md flex flex-col items-center justify-center text-[#1a3a5f] relative overflow-hidden">
                    <QrCode size={120} className="opacity-100 mb-4 text-[#1a3a5f]" strokeWidth={1.5} />
                    <p className="text-[10px] font-black text-[#1a3a5f]/40 uppercase tracking-[0.3em]">Đang tìm mã QR...</p>
                    
                    {/* Scanning line animation matching the image exactly */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#00a8cc] animate-[scan_3s_ease-in-out_infinite] shadow-[0_4px_10px_rgba(0,168,204,0.5)] z-10"></div>
                    
                    {/* Targeting Corners for a more "camera" feel but light theme */}
                    <div className="absolute inset-16 border border-[#1a3a5f]/10 rounded-2xl"></div>
                  </div>
                )}
              </div>

              {/* Status indicator matching lecturer's timer badge style */}
              <div className={`absolute -bottom-4 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg transition-colors ${
                scanStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-[#1a3a5f] text-white'
              }`}>
                {scanStatus === 'success' ? <CheckCircle2 size={16} /> : <RefreshCcw size={14} className="animate-spin" />}
                {scanStatus === 'success' ? 'Điểm danh hoàn tất' : 'Đang xử lý tín hiệu...'}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                <Wifi className="text-blue-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Mạng yêu cầu</p>
                  <p className="text-xs font-bold text-blue-700">HUST_Student</p>
                </div>
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                <MapPin className="text-blue-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Vị trí</p>
                  <p className="text-xs font-bold text-blue-700">Phòng D3-201</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR AREA */}
        <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">
          
          {/* MANUAL ENTRY */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Keyboard size={20} className="text-[#1a3a5f]" />
              <h3 className="font-bold text-[#1a3a5f] text-base">Nhập mã thủ công</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 font-medium">Sử dụng mã 6 chữ số nếu không quét được QR.</p>
            
            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input 
                type="text" 
                maxLength={6}
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Ví dụ: 842911" 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-black tracking-[0.5em] focus:outline-none focus:border-[#00a8cc] transition-all"
              />
              <button className="w-full bg-[#1a3a5f] hover:bg-[#254a75] text-white py-3 rounded-xl font-bold text-sm transition-all shadow-md">
                Xác thực mã
              </button>
            </form>
          </div>

          {/* SECURITY STATS */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-[#1a3a5f] text-base">Bảo mật hệ thống</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-800">Khoảng cách: 12m</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Hợp lệ</span>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center gap-3">
                  <ShieldCheck size={18} className="text-blue-600" />
                  <span className="text-xs font-bold text-blue-800">Thiết bị tin cậy</span>
                </div>
                <span className="text-[10px] font-black text-blue-600 uppercase">Xác minh</span>
              </div>

              <div className="mt-auto p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div className="flex gap-3">
                  <AlertTriangle size={20} className="text-orange-500 shrink-0" />
                  <p className="text-[10px] text-orange-700 leading-relaxed font-medium">
                    Hệ thống sẽ ghi nhận tọa độ GPS và địa chỉ IP khi bạn thực hiện điểm danh. Mọi hành vi gian lận sẽ bị xử lý theo quy định của nhà trường.
                  </p>
                </div>
              </div>
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
