import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { CheckCircle2, AlertTriangle, Loader2, MapPin, GraduationCap } from "lucide-react"
import api from "@/api/axios"

interface ScanResult {
  trang_thai: "co_mat" | "tre"
  hop_le_gps: boolean
  hop_le_wifi: boolean
}

type State = "form" | "processing" | "success" | "error" | "invalid"

export default function AttendPublic() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const sessionId = searchParams.get("session_id")

  const [state, setState] = useState<State>(token && sessionId ? "form" : "invalid")
  const [maSv, setMaSv] = useState("")
  const [result, setResult] = useState<ScanResult | null>(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {},
        { timeout: 8000 }
      )
    }
    if (state === "form") inputRef.current?.focus()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!maSv.trim() || !token || !sessionId) return

    setState("processing")
    try {
      const body: Record<string, unknown> = {
        token,
        session_id: parseInt(sessionId),
        ma_sinh_vien: maSv.trim(),
      }
      if (coords) { body.latitude = coords.lat; body.longitude = coords.lng }

      const res = await api.post("/qr/scan-public", body)
      setResult(res.data.data)
      setState("success")
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Điểm danh thất bại. Vui lòng thử lại.")
      setState("error")
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="h-9 w-9 rounded-lg bg-[#185FA5] flex items-center justify-center">
          <GraduationCap size={20} className="text-white" strokeWidth={2} />
        </div>
        <span className="text-lg font-medium text-[#185FA5]">UniCheck</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 w-full max-w-sm overflow-hidden">

        {/* form */}
        {state === "form" && (
          <div className="p-6">
            <h1 className="text-lg font-medium text-slate-800 mb-1">Điểm danh QR</h1>
            <p className="text-sm text-slate-500 mb-6">Nhập mã sinh viên để xác nhận có mặt</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-600">Mã sinh viên</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={maSv}
                  onChange={e => setMaSv(e.target.value)}
                  placeholder="Ví dụ: SV001"
                  className="h-12 px-4 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/25 focus:border-[#185FA5]"
                />
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <MapPin size={11} className={coords ? "text-emerald-500" : "text-slate-300"} />
                {coords ? `GPS: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}` : "Đang lấy vị trí GPS..."}
              </div>

              <button
                type="submit"
                disabled={!maSv.trim()}
                className="h-12 bg-[#185FA5] hover:bg-[#1254a0] disabled:opacity-50 text-white text-sm font-medium rounded-xl transition-colors"
              >
                Xác nhận điểm danh
              </button>
            </form>
          </div>
        )}

        {/* processing */}
        {state === "processing" && (
          <div className="p-10 flex flex-col items-center gap-4">
            <Loader2 size={40} className="animate-spin text-[#185FA5]" />
            <p className="text-sm font-medium text-slate-600">Đang xác thực...</p>
          </div>
        )}

        {/* success */}
        {state === "success" && result && (
          <div className="p-8 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 size={44} className="text-emerald-500" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xl font-medium text-slate-800">Điểm danh thành công!</p>
              <p className={`mt-1.5 text-sm font-medium ${result.trang_thai === "co_mat" ? "text-emerald-600" : "text-amber-500"}`}>
                {result.trang_thai === "co_mat" ? "Có mặt đúng giờ" : "Ghi nhận đi trễ"}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap justify-center">
              <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border ${result.hop_le_gps ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                GPS {result.hop_le_gps ? "hợp lệ" : "không kiểm tra"}
              </span>
              <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border ${result.hop_le_wifi ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-400 border-slate-200"}`}>
                WiFi {result.hop_le_wifi ? "hợp lệ" : "không kiểm tra"}
              </span>
            </div>
          </div>
        )}

        {/* error */}
        {state === "error" && (
          <div className="p-8 flex flex-col items-center gap-5 text-center">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={44} className="text-red-500" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xl font-medium text-slate-800">Thất bại</p>
              <p className="mt-1.5 text-sm text-slate-500">{errorMsg}</p>
            </div>
            <button
              onClick={() => { setState("form"); setErrorMsg("") }}
              className="h-11 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-xl transition-colors"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* invalid — thiếu token/session */}
        {state === "invalid" && (
          <div className="p-8 flex flex-col items-center gap-4 text-center">
            <AlertTriangle size={40} className="text-slate-300" />
            <p className="text-sm text-slate-500">Link không hợp lệ. Hãy quét lại mã QR từ giảng viên.</p>
          </div>
        )}
      </div>
    </div>
  )
}
