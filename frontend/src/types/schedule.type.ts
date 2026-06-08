export interface Schedule {
  id: number;
  lop_mon_hoc_id: number;
  thu: number;
  gio_bat_dau: string; // Time string
  gio_ket_thuc: string; // Time string
  phong_hoc_id: number;
}

export interface Session {
  id: number;
  lop_mon_hoc_id: number;
  ngay_hoc: string; // Date string
  gio_bat_dau: string; // Time string
  gio_ket_thuc: string; // Time string
  phong_hoc_id: number;
  trang_thai: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // Enum simulation
  diem_danh_mo: boolean;
  dong_diem_danh_luc?: string; // Datetime string
}

export interface LeaveSchedule {
  id: number;
  lop_mon_hoc_id: number;
  ngay_nghi: string; // Date string
  ly_do: string;
  loai: "LECTURER_ABSENT" | "SCHOOL_HOLIDAY" | "WEATHER"; // Enum simulation
}
