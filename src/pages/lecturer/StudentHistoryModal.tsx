import { useState, useEffect } from "react"
import { X, Loader2, Calendar, Edit2, Check, AlertCircle } from "lucide-react"
import api from "@/api/axios"

interface Props {
    student: any
    classId: string | number
    onClose: () => void
    onUpdateSuccess: () => void
}

export default function StudentHistoryModal({ student, classId, onClose, onUpdateSuccess }: Props) {
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editStatus, setEditStatus] = useState<string>("")
    const [editNote, setEditNote] = useState<string>("")
    const [saving, setSaving] = useState(false)

    const fetchHistory = async () => {
        setLoading(true)
        try {
            // Gọi API lịch sử (có phân trang ngầm, limit 100 để lấy mướt)
            const res = await api.get(`/attendance/student/${student.id || student.sinh_vien_id}`, {
                params: { lop_mon_hoc_id: classId, limit: 100 }
            })
            setHistory(res.data.data?.data || [])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHistory()
    }, [student])

    const handleStartEdit = (record: any) => {
        setEditingId(record.id)
        setEditStatus(record.trang_thai)
        setEditNote(record.ghi_chu || "")
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setEditStatus("")
        setEditNote("")
    }

    const handleSave = async (id: number) => {
        setSaving(true)
        try {
            await api.put(`/attendance/${id}`, {
                trang_thai: editStatus,
                ghi_chu: editNote
            })
            await fetchHistory() // Tải lại danh sách sau khi lưu
            onUpdateSuccess()    // Báo lên trên để reload tổng quát (nếu cần)
            handleCancelEdit()
        } catch (err: any) {
            alert("Lỗi khi cập nhật: " + (err.response?.data?.message || err.message))
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
                    <div>
                        <h2 className="text-xl font-medium text-[#185FA5]">Hồ sơ điểm danh</h2>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                            SV: <span className="font-medium text-[#185FA5]">{student.ho_ten}</span> ({student.ma_sinh_vien})
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* CẢNH BÁO */}
                {Number(student.ty_le_vang ?? 0) >= 20 ? (
                    <div className="bg-red-50 p-3 flex items-center gap-2 text-red-700 text-sm border-b border-red-100">
                        <AlertCircle size={18} />
                        <b>Cảnh báo CẤM THI:</b> Sinh viên này đã vắng {Number(student.ty_le_vang ?? 0).toFixed(1)}% tổng số buổi!
                    </div>
                ) : Number(student.ty_le_vang ?? 0) >= 10 ? (
                    <div className="bg-orange-50 p-3 flex items-center gap-2 text-orange-700 text-sm border-b border-orange-100">
                        <AlertCircle size={18} />
                        <b>Lưu ý:</b> Sinh viên này có dấu hiệu nghỉ nhiều ({Number(student.ty_le_vang ?? 0).toFixed(1)}%).
                    </div>
                ) : null}

                {/* BODY */}
                <div className="p-0 overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-slate-50 sticky top-0 shadow-sm z-10">
                            <tr>
                                <th className="py-3 px-4 font-medium text-slate-500">Ngày học</th>
                                <th className="py-3 px-4 font-medium text-slate-500">Giờ học</th>
                                <th className="py-3 px-4 font-medium text-slate-500">Trạng thái</th>
                                <th className="py-3 px-4 font-medium text-slate-500">Ghi chú</th>
                                <th className="py-3 px-4 font-medium text-slate-500 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center">
                                        <Loader2 size={24} className="animate-spin text-slate-400 mx-auto" />
                                    </td>
                                </tr>
                            ) : history.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-slate-400">
                                        Chưa có bất kỳ dữ liệu điểm danh nào của lớp này.
                                    </td>
                                </tr>
                            ) : (
                                history.map((h, i) => (
                                    <tr key={h.id || i} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 font-medium text-slate-700">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} className="text-slate-400" />
                                                {new Date(h.ngay_hoc).toLocaleDateString("vi-VN")}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">
                                            {h.gio_bat_dau?.slice(0, 5)} - {h.gio_ket_thuc?.slice(0, 5)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {editingId === h.id ? (
                                                <select
                                                    className="border border-slate-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:border-blue-500"
                                                    value={editStatus}
                                                    onChange={e => setEditStatus(e.target.value)}
                                                >
                                                    <option value="co_mat">Có mặt</option>
                                                    <option value="vang">Vắng</option>
                                                    <option value="tre">Trễ</option>
                                                    <option value="co_phep">Có phép</option>
                                                </select>
                                            ) : (
                                                <span className={`px-2.5 py-1 rounded text-xs font-medium ${h.trang_thai === 'co_mat' ? 'bg-[#dcfce7] text-[#15803d]' :
                                                    h.trang_thai === 'vang' ? 'bg-[#fee2e2] text-[#dc2626]' :
                                                        h.trang_thai === 'tre' ? 'bg-[#fff7ed] text-[#ea580c]' :
                                                            'bg-[#e0f2fe] text-[#0284c7]'
                                                    }`}>
                                                    {h.trang_thai === 'co_mat' ? 'CÓ MẶT' :
                                                        h.trang_thai === 'vang' ? 'VẮNG' :
                                                            h.trang_thai === 'tre' ? 'TRỄ' : 'CÓ PHÉP'}
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            {editingId === h.id ? (
                                                <input
                                                    type="text"
                                                    className="border border-slate-300 rounded px-2 py-1 text-sm bg-white w-full max-w-[200px]"
                                                    value={editNote}
                                                    onChange={e => setEditNote(e.target.value)}
                                                    placeholder="Nhập ghi chú..."
                                                />
                                            ) : (
                                                <span className="text-slate-500 text-xs italic">{h.ghi_chu || "—"}</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            {editingId === h.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        disabled={saving}
                                                        onClick={() => handleSave(h.id)}
                                                        className="bg-emerald-500 text-white p-1 rounded hover:bg-emerald-600 transition-colors disabled:opacity-50"
                                                    >
                                                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                                    </button>
                                                    <button
                                                        disabled={saving}
                                                        onClick={handleCancelEdit}
                                                        className="bg-slate-200 text-slate-600 p-1 rounded hover:bg-slate-300 transition-colors disabled:opacity-50"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleStartEdit(h)}
                                                    title="Sửa thủ công"
                                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
                    >
                        Đóng bảng
                    </button>
                </div>

            </div>
        </div>
    )
}
