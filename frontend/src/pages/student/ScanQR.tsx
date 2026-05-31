import { useState, useEffect, useRef } from "react"
import {
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wifi,
  Loader2,
  ShieldCheck
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { StudentService } from "@/services/student.service"
import api from "@/api/axios"
import { Html5QrcodeScanner } from "html5-qrcode"

export default function ScanQR() {
  const { user } = useAuth()

  const [isScanning, setIsScanning] = useState(true)
  const [scanStatus, setScanStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState("")

  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)
  const [studentId, setStudentId] = useState<number | null>(null)

  const scannerRef = useRef<Html5QrcodeScanner | null>(null)

  const latestStudentId = useRef(studentId)
  const latestCoords = useRef(coords)

  useEffect(() => {
    latestStudentId.current = studentId
    latestCoords.current = coords
  }, [studentId, coords])

  useEffect(() => {
    if (!user) return
    let mounted = true

    StudentService.getStudentIdByTaiKhoanId(user.id, user.email || user.ho_ten)
      .then(id => {
        if (mounted && id) setStudentId(id)
      })
      .catch(err => console.error(err))

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (mounted) {
            setCoords({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            })
          }
        },
        () => { },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    }

    return () => { mounted = false }
  }, [user])

  useEffect(() => {
    if (!isScanning) return;

    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "reader",
        { fps: 10 },
        false
      );
    }

    const scanner = scannerRef.current

    const onScanSuccess = async (decodedText: string) => {
      // Dừng scan ngay khi quét được mã để tránh call API liên tục
      if (scannerRef.current) scannerRef.current.pause(true)
      handleCheckin(decodedText)
    };

    scanner.render(onScanSuccess, () => { });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
        scannerRef.current = null
      }
    }
  }, [isScanning])

  const handleCheckin = async (qrDataText: string) => {
    const currentStudentId = latestStudentId.current;
    const currentCoords = latestCoords.current;

    if (!currentStudentId) {
      setErrorMsg("Không tìm thấy thông tin sinh viên.")
      setScanStatus("error")
      return
    }

    setScanStatus("loading")
    setErrorMsg("")

    try {
      let qrPayload: any = {}
      try {
        qrPayload = JSON.parse(qrDataText)
      } catch (e) {
        setScanStatus("error")
        setErrorMsg("Mã QR không đúng định dạng nhận diện.")
        setTimeout(() => setIsScanning(true), 3000)
        return
      }

      const { token, session_id } = qrPayload
      const mockBssid = "00:11:22:33:44:55"
      const mockSsid = "HUST_Student"

      await api.post("/attendance/checkin", {
        qr_token: token,
        session_id: session_id,
        student_id: currentStudentId,
        latitude: currentCoords?.lat,
        longitude: currentCoords?.lng,
        wifi_bssid: mockBssid,
        wifi_ssid: mockSsid
      })

      setScanStatus("success")
      setIsScanning(false)

    } catch (err: any) {
      setScanStatus("error")
      setErrorMsg(err.response?.data?.message || "Mã QR đã hết hạn hoặc không hợp lệ!")

      setTimeout(() => {
        if (scannerRef.current) {
          scannerRef.current.resume()
        }
      }, 3000)
    }
  }

  const resetScanner = () => {
    setScanStatus('idle')
    setIsScanning(true)
    setErrorMsg("")
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8 h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-[#1a3a5f] tracking-tight">Quét mã QR</h1>
            {isScanning && (
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full text-xs font-bold border border-blue-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                ĐANG QUÉT MÃ
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 font-medium">Xác thực bằng Camera & Định vị GPS</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold">
          <Clock size={16} />
          <span>{new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#f8f9fa] z-0"></div>
          <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#1a3a5f 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-slate-100 w-full aspect-square flex flex-col items-center justify-center relative mb-6">
              <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-white text-black">
                {scanStatus === 'success' ? (
                  <div className="w-full h-full bg-emerald-50 flex flex-col items-center justify-center gap-4 animate-in zoom-in duration-500 text-emerald-800 rounded-xl">
                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/50 text-white">
                      <CheckCircle2 size={56} />
                    </div>
                    <h3 className="text-2xl font-black">THÀNH CÔNG</h3>
                    <p className="text-emerald-600 text-sm font-medium">Bạn đã điểm danh thành công buổi học!</p>
                  </div>
                ) : scanStatus === 'loading' ? (
                  <div className="w-full h-full bg-[#f0f7ff] flex flex-col items-center justify-center gap-4 text-[#1a3a5f] rounded-xl border-4 border-[#1a3a5f]">
                    <Loader2 size={60} className="animate-spin text-[#00a8cc]" />
                    <h3 className="font-bold">Đang kiểm tra bảo mật...</h3>
                    <p className="text-xs text-slate-500">Đang đối chiếu GPS và WiFi</p>
                  </div>
                ) : scanStatus === 'error' ? (
                  <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center gap-4 text-red-800 p-6 text-center animate-in zoom-in rounded-xl border-4 border-red-500">
                    <AlertTriangle size={56} className="text-red-500" />
                    <h3 className="text-xl font-black">THẤT BẠI</h3>
                    <p className="font-semibold text-sm">{errorMsg}</p>
                    <button
                      onClick={resetScanner}
                      className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                      Thử quét lại
                    </button>
                  </div>
                ) : (
                  <div className="w-full" id="reader">
                    {/* Html5QrcodeScanner will mount here */}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 w-full">
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                <Wifi className="text-blue-600" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Mạng hiện tại</p>
                  <p className="text-xs font-bold text-blue-700 overflow-hidden text-ellipsis whitespace-nowrap max-w-[120px]">
                    (Giả lập) HUST_Student
                  </p>
                </div>
              </div>
              <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3 overflow-hidden">
                <MapPin className="text-blue-600 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Toạ độ GPS</p>
                  <p className="text-xs font-bold text-blue-700 whitespace-nowrap">
                    {coords ? `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Đang lấy vị trí..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6 min-h-0">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-bold text-[#1a3a5f] text-base">Bảo mật hệ thống</h3>
            </div>
            <div className="p-4 flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-emerald-600" />
                  <span className="text-xs font-bold text-emerald-800">Cấp quyền Định vị</span>
                </div>
                <span className="text-[10px] font-black text-emerald-600 uppercase">
                  {coords ? "Hợp lệ" : "Đang chờ"}
                </span>
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
                    Hệ thống tự động ghi nhận tọa độ GPS và địa chỉ IP trực tiếp khi bạn quét QR. Mọi hành vi dùng thiết bị giả lập lộ trình (Fake GPS) sẽ bị hệ thống từ chối điểm danh lập tức.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERRIDE CSS CHO HTML5-QRCODE */}
      <style>{`
        /* Bỏ viền mặc định của scanner */
        #reader {
          border: none !important;
          border-radius: 12px;
          overflow: hidden;
          background: transparent !important;
          width: 100%;
        }

        /* Ẩn các icon mặc định xấu xí của thư viện */
        #reader img[alt="Info icon"], 
        #reader img[alt="Camera based scan"] {
          display: none !important;
        }

        /* Tút lại các nút bấm */
        #reader button {
          background-color: #1a3a5f !important;
          color: white !important;
          border: none !important;
          border-radius: 8px !important;
          padding: 8px 16px !important;
          font-weight: 700 !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          margin-top: 12px !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        }

        #reader button:hover {
          background-color: #254a75 !important;
        }

        /* Link chuyển đổi (Swap link) */
        #reader a {
          color: #00a8cc !important;
          text-decoration: none !important;
          font-weight: 700 !important;
          display: inline-block !important;
          margin-top: 15px !important;
        }

        #reader a:hover {
          color: #1a3a5f !important;
        }

        /* Khu vực upload ảnh */
        #reader__dashboard_section_csr span {
          color: #64748b !important;
          font-weight: 600 !important;
          font-size: 13px !important;
        }

        /* Input file */
        #reader input[type="file"] {
          margin-top: 15px !important;
        }

        /* Fix khoảng cách nội dung */
        #reader__dashboard_section_csr {
          padding: 30px !important;
          background: #f8fafc !important;
          border-radius: 12px !important;
          border: 2px dashed #cbd5e1 !important;
          margin: 10px !important;
        }
      `}</style>
    </div>
  )
}
