export interface ClassStudent {
  mssv: string;
  name: string;
  attendanceRate: number;
  status: "PRESENT" | "ABSENT" | "LATE" | "NOT_YET";
}

export interface ClassHistory {
  id: number;
  week: string;
  type: string;
  presentCount: number;
  totalCount: number;
  dateStr: string;
}

export const mockClassStudents: ClassStudent[] = [
  { mssv: "20210001", name: "Nguyễn Văn A", attendanceRate: 100, status: "PRESENT" },
  { mssv: "20210002", name: "Trần Thị B", attendanceRate: 75, status: "ABSENT" },
  { mssv: "20210003", name: "Lê Văn C", attendanceRate: 90, status: "LATE" },
  { mssv: "20210004", name: "Phạm Thị D", attendanceRate: 95, status: "PRESENT" },
  { mssv: "20210005", name: "Hoàng Văn E", attendanceRate: 88, status: "NOT_YET" },
];

export const mockClassHistory: ClassHistory[] = [
  { id: 1, week: "Tuần 10", type: "Bài giảng", presentCount: 42, totalCount: 45, dateStr: "12 THG 5" },
  { id: 2, week: "Tuần 9", type: "Thực hành", presentCount: 45, totalCount: 45, dateStr: "05 THG 5" },
];
