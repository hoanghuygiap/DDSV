export interface WarningClass {
  id: string;
  code: string;
  name: string;
  className: string;
  absenceRate: number;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  lecturer: string;
  absentCount: number;
  absenceRate: number;
  status: "NORMAL" | "HIGH_RISK" | "WATCHING";
}

export const mockWarningClasses: WarningClass[] = [
  { id: "1", code: "IT201", name: "Cơ sở dữ liệu", className: "D19 CQ01", absenceRate: 24.5 },
  { id: "2", code: "BA102", name: "Kinh tế vi mô", className: "K20 CQ03", absenceRate: 21.8 },
  { id: "3", code: "EE304", name: "Kỹ thuật số", className: "D18 CQ05", absenceRate: 19.2 },
  { id: "4", code: "ME205", name: "Cơ lý thuyết", className: "C19 CQ02", absenceRate: 18.5 },
  { id: "5", code: "CS101", name: "Nhập môn lập trình", className: "D21 CQ01", absenceRate: 17.1 },
];

export const mockSubjectAttendance: SubjectAttendance[] = [
  { id: "1", code: "IT3120", name: "Phân tích hệ thống", lecturer: "Nguyễn Văn A", absentCount: 45, absenceRate: 12.5, status: "NORMAL" },
  { id: "2", code: "MA2110", name: "Xác suất thống kê", lecturer: "Trần Thị B", absentCount: 122, absenceRate: 28.4, status: "HIGH_RISK" },
  { id: "3", code: "FL1012", name: "Tiếng Anh chuyên ngành", lecturer: "Lê Văn C", absentCount: 78, absenceRate: 18.9, status: "WATCHING" },
  { id: "4", code: "PH1010", name: "Vật lý đại cương I", lecturer: "Phạm Thành D", absentCount: 32, absenceRate: 8.2, status: "NORMAL" },
];
