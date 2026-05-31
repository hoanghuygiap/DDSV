import { useState, useEffect, useRef } from "react"
import { useSearchParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, RefreshCcw, Wifi, MapPin, StopCircle, Play, Loader2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import api from "@/api/axios"

async function detectLanIP(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] })
      pc.createDataChannel("")
      pc.createOffer().then(o => pc.setLocalDescription(o))
      pc.onicecandidate = (e) => {
        if (!e.candidate) { resolve(null); return }
        const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate)
        if (match && !match[1].startsWith("127.")) {
          pc.close()
          resolve(match[1])
        }
      }
      setTimeout(() => { pc.close(); resolve(null) }, 3000)
    } catch {
      resolve(null)
    }
  })
}

export default function LiveAttendanceQR() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("sessionId")
  const navigate = useNavigate()

  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isLive, setIsLive] = useState(false)
  const [lanIP, setLanIP] = useState<string | null>(null)

  const [loadingAction, setLoadingAction] = useState(false)

  useEffect(() => {
    detectLanIP().then(setLanIP)
  }, [])

  // Fetch session init info
  useEffect(() => {
    if (!sessionId) return
    api.get(`/sessions/${sessionId}`).then((res) => {
      const data = res.data.data
      setSessionInfo(data)
      setIsLive(data.trang_thai === "dang_dien_ra" && data.diem_danh_mo === 1)
    }).catch(err => {
      console.error(err)
      alert("Không thể tải thông tin buổi học")
    })
  }, [sessionId])

  // Lặp Realtime và Refresh QR
  useEffect(() => {
    if (!isLive || !sessionId) return;

    let localTimer = 15;
    setTimeLeft(15);

    if (!qrToken) handleRefreshQR();

    const interval = setInterval(() => {
      localTimer -= 1;
      if (localTimer <= 0) {
        localTimer = 15;
        handleRefreshQR();
      }
      setTimeLeft(localTimer);
    }, 1000)

    return () => clearInterval(interval)
  }, [isLive, sessionId])

const handleRefreshQR = async () => {
    try {
      const res = await api.post("/qr/refresh", {
        session_id: Number(sessionId),
        expires_in_seconds: 15
      })
      setQrToken(res.data.data.token)
    } catch (err) {
      console.error("Không thể làm mới QR:", err)
    }
  }

  const handleOpenAttendance = async () => {
    if (!confirm("Bạn có chắc chắn muốn phát động Điểm danh cho buổi học này?")) return
    setLoadingAction(true)
    try {
      const res = await api.patch(`/sessions/${sessionId}/open-attendance`)
      setQrToken(res.data.data.qr_token)
      setIsLive(true)
      setSessionInfo((prev: any) => ({ ...prev, trang_thai: "dang_dien_ra", diem_danh_mo: 1 }))
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message))
    } finally {
      setLoadingAction(false)
    }
  }

  const handleCloseAttendance = async () => {
    if (!confirm("Bạn có chắc chắn muốn Dừng Điểm danh? Các sinh viên chưa điểm danh sẽ tự động bị Vắng.")) return
    setLoadingAction(true)
    try {
      await api.patch(`/sessions/${sessionId}/close-attendance`)
      setIsLive(false)
      setQrToken(null)
      setSessionInfo((prev: any) => ({ ...prev, trang_thai: "da_ket_thuc", diem_danh_mo: 0 }))
      alert("Đã kết thúc điểm danh và tự động đánh vắng thành công!")
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message))
    } finally {
      setLoadingAction(false)
    }
  }



  if (!sessionInfo) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  const baseUrl = isLocalhost && lanIP
    ? `http://${lanIP}:${window.location.port || "5173"}`
    : window.location.origin
  const qrPayload = qrToken
    ? `${baseUrl}/attend?token=${encodeURIComponent(qrToken)}&session_id=${sessionId}`
    : ""

  return (
    <div className="flex flex-col gap-6 w-full pb-8 h-[calc(100vh-80px)]">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link to={`/dashboard/my-classes/${sessionInfo.lop_mon_hoc_id}`} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#185FA5] hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-medium text-[#185FA5] tracking-tight">
                Mã QR Điểm Danh
              </h1>
              {isLive ? (
                <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-200">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  ĐANG PHÁT LIVE
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
                  CHƯA MỞ
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 font-medium">Buổi ngày {new Date(sessionInfo.ngay_hoc).toLocaleDateString('vi-VN')} ({sessionInfo.gio_bat_dau.slice(0, 5)} - {sessionInfo.gio_ket_thuc.slice(0, 5)})</p>
          </div>
        </div>

        {isLive ? (
          <div className="flex items-center gap-3">

            <button
              disabled={loadingAction}
              onClick={handleCloseAttendance}
              className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors border border-red-200 disabled:opacity-50"
            >
              {loadingAction ? <Loader2 size={18} className="animate-spin" /> : <StopCircle size={18} />}
              Dừng điểm danh
            </button>
          </div>
        ) : (
          sessionInfo.trang_thai !== "da_ket_thuc" && sessionInfo.trang_thai !== "huy" && (
            <button
              disabled={loadingAction}
              onClick={handleOpenAttendance}
              className="flex items-center gap-2 bg-[#185FA5] hover:bg-[#1254a0] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 shadow-md shadow-[#185FA5]/20"
            >
              {loadingAction ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
              Bắt đầu Điểm danh
            </button>
          )
        )}
      </div>

      <div className="flex-1 grid grid-cols-1 gap-6 min-h-0">

        {/* QR SECTION */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#f8f9fa] z-0"></div>
          <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#185FA5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

          <div className="relative z-10 w-full max-w-md flex flex-col items-center">

            <div className={`p-6 rounded-2xl shadow-xl w-full aspect-square flex items-center justify-center relative mb-8 transition-colors ${isLive ? 'bg-white border-blue-200 border-2' : 'bg-slate-100 border-slate-200 border'}`}>
              <div className="w-full h-full border-4 border-[#185FA5] rounded-lg p-2 flex items-center justify-center bg-white relative overflow-hidden">
                {!isLive ? (
                  <div className="flex flex-col items-center text-slate-400 gap-3 text-center p-4">
                    <StopCircle size={64} opacity={0.3} />
                    <p className="font-medium">Màn hình đang khóa</p>
                    <p className="text-xs">Vui lòng ấn nút Bắt đầu Điểm danh để sinh QR Code an toàn.</p>
                  </div>
                ) : !qrToken ? (
                  <Loader2 size={40} className="animate-spin text-blue-500" />
                ) : (
                  <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden">
                    <QRCodeSVG value={qrPayload} size={260} level="H" includeMargin={true} fgColor="#185FA5" />
                    {/* Scanning line animation with shadow/glow */}
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#185FA5] animate-[scan_3s_ease-in-out_infinite] shadow-[0_4px_10px_rgba(24,95,165,0.5)] z-10"></div>
                  </div>
                )}
              </div>

              {/* Timer indicator */}
              {isLive && (
                <div className="absolute -bottom-4 bg-[#185FA5] text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
                  <RefreshCcw size={14} className={timeLeft <= 3 ? "animate-spin" : ""} />
                  Làm mới sau {timeLeft}s
                </div>
              )}
            </div>

            <h2 className="text-2xl font-medium text-[#185FA5] mb-2 text-center">
              {isLive ? "Quét để điểm danh ngay" : "Phiên điểm danh chưa mở"}
            </h2>
            <p className="text-slate-500 font-medium text-center mb-6">
              {isLive ? "Yêu cầu sinh viên sử dụng app UniCheck hoặc Web để quét mã và bật Vị trí GPS." : "Phiên điểm danh đang đóng theo chính sách chống gian lận."}
            </p>

            {isLive && (
              <div className="flex gap-4 w-full">
                {sessionInfo.require_wifi ? (
                  <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
                    <Wifi className="text-blue-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Mạng Bắt buộc</p>
                      <p className="text-sm font-medium text-blue-700">Trường DHTL</p>
                    </div>
                  </div>
                ) : null}
                {sessionInfo.require_gps ? (
                  <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3">
                    <MapPin className="text-indigo-600" />
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Khoảng cách</p>
                      <p className="text-sm font-medium text-indigo-700">{sessionInfo.ban_kinh_gps_m} mét</p>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
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
