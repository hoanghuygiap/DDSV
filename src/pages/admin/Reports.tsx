import { useEffect, useState } from "react"
import { Download, Loader2, Users, CalendarCheck, AlertTriangle, TrendingUp } from "lucide-react"
import api from "@/api/axios"

interface ClassReport {
    lop_mon_hoc_id: number
    ma_lop: string
    ten_hoc_phan: string
    tong_luot_diem_danh: number
    co_mat: number
    vang: number
    tre: number
    co_phep: number
    ti_le_co_mat: number
}

interface Warning {
    id: number
    student_id: number
    course_class_id?: number
    type: string
    content: string
    processed: boolean | number
}

interface WeeklyRow {
    sinh_vien_id: number
    lop_mon_hoc_id: number
    tuan_hoc: number
    ngay_dau_tuan: string
    tong_buoi: number
    co_mat: number
    vang: number
    ti_le_co_mat: number
}

const STATUS_MAP = {
    HIGH_RISK: { label: "Nguy cơ cao", cls: "bg-red-50 text-red-600 border border-red-200" },
    WATCHING:  { label: "Theo dõi",   cls: "bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]" },
    NORMAL:    { label: "Bình thường",cls: "bg-[#dcfce7] text-[#15803d] border border-[#bbf7d0]" },
}

function getStatus(absenceRate: number): "NORMAL" | "WATCHING" | "HIGH_RISK" {
    if (absenceRate >= 25) return "HIGH_RISK"
    if (absenceRate >= 15) return "WATCHING"
    return "NORMAL"
}

function StatusBadge({ rate }: { rate: number }) {
    const key = getStatus(rate)
    const s = STATUS_MAP[key]
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${s.cls}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {s.label}
        </span>
    )
}

// Nhóm dữ liệu weekly theo tháng để vẽ biểu đồ
function groupByMonth(rows: WeeklyRow[]) {
    const map: Record<string, { total: number; co_mat: number }> = {}
    rows.forEach(r => {
        const month = r.ngay_dau_tuan?.slice(0, 7) ?? ""
        if (!month) return
        if (!map[month]) map[month] = { total: 0, co_mat: 0 }
        map[month].total  += r.tong_buoi
        map[month].co_mat += r.co_mat
    })
    return Object.entries(map)
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6)
        .map(([month, v]) => ({
            month,
            total: v.total,
            present: v.co_mat,
            rate: v.total > 0 ? Math.round(v.co_mat / v.total * 1000) / 10 : 0,
        }))
}

const VI_MONTHS: Record<string, string> = {
    "01":"Th.1","02":"Th.2","03":"Th.3","04":"Th.4","05":"Th.5","06":"Th.6",
    "07":"Th.7","08":"Th.8","09":"Th.9","10":"Th.10","11":"Th.11","12":"Th.12",
}
const monthLabel = (ym: string) => VI_MONTHS[ym.split("-")[1]] ?? ym

export default function ReportsPage() {
    const [classData,    setClassData]    = useState<ClassReport[]>([])
    const [warnings,     setWarnings]     = useState<Warning[]>([])
    const [totalStudents,setTotalStudents]= useState(0)
    const [monthlyTrend, setMonthlyTrend] = useState<{ month: string; total: number; present: number; rate: number }[]>([])
    const [loading,      setLoading]      = useState(true)

    useEffect(() => {
        let cancelled = false
        setLoading(true)

        Promise.allSettled([
            api.get("/reports/by-course-class"),
            api.get("/warnings"),
            api.get("/students", { params: { page: 1, limit: 1 } }),
            api.get("/reports/weekly-attendance"),
        ])
        .then(([classRes, warnRes, stuRes, weekRes]) => {
            if (cancelled) return
            if (classRes.status === "fulfilled")
                setClassData(classRes.value.data.data ?? [])
            if (warnRes.status === "fulfilled")
                setWarnings(warnRes.value.data.data?.data ?? [])
            if (stuRes.status === "fulfilled")
                setTotalStudents(stuRes.value.data.pagination?.total ?? 0)
            if (weekRes.status === "fulfilled")
                setMonthlyTrend(groupByMonth(weekRes.value.data.data ?? []))
        })
        .finally(() => { if (!cancelled) setLoading(false) })

        return () => { cancelled = true }
    }, [])

    // Tính toán summary từ dữ liệu có sẵn (Number() để tránh string concat từ MySQL)
    const totalAttendance = classData.reduce((s, r) => s + (Number(r.tong_luot_diem_danh) || 0), 0)
    const totalPresent    = classData.reduce((s, r) => s + (Number(r.co_mat) || 0), 0)
    const attendanceRate  = totalAttendance > 0
        ? Math.round(totalPresent / totalAttendance * 1000) / 10
        : 0
    const warningCount = warnings.filter(w => !w.processed).length

    const warningClasses = classData
        .filter(r => Number(r.tong_luot_diem_danh) > 0)
        .map(r => ({
            id:           r.lop_mon_hoc_id,
            ma_lop:       r.ma_lop,
            ten_hoc_phan: r.ten_hoc_phan,
            absenceRate:  Math.round((Number(r.vang) / Number(r.tong_luot_diem_danh)) * 1000) / 10,
            absentCount:  Number(r.vang),
        }))
        .sort((a, b) => b.absenceRate - a.absenceRate)
        .slice(0, 5)

    const chartMax = monthlyTrend.length
        ? Math.min(Math.ceil(Math.max(...monthlyTrend.map(m => m.rate), 1) / 10) * 10 + 10, 100)
        : 100

    const handleExport = () => {
        const token = localStorage.getItem("access_token")
        window.open(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"}/reports/export?token=${token}`, "_blank")
    }

    if (loading) return (
        <div className="flex flex-col w-full pb-10">
            <div className="mb-6">
                <h1 className="text-[22px] font-medium text-[#185FA5]">Phân tích dữ liệu học thuật</h1>
                <p className="text-sm text-slate-500 mt-1">Dữ liệu tổng hợp từ các lớp học toàn trường.</p>
            </div>
            <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
                <Loader2 size={24} className="animate-spin" />
                <span className="text-sm font-medium">Đang tải dữ liệu...</span>
            </div>
        </div>
    )

    return (
        <div className="flex flex-col w-full pb-10">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                <div>
                    <h1 className="text-[22px] font-medium text-[#185FA5]">Phân tích dữ liệu học thuật</h1>
                    <p className="text-sm text-slate-500 mt-1">Dữ liệu tổng hợp từ các lớp học toàn trường.</p>
                </div>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng sinh viên</p>
                        <div className="p-2 rounded-md bg-[#185FA5] text-white"><Users size={18} strokeWidth={2} /></div>
                    </div>
                    <h3 className="text-3xl font-medium text-slate-800">{totalStudents.toLocaleString("vi-VN")}</h3>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tỷ lệ chuyên cần</p>
                        <div className="p-2 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <TrendingUp size={18} strokeWidth={2} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-medium text-[#185FA5]">{attendanceRate.toFixed(1)}%</h3>
                    <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#185FA5] h-full rounded-full" style={{ width: `${attendanceRate}%` }} />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Tổng lớp môn học</p>
                        <div className="p-2 rounded-md bg-sky-50 text-sky-600 border border-sky-100">
                            <CalendarCheck size={18} strokeWidth={2} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-medium text-slate-800">{classData.length}</h3>
                    <p className="text-xs text-slate-500 mt-2">Có dữ liệu điểm danh</p>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-amber-50 opacity-60 pointer-events-none">
                        <AlertTriangle size={90} strokeWidth={1} />
                    </div>
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Cảnh báo vắng</p>
                        <div className="p-2 rounded-md bg-red-50 text-red-500 border border-red-100">
                            <AlertTriangle size={18} strokeWidth={2} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-medium text-red-600 relative z-10">{warningCount.toLocaleString("vi-VN")}</h3>
                    <p className="text-xs text-slate-500 mt-2 relative z-10">Cảnh báo chưa xử lý</p>
                </div>
            </div>

            {/* MIDDLE: Chart + Warning classes */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Monthly Trend */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col">
                    <div className="mb-6">
                        <h3 className="font-medium text-slate-800 text-lg">Xu hướng chuyên cần theo tháng</h3>
                        <p className="text-sm text-slate-500 mt-1">Tỷ lệ có mặt theo từng tháng (6 tháng gần nhất)</p>
                    </div>
                    {monthlyTrend.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                            Chưa có dữ liệu điểm danh
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-end min-h-[240px]">
                            <div className="relative h-48 w-full flex items-end justify-around pb-6 border-b border-slate-100">
                                <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
                                    {[chartMax, Math.round(chartMax * 0.75), Math.round(chartMax * 0.5), Math.round(chartMax * 0.25)].map(v => (
                                        <div key={v} className="flex items-center gap-2">
                                            <span className="text-[10px] text-slate-400 w-7 text-right">{v}%</span>
                                            <div className="flex-1 h-px bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                                {monthlyTrend.map(m => (
                                    <div key={m.month} className="relative z-10 flex flex-col items-center gap-1 group" style={{ minWidth: 36 }}>
                                        <span className="absolute -top-5 text-[10px] font-medium text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {m.rate}%
                                        </span>
                                        <div
                                            className="w-8 md:w-10 lg:w-12 rounded-t-sm transition-all"
                                            style={{
                                                height: `${(m.rate / chartMax) * 170}px`,
                                                backgroundColor: m.rate >= 90 ? "#185FA5" : m.rate >= 75 ? "#16a34a" : "#ea580c"
                                            }}
                                            title={`${monthLabel(m.month)}: ${m.rate}%`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-around pt-3 text-[10px] sm:text-xs font-medium text-slate-500">
                                {monthlyTrend.map(m => (
                                    <span key={m.month} className="w-8 md:w-10 lg:w-12 text-center">{monthLabel(m.month)}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Top 5 lớp vắng cao */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-medium text-slate-800 text-lg">Cảnh báo tỷ lệ vắng</h3>
                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-medium uppercase tracking-wider">Top 5</span>
                    </div>
                    {warningClasses.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Không có lớp cảnh báo</div>
                    ) : (
                        <div className="flex flex-col gap-4 flex-1">
                            {warningClasses.map(item => (
                                <div key={item.id} className="flex justify-between items-start group">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="font-medium text-slate-800 text-sm truncate group-hover:text-[#185FA5]">
                                            {item.ten_hoc_phan}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5">Lớp: {item.ma_lop}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="font-medium text-red-600">{item.absenceRate}%</span>
                                        <p className="text-[10px] font-medium text-slate-400 uppercase">Vắng</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL TABLE */}
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-medium text-slate-800 text-lg">Chi tiết chuyên cần theo lớp</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Sắp xếp theo tỷ lệ vắng cao nhất</p>
                    </div>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        <Download size={16} />
                        <span>Xuất báo cáo</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="text-xs uppercase text-slate-500 bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-4 font-medium tracking-wider">Mã lớp</th>
                                <th className="px-5 py-4 font-medium tracking-wider">Môn học</th>
                                <th className="px-5 py-4 font-medium tracking-wider text-right">Tổng lượt</th>
                                <th className="px-5 py-4 font-medium tracking-wider text-right">Có mặt</th>
                                <th className="px-5 py-4 font-medium tracking-wider text-right">Vắng</th>
                                <th className="px-5 py-4 font-medium tracking-wider text-right">Tỷ lệ vắng</th>
                                <th className="px-5 py-4 font-medium tracking-wider text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {classData.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                                        Chưa có dữ liệu điểm danh
                                    </td>
                                </tr>
                            ) : (
                                [...classData]
                                    .sort((a, b) => {
                                        const ra = Number(a.tong_luot_diem_danh) > 0 ? Number(a.vang) / Number(a.tong_luot_diem_danh) : 0
                                        const rb = Number(b.tong_luot_diem_danh) > 0 ? Number(b.vang) / Number(b.tong_luot_diem_danh) : 0
                                        return rb - ra
                                    })
                                    .map(row => {
                                        const absenceRate = Number(row.tong_luot_diem_danh) > 0
                                            ? Math.round(Number(row.vang) / Number(row.tong_luot_diem_danh) * 1000) / 10
                                            : 0
                                        return (
                                            <tr key={row.lop_mon_hoc_id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-5 py-4 font-medium text-slate-700 whitespace-nowrap font-mono">
                                                    {row.ma_lop}
                                                </td>
                                                <td className="px-5 py-4 font-medium text-slate-800 max-w-[200px]">
                                                    <div className="truncate" title={row.ten_hoc_phan}>{row.ten_hoc_phan}</div>
                                                </td>
                                                <td className="px-5 py-4 text-right font-medium">
                                                    {row.tong_luot_diem_danh.toLocaleString("vi-VN")}
                                                </td>
                                                <td className="px-5 py-4 text-right font-medium text-[#15803d]">
                                                    {row.co_mat.toLocaleString("vi-VN")}
                                                </td>
                                                <td className="px-5 py-4 text-right font-medium text-red-500">
                                                    {row.vang.toLocaleString("vi-VN")}
                                                </td>
                                                <td className="px-5 py-4 text-right">
                                                    <span className={`font-medium ${absenceRate >= 25 ? "text-red-600" : absenceRate >= 15 ? "text-[#ea580c]" : "text-slate-600"}`}>
                                                        {absenceRate}%
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex justify-center">
                                                        <StatusBadge rate={absenceRate} />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">Hiển thị {classData.length} lớp</span>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Nguy cơ cao ≥ 25%</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#ea580c] inline-block" />Theo dõi ≥ 15%</span>
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#15803d] inline-block" />Bình thường</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
