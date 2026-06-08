export interface Department {
  id: number;
  ten_khoa: string;
}

export interface Major {
  id: number;
  ten_nganh: string;
  khoa_id: number;
}

export interface AdminClass {
  id: number;
  ten_lop: string;
  nganh_id: number;
}

export interface Semester {
  id: number;
  ten_ky: string;
  bat_dau: string;
  ket_thuc: string;
}

export interface Course {
  id: number;
  ma_hoc_phan: string;
  ten_hoc_phan: string;
  so_tin_chi: number;
}

export interface SubjectClass {
  id: number;
  ma_lop: string;
  hoc_phan_id: number;
  giang_vien_id: number;
  ky_hoc_id: number;
  deleted_at?: string;
}

export interface ClassRegistration {
  sinh_vien_id: number;
  lop_mon_hoc_id: number;
}
