import { Attendance, QrToken, QrScanHistory } from "../types/attendance.type";

export const mockAttendances: Attendance[] = [
  { id: 1, buoi_hoc_id: 1, sinh_vien_id: 1, trang_thai: "PRESENT", thoi_gian: "2023-09-05T07:45:00Z", latitude: 10.8231, longitude: 106.6297, hop_le_gps: true, wifi_bssid: "00:11:22:33:44:55", hop_le_wifi: true, hop_le: true },
  { id: 2, buoi_hoc_id: 1, sinh_vien_id: 2, trang_thai: "ABSENT", thoi_gian: "2023-09-05T08:00:00Z" },
];

export const mockQrTokens: QrToken[] = [
  { id: 1, buoi_hoc_id: 1, token_hash: "abcd1234efgh5678", het_han: "2023-09-05T07:50:00Z", dang_hoat_dong: false, lan_tao: 1, created_at: "2023-09-05T07:30:00Z" },
  { id: 2, buoi_hoc_id: 1, token_hash: "ijkl9012mnop3456", het_han: "2023-09-05T08:00:00Z", dang_hoat_dong: true, lan_tao: 2, created_at: "2023-09-05T07:50:00Z" },
];

export const mockQrScanHistories: QrScanHistory[] = [
  { id: 1, qr_token_id: 1, sinh_vien_id: 1, thanh_cong: true, thoi_gian: "2023-09-05T07:45:00Z", ip: "192.168.1.10", thiet_bi_id: "DEVICE_001" },
  { id: 2, qr_token_id: 1, sinh_vien_id: 2, thanh_cong: false, ly_do_fail: "Vị trí GPS không hợp lệ", thoi_gian: "2023-09-05T07:46:00Z", ip: "192.168.1.11", thiet_bi_id: "DEVICE_002" },
];
