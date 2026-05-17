import { Department, Major, AdminClass, Semester, Course, SubjectClass, ClassRegistration } from "../types/academic.type";

export const mockDepartments: Department[] = [
  { id: 1, ten_khoa: "Công nghệ thông tin" },
  { id: 2, ten_khoa: "Kinh tế" },
];

export const mockMajors: Major[] = [
  { id: 1, ten_nganh: "Kỹ thuật phần mềm", khoa_id: 1 },
  { id: 2, ten_nganh: "Khoa học máy tính", khoa_id: 1 },
  { id: 3, ten_nganh: "Quản trị kinh doanh", khoa_id: 2 },
];

export const mockAdminClasses: AdminClass[] = [
  { id: 1, ten_lop: "KTPM01", nganh_id: 1 },
  { id: 2, ten_lop: "KTPM02", nganh_id: 1 },
];

export const mockSemesters: Semester[] = [
  { id: 1, ten_ky: "Học kỳ 1 Năm học 2023-2024", bat_dau: "2023-09-05", ket_thuc: "2024-01-15" },
  { id: 2, ten_ky: "Học kỳ 2 Năm học 2023-2024", bat_dau: "2024-02-15", ket_thuc: "2024-06-30" },
];

export const mockCourses: Course[] = [
  { id: 1, ma_hoc_phan: "IT001", ten_hoc_phan: "Nhập môn lập trình", so_tin_chi: 3 },
  { id: 2, ma_hoc_phan: "IT002", ten_hoc_phan: "Cấu trúc dữ liệu", so_tin_chi: 4 },
];

export const mockSubjectClasses: SubjectClass[] = [
  { id: 1, ma_lop: "IT001.M11", hoc_phan_id: 1, giang_vien_id: 1, ky_hoc_id: 1 },
  { id: 2, ma_lop: "IT002.M12", hoc_phan_id: 2, giang_vien_id: 1, ky_hoc_id: 1 },
];

export const mockClassRegistrations: ClassRegistration[] = [
  { sinh_vien_id: 1, lop_mon_hoc_id: 1 },
  { sinh_vien_id: 2, lop_mon_hoc_id: 1 },
  { sinh_vien_id: 1, lop_mon_hoc_id: 2 },
];
