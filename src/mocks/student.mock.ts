export const mockStudentAttendanceHistoryV2 = [
  {
    id: 1,
    mon_hoc: "Thiết kế Giao diện",
    ngay: "15/10/2023",
    phong: "P. 302, Tòa A",
    giang_vien: "ThS. Nguyễn Văn A",
    trang_thai: "PRESENT",
    minh_chung: null
  },
  {
    id: 2,
    mon_hoc: "Cơ sở dữ liệu",
    ngay: "12/10/2023",
    phong: "P. 104, Tòa B",
    giang_vien: "TS. Trần Thị B",
    trang_thai: "ABSENT",
    minh_chung: "Nộp phép"
  },
  {
    id: 3,
    mon_hoc: "Toán cao cấp A1",
    ngay: "10/10/2023",
    phong: "Hội trường C",
    giang_vien: "PGS. Lê Văn C",
    trang_thai: "LATE",
    minh_chung: "Xem lý do"
  },
  {
    id: 4,
    mon_hoc: "Thiết kế Giao diện",
    ngay: "08/10/2023",
    phong: "P. 302, Tòa A",
    giang_vien: "ThS. Nguyễn Văn A",
    trang_thai: "PRESENT",
    minh_chung: null
  },
  {
    id: 5,
    mon_hoc: "Cơ sở dữ liệu",
    ngay: "05/10/2023",
    phong: "P. 104, Tòa B",
    giang_vien: "TS. Trần Thị B",
    trang_thai: "PRESENT",
    minh_chung: null
  }
];

export const mockStudentStats = {
  tong_buoi_hoc: 42,
  ty_le_chuyen_can: 90.4,
  so_buoi_vang: 2,
  so_buoi_muon: 2
};

export const mockStudentScheduleV2 = {
  ca_sang: [
    { thu: 2, ngay: "16/10", mon: "Cấu trúc Dữ liệu & Giải thuật", thoi_gian: "07:00 - 09:30", phong: "D3-201", giang_vien: "TS. Nguyễn Văn A", type: "theory" },
    { thu: 3, ngay: "17/10", mon: "Thực hành Mạng máy tính", thoi_gian: "08:00 - 11:30", phong: "Lab 4", giang_vien: "ThS. Trần Thị B", type: "practice", isLive: true },
    { thu: 4, ngay: "18/10", mon: null },
    { thu: 5, ngay: "19/10", mon: "Trí tuệ Nhân tạo", thoi_gian: "07:00 - 09:30", phong: "Hội trường C2", giang_vien: null, type: "theory" },
    { thu: 6, ngay: "20/10", mon: "Đồ án Cơ sở", thoi_gian: "07:00 - 11:30", phong: "Xưởng TH 1", giang_vien: null, type: "practice" },
    { thu: 7, ngay: "21/10", mon: null },
    { thu: 8, ngay: "22/10", mon: null },
  ],
  ca_chieu: [
    { thu: 2, ngay: "16/10", mon: null },
    { thu: 3, ngay: "17/10", mon: null },
    { thu: 4, ngay: "18/10", mon: "Hệ điều hành", thoi_gian: "12:30 - 15:00", phong: "D3-304", giang_vien: null, type: "theory" },
    { thu: 5, ngay: "19/10", mon: null },
    { thu: 6, ngay: "20/10", mon: "Kỹ năng mềm", thoi_gian: "12:30 - 15:00", phong: "A1-102", giang_vien: null, type: "theory" },
    { thu: 7, ngay: "21/10", mon: null },
    { thu: 8, ngay: "22/10", mon: null },
  ]
};
