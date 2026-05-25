import { useState, useEffect } from "react"
import { Calendar, Clock, MapPin, Plus, Trash2, Edit2, Loader2, AlertCircle, QrCode } from "lucide-react"
import { Link } from "react-router-dom"
import api from "@/api/axios"
import { useAuth } from "@/contexts/AuthContext"
import { LecturerService } from "@/services/lecturer.service"

interface SessionItem {
    id: number
    buoi_hoc_id: number // Mapped from schedule API (schedule API uses buoi_hoc_id, not id directly usually? Let's check: schedule API returns `buoi_hoc_id`, `ngay_hoc`, `gio_bat_dau`, `gio_ket_thuc`, `trang_thai`, `ten_phong`, `lop_mon_hoc_id`)
    ngay_hoc: string
    gio_bat_dau: string
    gio_ket_thuc: string
    trang_thai: string
    ten_phong: string | null
    phong_hoc_id?: number | null
}

interface RoomItem {
    id: number
    name: string
}

import React from "react"
export default function SessionManager({ classId }: { classId: number }) {
    const { user } = useAuth()
    const [sessions, setSessions] = useState<SessionItem[]>([])
    const [rooms, setRooms] = useState<RoomItem[]>([])
    const [loading, setLoading] = useState(true)

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentSessionId, setCurrentSessionId] = useState<number | null>(null)

    // Form states
    const [formData, setFormData] = useState({
        ngay_hoc: "",
        gio_bat_dau: "",
        gio_ket_thuc: "",
        phong_hoc_id: ""
    })
    const [formError, setFormError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const fetchData = async () => {
        if (!user) return
        setLoading(true)
        try {
            // 1. Fetch Rooms (Ask for limit=100 to get all rooms for the select dropdown)
            const roomsRes = await api.get("/rooms?limit=100")
            // Backend trả về data: { data: [...], pagination: {...} } nên ta cần .data.data.data
            setRooms(roomsRes.data?.data?.data || [])

            // 2. Fetch Lecturer Schedule
            const allLecturers = await LecturerService.getAll()
            const me = allLecturers.find(l => l.username === user.username)
            if (me) {
                const scheduleData = await LecturerService.getSchedule(me.id)
                // Lọc các buổi học của đúng lớp này
                const filtered = scheduleData.filter((s: any) => s.lop_mon_hoc_id === Number(classId))
                setSessions(filtered)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [user, classId])

    const handleOpenCreate = () => {
        setIsEditing(false)
        setFormData({ ngay_hoc: "", gio_bat_dau: "07:00", gio_ket_thuc: "09:30", phong_hoc_id: "" })
        setFormError("")
        setIsModalOpen(true)
    }

    const handleOpenEdit = (session: any) => {
        setIsEditing(true)
        setCurrentSessionId(session.buoi_hoc_id)
        setFormData({
            ngay_hoc: new Date(session.ngay_hoc).toISOString().split('T')[0],
            gio_bat_dau: session.gio_bat_dau.slice(0, 5),
            gio_ket_thuc: session.gio_ket_thuc.slice(0, 5),
            phong_hoc_id: session.phong_hoc_id?.toString() || ""
        })
        setFormError("")
        setIsModalOpen(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm("Bạn có chắc chắn muốn hủy buổi học này?")) return
        try {
            await api.delete(`/sessions/${id}`)
            fetchData()
        } catch (err: any) {
            alert("Lỗi khi hủy buổi học: " + err.message)
        }
    }

    const validateForm = () => {
        if (!formData.ngay_hoc || !formData.gio_bat_dau || !formData.gio_ket_thuc) {
            return "Vui lòng nhập đủ ngày và giờ bắt đầu/kết thúc."
        }

        const start = new Date(`2000-01-01T${formData.gio_bat_dau}`)
        const end = new Date(`2000-01-01T${formData.gio_ket_thuc}`)
        if (end <= start) {
            return "Giờ kết thúc phải lớn hơn Giờ bắt đầu."
        }

        if (formData.phong_hoc_id) {
            const roomExists = rooms.find(r => r.id.toString() === formData.phong_hoc_id)
            if (!roomExists) return "Phòng học không tồn tại."
        }

        return ""
    }

    const handleSubmit = async () => {
        const errorMsg = validateForm()
        if (errorMsg) {
            setFormError(errorMsg)
            return
        }

        setIsSubmitting(true)
        setFormError("")
        try {
            const payload = {
                lop_mon_hoc_id: Number(classId),
                ngay_hoc: formData.ngay_hoc,
                gio_bat_dau: formData.gio_bat_dau,
                gio_ket_thuc: formData.gio_ket_thuc,
                phong_hoc_id: formData.phong_hoc_id ? Number(formData.phong_hoc_id) : null,
            }

            if (isEditing && currentSessionId) {
                await api.put(`/sessions/${currentSessionId}`, payload)
                alert("Cập nhật buổi học thành công!")
            } else {
                await api.post("/sessions", payload)
                alert("Tạo mới buổi học thành công!")
            }
            setIsModalOpen(false)
            fetchData() // Tải lại danh sách
        } catch (err: any) {
            setFormError(err.response?.data?.message || "Có lỗi xảy ra khi lưu.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 size={24} className="animate-spin text-slate-400" />
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[#8b1a1a] text-lg">Quản lý các Buổi học</h3>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 bg-[#8b1a1a] hover:bg-[#6e1414] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                    <Plus size={16} /> Thêm buổi học
                </button>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-xs">
                            <th className="py-3 px-4 font-bold">Ngày học</th>
                            <th className="py-3 px-4 font-bold">Thời gian</th>
                            <th className="py-3 px-4 font-bold">Phòng học</th>
                            <th className="py-3 px-4 font-bold">Trạng thái</th>
                            <th className="py-3 px-4 text-right font-bold">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {sessions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-slate-400">
                                    Chưa có buổi học nào được tạo.
                                </td>
                            </tr>
                        ) : (
                            sessions.map((s, i) => (
                                <tr key={i} className="hover:bg-slate-50">
                                    <td className="py-3 px-4 font-medium text-slate-700">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            {new Date(s.ngay_hoc).toLocaleDateString("vi-VN")}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            {s.gio_bat_dau.slice(0, 5)} - {s.gio_ket_thuc.slice(0, 5)}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4 text-slate-600">
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-slate-400" />
                                            {s.ten_phong || "Chưa xếp"}
                                        </div>
                                    </td>
                                    <td className="py-3 px-4">
                                        {s.trang_thai === 'huy' ? (
                                            <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">Đã Hủy</span>
                                        ) : s.trang_thai === 'da_ket_thuc' ? (
                                            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">Đã kết thúc</span>
                                        ) : (
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Sắp diễn ra</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                to={`/dashboard/qr-attendance?sessionId=${s.buoi_hoc_id}`}
                                                className="p-1.5 text-slate-400 border border-transparent hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-all"
                                                title="Mở Màn hình Quét QR"
                                            >
                                                <QrCode size={16} />
                                            </Link>
                                            <button
                                                onClick={() => handleOpenEdit(s)}
                                                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="Sửa"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s.buoi_hoc_id)}
                                                disabled={s.trang_thai === 'huy'}
                                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                title="Hủy buổi học"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="text-lg font-bold text-[#1a3a5f]">
                                {isEditing ? "Sửa thông tin buổi học" : "Tạo buổi học mới"}
                            </h2>
                        </div>

                        <div className="p-6 flex flex-col gap-4">
                            {formError && (
                                <div className="flex flex-row items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                                    <AlertCircle size={16} /> {formError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Ngày học</label>
                                <input
                                    type="date"
                                    value={formData.ngay_hoc}
                                    onChange={e => setFormData({ ...formData, ngay_hoc: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8b1a1a] text-sm"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Giờ bắt đầu</label>
                                    <input
                                        type="time"
                                        value={formData.gio_bat_dau}
                                        onChange={e => setFormData({ ...formData, gio_bat_dau: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8b1a1a] text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Giờ kết thúc</label>
                                    <input
                                        type="time"
                                        value={formData.gio_ket_thuc}
                                        onChange={e => setFormData({ ...formData, gio_ket_thuc: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8b1a1a] text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1">Phòng học (Không bắt buộc)</label>
                                <select
                                    value={formData.phong_hoc_id}
                                    onChange={e => setFormData({ ...formData, phong_hoc_id: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8b1a1a] text-sm"
                                >
                                    <option value="">-- Chưa xếp phòng --</option>
                                    {rooms.map(r => (
                                        <option key={r.id} value={r.id}>{r.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="px-6 py-4 bg-slate-50 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-sm"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="px-4 py-2 flex items-center gap-2 font-medium text-white bg-[#8b1a1a] rounded-lg hover:bg-[#6e1414] transition-colors text-sm disabled:opacity-50"
                            >
                                {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                                Lưu thông tin
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
