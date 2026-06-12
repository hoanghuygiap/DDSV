// import { useState, useEffect, useRef } from "react"
// import { useSearchParams, Link, useNavigate } from "react-router-dom"
// import { ArrowLeft, RefreshCcw, Wifi, MapPin, StopCircle, UserCheck, Play, Loader2 } from "lucide-react"
// import { QRCodeSVG } from "qrcode.react"
// import api from "@/api/axios"

// async function detectLanIP(): Promise<string | null> {
//   return new Promise((resolve) => {
//     try {
//       const pc = new RTCPeerConnection({ iceServers: [] })
//       pc.createDataChannel("")
//       pc.createOffer().then(o => pc.setLocalDescription(o))
//       pc.onicecandidate = (e) => {
//         if (!e.candidate) { resolve(null); return }
//         const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate)
//         if (match && !match[1].startsWith("127.")) {
//           pc.close()
//           resolve(match[1])
//         }
//       }
//       setTimeout(() => { pc.close(); resolve(null) }, 3000)
//     } catch {
//       resolve(null)
//     }
//   })
// }

// export default function LiveAttendanceQR() {
//   const [searchParams] = useSearchParams()
//   const sessionId = searchParams.get("sessionId")
//   const navigate = useNavigate()

//   const [sessionInfo, setSessionInfo] = useState<any>(null)
//   const [qrToken, setQrToken] = useState<string | null>(null)
//   const [timeLeft, setTimeLeft] = useState(15)
//   const [isLive, setIsLive] = useState(false)
//   const [lanIP, setLanIP] = useState<string | null>(null)

//   const [studentsHistory, setStudentsHistory] = useState<any[]>([])
//   const [loadingAction, setLoadingAction] = useState(false)

//   useEffect(() => {
//     detectLanIP().then(setLanIP)
//   }, [])

//   // Fetch session init info
//   useEffect(() => {
//     if (!sessionId) return
//     api.get(`/sessions/${sessionId}`).then((res) => {
//       const data = res.data.data
//       setSessionInfo(data)
//       setIsLive(data.trang_thai === "dang_dien_ra" && data.diem_danh_mo === 1)
//     }).catch(err => {
//       console.error(err)
//       alert("Không thể tải thông tin buổi học")
//     })
//   }, [sessionId])

//   // Lặp Realtime và Refresh QR
//   useEffect(() => {
//     if (!isLive || !sessionId) return;

//     let localTimer = 15;
//     setTimeLeft(15);

//     if (!qrToken) handleRefreshQR();
//     fetchRealtime();

//     const interval = setInterval(() => {
//       localTimer -= 1;
//       if (localTimer <= 0) {
//         localTimer = 15;
//         handleRefreshQR();
//       }
//       setTimeLeft(localTimer);

//       if (localTimer % 2 === 0) {
//         fetchRealtime();
//       }
//     }, 1000)

//     return () => clearInterval(interval)
//   }, [isLive, sessionId])

//   const fetchRealtime = async () => {
//     try {
//       const res = await api.get(`/attendance/realtime/${sessionId}`)
//       setStudentsHistory(res.data.data || [])
//     } catch (err) {
//       console.error("Lỗi Realtime Polling:", err)
//     }
//   }

// const handleRefreshQR = async () => {
//     try {
//       const res = await api.post("/qr/refresh", {
//         session_id: Number(sessionId),
//         expires_in_seconds: 15
//       })
//       setQrToken(res.data.data.token)
//     } catch (err) {
//       console.error("Không thể làm mới QR:", err)
//     }
//   }

//   const handleOpenAttendance = async () => {
//     if (!confirm("Bạn có chắc chắn muốn phát động Điểm danh cho buổi học này?")) return
//     setLoadingAction(true)
//     try {
//       const res = await api.patch(`/sessions/${sessionId}/open-attendance`)
//       setQrToken(res.data.data.qr_token)
//       setIsLive(true)
//       setSessionInfo((prev: any) => ({ ...prev, trang_thai: "dang_dien_ra", diem_danh_mo: 1 }))
//     } catch (err: any) {
//       alert("Lỗi: " + (err.response?.data?.message || err.message))
//     } finally {
//       setLoadingAction(false)
//     }
//   }

//   const handleCloseAttendance = async () => {
//     if (!confirm("Bạn có chắc chắn muốn Dừng Điểm danh? Các sinh viên chưa điểm danh sẽ tự động bị Vắng.")) return
//     setLoadingAction(true)
//     try {
//       await api.patch(`/sessions/${sessionId}/close-attendance`)
//       setIsLive(false)
//       setQrToken(null)
//       setSessionInfo((prev: any) => ({ ...prev, trang_thai: "da_ket_thuc", diem_danh_mo: 0 }))
//       alert("Đã kết thúc điểm danh và tự động đánh vắng thành công!")
//     } catch (err: any) {
//       alert("Lỗi: " + (err.response?.data?.message || err.message))
//     } finally {
//       setLoadingAction(false)
//     }
//   }



//   if (!sessionInfo) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-slate-400" /></div>

//   const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
//   const baseUrl = isLocalhost && lanIP
//     ? `http://${lanIP}:${window.location.port || "5173"}`
//     : window.location.origin
//   const qrPayload = qrToken
//     ? `${baseUrl}/attend?token=${encodeURIComponent(qrToken)}&session_id=${sessionId}`
//     : ""

//   return (
//     <div className="flex flex-col gap-6 w-full pb-8 h-[calc(100vh-80px)]">

//       {/* HEADER */}
//       <div className="flex items-center justify-between gap-4 shrink-0">
//         <div className="flex items-center gap-4">
//           <Link to={`/dashboard/my-classes/${sessionInfo.lop_mon_hoc_id}`} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#185FA5] hover:bg-blue-50 transition-colors">
//             <ArrowLeft size={20} />
//           </Link>
//           <div>
//             <div className="flex items-center gap-3">
//               <h1 className="text-xl font-medium text-[#185FA5] tracking-tight">
//                 Mã QR Điểm Danh
//               </h1>
//               {isLive ? (
//                 <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-medium border border-emerald-200">
//                   <span className="relative flex h-2 w-2">
//                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//                   </span>
//                   ĐANG PHÁT LIVE
//                 </span>
//               ) : (
//                 <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
//                   CHƯA MỞ
//                 </span>
//               )}
//             </div>
//             <p className="text-sm text-slate-500 font-medium">Buổi ngày {new Date(sessionInfo.ngay_hoc).toLocaleDateString('vi-VN')} ({sessionInfo.gio_bat_dau.slice(0, 5)} - {sessionInfo.gio_ket_thuc.slice(0, 5)})</p>
//           </div>
//         </div>

//         {isLive ? (
//           <div className="flex items-center gap-3">

//             <button
//               disabled={loadingAction}
//               onClick={handleCloseAttendance}
//               className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors border border-red-200 disabled:opacity-50"
//             >
//               {loadingAction ? <Loader2 size={18} className="animate-spin" /> : <StopCircle size={18} />}
//               Dừng điểm danh
//             </button>
//           </div>
//         ) : (
//           sessionInfo.trang_thai !== "da_ket_thuc" && sessionInfo.trang_thai !== "huy" && (
//             <button
//               disabled={loadingAction}
//               onClick={handleOpenAttendance}
//               className="flex items-center gap-2 bg-[#185FA5] hover:bg-[#1254a0] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 shadow-md shadow-[#185FA5]/20"
//             >
//               {loadingAction ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
//               Bắt đầu Điểm danh
//             </button>
//           )
//         )}
//       </div>

//       <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">

//         {/* QR SECTION */}
//         <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
//           <div className="absolute inset-0 bg-[#f8f9fa] z-0"></div>
//           <div className="absolute inset-0 opacity-[0.03] z-0" style={{ backgroundImage: 'radial-gradient(#185FA5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

//           <div className="relative z-10 w-full max-w-md flex flex-col items-center">

//             <div className={`p-6 rounded-2xl shadow-xl w-full aspect-square flex items-center justify-center relative mb-8 transition-colors ${isLive ? 'bg-white border-blue-200 border-2' : 'bg-slate-100 border-slate-200 border'}`}>
//               <div className="w-full h-full border-4 border-[#185FA5] rounded-lg p-2 flex items-center justify-center bg-white relative overflow-hidden">
//                 {!isLive ? (
//                   <div className="flex flex-col items-center text-slate-400 gap-3 text-center p-4">
//                     <StopCircle size={64} opacity={0.3} />
//                     <p className="font-medium">Màn hình đang khóa</p>
//                     <p className="text-xs">Vui lòng ấn nút Bắt đầu Điểm danh để sinh QR Code an toàn.</p>
//                   </div>
//                 ) : !qrToken ? (
//                   <Loader2 size={40} className="animate-spin text-blue-500" />
//                 ) : (
//                   <div className="w-full h-full bg-white flex items-center justify-center relative overflow-hidden">
//                     <QRCodeSVG value={qrPayload} size={260} level="H" includeMargin={true} fgColor="#185FA5" />
//                     {/* Scanning line animation with shadow/glow */}
//                     <div className="absolute top-0 left-0 w-full h-[3px] bg-[#185FA5] animate-[scan_3s_ease-in-out_infinite] shadow-[0_4px_10px_rgba(24,95,165,0.5)] z-10"></div>
//                   </div>
//                 )}
//               </div>

//               {/* Timer indicator */}
//               {isLive && (
//                 <div className="absolute -bottom-4 bg-[#185FA5] text-white px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 shadow-lg">
//                   <RefreshCcw size={14} className={timeLeft <= 3 ? "animate-spin" : ""} />
//                   Làm mới sau {timeLeft}s
//                 </div>
//               )}
//             </div>

//             <h2 className="text-2xl font-medium text-[#185FA5] mb-2 text-center">
//               {isLive ? "Quét để điểm danh ngay" : "Phiên điểm danh chưa mở"}
//             </h2>
//             <p className="text-slate-500 font-medium text-center mb-6">
//               {isLive ? "Yêu cầu sinh viên sử dụng app UniCheck hoặc Web để quét mã và bật Vị trí GPS." : "Phiên điểm danh đang đóng theo chính sách chống gian lận."}
//             </p>

//             {isLive && (
//               <div className="flex gap-4 w-full">
//                 {sessionInfo.require_wifi ? (
//                   <div className="flex-1 bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-center gap-3">
//                     <Wifi className="text-blue-600" />
//                     <div>
//                       <p className="text-xs text-slate-500 font-medium uppercase">Mạng Bắt buộc</p>
//                       <p className="text-sm font-medium text-blue-700">Trường DHTL</p>
//                     </div>
//                   </div>
//                 ) : null}
//                 {sessionInfo.require_gps ? (
//                   <div className="flex-1 bg-indigo-50 border border-indigo-100 rounded-lg p-3 flex items-center gap-3">
//                     <MapPin className="text-indigo-600" />
//                     <div>
//                       <p className="text-xs text-slate-500 font-medium uppercase">Khoảng cách</p>
//                       <p className="text-sm font-medium text-indigo-700">{sessionInfo.ban_kinh_gps_m} mét</p>
//                     </div>
//                   </div>
//                 ) : null}
//               </div>
//             )}
//           </div>
//         </div>


//         {/* LIVE STATS & RECENT LOGS */}
//         <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">

//           <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 shrink-0 relative overflow-hidden">
//             {isLive && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse"></div>}
//             <h3 className="font-medium text-[#185FA5] text-lg mb-4 flex justify-between items-center">
//               Tiến độ kiểm diện
//               {isLive && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div> Realtime</span>}
//             </h3>
//             <div className="flex items-end justify-between mb-2">
//               <span className="text-4xl font-medium text-[#185FA5]">{studentsHistory.length}</span>
//               <span className="text-slate-500 font-medium mb-1">Đã Check-in</span>
//             </div>
//             <div className="flex items-center gap-2 text-sm text-[#185FA5] font-medium bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
//               <UserCheck size={18} />
//               Dữ liệu được làm mới liên tục.
//             </div>
//           </div>

//           <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
//             <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
//               <h3 className="font-medium text-[#185FA5] text-base">Check-in gần nhất</h3>
//             </div>
//             <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
//               {studentsHistory.map((sv, i) => (
//                 <div key={i} className={`flex items-center justify-between p-3 border rounded-lg animate-in fade-in slide-in-from-right-4 duration-300 ${sv.trang_thai === 'tre' ? 'border-amber-200 bg-amber-50' : 'border-emerald-100 bg-emerald-50/50'}`}>
//                   <div className="flex items-center gap-3">
//                     <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0 ${sv.trang_thai === 'tre' ? 'bg-amber-200 text-amber-700' : 'bg-emerald-100 text-emerald-600'}`}>
//                       {sv.trang_thai === 'tre' ? 'TRỄ' : <UserCheck size={14} />}
//                     </div>
//                     <div>
//                       <h4 className="text-sm font-medium text-slate-800">{sv.student_name}</h4>
//                       <p className="text-xs text-slate-500">Mã SV: {sv.sinh_vien_id}</p>
//                     </div>
//                   </div>
//                   <span className="text-[10px] font-medium text-slate-400">
//                     {new Date(sv.checked_in_at).toLocaleTimeString('vi-VN')}
//                   </span>
//                 </div>
//               ))}
//               {studentsHistory.length === 0 && (
//                 <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200 mt-2">
//                   <UserCheck size={40} className="mb-3 opacity-30" />
//                   <p className="font-medium text-sm">Chưa có ai check-in cho đến hiện tại.</p>
//                 </div>
//               )}
//             </div>
//           </div>

//         </div>

//       </div>

//       <style>{`
//         @keyframes scan {
//           0% { top: 0; }
//           50% { top: 100%; }
//           100% { top: 0; }
//         }
//       `}</style>
//     </div>
//   )
// }

import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import {
  ArrowLeft,
  RefreshCcw,
  Wifi,
  MapPin,
  StopCircle,
  UserCheck,
  Play,
  Loader2,
} from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import api from "@/api/axios"

async function detectLanIP(): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const pc = new RTCPeerConnection({ iceServers: [] })
      pc.createDataChannel("")
      pc.createOffer().then((o) => pc.setLocalDescription(o))

      pc.onicecandidate = (e) => {
        if (!e.candidate) {
          resolve(null)
          return
        }

        const match = /([0-9]{1,3}(\.[0-9]{1,3}){3})/.exec(e.candidate.candidate)

        if (match && !match[1].startsWith("127.")) {
          pc.close()
          resolve(match[1])
        }
      }

      setTimeout(() => {
        pc.close()
        resolve(null)
      }, 3000)
    } catch {
      resolve(null)
    }
  })
}

export default function LiveAttendanceQR() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get("sessionId")

  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const [qrToken, setQrToken] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState(15)
  const [isLive, setIsLive] = useState(false)
  const [lanIP, setLanIP] = useState<string | null>(null)

  const [studentsHistory, setStudentsHistory] = useState<any[]>([])
  const [loadingAction, setLoadingAction] = useState(false)

  useEffect(() => {
    detectLanIP().then(setLanIP)
  }, [])

  useEffect(() => {
    if (!sessionId) return

    api
      .get(`/sessions/${sessionId}`)
      .then((res) => {
        const data = res.data.data
        setSessionInfo(data)
        setIsLive(data.trang_thai === "dang_dien_ra" && data.diem_danh_mo === 1)
      })
      .catch((err) => {
        console.error(err)
        alert("Không thể tải thông tin buổi học")
      })
  }, [sessionId])

  useEffect(() => {
    if (!isLive || !sessionId) return

    let localTimer = 15
    setTimeLeft(15)

    if (!qrToken) handleRefreshQR()
    fetchRealtime()

    const interval = setInterval(() => {
      localTimer -= 1

      if (localTimer <= 0) {
        localTimer = 15
        handleRefreshQR()
      }

      setTimeLeft(localTimer)

      if (localTimer % 2 === 0) {
        fetchRealtime()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isLive, sessionId])

  const fetchRealtime = async () => {
    try {
      const res = await api.get(`/attendance/realtime/${sessionId}`)
      setStudentsHistory(res.data.data || [])
    } catch (err) {
      console.error("Lỗi Realtime Polling:", err)
    }
  }

  const handleRefreshQR = async () => {
    try {
      const res = await api.post("/qr/refresh", {
        session_id: Number(sessionId),
        expires_in_seconds: 15,
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
      setStudentsHistory([])
      setIsLive(true)

      setSessionInfo((prev: any) => ({
        ...prev,
        trang_thai: "dang_dien_ra",
        diem_danh_mo: 1,
      }))

      fetchRealtime()
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

      setSessionInfo((prev: any) => ({
        ...prev,
        trang_thai: "da_ket_thuc",
        diem_danh_mo: 0,
      }))

      alert("Đã kết thúc điểm danh và tự động đánh vắng thành công!")
    } catch (err: any) {
      alert("Lỗi: " + (err.response?.data?.message || err.message))
    } finally {
      setLoadingAction(false)
    }
  }

  if (!sessionInfo) {
    return (
      <div className="p-10 flex justify-center">
        <Loader2 className="animate-spin text-slate-400" />
      </div>
    )
  }

  const checkedStudents = studentsHistory.filter(
    (sv) => sv.trang_thai === "co_mat" || sv.trang_thai === "tre"
  )

  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"

  const baseUrl =
    isLocalhost && lanIP
      ? `http://${lanIP}:${window.location.port || "5173"}`
      : window.location.origin

  const qrPayload = qrToken
    ? `${baseUrl}/attend?token=${encodeURIComponent(qrToken)}&session_id=${sessionId}`
    : ""

  return (
    <div className="flex flex-col gap-6 w-full pb-8 h-[calc(100vh-80px)]">
      <div className="flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            to={`/dashboard/my-classes/${sessionInfo.lop_mon_hoc_id}`}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-[#185FA5] hover:bg-blue-50 transition-colors"
          >
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
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  ĐANG PHÁT LIVE
                </span>
              ) : (
                <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200">
                  CHƯA MỞ
                </span>
              )}
            </div>

            <p className="text-sm text-slate-500 font-medium">
              Buổi ngày {new Date(sessionInfo.ngay_hoc).toLocaleDateString("vi-VN")} (
              {sessionInfo.gio_bat_dau.slice(0, 5)} - {sessionInfo.gio_ket_thuc.slice(0, 5)})
            </p>
          </div>
        </div>

        {isLive ? (
          <button
            disabled={loadingAction}
            onClick={handleCloseAttendance}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-5 py-2.5 rounded-lg font-medium text-sm transition-colors border border-red-200 disabled:opacity-50"
          >
            {loadingAction ? <Loader2 size={18} className="animate-spin" /> : <StopCircle size={18} />}
            Dừng điểm danh
          </button>
        ) : (
          sessionInfo.trang_thai !== "da_ket_thuc" &&
          sessionInfo.trang_thai !== "huy" && (
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

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#f8f9fa] z-0" />
          <div
            className="absolute inset-0 opacity-[0.03] z-0"
            style={{
              backgroundImage: "radial-gradient(#185FA5 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          <div className="relative z-10 w-full max-w-md flex flex-col items-center">
            <div
              className={`p-6 rounded-2xl shadow-xl w-full aspect-square flex items-center justify-center relative mb-8 transition-colors ${
                isLive ? "bg-white border-blue-200 border-2" : "bg-slate-100 border-slate-200 border"
              }`}
            >
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
                    <QRCodeSVG value={qrPayload} size={260} level="H" includeMargin fgColor="#185FA5" />
                    <div className="absolute top-0 left-0 w-full h-[3px] bg-[#185FA5] animate-[scan_3s_ease-in-out_infinite] shadow-[0_4px_10px_rgba(24,95,165,0.5)] z-10" />
                  </div>
                )}
              </div>

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
              {isLive
                ? "Yêu cầu sinh viên sử dụng app UniCheck hoặc Web để quét mã và bật Vị trí GPS."
                : "Phiên điểm danh đang đóng theo chính sách chống gian lận."}
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

        <div className="lg:col-span-1 flex flex-col gap-6 h-full min-h-0">
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 shrink-0 relative overflow-hidden">
            {isLive && <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 animate-pulse" />}

            <h3 className="font-medium text-[#185FA5] text-lg mb-4 flex justify-between items-center">
              Tiến độ kiểm diện
              {isLive && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  Realtime
                </span>
              )}
            </h3>

            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-medium text-[#185FA5]">{checkedStudents.length}</span>
              <span className="text-slate-500 font-medium mb-1">Đã Check-in</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-[#185FA5] font-medium bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
              <UserCheck size={18} />
              Dữ liệu được làm mới liên tục.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-medium text-[#185FA5] text-base">Check-in gần nhất</h3>
            </div>

            <div className="p-4 overflow-y-auto flex-1 flex flex-col gap-3">
              {checkedStudents.map((sv, i) => {
                const isLate = sv.trang_thai === "tre"

                return (
                  <div
                    key={i}
                    className={`flex items-center justify-between p-3 border rounded-lg animate-in fade-in slide-in-from-right-4 duration-300 ${
                      isLate ? "border-amber-200 bg-amber-50" : "border-emerald-100 bg-emerald-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-xs shrink-0 ${
                          isLate ? "bg-amber-200 text-amber-700" : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {isLate ? "TRỄ" : <UserCheck size={14} />}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-slate-800">{sv.student_name}</h4>
                        <p className="text-xs text-slate-500">Mã SV: {sv.ma_sinh_vien}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-medium text-slate-400">
                      {sv.checked_in_at ? new Date(sv.checked_in_at).toLocaleTimeString("vi-VN") : "Vừa xong"}
                    </span>
                  </div>
                )
              })}

              {checkedStudents.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200 mt-2">
                  <UserCheck size={40} className="mb-3 opacity-30" />
                  <p className="font-medium text-sm">Chưa có ai check-in cho đến hiện tại.</p>
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
