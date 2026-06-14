// import { useEffect, useMemo, useState } from "react"
// import { useNavigate, useParams } from "react-router-dom"
// import {
//   ArrowLeft,
//   BookOpen,
//   Users,
//   CalendarDays,
//   CheckCircle2,
//   XCircle,
//   Clock3,
//   Loader2,
// } from "lucide-react"
// import api from "@/api/axios"

// interface Student {
//   id: number
//   ma_sinh_vien: string
//   ho_ten: string
//   email?: string
//   ten_lop?: string
// }

// interface Session {
//   id: number
//   ngay_hoc: string
//   gio_bat_dau: string
//   gio_ket_thuc: string
//   trang_thai: string
//   so_co_mat?: number
//   so_tre?: number
//   so_vang?: number
//   tong_sinh_vien?: number
// }

// interface CourseClass {
//   id: number
//   ma_lop: string
//   ten_hoc_phan?: string
//   ma_hoc_phan?: string
//   ten_giang_vien?: string
//   ma_giang_vien?: string
//   ten_ky?: string
// }

// export default function AdminClassDetailPage() {
//   const { id } = useParams()
//   const navigate = useNavigate()

//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState("")
//   const [courseClass, setCourseClass] = useState<CourseClass | null>(null)
//   const [students, setStudents] = useState<Student[]>([])
//   const [sessions, setSessions] = useState<Session[]>([])

//   useEffect(() => {
//     fetchData()
//   }, [id])

//   async function fetchData() {
//     if (!id) return

//     setLoading(true)
//     setError("")

//     try {
//       const [classRes, studentRes, sessionRes] = await Promise.allSettled([
//         api.get(`/course-classes/${id}`),
//         api.get(`/course-classes/${id}/students`),
//         api.get(`/sessions`, {
//           params: {
//             course_class_id: id,
//             limit: 100,
//           },
//         }),
//       ])

//       if (classRes.status === "fulfilled") {
//         setCourseClass(classRes.value.data?.data ?? classRes.value.data)
//       }

//       if (studentRes.status === "fulfilled") {
//         setStudents(studentRes.value.data?.data ?? [])
//       }

//       if (sessionRes.status === "fulfilled") {
//         setSessions(sessionRes.value.data?.data ?? [])
//       }
//     } catch {
//       setError("Không thể tải chi tiết lớp môn học.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const studiedSessions = useMemo(() => {
//     return sessions.filter(
//       (s) =>
//         s.trang_thai === "da_ket_thuc" ||
//         s.trang_thai === "dang_dien_ra" ||
//         s.trang_thai === "completed"
//     )
//   }, [sessions])

//   const upcomingSessions = useMemo(() => {
//     return sessions.filter(
//       (s) =>
//         s.trang_thai === "sap_dien_ra" ||
//         s.trang_thai === "upcoming"
//     )
//   }, [sessions])

//   const totalStudents = students.length
//   const totalStudied = studiedSessions.length
//   const totalUpcoming = upcomingSessions.length

//   const totalPresent = sessions.reduce(
//     (sum, s) => sum + Number(s.so_co_mat || 0) + Number(s.so_tre || 0),
//     0
//   )

//   const totalExpected = totalStudents * totalStudied

//   const attendanceRate =
//     totalExpected > 0 ? Math.round((totalPresent / totalExpected) * 100) : 0

//   function formatDate(date: string) {
//     if (!date) return "—"
//     return new Date(date).toLocaleDateString("vi-VN")
//   }

//   return (
//     <div className="flex flex-col w-full pb-10">
//       <div className="mb-6 flex items-center gap-3">
//         <button
//           onClick={() => navigate("/dashboard/classes")}
//           className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50"
//         >
//           <ArrowLeft size={18} />
//         </button>

//         <div>
//           <h1 className="text-[22px] font-medium text-[#185FA5]">
//             Chi tiết lớp môn học
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Xem sinh viên, số buổi đã học và lịch sử điểm danh.
//           </p>
//         </div>
//       </div>

//       {loading ? (
//         <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
//           <Loader2 className="animate-spin" size={32} />
//           <span>Đang tải dữ liệu...</span>
//         </div>
//       ) : error ? (
//         <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100">
//           {error}
//         </div>
//       ) : (
//         <>
//           <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-6">
//             <h2 className="text-lg font-medium text-slate-800">
//               {courseClass?.ten_hoc_phan || "—"}
//             </h2>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
//               <Info label="Mã lớp" value={courseClass?.ma_lop} />
//               <Info label="Mã học phần" value={courseClass?.ma_hoc_phan} />
//               <Info label="Giảng viên" value={courseClass?.ten_giang_vien} />
//               <Info label="Học kỳ" value={courseClass?.ten_ky} />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//             <StatCard
//               title="Tổng sinh viên"
//               value={totalStudents}
//               icon={<Users size={20} />}
//             />
//             <StatCard
//               title="Số buổi đã học"
//               value={totalStudied}
//               icon={<CheckCircle2 size={20} />}
//             />
//             <StatCard
//               title="Số buổi chưa học"
//               value={totalUpcoming}
//               icon={<CalendarDays size={20} />}
//             />
//             <StatCard
//               title="Chuyên cần TB"
//               value={`${attendanceRate}%`}
//               icon={<BookOpen size={20} />}
//             />
//           </div>

//           <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//             <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
//               <div className="px-5 py-4 border-b border-slate-100">
//                 <h3 className="font-medium text-slate-800">
//                   Danh sách sinh viên
//                 </h3>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-slate-100 text-xs uppercase text-slate-500">
//                     <tr>
//                       <th className="px-4 py-3 text-left">Mã SV</th>
//                       <th className="px-4 py-3 text-left">Họ tên</th>
//                       <th className="px-4 py-3 text-left">Lớp</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {students.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={3}
//                           className="py-10 text-center text-slate-400"
//                         >
//                           Chưa có sinh viên trong lớp.
//                         </td>
//                       </tr>
//                     ) : (
//                       students.map((s) => (
//                         <tr key={s.id} className="hover:bg-slate-50">
//                           <td className="px-4 py-3 font-mono text-[#185FA5]">
//                             {s.ma_sinh_vien}
//                           </td>
//                           <td className="px-4 py-3 font-medium text-slate-700">
//                             {s.ho_ten}
//                           </td>
//                           <td className="px-4 py-3 text-slate-500">
//                             {s.ten_lop || "—"}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
//               <div className="px-5 py-4 border-b border-slate-100">
//                 <h3 className="font-medium text-slate-800">
//                   Lịch sử buổi học / điểm danh
//                 </h3>
//               </div>

//               <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead className="bg-slate-100 text-xs uppercase text-slate-500">
//                     <tr>
//                       <th className="px-4 py-3 text-left">Ngày</th>
//                       <th className="px-4 py-3 text-left">Giờ</th>
//                       <th className="px-4 py-3 text-center">Có mặt</th>
//                       <th className="px-4 py-3 text-center">Trễ</th>
//                       <th className="px-4 py-3 text-center">Vắng</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {sessions.length === 0 ? (
//                       <tr>
//                         <td
//                           colSpan={5}
//                           className="py-10 text-center text-slate-400"
//                         >
//                           Chưa có buổi học.
//                         </td>
//                       </tr>
//                     ) : (
//                       sessions.map((s) => (
//                         <tr key={s.id} className="hover:bg-slate-50">
//                           <td className="px-4 py-3 text-slate-700">
//                             {formatDate(s.ngay_hoc)}
//                           </td>
//                           <td className="px-4 py-3 text-slate-500">
//                             <span className="inline-flex items-center gap-1">
//                               <Clock3 size={13} />
//                               {s.gio_bat_dau} - {s.gio_ket_thuc}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 text-center text-green-600 font-medium">
//                             {s.so_co_mat ?? 0}
//                           </td>
//                           <td className="px-4 py-3 text-center text-yellow-600 font-medium">
//                             {s.so_tre ?? 0}
//                           </td>
//                           <td className="px-4 py-3 text-center text-red-600 font-medium">
//                             {s.so_vang ?? 0}
//                           </td>
//                         </tr>
//                       ))
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   )
// }

// function Info({
//   label,
//   value,
// }: {
//   label: string
//   value?: string | number | null
// }) {
//   return (
//     <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
//       <p className="text-xs text-slate-400">{label}</p>
//       <p className="text-sm font-medium text-slate-700 mt-1">
//         {value || "—"}
//       </p>
//     </div>
//   )
// }

// function StatCard({
//   title,
//   value,
//   icon,
// }: {
//   title: string
//   value: string | number
//   icon: React.ReactNode
// }) {
//   return (
//     <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
//       <div className="flex items-start justify-between">
//         <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
//           {title}
//         </p>
//         <div className="p-2 rounded-md bg-[#185FA5] text-white">
//           {icon}
//         </div>
//       </div>
//       <h3 className="text-3xl font-medium text-slate-800 mt-4">{value}</h3>
//     </div>
//   )
// }


import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  BookOpen,
  Users,
  CalendarDays,
  CheckCircle2,
  Loader2,
  Clock3,
} from "lucide-react"
import api from "@/api/axios"

interface Student {
  id: number
  ma_sinh_vien: string
  ho_ten: string
  email?: string
  ten_lop?: string
  so_buoi_co_mat?: number
  so_buoi_tre?: number
  so_buoi_vang?: number
  so_buoi_co_phep?: number
  ty_le_vang?: number
}

interface Session {
  id: number
  ngay_hoc: string
  gio_bat_dau: string
  gio_ket_thuc: string
  trang_thai: string
  so_co_mat?: number
  so_tre?: number
  so_vang?: number
  so_co_phep?: number
}

interface CourseClass {
  id: number
  ma_lop: string
  ten_hoc_phan?: string
  ma_hoc_phan?: string
  ten_giang_vien?: string
  ma_giang_vien?: string
  ten_ky?: string
}

interface Summary {
  tong_sinh_vien: number
  tong_buoi: number
  so_buoi_da_hoc: number
  so_buoi_chua_hoc: number
  ty_le_chuyen_can: number
}

export default function AdminClassDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [courseClass, setCourseClass] = useState<CourseClass | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [summary, setSummary] = useState<Summary>({
    tong_sinh_vien: 0,
    tong_buoi: 0,
    so_buoi_da_hoc: 0,
    so_buoi_chua_hoc: 0,
    ty_le_chuyen_can: 0,
  })

  useEffect(() => {
    fetchData()
  }, [id])

  async function fetchData() {
    if (!id) return

    setLoading(true)
    setError("")

    try {
      const res = await api.get(`/course-classes/${id}/overview`)
      const data = res.data?.data

      setCourseClass(data?.classInfo ?? null)
      setStudents(data?.students ?? [])
      setSessions(data?.sessions ?? [])
      setSummary(
        data?.summary ?? {
          tong_sinh_vien: 0,
          tong_buoi: 0,
          so_buoi_da_hoc: 0,
          so_buoi_chua_hoc: 0,
          ty_le_chuyen_can: 0,
        }
      )
    } catch {
      setError("Không thể tải chi tiết lớp môn học.")
    } finally {
      setLoading(false)
    }
  }

  const sortedSessions = useMemo(() => {
    return [...sessions].sort((a, b) => {
      const da = new Date(a.ngay_hoc).getTime()
      const db = new Date(b.ngay_hoc).getTime()
      return db - da
    })
  }, [sessions])

  function formatDate(date: string) {
    if (!date) return "—"
    return new Date(date).toLocaleDateString("vi-VN")
  }

  function formatTime(time?: string) {
    if (!time) return "—"
    return time.slice(0, 5)
  }

  return (
    <div className="flex flex-col w-full pb-10">
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/classes")}
          className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors"
          title="Quay lại"
        >
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-[22px] font-medium text-[#185FA5]">
            Chi tiết lớp môn học
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Xem sinh viên, số buổi đã học và lịch sử điểm danh.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
          <Loader2 className="animate-spin" size={32} />
          <span>Đang tải dữ liệu...</span>
        </div>
      ) : error ? (
        <div className="p-4 rounded-lg bg-red-50 text-red-600 border border-red-100">
          {error}
        </div>
      ) : (
        <>
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-6">
            <h2 className="text-lg font-medium text-slate-800">
              {courseClass?.ten_hoc_phan || "—"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 text-sm">
              <Info label="Mã lớp" value={courseClass?.ma_lop} />
              <Info label="Mã học phần" value={courseClass?.ma_hoc_phan} />
              <Info label="Giảng viên" value={courseClass?.ten_giang_vien} />
              <Info label="Học kỳ" value={courseClass?.ten_ky} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Tổng sinh viên"
              value={summary.tong_sinh_vien}
              icon={<Users size={20} />}
            />

            <StatCard
              title="Số buổi đã học"
              value={summary.so_buoi_da_hoc}
              icon={<CheckCircle2 size={20} />}
            />

            <StatCard
              title="Số buổi chưa học"
              value={summary.so_buoi_chua_hoc}
              icon={<CalendarDays size={20} />}
            />

            <StatCard
              title="Chuyên cần TB"
              value={`${summary.ty_le_chuyen_can}%`}
              icon={<BookOpen size={20} />}
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-medium text-slate-800">
                  Danh sách sinh viên
                </h3>
              </div>

              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left">Mã SV</th>
                      <th className="px-4 py-3 text-left">Họ tên</th>
                      <th className="px-4 py-3 text-left">Lớp</th>
                      <th className="px-4 py-3 text-center">Có mặt</th>
                      <th className="px-4 py-3 text-center">Trễ</th>
                      <th className="px-4 py-3 text-center">Vắng</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {students.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-slate-400"
                        >
                          Chưa có sinh viên trong lớp.
                        </td>
                      </tr>
                    ) : (
                      students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-mono text-[#185FA5]">
                            {s.ma_sinh_vien}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {s.ho_ten}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            {s.ten_lop || "—"}
                          </td>
                          <td className="px-4 py-3 text-center text-green-600 font-medium">
                            {s.so_buoi_co_mat ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center text-yellow-600 font-medium">
                            {s.so_buoi_tre ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center text-red-600 font-medium">
                            {s.so_buoi_vang ?? 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="font-medium text-slate-800">
                  Lịch sử buổi học / điểm danh
                </h3>
              </div>

              <div className="overflow-x-auto max-h-[520px]">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 text-xs uppercase text-slate-500 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left">Ngày</th>
                      <th className="px-4 py-3 text-left">Giờ</th>
                      <th className="px-4 py-3 text-center">Có mặt</th>
                      <th className="px-4 py-3 text-center">Trễ</th>
                      <th className="px-4 py-3 text-center">Vắng</th>
                      <th className="px-4 py-3 text-center">Có phép</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {sortedSessions.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-10 text-center text-slate-400"
                        >
                          Chưa có buổi học.
                        </td>
                      </tr>
                    ) : (
                      sortedSessions.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-700">
                            {formatDate(s.ngay_hoc)}
                          </td>
                          <td className="px-4 py-3 text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={13} />
                              {formatTime(s.gio_bat_dau)} -{" "}
                              {formatTime(s.gio_ket_thuc)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center text-green-600 font-medium">
                            {s.so_co_mat ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center text-yellow-600 font-medium">
                            {s.so_tre ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center text-red-600 font-medium">
                            {s.so_vang ?? 0}
                          </td>
                          <td className="px-4 py-3 text-center text-blue-600 font-medium">
                            {s.so_co_phep ?? 0}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Info({
  label,
  value,
}: {
  label: string
  value?: string | number | null
}) {
  return (
    <div className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-3">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-700 mt-1">
        {value || "—"}
      </p>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </p>
        <div className="p-2 rounded-md bg-[#185FA5] text-white">{icon}</div>
      </div>

      <h3 className="text-3xl font-medium text-slate-800 mt-4">{value}</h3>
    </div>
  )
}