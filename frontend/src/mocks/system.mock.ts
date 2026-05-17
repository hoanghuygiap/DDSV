import { Notification, UserNotification, Warning, SystemLog, Config } from "../types/system.type";

export const mockNotifications: Notification[] = [
  { id: 1, tieu_de: "Thông báo lịch nghỉ", noi_dung: "Giảng viên xin nghỉ buổi học ngày 12/09", nguoi_gui_id: 2, lop_mon_hoc_id: 1, loai: "WARNING", gui_luc: "2023-09-10T10:00:00Z" },
  { id: 2, tieu_de: "Nhắc nhở điểm danh", noi_dung: "Đã có thể điểm danh buổi học", nguoi_gui_id: 1, lop_mon_hoc_id: 1, loai: "REMINDER", gui_luc: "2023-09-05T07:25:00Z" },
];

export const mockUserNotifications: UserNotification[] = [
  { thong_bao_id: 1, tai_khoan_id: 3, da_doc: false },
  { thong_bao_id: 2, tai_khoan_id: 3, da_doc: true },
];

export const mockWarnings: Warning[] = [
  { id: 1, sinh_vien_id: 2, lop_mon_hoc_id: 1, loai: "VANG_THI", noi_dung: "Sinh viên vắng mặt quá 20%", da_xu_ly: false, tao_luc: "2023-11-01T08:00:00Z" },
];

export const mockSystemLogs: SystemLog[] = [
  { id: 1, tai_khoan_id: 2, hanh_dong: "UPDATE_STATUS", bang: "buoi_hoc", ban_ghi_id: 1, du_lieu_cu: { trang_thai: "PENDING" }, du_lieu_moi: { trang_thai: "COMPLETED" }, ip: "192.168.1.100", thoi_gian: "2023-09-05T09:30:00Z" },
];

export const mockConfigs: Config[] = [
  { key_name: "MAX_ABSENCE_PERCENTAGE", value: "20", kieu: "NUMBER", mo_ta: "Tỷ lệ vắng mặt tối đa trước khi cấm thi (%)" },
  { key_name: "GPS_TOLERANCE_METERS", value: "50", kieu: "NUMBER", mo_ta: "Bán kính cho phép sai số GPS" },
];
