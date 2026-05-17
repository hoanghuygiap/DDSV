export interface Attendance {
  id: number;
  buoi_hoc_id: number;
  sinh_vien_id: number;
  trang_thai: "PRESENT" | "ABSENT" | "LATE" | "EXCUSED"; // Enum simulation
  thoi_gian: string; // Datetime string
  latitude?: number;
  longitude?: number;
  hop_le_gps?: boolean;
  wifi_bssid?: string;
  hop_le_wifi?: boolean;
  hop_le?: boolean;
  ghi_chu?: string;
}

export interface QrToken {
  id: number;
  buoi_hoc_id: number;
  token_hash: string;
  het_han: string; // Datetime string
  dang_hoat_dong: boolean;
  lan_tao: number;
  created_at: string; // Datetime string
}

export interface QrScanHistory {
  id: number; // BigInt generally maps to number/string in TS depending on setup, using number for simplicity
  qr_token_id: number;
  sinh_vien_id: number;
  thanh_cong: boolean;
  ly_do_fail?: string;
  thoi_gian: string; // Datetime string
  ip: string;
  thiet_bi_id: string;
}
