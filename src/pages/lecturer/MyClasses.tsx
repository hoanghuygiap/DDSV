import { useState, useEffect } from "react"
import { Search, BookOpen, ExternalLink, Loader2, MapPin } from "lucide-react"
import { Link } from "react-router-dom"
import { LecturerService } from "@/services/lecturer.service"
import { useAuth } from "@/contexts/AuthContext"

interface CourseClass {
  id: number
  ma_lop: string
  ma_hoc_phan: string
  ten_hoc_phan: string
  so_tin_chi: number
  ten_ky: string
  bat_dau: string
  ket_thuc: string
  tong_buoi: number
  so_sinh_vien?: number
}

interface ScheduleItem {
  buoi_hoc_id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  trang_thai: string
  ma_hoc_phan: string
  ten_hoc_phan: string
  lop_mon_hoc_id: number
  ma_lop: string
  ten_phong: string | null
  ten_ky: string
}

export default function MyClasses() {
  const { user } = useAuth()
  const [classes, setClasses] = useState<CourseClass[]>([])
  const [schedule, setSchedule] = useState<ScheduleItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedKy, setSelectedKy] = useState<string>("")
  const [hasInitializedKy, setHasInitializedKy] = useState(false)

  useEffect(() => {
    if (!user) return
    const fetchClasses = async () => {
      setIsLoading(true)
      setError("")
      try {
        const allLecturers = await LecturerService.getAll()
        const me = allLecturers.find((l) => l.username === user.username)
        if (!me) throw new Error("Không tìm thấy hồ sơ giảng viên liên kết.")

        const [data, schedData] = await Promise.all([
          LecturerService.getCourseClasses(me.id),
          LecturerService.getSchedule(me.id)
        ])

        setClasses(data ?? [])
        setSchedule(schedData ?? [])
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách lớp học.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchClasses()
  }, [user])

  const semesters = [...new Set(classes.map(c => c.ten_ky))].sort()

  useEffect(() => {
    if (semesters.length > 0 && !hasInitializedKy) {
      setSelectedKy(semesters[semesters.length - 1] || "")
      setHasInitializedKy(true)
    }
  }, [semesters, hasInitializedKy])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredClasses = classes.filter(cls => {
    const matchSearch = cls.ma_lop.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.ten_hoc_phan.toLowerCase().includes(searchQuery.toLowerCase())
    const matchKy = selectedKy ? cls.ten_ky === selectedKy : true
    return matchSearch && matchKy
  })

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedKy])

  // Pagination logic
  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage)
  const paginatedClasses = filteredClasses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // Grouping Helpers
  const getScheduleSummary = (lopMonHocId: number) => {
    const classSessions = schedule.filter(s => s.lop_mon_hoc_id === lopMonHocId)
    if (classSessions.length === 0) return "Chưa xếp lịch"

    const days = new Set<number>()
    classSessions.forEach(s => {
      const d = new Date(s.ngay_hoc).getDay()
      days.add(d === 0 ? 8 : d + 1)
    })

    const dayLabels = Array.from(days).sort().map(d => d === 8 ? "CN" : `T${d}`)
    const firstSession = classSessions[0]

    const gioBatDau = firstSession.gio_bat_dau.slice(0, 5)
    const gioKetThuc = firstSession.gio_ket_thuc.slice(0, 5)

    return `${dayLabels.join(", ")} (${gioBatDau} - ${gioKetThuc})`
  }

  const getRooms = (lopMonHocId: number) => {
    const classSessions = schedule.filter(s => s.lop_mon_hoc_id === lopMonHocId)
    const rooms = new Set<string>()
    classSessions.forEach(s => {
      if (s.ten_phong) rooms.add(s.ten_phong)
    })
    if (rooms.size === 0) return "Chưa xếp phòng"
    return Array.from(rooms).join(", ")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={32} className="animate-spin text-slate-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-sm text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5f] tracking-tight">
            Danh sách Lớp học
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Quản lý các lớp học phần bạn đang phụ trách
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Tìm mã lớp, tên môn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc] w-full md:w-64"
            />
          </div>
          <select
            value={selectedKy}
            onChange={(e) => setSelectedKy(e.target.value)}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc]"
          >
            <option value="">Tất cả học kỳ</option>
            {semesters.map(ky => (
              <option key={ky} value={ky}>{ky}</option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE/LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {filteredClasses.length === 0 ? (
          <div className="text-center py-16 text-sm text-slate-400 flex flex-col items-center gap-2">
            <BookOpen size={48} className="text-slate-200 mb-2" />
            <p>Bạn chưa được gán lớp môn học nào hoặc không có dữ liệu.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Lớp / Học phần</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Học kỳ</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Thời gian</th>
                  <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedClasses.map((cls) => (
                  <tr key={cls.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen size={20} />
                        </div>
                        <div>
                          <Link to={`/dashboard/my-classes/${cls.id}`} className="font-bold text-[#1a3a5f] hover:text-[#00a8cc] transition-colors">
                            {cls.ten_hoc_phan}
                          </Link>
                          <p className="text-sm text-slate-500 font-medium">{cls.ma_lop} • {cls.so_tin_chi} TC</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-semibold text-slate-700">{cls.ten_ky}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1 text-sm text-slate-700 font-medium">
                        <span>{getScheduleSummary(cls.id)}</span>
                        <div className="flex items-center gap-1 text-xs text-slate-500 font-normal">
                          <MapPin size={12} />
                          {getRooms(cls.id) !== "Chưa xếp phòng" ? "Phòng " : ""}{getRooms(cls.id)}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/dashboard/my-classes/${cls.id}`} className="p-2 text-slate-400 hover:text-[#00a8cc] hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger" title="Xem chi tiết">
                          <ExternalLink size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredClasses.length > 0 && (
          <div className="p-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-500 flex justify-between items-center">
            <span>
              Hiển thị {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredClasses.length)} trong tổng số {filteredClasses.length} lớp học
            </span>
            {totalPages > 1 && (
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors"
                >
                  Trước
                </button>

                {Array.from({ length: totalPages }).map((_, docIdx) => {
                  const page = docIdx + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded transition-colors ${currentPage === page
                        ? "border-[#00a8cc] bg-[#00a8cc] text-white font-medium"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                    >
                      {page}
                    </button>
                  )
                })}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

