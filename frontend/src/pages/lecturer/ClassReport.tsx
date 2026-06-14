// import { useEffect, useMemo, useState } from "react"
// import { useAuth } from "@/contexts/AuthContext"
// import {
//   Loader2, TrendingUp, AlertTriangle, Clock,
//   ChevronDown, BookOpen, UserX,
// } from "lucide-react"
// import api from "@/api/axios"
// import { LecturerService } from "@/services/lecturer.service"

// // ─── Types ────────────────────────────────────────────────────────────────────
// interface CourseClass {
//   id: number
//   ma_lop: string
//   ma_hoc_phan: string
//   ten_hoc_phan: string
//   ten_ky: string
//   so_sinh_vien: number
//   tong_buoi_da_day: number
//   ty_le_co_mat_tb: number | null
//   so_luong_nguy_co: number
// }

// interface StudentRow {
//   id: number
//   ma_sinh_vien: string
//   ho_ten: string
//   tong_buoi: number
//   so_buoi_vang: number
//   so_buoi_co_mat: number
//   so_buoi_tre: number
//   so_buoi_co_phep: number
//   ty_le_vang: number | null
// }

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// function initials(name: string) {
//   return (name ?? "?").split(" ").slice(-2).map(x => x[0]).join("").toUpperCase()
// }

// function riskLevel(tyLeVang: number | null): "high" | "mid" | "ok" {
//   const v = tyLeVang ?? 0
//   if (v >= 20) return "high"
//   if (v >= 10) return "mid"
//   return "ok"
// }

// function RiskBadge({ level }: { level: "high" | "mid" | "ok" }) {
//   if (level === "high") return (
//     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600 border border-red-200">
//       ⚠ Cấm thi
//     </span>
//   )
//   if (level === "mid") return (
//     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-600 border border-orange-200">
//       Cảnh báo
//     </span>
//   )
//   return (
//     <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
//       Bình thường
//     </span>
//   )
// }

// // ─── Main ─────────────────────────────────────────────────────────────────────
// export default function ClassReport() {
//   const { user } = useAuth()

//   const [classes,         setClasses]         = useState<CourseClass[]>([])
//   const [selectedId,      setSelectedId]      = useState("")
//   const [students,        setStudents]        = useState<StudentRow[]>([])
//   const [loadingClasses,  setLoadingClasses]  = useState(true)
//   const [loadingStudents, setLoadingStudents] = useState(false)

//   // Load lecturer's classes
//   useEffect(() => {
//     if (!user) return
//     setLoadingClasses(true)
//     LecturerService.getAll()
//       .then(all => {
//         const me = all.find((l: any) => l.username === user.username)
//         if (!me) return []
//         return LecturerService.getCourseClasses(me.id)
//       })
//       .then(cls => { if (cls) setClasses(cls as CourseClass[]) })
//       .catch(() => {})
//       .finally(() => setLoadingClasses(false))
//   }, [user])

//   // Load students when class changes
//   useEffect(() => {
//     if (!selectedId) { setStudents([]); return }
//     setLoadingStudents(true)
//     api.get(`/course-classes/${selectedId}/students`, { params: { limit: 300 } })
//       .then(res => setStudents(res.data?.data ?? []))
//       .catch(() => setStudents([]))
//       .finally(() => setLoadingStudents(false))
//   }, [selectedId])

//   const selectedClass = classes.find(c => String(c.id) === selectedId)

//   // ── Stats ─────────────────────────────────────────────────────────────────
//   const attendanceRate = Number(selectedClass?.ty_le_co_mat_tb ?? 0)
//   const totalVang      = students.reduce((s, r) => s + (Number(r.so_buoi_vang) || 0), 0)
//   const totalTre       = students.reduce((s, r) => s + (Number(r.so_buoi_tre)  || 0), 0)
//   const highRiskCount  = selectedClass?.so_luong_nguy_co ?? 0

//   // ── Chart: top 8 by absence ───────────────────────────────────────────────
//   const chartStudents = useMemo(
//     () => [...students].sort((a, b) => (Number(b.so_buoi_vang) || 0) - (Number(a.so_buoi_vang) || 0)).slice(0, 8),
//     [students]
//   )
//   const chartMax = Math.max(...chartStudents.map(s => s.so_buoi_vang || 0), 1)

//   // ── Right panel: high-risk students ──────────────────────────────────────
//   const warningStudents = useMemo(
//     () => [...students]
//       .filter(s => (Number(s.ty_le_vang) ?? 0) >= 10)
//       .sort((a, b) => (Number(b.ty_le_vang) ?? 0) - (Number(a.ty_le_vang) ?? 0))
//       .slice(0, 5),
//     [students]
//   )

//   // ── Table: all students sorted by absence ─────────────────────────────────
//   const tableStudents = useMemo(
//     () => [...students].sort((a, b) => (Number(b.so_buoi_vang) || 0) - (Number(a.so_buoi_vang) || 0)),
//     [students]
//   )

//   // ─── Render ──────────────────────────────────────────────────────────────
//   if (loadingClasses) return (
//     <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
//       <Loader2 size={20} className="animate-spin" />
//       <span className="text-sm">Đang tải danh sách lớp...</span>
//     </div>
//   )

//   return (
//     <div className="flex flex-col gap-6 w-full pb-8">

//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
//         <div>
//           <h1 className="text-[22px] font-medium text-[#185FA5]">
//             {selectedClass
//               ? `Thống kê lớp học: ${selectedClass.ma_lop} — ${selectedClass.ten_hoc_phan}`
//               : "Báo cáo chuyên cần"}
//           </h1>
//           {selectedClass
//             ? <p className="text-sm text-slate-500 mt-0.5">{selectedClass.ten_ky}</p>
//             : <p className="text-sm text-slate-500 mt-0.5">Chọn lớp học phần để xem thống kê</p>
//           }
//         </div>

//         {/* Class selector */}
//         <div className="relative shrink-0">
//           <select
//             value={selectedId}
//             onChange={e => setSelectedId(e.target.value)}
//             className="appearance-none h-10 pl-4 pr-10 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[280px]"
//           >
//             <option value="">-- Chọn lớp học phần --</option>
//             {classes.map(c => (
//               <option key={c.id} value={String(c.id)}>
//                 {c.ma_lop} — {c.ten_hoc_phan}
//               </option>
//             ))}
//           </select>
//           <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//         </div>
//       </div>

//       {/* EMPTY STATE */}
//       {!selectedId ? (
//         <div className="flex flex-col items-center justify-center py-28 text-slate-400 gap-3">
//           <BookOpen size={44} strokeWidth={1.2} />
//           <p className="text-base font-medium">Chọn một lớp học phần để xem báo cáo</p>
//           <p className="text-sm">Dữ liệu chuyên cần, cảnh báo và thống kê sẽ hiển thị tại đây</p>
//         </div>
//       ) : loadingStudents ? (
//         <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
//           <Loader2 size={20} className="animate-spin" />
//           <span className="text-sm">Đang tải dữ liệu...</span>
//         </div>
//       ) : (
//         <>
//           {/* ── STAT CARDS ──────────────────────────────────────────────────── */}
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

//             {/* Tỷ lệ chuyên cần */}
//             <div className="bg-[#185FA5] rounded-xl p-5 text-white shadow-sm relative overflow-hidden col-span-2 sm:col-span-1">
//               <div className="absolute -right-4 -top-4 opacity-10"><TrendingUp size={80} /></div>
//               <div className="relative z-10">
//                 <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-3">Tỷ lệ chuyên cần</p>
//                 <h2 className="text-4xl font-medium mb-3">{attendanceRate.toFixed(1)}%</h2>
//                 <div className="w-full bg-white/20 h-1.5 rounded-full">
//                   <div className="h-full bg-white rounded-full transition-all" style={{ width: `${Math.min(attendanceRate, 100)}%` }} />
//                 </div>
//               </div>
//             </div>

//             {/* Tổng số vắng */}
//             <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
//               <div className="flex justify-between items-start">
//                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng số vắng</p>
//                 <div className="p-2 rounded-lg bg-orange-50 text-orange-500"><UserX size={16} /></div>
//               </div>
//               <h2 className="text-3xl font-medium text-slate-800">{totalVang}</h2>
//               <p className="text-xs text-slate-400">Lượt vắng toàn lớp</p>
//             </div>

//             {/* Số lần đi muộn */}
//             <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
//               <div className="flex justify-between items-start">
//                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Số lần đi muộn</p>
//                 <div className="p-2 rounded-lg bg-amber-50 text-amber-500"><Clock size={16} /></div>
//               </div>
//               <h2 className="text-3xl font-medium text-slate-800">{totalTre}</h2>
//               <p className="text-xs text-slate-400">Lượt trễ toàn lớp</p>
//             </div>

//             {/* Sinh viên nguy cơ cao */}
//             <div className="bg-white border border-l-4 border-red-200 border-l-red-500 rounded-xl p-5 shadow-sm flex flex-col gap-2">
//               <div className="flex justify-between items-start">
//                 <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nguy cơ cao</p>
//                 <div className="p-2 rounded-lg bg-red-50 text-red-500"><AlertTriangle size={16} /></div>
//               </div>
//               <h2 className="text-3xl font-medium text-red-600">{highRiskCount}</h2>
//               <p className="text-xs text-slate-400">Vắng ≥ 20% — cần cảnh báo</p>
//             </div>
//           </div>

//           {/* ── MIDDLE ──────────────────────────────────────────────────────── */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

//             {/* Chart – top students by absence */}
//             <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
//               <div className="flex items-start justify-between mb-5">
//                 <div>
//                   <h3 className="font-medium text-slate-800">Sinh viên vắng nhiều nhất</h3>
//                   <p className="text-xs text-slate-400 mt-0.5">
//                     Top 8 · {selectedClass?.tong_buoi_da_day ?? 0} buổi đã dạy
//                   </p>
//                 </div>
//                 <div className="flex items-center gap-3 text-[11px] text-slate-500">
//                   <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-400 inline-block" />≥ 20%</span>
//                   <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-400 inline-block" />10–20%</span>
//                   <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#185FA5] inline-block" />&lt; 10%</span>
//                 </div>
//               </div>

//               {chartStudents.length === 0 ? (
//                 <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
//                   Chưa có dữ liệu điểm danh
//                 </div>
//               ) : (
//                 <div className="flex flex-col gap-3.5">
//                   {chartStudents.map(s => {
//                     const vRate = Number(s.tong_buoi) > 0 ? (Number(s.so_buoi_vang) / Number(s.tong_buoi)) * 100 : 0
//                     const level = riskLevel(s.ty_le_vang)
//                     const barColor = level === "high" ? "bg-red-400" : level === "mid" ? "bg-orange-400" : "bg-[#185FA5]"
//                     return (
//                       <div key={s.id} className="flex items-center gap-3">
//                         <div className="w-32 shrink-0">
//                           <p className="text-xs font-medium text-slate-700 truncate">{s.ho_ten}</p>
//                           <p className="text-[10px] text-slate-400 font-mono">{s.ma_sinh_vien}</p>
//                         </div>
//                         <div className="flex-1 bg-slate-100 h-5 rounded overflow-hidden">
//                           <div
//                             className={`h-full ${barColor} rounded transition-all duration-500`}
//                             style={{ width: `${(s.so_buoi_vang / chartMax) * 100}%` }}
//                           />
//                         </div>
//                         <span className={`w-14 text-right text-xs font-medium shrink-0 ${
//                           level === "high" ? "text-red-600" : level === "mid" ? "text-orange-500" : "text-slate-600"
//                         }`}>
//                           {s.so_buoi_vang} buổi
//                         </span>
//                         <span className="w-10 text-right text-[11px] text-slate-400 shrink-0">
//                           {vRate.toFixed(0)}%
//                         </span>
//                       </div>
//                     )
//                   })}
//                 </div>
//               )}
//             </div>

//             {/* Right – warning students */}
//             <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
//               <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
//                 <div className="flex items-center gap-2">
//                   <AlertTriangle size={14} className="text-red-500" />
//                   <h3 className="text-sm font-medium text-slate-800">Cảnh báo vắng nhiều</h3>
//                 </div>
//                 {highRiskCount > 0 && (
//                   <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium">
//                     {highRiskCount}
//                   </span>
//                 )}
//               </div>

//               <div className="flex-1 flex flex-col divide-y divide-slate-100 overflow-y-auto max-h-72">
//                 {warningStudents.length === 0 ? (
//                   <div className="flex-1 flex items-center justify-center py-10 text-slate-400 text-sm">
//                     Không có sinh viên cảnh báo
//                   </div>
//                 ) : (
//                   warningStudents.map(s => {
//                     const level = riskLevel(s.ty_le_vang)
//                     return (
//                       <div key={s.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
//                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${
//                           level === "high" ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"
//                         }`}>
//                           {initials(s.ho_ten)}
//                         </div>
//                         <div className="flex-1 min-w-0">
//                           <p className="text-sm font-medium text-slate-800 truncate">{s.ho_ten}</p>
//                           <p className="text-[11px] text-slate-400 font-mono">{s.ma_sinh_vien}</p>
//                         </div>
//                         <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${
//                           level === "high" ? "bg-red-50 text-red-600 border border-red-100" : "bg-orange-50 text-orange-600 border border-orange-100"
//                         }`}>
//                           Vắng: {s.so_buoi_vang}
//                         </span>
//                       </div>
//                     )
//                   })
//                 )}
//               </div>

//               <div className="p-3 border-t border-slate-100 text-center">
//                 <p className="text-xs text-slate-400">
//                   {students.filter(s => (s.ty_le_vang ?? 0) >= 20).length} sinh viên có nguy cơ cấm thi
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* ── TABLE ───────────────────────────────────────────────────────── */}
//           <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
//             <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
//               <div>
//                 <h3 className="font-medium text-slate-800">Chi tiết chuyên cần sinh viên</h3>
//                 <p className="text-xs text-slate-400 mt-0.5">
//                   {students.length} sinh viên · sắp xếp theo số buổi vắng
//                 </p>
//               </div>
//               <div className="flex items-center gap-4 text-[11px] text-slate-400">
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Cấm thi ≥ 20%</span>
//                 <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Cảnh báo ≥ 10%</span>
//               </div>
//             </div>

//             <div className="overflow-x-auto">
//               <table className="w-full text-sm text-left text-slate-600">
//                 <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
//                   <tr>
//                     <th className="px-5 py-3 font-medium tracking-wider w-10">#</th>
//                     <th className="px-5 py-3 font-medium tracking-wider">Sinh viên</th>
//                     <th className="px-5 py-3 font-medium tracking-wider text-center">Tổng buổi</th>
//                     <th className="px-5 py-3 font-medium tracking-wider text-center">Có mặt</th>
//                     <th className="px-5 py-3 font-medium tracking-wider text-center">Vắng</th>
//                     <th className="px-5 py-3 font-medium tracking-wider text-center">Trễ</th>
//                     <th className="px-5 py-3 font-medium tracking-wider text-center">Tỷ lệ vắng</th>
//                     <th className="px-5 py-3 font-medium tracking-wider text-center">Tình trạng</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {tableStudents.length === 0 ? (
//                     <tr>
//                       <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
//                         Chưa có dữ liệu sinh viên
//                       </td>
//                     </tr>
//                   ) : (
//                     tableStudents.map((s, idx) => {
//                       const level = riskLevel(s.ty_le_vang)
//                       const vRate = Number(s.ty_le_vang ?? 0)
//                       return (
//                         <tr
//                           key={s.id}
//                           className={`hover:bg-slate-50/50 transition-colors ${level === "high" ? "bg-red-50/40" : ""}`}
//                         >
//                           <td className="px-5 py-3.5 text-slate-400 text-xs">{idx + 1}</td>
//                           <td className="px-5 py-3.5">
//                             <div className="flex items-center gap-2.5">
//                               <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${
//                                 level === "high" ? "bg-red-100 text-red-600"
//                                 : level === "mid"  ? "bg-orange-100 text-orange-600"
//                                 : "bg-slate-100 text-slate-600"
//                               }`}>
//                                 {initials(s.ho_ten)}
//                               </div>
//                               <div>
//                                 <p className="font-medium text-slate-800 leading-tight">{s.ho_ten}</p>
//                                 <p className="text-[11px] text-slate-400 font-mono">{s.ma_sinh_vien}</p>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="px-5 py-3.5 text-center font-medium text-slate-700">{s.tong_buoi}</td>
//                           <td className="px-5 py-3.5 text-center font-medium text-emerald-600">{s.so_buoi_co_mat}</td>
//                           <td className="px-5 py-3.5 text-center">
//                             <span className={`font-medium ${
//                               level === "high" ? "text-red-600" : level === "mid" ? "text-orange-500" : "text-slate-700"
//                             }`}>{s.so_buoi_vang}</span>
//                           </td>
//                           <td className="px-5 py-3.5 text-center text-amber-600 font-medium">{s.so_buoi_tre}</td>
//                           <td className="px-5 py-3.5">
//                             <div className="flex items-center justify-center gap-2">
//                               <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
//                                 <div
//                                   className={`h-full rounded-full ${
//                                     level === "high" ? "bg-red-500" : level === "mid" ? "bg-orange-400" : "bg-emerald-500"
//                                   }`}
//                                   style={{ width: `${Math.min(vRate, 100)}%` }}
//                                 />
//                               </div>
//                               <span className={`text-xs font-medium w-10 ${
//                                 level === "high" ? "text-red-600" : level === "mid" ? "text-orange-500" : "text-slate-600"
//                               }`}>
//                                 {vRate.toFixed(1)}%
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-5 py-3.5 text-center">
//                             <RiskBadge level={level} />
//                           </td>
//                         </tr>
//                       )
//                     })
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }
import { useEffect, useMemo, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  Loader2, TrendingUp, AlertTriangle, Clock,
  ChevronDown, BookOpen, UserX, Download,
} from "lucide-react"
import api from "@/api/axios"
import { LecturerService } from "@/services/lecturer.service"

// ─── Types ────────────────────────────────────────────────────────────────────
interface CourseClass {
  id: number
  ma_lop: string
  ma_hoc_phan: string
  ten_hoc_phan: string
  ten_ky: string
  so_sinh_vien: number
  tong_buoi_da_day: number
  ty_le_co_mat_tb: number | null
  so_luong_nguy_co: number
}

interface StudentRow {
  id: number
  ma_sinh_vien: string
  ho_ten: string
  tong_buoi: number
  so_buoi_vang: number
  so_buoi_co_mat: number
  so_buoi_tre: number
  so_buoi_co_phep: number
  ty_le_vang: number | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function initials(name: string) {
  return (name ?? "?").split(" ").slice(-2).map(x => x[0]).join("").toUpperCase()
}

function riskLevel(tyLeVang: number | null): "high" | "mid" | "ok" {
  const v = tyLeVang ?? 0
  if (v >= 20) return "high"
  if (v >= 10) return "mid"
  return "ok"
}

function RiskBadge({ level }: { level: "high" | "mid" | "ok" }) {
  if (level === "high") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-red-50 text-red-600 border border-red-200">
      ⚠ Nguy cơ cao
    </span>
  )
  if (level === "mid") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-orange-50 text-orange-600 border border-orange-200">
      Cảnh báo
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
      Bình thường
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ClassReport() {
  const { user } = useAuth()

  const [classes, setClasses] = useState<CourseClass[]>([])
  const [selectedId, setSelectedId] = useState("")
  const [students, setStudents] = useState<StudentRow[]>([])
  const [loadingClasses, setLoadingClasses] = useState(true)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const [exporting, setExporting] = useState(false)

  // Load lecturer's classes
  useEffect(() => {
    if (!user) return
    setLoadingClasses(true)

    LecturerService.getAll()
      .then(all => {
        const me = all.find((l: any) => l.username === user.username)
        if (!me) return []
        return LecturerService.getCourseClasses(me.id)
      })
      .then(cls => {
        if (cls) setClasses(cls as CourseClass[])
      })
      .catch(() => {})
      .finally(() => setLoadingClasses(false))
  }, [user])

  // Load students when class changes
  useEffect(() => {
    if (!selectedId) {
      setStudents([])
      return
    }

    setLoadingStudents(true)

    api.get(`/course-classes/${selectedId}/students`, {
      params: { limit: 300 },
    })
      .then(res => setStudents(res.data?.data ?? []))
      .catch(() => setStudents([]))
      .finally(() => setLoadingStudents(false))
  }, [selectedId])

  const selectedClass = classes.find(c => String(c.id) === selectedId)

  const handleExportExcel = async () => {
    if (!selectedId) {
      alert("Vui lòng chọn lớp học phần trước khi xuất Excel")
      return
    }

    try {
      setExporting(true)

      const res = await api.get(`/reports/export`, {
        params: {
          course_class_id: selectedId,
        },
        responseType: "blob",
      })

      const blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")

      const fileName = selectedClass
        ? `bao-cao-chuyen-can-${selectedClass.ma_lop}.xlsx`
        : "bao-cao-chuyen-can.xlsx"

      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      link.remove()

      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error(error)
      alert("Xuất Excel thất bại. Kiểm tra lại API /reports/export")
    } finally {
      setExporting(false)
    }
  }

  // ── Stats ─────────────────────────────────────────────────────────────────
  const attendanceRate = Number(selectedClass?.ty_le_co_mat_tb ?? 0)
  const totalVang = students.reduce((s, r) => s + (Number(r.so_buoi_vang) || 0), 0)
  const totalTre = students.reduce((s, r) => s + (Number(r.so_buoi_tre) || 0), 0)
  const highRiskCount = selectedClass?.so_luong_nguy_co ?? students.filter(s => (s.ty_le_vang ?? 0) >= 20).length

  // ── Chart: top 8 by absence ───────────────────────────────────────────────
  const chartStudents = useMemo(
    () => [...students]
      .sort((a, b) => (Number(b.so_buoi_vang) || 0) - (Number(a.so_buoi_vang) || 0))
      .slice(0, 8),
    [students]
  )

  const chartMax = Math.max(...chartStudents.map(s => s.so_buoi_vang || 0), 1)

  // ── Right panel: warning students ─────────────────────────────────────────
  const warningStudents = useMemo(
    () => [...students]
      .filter(s => Number(s.ty_le_vang ?? 0) >= 10)
      .sort((a, b) => Number(b.ty_le_vang ?? 0) - Number(a.ty_le_vang ?? 0))
      .slice(0, 5),
    [students]
  )

  // ── Table: all students sorted by absence ─────────────────────────────────
  const tableStudents = useMemo(
    () => [...students].sort((a, b) => (Number(b.so_buoi_vang) || 0) - (Number(a.so_buoi_vang) || 0)),
    [students]
  )

  // ─── Render ──────────────────────────────────────────────────────────────
  if (loadingClasses) return (
    <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
      <Loader2 size={20} className="animate-spin" />
      <span className="text-sm">Đang tải danh sách lớp...</span>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 w-full pb-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium text-[#185FA5]">
            {selectedClass
              ? `Thống kê lớp học: ${selectedClass.ma_lop} — ${selectedClass.ten_hoc_phan}`
              : "Báo cáo chuyên cần"}
          </h1>

          {selectedClass
            ? <p className="text-sm text-slate-500 mt-0.5">{selectedClass.ten_ky}</p>
            : <p className="text-sm text-slate-500 mt-0.5">Chọn lớp học phần để xem thống kê</p>
          }
        </div>

        {/* Export + Class selector */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportExcel}
            disabled={!selectedId || exporting}
            className="h-10 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {exporting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            Xuất Excel
          </button>

          <div className="relative">
            <select
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
              className="appearance-none h-10 pl-4 pr-10 border border-slate-200 rounded-lg text-sm text-slate-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#185FA5]/20 focus:border-[#185FA5] min-w-[280px]"
            >
              <option value="">-- Chọn lớp học phần --</option>
              {classes.map(c => (
                <option key={c.id} value={String(c.id)}>
                  {c.ma_lop} — {c.ten_hoc_phan}
                </option>
              ))}
            </select>

            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {!selectedId ? (
        <div className="flex flex-col items-center justify-center py-28 text-slate-400 gap-3">
          <BookOpen size={44} strokeWidth={1.2} />
          <p className="text-base font-medium">Chọn một lớp học phần để xem báo cáo</p>
          <p className="text-sm">Dữ liệu chuyên cần, cảnh báo và thống kê sẽ hiển thị tại đây</p>
        </div>
      ) : loadingStudents ? (
        <div className="flex items-center justify-center h-64 gap-2 text-slate-400">
          <Loader2 size={20} className="animate-spin" />
          <span className="text-sm">Đang tải dữ liệu...</span>
        </div>
      ) : (
        <>
          {/* STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="bg-[#185FA5] rounded-xl p-5 text-white shadow-sm relative overflow-hidden col-span-2 sm:col-span-1">
              <div className="absolute -right-4 -top-4 opacity-10">
                <TrendingUp size={80} />
              </div>
              <div className="relative z-10">
                <p className="text-blue-200 text-xs font-medium uppercase tracking-wide mb-3">Tỷ lệ chuyên cần</p>
                <h2 className="text-4xl font-medium mb-3">{attendanceRate.toFixed(1)}%</h2>
                <div className="w-full bg-white/20 h-1.5 rounded-full">
                  <div
                    className="h-full bg-white rounded-full transition-all"
                    style={{ width: `${Math.min(attendanceRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Tổng số vắng</p>
                <div className="p-2 rounded-lg bg-orange-50 text-orange-500">
                  <UserX size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-medium text-slate-800">{totalVang}</h2>
              <p className="text-xs text-slate-400">Lượt vắng toàn lớp</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Số lần đi muộn</p>
                <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                  <Clock size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-medium text-slate-800">{totalTre}</h2>
              <p className="text-xs text-slate-400">Lượt trễ toàn lớp</p>
            </div>

            <div className="bg-white border border-l-4 border-red-200 border-l-red-500 rounded-xl p-5 shadow-sm flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Nguy cơ cao</p>
                <div className="p-2 rounded-lg bg-red-50 text-red-500">
                  <AlertTriangle size={16} />
                </div>
              </div>
              <h2 className="text-3xl font-medium text-red-600">{highRiskCount}</h2>
              <p className="text-xs text-slate-400">Vắng ≥ 20% — cần cảnh báo</p>
            </div>
          </div>

          {/* MIDDLE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-medium text-slate-800">Sinh viên vắng nhiều nhất</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Top 8 · {selectedClass?.tong_buoi_da_day ?? 0} buổi đã dạy
                  </p>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-red-400 inline-block" />≥ 20%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-orange-400 inline-block" />10–20%
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-[#185FA5] inline-block" />&lt; 10%
                  </span>
                </div>
              </div>

              {chartStudents.length === 0 ? (
                <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
                  Chưa có dữ liệu điểm danh
                </div>
              ) : (
                <div className="flex flex-col gap-3.5">
                  {chartStudents.map(s => {
                    const vRate = Number(s.tong_buoi) > 0
                      ? (Number(s.so_buoi_vang) / Number(s.tong_buoi)) * 100
                      : 0

                    const level = riskLevel(s.ty_le_vang)

                    const barColor =
                      level === "high"
                        ? "bg-red-400"
                        : level === "mid"
                          ? "bg-orange-400"
                          : "bg-[#185FA5]"

                    return (
                      <div key={s.id} className="flex items-center gap-3">
                        <div className="w-32 shrink-0">
                          <p className="text-xs font-medium text-slate-700 truncate">{s.ho_ten}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{s.ma_sinh_vien}</p>
                        </div>

                        <div className="flex-1 bg-slate-100 h-5 rounded overflow-hidden">
                          <div
                            className={`h-full ${barColor} rounded transition-all duration-500`}
                            style={{ width: `${(s.so_buoi_vang / chartMax) * 100}%` }}
                          />
                        </div>

                        <span className={`w-14 text-right text-xs font-medium shrink-0 ${
                          level === "high"
                            ? "text-red-600"
                            : level === "mid"
                              ? "text-orange-500"
                              : "text-slate-600"
                        }`}>
                          {s.so_buoi_vang} buổi
                        </span>

                        <span className="w-10 text-right text-[11px] text-slate-400 shrink-0">
                          {vRate.toFixed(0)}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
              <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500" />
                  <h3 className="text-sm font-medium text-slate-800">Cảnh báo vắng nhiều</h3>
                </div>

                {highRiskCount > 0 && (
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100 font-medium">
                    {highRiskCount}
                  </span>
                )}
              </div>

              <div className="flex-1 flex flex-col divide-y divide-slate-100 overflow-y-auto max-h-72">
                {warningStudents.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center py-10 text-slate-400 text-sm">
                    Không có sinh viên cảnh báo
                  </div>
                ) : (
                  warningStudents.map(s => {
                    const level = riskLevel(s.ty_le_vang)

                    return (
                      <div key={s.id} className="px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${
                          level === "high"
                            ? "bg-red-50 text-red-600"
                            : "bg-orange-50 text-orange-600"
                        }`}>
                          {initials(s.ho_ten)}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">{s.ho_ten}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{s.ma_sinh_vien}</p>
                        </div>

                        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded ${
                          level === "high"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : "bg-orange-50 text-orange-600 border border-orange-100"
                        }`}>
                          Vắng: {s.so_buoi_vang}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>

              <div className="p-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400">
                  {students.filter(s => (s.ty_le_vang ?? 0) >= 20).length} sinh viên có nguy cơ cao
                </p>
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-medium text-slate-800">Chi tiết chuyên cần sinh viên</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {students.length} sinh viên · sắp xếp theo số buổi vắng
                </p>
              </div>

              <div className="flex items-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Nguy cơ cao ≥ 20%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-400 inline-block" />Cảnh báo ≥ 10%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-[11px] uppercase text-slate-500 bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 font-medium tracking-wider w-10">#</th>
                    <th className="px-5 py-3 font-medium tracking-wider">Sinh viên</th>
                    <th className="px-5 py-3 font-medium tracking-wider text-center">Tổng buổi</th>
                    <th className="px-5 py-3 font-medium tracking-wider text-center">Có mặt</th>
                    <th className="px-5 py-3 font-medium tracking-wider text-center">Vắng</th>
                    <th className="px-5 py-3 font-medium tracking-wider text-center">Trễ</th>
                    <th className="px-5 py-3 font-medium tracking-wider text-center">Tỷ lệ vắng</th>
                    <th className="px-5 py-3 font-medium tracking-wider text-center">Tình trạng</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {tableStudents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                        Chưa có dữ liệu sinh viên
                      </td>
                    </tr>
                  ) : (
                    tableStudents.map((s, idx) => {
                      const level = riskLevel(s.ty_le_vang)
                      const vRate = Number(s.ty_le_vang ?? 0)

                      return (
                        <tr
                          key={s.id}
                          className={`hover:bg-slate-50/50 transition-colors ${
                            level === "high" ? "bg-red-50/40" : ""
                          }`}
                        >
                          <td className="px-5 py-3.5 text-slate-400 text-xs">{idx + 1}</td>

                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${
                                level === "high"
                                  ? "bg-red-100 text-red-600"
                                  : level === "mid"
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-slate-100 text-slate-600"
                              }`}>
                                {initials(s.ho_ten)}
                              </div>

                              <div>
                                <p className="font-medium text-slate-800 leading-tight">{s.ho_ten}</p>
                                <p className="text-[11px] text-slate-400 font-mono">{s.ma_sinh_vien}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-center font-medium text-slate-700">{s.tong_buoi}</td>
                          <td className="px-5 py-3.5 text-center font-medium text-emerald-600">{s.so_buoi_co_mat}</td>

                          <td className="px-5 py-3.5 text-center">
                            <span className={`font-medium ${
                              level === "high"
                                ? "text-red-600"
                                : level === "mid"
                                  ? "text-orange-500"
                                  : "text-slate-700"
                            }`}>
                              {s.so_buoi_vang}
                            </span>
                          </td>

                          <td className="px-5 py-3.5 text-center text-amber-600 font-medium">{s.so_buoi_tre}</td>

                          <td className="px-5 py-3.5">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    level === "high"
                                      ? "bg-red-500"
                                      : level === "mid"
                                        ? "bg-orange-400"
                                        : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${Math.min(vRate, 100)}%` }}
                                />
                              </div>

                              <span className={`text-xs font-medium w-10 ${
                                level === "high"
                                  ? "text-red-600"
                                  : level === "mid"
                                    ? "text-orange-500"
                                    : "text-slate-600"
                              }`}>
                                {vRate.toFixed(1)}%
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-3.5 text-center">
                            <RiskBadge level={level} />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}