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

export interface StudentListItem {
  id: number              // sinh_vien.id
  tai_khoan_id: number
  ma_sinh_vien: string
  ho_ten: string
  email: string
  sdt: string | null
  lop_id: number | null
  ten_lop: string | null
  username: string
  kich_hoat: boolean
  created_at: string
}

export interface StudentCreatePayload {
  username: string
  password: string
  ho_ten: string
  email: string
  sdt: string
  ma_sinh_vien: string
  lop_id?: number | null
}

export interface StudentPagination {
  total: number
  page: number
  limit: number
  totalPages: number
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
  getList: async (
    page: number,
    limit: number,
    keyword = "",
    filters?: { khoa_id?: number | ""; nganh_id?: number | ""; lop_id?: number | ""; kich_hoat?: "true" | "false" | "" }
  ) => {
    const params: Record<string, string | number> = { page, limit, keyword }
    if (filters?.khoa_id)  params.khoa_id  = filters.khoa_id
    if (filters?.nganh_id) params.nganh_id = filters.nganh_id
    if (filters?.lop_id)   params.lop_id   = filters.lop_id
    if (filters?.kich_hoat !== undefined && filters.kich_hoat !== "") params.kich_hoat = filters.kich_hoat
    const res = await api.get("/students", { params })
    return res.data as { data: StudentListItem[]; pagination: StudentPagination }
  },

  create: async (data: StudentCreatePayload) => {
    const res = await api.post("/students", data)
    return res.data
  },

  remove: async (id: number) => {
    const res = await api.delete(`/students/${id}`)
    return res.data
  },

  // Dùng cho StudentDetail: lấy thông tin và lớp học bằng sv.id
  getById: async (id: number) => {
    const res = await api.get(`/students/${id}`)
    return res.data.data as StudentListItem
  },

  getClassesById: async (id: number) => {
    const res = await api.get(`/students/${id}/classes`)
    return res.data as { data: StudentClass[]; pagination: StudentPagination }
  },
}
