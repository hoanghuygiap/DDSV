// Giảng viên — khớp với response từ GET /api/lecturers
export interface Lecturer {
  id: number
  tai_khoan_id: number
  ma_giang_vien: string
  ho_ten: string
  email: string
  sdt: string | null
  username: string
  kich_hoat: boolean
  created_at: string
}

export interface LecturerPayload {
  username: string
  password: string
  ho_ten: string
  email: string
  sdt?: string
  ma_giang_vien: string
}

// Tài khoản người dùng — khớp với response từ GET /api/users
export interface UserAccount {
  id: number
  username: string
  ho_ten: string
  email: string
  kich_hoat: boolean
  last_login: string | null
  failed_attempts: number
  lock_until: string | null
  created_at: string
}

export interface UserPayload {
  username: string
  password: string
  ho_ten: string
  email: string
  roleId?: number
}

// Sinh viên (dùng khi backend có sẵn)
export interface Student {
  id: number
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
