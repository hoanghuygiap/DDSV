export interface Notification {
  id: number;
  tieu_de: string;
  noi_dung: string;
  nguoi_gui_id: number;
  lop_mon_hoc_id?: number;
  loai: "INFO" | "WARNING" | "REMINDER"; // Enum simulation
  gui_luc: string; // Datetime string
}

export interface UserNotification {
  thong_bao_id: number;
  tai_khoan_id: number;
  da_doc: boolean;
}

export interface Warning {
  id: number;
  sinh_vien_id: number;
  lop_mon_hoc_id?: number;
  loai: string;
  noi_dung: string;
  da_xu_ly: boolean;
  xu_ly_boi?: number;
  xu_ly_luc?: string; // Datetime string
  tao_luc: string; // Datetime string
}

export interface SystemLog {
  id: number; // BigInt mapped to number
  tai_khoan_id: number;
  hanh_dong: string;
  bang: string;
  ban_ghi_id?: number;
  du_lieu_cu?: Record<string, unknown>; // JSON type mapping
  du_lieu_moi?: Record<string, unknown>; // JSON type mapping
  ip?: string;
  thoi_gian: string; // Datetime string
}

export interface Config {
  key_name: string;
  value: string;
  kieu: "STRING" | "NUMBER" | "BOOLEAN" | "JSON"; // Enum simulation
  mo_ta: string;
}
