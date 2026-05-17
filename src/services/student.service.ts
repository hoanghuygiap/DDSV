import api from "@/api/axios"

export interface StudentProfile {
  id: number
  tai_khoan_id: number
  ma_sinh_vien: string
  ho_ten: string
  email: string | null
  sdt: string
  lop_id: number | null
}

export interface StudentClass {
  lop_mon_hoc_id: number
  ma_lop: string
  ma_hoc_phan: string
  ten_hoc_phan: string
  so_tin_chi: number
  ten_giang_vien: string | null
  ky_hoc_id: number
  ten_ky: string
  bat_dau: string
  ket_thuc: string
  tong_buoi: number
  so_buoi_nghi: number
  vang_khong_phep: number
  vang_co_phep: number
  so_tre: number
}

export const StudentService = {
  getClassesByAccount: async (tai_khoan_id: number) => {
    const res = await api.get(`/students/by-account/${tai_khoan_id}/classes`)
    return res.data as { student: StudentProfile; data: StudentClass[] }
  },
}
