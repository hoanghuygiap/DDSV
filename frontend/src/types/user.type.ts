export interface Lecturer {
  id: number;
  tai_khoan_id: number;
  ma_giang_vien: string;
  deleted_at?: string;
}

export interface Student {
  id: number;
  tai_khoan_id: number;
  ma_sinh_vien: string;
  lop_id: number;
  deleted_at?: string;
}
