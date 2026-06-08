import { Schedule, Session, LeaveSchedule } from "../types/schedule.type";

export const mockSchedules: Schedule[] = [
  { id: 1, lop_mon_hoc_id: 1, thu: 2, gio_bat_dau: "07:30:00", gio_ket_thuc: "09:30:00", phong_hoc_id: 1 },
  { id: 2, lop_mon_hoc_id: 1, thu: 4, gio_bat_dau: "07:30:00", gio_ket_thuc: "09:30:00", phong_hoc_id: 1 },
  { id: 3, lop_mon_hoc_id: 2, thu: 3, gio_bat_dau: "13:00:00", gio_ket_thuc: "15:00:00", phong_hoc_id: 2 },
];

export const mockSessions: Session[] = [
  { id: 1, lop_mon_hoc_id: 1, ngay_hoc: "2023-09-05", gio_bat_dau: "07:30:00", gio_ket_thuc: "09:30:00", phong_hoc_id: 1, trang_thai: "COMPLETED", diem_danh_mo: false, dong_diem_danh_luc: "2023-09-05T08:00:00Z" },
  { id: 2, lop_mon_hoc_id: 1, ngay_hoc: "2023-09-07", gio_bat_dau: "07:30:00", gio_ket_thuc: "09:30:00", phong_hoc_id: 1, trang_thai: "PENDING", diem_danh_mo: false },
];

export const mockLeaveSchedules: LeaveSchedule[] = [
  { id: 1, lop_mon_hoc_id: 1, ngay_nghi: "2023-09-12", ly_do: "Giảng viên đi công tác", loai: "LECTURER_ABSENT" },
];
