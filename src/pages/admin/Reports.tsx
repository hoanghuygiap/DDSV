import { useEffect, useState } from "react"
import { Download, Loader2, Users, CalendarCheck, AlertTriangle, TrendingUp } from "lucide-react"
import api from "@/api/axios"

interface Summary {
    totalStudents:   number
    sessionsToday:   number
    activeSessions:  number
    attendanceRate:  number
    warningStudents: number
}

interface MonthPoint {
    month:   string
    total:   number
    present: number
    rate:    number
}

interface WarningClass {
    id:          number
    code:        string
    name:        string
    className:   string
    absentCount: number
    absenceRate: number
}

interface ClassAttendance {
    id:              number
    code:            string
    name:            string
    lecturer:        string
    className:       string
    totalAttendance: number
    absentCount:     number
    absenceRate:     number
    status:          "NORMAL" | "WATCHING" | "HIGH_RISK"
}

interface OverviewData {
    summary:         Summary
    monthlyTrend:    MonthPoint[]
    warningClasses:  WarningClass[]
    classAttendance: ClassAttendance[]
}

const VI_MONTHS: Record<string, string> = {
    "01": "Th.1", "02": "Th.2", "03": "Th.3",
    "04": "Th.4", "05": "Th.5", "06": "Th.6",
    "07": "Th.7", "08": "Th.8", "09": "Th.9",
    "10": "Th.10", "11": "Th.11", "12": "Th.12"
}

function monthLabel(ym: string) {
    const [, m] = ym.split("-")
    return VI_MONTHS[m] ?? ym
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case "NORMAL":
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Bình thường
                </span>
            )
        case "HIGH_RISK":
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 border border-red-100 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Nguy cơ cao
                </span>
            )
        case "WATCHING":
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />Theo dõi
                </span>
            )
        default:
            return null
    }
}

export default function ReportsPage() {
    const [data, setData]       = useState<OverviewData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState("")

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        api.get("/reports/overview")
            .then(res => {
                if (!cancelled) setData(res.data.data)
            })
            .catch(() => {
                if (!cancelled) setError("Không thể tải dữ liệu báo cáo.")
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })
        return () => { cancelled = true }
    }, [])

    if (loading) {
        return (
            <div className="flex flex-col w-full pb-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Phân tích dữ liệu học thuật</h1>
                        <p className="text-sm text-slate-500 mt-1">Dữ liệu tổng hợp từ các lớp học toàn trường.</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
                    <Loader2 size={24} className="animate-spin" />
                    <span className="text-sm font-medium">Đang tải dữ liệu...</span>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="flex flex-col w-full pb-10">
                <div className="flex items-center justify-center h-64 text-red-500 text-sm font-medium">
                    {error || "Có lỗi xảy ra."}
                </div>
            </div>
        )
    }

    const { summary, monthlyTrend, warningClasses, classAttendance } = data
    const maxRate = monthlyTrend.length ? Math.max(...monthlyTrend.map(m => m.rate), 1) : 100
    const chartMax = Math.min(Math.ceil(maxRate / 10) * 10 + 10, 100)

    return (
        <div className="flex flex-col w-full pb-10">

            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Phân tích dữ liệu học thuật</h1>
                    <p className="text-sm text-slate-500 mt-1">Dữ liệu tổng hợp từ các lớp học toàn trường.</p>
                </div>
            </div>

            {/* TOP 4 STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tổng sinh viên</p>
                        <div className="p-2 rounded-lg bg-[#1e325c] text-white">
                            <Users size={18} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">
                        {summary.totalStudents.toLocaleString("vi-VN")}
                    </h3>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tỷ lệ chuyên cần</p>
                        <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                            <TrendingUp size={18} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-[#007082]">{summary.attendanceRate}%</h3>
                    <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#38bdf8] h-full rounded-full transition-all" style={{ width: `${summary.attendanceRate}%` }} />
                    </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Buổi học hôm nay</p>
                        <div className="p-2 rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
                            <CalendarCheck size={18} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-slate-800">{summary.sessionsToday}</h3>
                    <p className="text-xs text-slate-500 mt-2">
                        {summary.activeSessions > 0
                            ? <span className="text-emerald-600 font-semibold">● {summary.activeSessions} đang điểm danh</span>
                            : "Chưa có buổi nào mở điểm danh"}
                    </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute -right-4 -bottom-4 text-amber-50 opacity-60 pointer-events-none">
                        <AlertTriangle size={90} strokeWidth={1} />
                    </div>
                    <div className="flex justify-between items-start mb-3 relative z-10">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sinh viên cảnh báo</p>
                        <div className="p-2 rounded-lg bg-red-50 text-red-500 border border-red-100">
                            <AlertTriangle size={18} strokeWidth={2.5} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-red-600 relative z-10">
                        {summary.warningStudents.toLocaleString("vi-VN")}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 relative z-10">Vắng trên 20% số buổi</p>
                </div>
            </div>

            {/* MIDDLE 2 COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                {/* Monthly Trend Bar Chart */}
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800 text-lg">Xu hướng chuyên cần 6 tháng gần nhất</h3>
                        <p className="text-sm text-slate-500 mt-1">Tỷ lệ có mặt theo từng tháng</p>
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
                                    <div
                                        key={m.month}
                                        className="relative z-10 flex flex-col items-center gap-1 group"
                                        style={{ minWidth: 36 }}
                                    >
                                        <span className="absolute -top-5 text-[10px] font-bold text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            {m.rate}%
                                        </span>
                                        <div
                                            className="w-8 md:w-10 lg:w-12 rounded-t-sm transition-all"
                                            style={{
                                                height: `${(m.rate / chartMax) * 170}px`,
                                                backgroundColor: m.rate >= 90 ? "#007082" : m.rate >= 75 ? "#1e325c" : "#f59e0b"
                                            }}
                                            title={`${monthLabel(m.month)} ${m.month.split("-")[0]}: ${m.rate}%`}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-around pt-3 text-[10px] sm:text-xs font-semibold text-slate-500">
                                {monthlyTrend.map(m => (
                                    <span key={m.month} className="w-8 md:w-10 lg:w-12 text-center">
                                        {monthLabel(m.month)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Warning Classes */}
                <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-5">
                        <h3 className="font-bold text-slate-800 text-lg">Cảnh báo tỷ lệ vắng</h3>
                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Top 5</span>
                    </div>
                    {warningClasses.length === 0 ? (
                        <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                            Không có lớp cảnh báo
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 flex-1">
                            {warningClasses.map(item => (
                                <div key={item.id} className="flex justify-between items-start group">
                                    <div className="flex-1 min-w-0 pr-2">
                                        <h4 className="font-bold text-slate-800 text-sm group-hover:text-[#007082] transition-colors truncate">
                                            {item.code} – {item.name}
                                        </h4>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">Lớp: {item.className}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <span className="font-bold text-red-600">{item.absenceRate}%</span>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Vắng</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* DETAIL TABLE */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 className="font-bold text-slate-800 text-lg">Chi tiết chuyên cần theo lớp</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Sắp xếp theo tỷ lệ vắng cao nhất</p>
                    </div>
                    <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-md px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                        <Download size={16} />
                        <span>Xuất báo cáo</span>
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="text-xs uppercase text-slate-500 bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-5 py-4 font-bold tracking-wider">Mã lớp</th>
                                <th className="px-5 py-4 font-bold tracking-wider">Môn học</th>
                                <th className="px-5 py-4 font-bold tracking-wider">Giảng viên</th>
                                <th className="px-5 py-4 font-bold tracking-wider text-right">Tổng lượt</th>
                                <th className="px-5 py-4 font-bold tracking-wider text-right">Vắng</th>
                                <th className="px-5 py-4 font-bold tracking-wider text-right">Tỷ lệ vắng</th>
                                <th className="px-5 py-4 font-bold tracking-wider text-center">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {classAttendance.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">
                                        Chưa có dữ liệu điểm danh
                                    </td>
                                </tr>
                            ) : (
                                classAttendance.map(row => (
                                    <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-5 py-4 font-bold text-slate-700 whitespace-nowrap">{row.className}</td>
                                        <td className="px-5 py-4 font-medium text-slate-800 max-w-[200px]">
                                            <div className="truncate" title={row.name}>{row.name}</div>
                                            <div className="text-xs text-slate-400 font-normal mt-0.5">{row.code}</div>
                                        </td>
                                        <td className="px-5 py-4 font-medium text-slate-600 whitespace-nowrap">{row.lecturer}</td>
                                        <td className="px-5 py-4 text-right font-medium">{row.totalAttendance.toLocaleString("vi-VN")}</td>
                                        <td className="px-5 py-4 text-right font-medium text-red-500">{row.absentCount.toLocaleString("vi-VN")}</td>
                                        <td className="px-5 py-4 text-right">
                                            <span className={`font-bold ${row.absenceRate >= 25 ? "text-red-600" : row.absenceRate >= 15 ? "text-amber-600" : "text-slate-600"}`}>
                                                {row.absenceRate}%
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex justify-center">{getStatusBadge(row.status)}</div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500">
                        Hiển thị {classAttendance.length} lớp
                    </span>
                    <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />Nguy cơ cao ≥ 25%
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />Theo dõi ≥ 15%
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />Bình thường
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
