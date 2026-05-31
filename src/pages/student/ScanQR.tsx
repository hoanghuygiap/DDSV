import { useCallback, useEffect, useRef, useState } from "react"
import jsQR from "jsqr"
import {
  Camera, CameraOff, CheckCircle2, AlertTriangle,
  Loader2, MapPin, Wifi, RotateCcw, Keyboard, X,
} from "lucide-react"
import api from "@/api/axios"

// ─── Types ────────────────────────────────────────────────────────────────────
type ScanState = "idle" | "scanning" | "processing" | "success" | "error"

interface ScanResult {
  trang_thai: "co_mat" | "tre"
  hop_le_gps: boolean
  hop_le_wifi: boolean
  hop_le: boolean
  attendance_id: number
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ScanQR() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number>(0)

  const [scanState, setScanState] = useState<ScanState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [result, setResult] = useState<ScanResult | null>(null)
  const [cameraErr, setCameraErr] = useState("")
  const [geoLoading, setGeoLoading] = useState(false)
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  // Manual input
  const [showManual, setShowManual] = useState(false)
  const [manualToken, setManualToken] = useState("")
  const [manualSid, setManualSid] = useState("")

  // ── Get GPS once on mount ──────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) return
    setGeoLoading(true)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setGeoLoading(false)
      },
      () => setGeoLoading(false),
      { timeout: 8000 }
    )
  }, [])

  // ── Camera start/stop ──────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    setCameraErr("")
    setScanState("scanning")
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        requestFrame()
      }
    } catch {
      setCameraErr("Không truy cập được camera. Hãy cấp quyền camera cho trình duyệt.")
      setScanState("idle")
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
  }, [])

  useEffect(() => () => stopCamera(), [stopCamera])

  // ── Frame loop ─────────────────────────────────────────────────────────────
  function requestFrame() {
    rafRef.current = requestAnimationFrame(tick)
  }

  function tick() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || video.readyState < 2) { requestFrame(); return }

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!
    ctx.drawImage(video, 0, 0)

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    })

    if (code?.data) {
      handleQrData(code.data)
      return
    }
    requestFrame()
  }

  // ── QR decoded ────────────────────────────────────────────────────────────
  async function handleQrData(raw: string) {
    cancelAnimationFrame(rafRef.current)
    stopCamera()

    let token: string, session_id: number
    try {
      const payload = JSON.parse(raw)
      token = payload.token
      session_id = payload.session_id
      if (!token || !session_id) throw new Error()
    } catch {
      setErrorMsg("QR không đúng định dạng. Hãy thử quét lại.")
      setScanState("error")
      return
    }

    await submitAttendance(token, session_id)
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function submitAttendance(token: string, session_id: number) {
    setScanState("processing")
    setErrorMsg("")
    try {
      const body: Record<string, unknown> = { token, session_id }
      if (coords) {
        body.latitude = coords.lat
        body.longitude = coords.lng
      }
      const res = await api.post("/qr/scan", body)
      setResult(res.data.data)
      setScanState("success")
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Điểm danh thất bại. Vui lòng thử lại.")
      setScanState("error")
    }
  }

  // ── Manual submit ─────────────────────────────────────────────────────────
  async function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault()
    const sid = parseInt(manualSid)
    if (!manualToken.trim() || isNaN(sid)) return
    setShowManual(false)
    await submitAttendance(manualToken.trim(), sid)
  }

  function reset() {
    setResult(null)
    setErrorMsg("")
    setCameraErr("")
    setScanState("idle")
    setManualToken("")
    setManualSid("")
  }

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 w-full pb-8 max-w-2xl mx-auto">

      {/* HEADER */}
      <div>
        <h1 className="text-[22px] font-medium text-[#185FA5]">Quét mã QR điểm danh</h1>
        <p className="text-sm text-slate-500 mt-0.5">Quét mã QR do giảng viên hiển thị để ghi nhận điểm danh</p>
      </div>

      {/* CAMERA CARD */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

        {/* Camera viewport */}
        <div className="relative bg-slate-900 aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${scanState === "scanning" ? "block" : "hidden"}`}
            playsInline
            muted
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Overlay: idle */}
          {scanState === "idle" && !cameraErr && (
            <div className="flex flex-col items-center gap-3 text-slate-400 p-8">
              <Camera size={52} strokeWidth={1.2} />
              <p className="text-sm font-medium">Camera chưa bật</p>
            </div>
          )}

          {/* Overlay: camera error */}
          {cameraErr && (
            <div className="flex flex-col items-center gap-3 text-red-400 p-8 text-center">
              <CameraOff size={44} strokeWidth={1.2} />
              <p className="text-sm font-medium">{cameraErr}</p>
            </div>
          )}

          {/* Overlay: scanning — crosshair */}
          {scanState === "scanning" && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-56 h-56">
                {/* Corners */}
                {[
                  "top-0 left-0 border-t-4 border-l-4",
                  "top-0 right-0 border-t-4 border-r-4",
                  "bottom-0 left-0 border-b-4 border-l-4",
                  "bottom-0 right-0 border-b-4 border-r-4",
                ].map((cls, i) => (
                  <span key={i} className={`absolute w-8 h-8 border-white rounded-sm ${cls}`} />
                ))}
                {/* Scan line */}
                <div className="absolute left-2 right-2 h-0.5 bg-[#185FA5] shadow-[0_0_8px_2px_rgba(24,95,165,0.6)] animate-[scanline_2s_ease-in-out_infinite]" />
              </div>
            </div>
          )}

          {/* Overlay: processing */}
          {scanState === "processing" && (
            <div className="flex flex-col items-center gap-3 text-white p-8">
              <Loader2 size={44} className="animate-spin" />
              <p className="text-sm font-medium">Đang xác thực...</p>
            </div>
          )}

          {/* Overlay: success */}
          {scanState === "success" && result && (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
                <CheckCircle2 size={44} className="text-white" />
              </div>
              <div>
                <p className="text-white text-xl font-medium">Điểm danh thành công!</p>
                <p className={`text-sm mt-1 font-medium ${result.trang_thai === "co_mat" ? "text-emerald-300" : "text-amber-300"}`}>
                  {result.trang_thai === "co_mat" ? "Có mặt đúng giờ" : "Ghi nhận đi trễ"}
                </p>
              </div>
              {/* GPS / WiFi indicators */}
              <div className="flex gap-3">
                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${result.hop_le_gps ? "bg-emerald-600 text-white" : "bg-slate-600 text-slate-300"}`}>
                  <MapPin size={11} /> GPS {result.hop_le_gps ? "hợp lệ" : "không kiểm tra"}
                </span>
                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${result.hop_le_wifi ? "bg-emerald-600 text-white" : "bg-slate-600 text-slate-300"}`}>
                  <Wifi size={11} /> WiFi {result.hop_le_wifi ? "hợp lệ" : "không kiểm tra"}
                </span>
              </div>
            </div>
          )}

          {/* Overlay: error */}
          {scanState === "error" && (
            <div className="flex flex-col items-center gap-3 text-center p-8">
              <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-400" />
              </div>
              <p className="text-red-300 font-medium text-sm">{errorMsg}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4 flex items-center gap-3 border-t border-slate-100">
          {(scanState === "idle" || cameraErr) && (
            <button
              onClick={startCamera}
              className="flex-1 h-10 bg-[#185FA5] hover:bg-[#1254a0] text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Camera size={16} />
              Bật camera quét QR
            </button>
          )}

          {scanState === "scanning" && (
            <button
              onClick={() => { stopCamera(); setScanState("idle") }}
              className="flex-1 h-10 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <CameraOff size={16} />
              Dừng camera
            </button>
          )}

          {(scanState === "success" || scanState === "error") && (
            <button
              onClick={reset}
              className="flex-1 h-10 border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw size={15} />
              Quét lại
            </button>
          )}

          {scanState !== "processing" && (
            <button
              onClick={() => setShowManual(v => !v)}
              className="h-10 px-4 border border-slate-200 text-slate-500 hover:bg-slate-50 text-sm rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Keyboard size={15} />
              Nhập thủ công
            </button>
          )}
        </div>

        {/* GPS status bar */}
        <div className="px-4 pb-3 flex items-center gap-2 text-xs text-slate-400">
          <MapPin size={12} className={coords ? "text-emerald-500" : geoLoading ? "text-amber-400" : "text-slate-300"} />
          {geoLoading
            ? "Đang lấy vị trí GPS..."
            : coords
              ? `GPS: ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`
              : "Không lấy được GPS — điểm danh vẫn hoạt động nếu buổi học không yêu cầu"}
        </div>
      </div>

      {/* MANUAL INPUT */}
      {showManual && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-slate-800 flex items-center gap-2">
              <Keyboard size={16} className="text-slate-400" />
              Nhập token thủ công
            </h3>
            <button onClick={() => setShowManual(false)} className="text-slate-400 hover:text-slate-600">
              <X size={16} />
            </button>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Dùng khi không thể quét QR. Giảng viên cung cấp token và mã buổi học.
          </p>
          <form onSubmit={handleManualSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Token QR</label>
              <input
                type="text"
                value={manualToken}
                onChange={e => setManualToken(e.target.value)}
                placeholder="Dán token từ giảng viên..."
                className="h-9 px-3 border border-slate-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-slate-600">Mã buổi học (session_id)</label>
              <input
                type="number"
                value={manualSid}
                onChange={e => setManualSid(e.target.value)}
                placeholder="Ví dụ: 42"
                className="h-9 px-3 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5]"
              />
            </div>
            <button
              type="submit"
              disabled={!manualToken.trim() || !manualSid}
              className="h-9 bg-[#185FA5] hover:bg-[#1254a0] disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Xác nhận điểm danh
            </button>
          </form>
        </div>
      )}

      {/* INFO */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={16} className="text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Hệ thống ghi nhận tọa độ GPS và địa chỉ IP khi điểm danh. Mã QR tự động hết hạn sau mỗi lần làm mới — hãy quét ngay khi giảng viên hiển thị.
        </p>
      </div>

      {/* OVERRIDE CSS CHO HTML5-QRCODE */}
      <style>{`
        @keyframes scanline {
          0%   { top: 8px; }
          50%  { top: calc(100% - 8px); }
          100% { top: 8px; }
        }
      `}</style>
    </div>
  )
}
