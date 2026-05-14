import { SubjectClass, Course } from "@/types/academic.type";
import { Attendance } from "@/types/attendance.type";

export const mockLecturerClasses = [
  {
    id: 1,
    ma_lop: "IT4040-12345",
    ten_hoc_phan: "Lập trình Web",
    ma_hoc_phan: "IT4040",
    so_tin_chi: 3,
    so_sinh_vien: 65,
    ky_hoc: "20251",
    phong_hoc: "D3-101",
    thoi_gian: "Sáng thứ 2, 08:00 - 10:15",
    ty_le_chuyen_can: 92.5,
    trang_thai: "Đang diễn ra",
  },
  {
    id: 2,
    ma_lop: "IT3030-12346",
    ten_hoc_phan: "Cơ sở dữ liệu",
    ma_hoc_phan: "IT3030",
    so_tin_chi: 3,
    so_sinh_vien: 80,
    ky_hoc: "20251",
    phong_hoc: "D3-102",
    thoi_gian: "Chiều thứ 3, 13:00 - 15:15",
    ty_le_chuyen_can: 88.0,
    trang_thai: "Chưa bắt đầu",
  },
  {
    id: 3,
    ma_lop: "IT4040-12347",
    ten_hoc_phan: "Lập trình Web",
    ma_hoc_phan: "IT4040",
    so_tin_chi: 3,
    so_sinh_vien: 55,
    ky_hoc: "20251",
    phong_hoc: "TC-201",
    thoi_gian: "Sáng thứ 5, 08:00 - 10:15",
    ty_le_chuyen_can: 95.2,
    trang_thai: "Đã kết thúc",
  }
];

export const mockClassStudents = [
  {
    id: 1,
    ma_sv: "20210001",
    ho_ten: "Nguyễn Văn A",
    email: "a.nv210001@sis.hust.edu.vn",
    lop_quan_ly: "CNTT 01 - K66",
    so_buoi_vang: 0,
    ty_le_vang: 0,
    trang_thai_hom_nay: "PRESENT"
  },
  {
    id: 2,
    ma_sv: "20210002",
    ho_ten: "Trần Thị B",
    email: "b.tt210002@sis.hust.edu.vn",
    lop_quan_ly: "CNTT 02 - K66",
    so_buoi_vang: 3,
    ty_le_vang: 25,
    trang_thai_hom_nay: "ABSENT"
  },
  {
    id: 3,
    ma_sv: "20210003",
    ho_ten: "Lê Văn C",
    email: "c.lv210003@sis.hust.edu.vn",
    lop_quan_ly: "KHMT 01 - K66",
    so_buoi_vang: 1,
    ty_le_vang: 8.3,
    trang_thai_hom_nay: "LATE"
  },
  {
    id: 4,
    ma_sv: "20210004",
    ho_ten: "Phạm Thị D",
    email: "d.pt210004@sis.hust.edu.vn",
    lop_quan_ly: "CNTT 01 - K66",
    so_buoi_vang: 0,
    ty_le_vang: 0,
    trang_thai_hom_nay: "PRESENT"
  },
];

export const mockAttendanceHistory = [
  {
    id: 1,
    ngay: "2026-05-14",
    thoi_gian_bat_dau: "08:00",
    thoi_gian_ket_thuc: "08:15",
    phong_hoc: "D3-101",
    so_sv_co_mat: 60,
    so_sv_vang: 5,
    so_sv_di_muon: 0,
    trang_thai: "Hoàn thành"
  },
  {
    id: 2,
    ngay: "2026-05-07",
    thoi_gian_bat_dau: "08:00",
    thoi_gian_ket_thuc: "08:15",
    phong_hoc: "D3-101",
    so_sv_co_mat: 62,
    so_sv_vang: 2,
    so_sv_di_muon: 1,
    trang_thai: "Hoàn thành"
  },
  {
    id: 3,
    ngay: "2026-04-30",
    thoi_gian_bat_dau: "08:00",
    thoi_gian_ket_thuc: "08:15",
    phong_hoc: "D3-101",
    so_sv_co_mat: 65,
    so_sv_vang: 0,
    so_sv_di_muon: 0,
    trang_thai: "Hoàn thành"
  }
];

export const mockReports = {
  tong_quan: {
    ti_le_di_hoc: 92.5,
    sv_canh_bao: 12,
    so_buoi_da_day: 45,
    tong_so_lop: 3
  },
  bieu_do_chuyen_can: [
    { label: "Tuần 1", value: 95 },
    { label: "Tuần 2", value: 94 },
    { label: "Tuần 3", value: 88 },
    { label: "Tuần 4", value: 92 },
    { label: "Tuần 5", value: 96 }
  ]
};
