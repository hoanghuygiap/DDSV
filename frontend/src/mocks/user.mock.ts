import { Lecturer, Student } from "../types/user.type";

export const mockLecturers: Lecturer[] = [
  { id: 1, tai_khoan_id: 2, ma_giang_vien: "GV001" },
  { id: 2, tai_khoan_id: 4, ma_giang_vien: "GV002" },
];

export const mockStudents: Student[] = [
  { id: 1, tai_khoan_id: 3, ma_sinh_vien: "SV001", lop_id: 1 },
  { id: 2, tai_khoan_id: 5, ma_sinh_vien: "SV002", lop_id: 1 },
];
