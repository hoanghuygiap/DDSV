export interface ClassItem {
  id: string;
  name: string;
  major: string;
  code: string;
  instructorName: string;
  instructorInitials: string;
  instructorColor: string;
  students: string;
  schedule: string;
  status: "Active" | "Inactive";
}

export const mockClasses: ClassItem[] = [
  {
    id: "1",
    name: "Cấu trúc dữ liệu và Giải thuật",
    major: "Kỹ thuật phần mềm",
    code: "CO2003",
    instructorName: "TS. Trần Nam",
    instructorInitials: "TN",
    instructorColor: "bg-blue-100 text-blue-600",
    students: "120/120",
    schedule: "T2 (1-3), T4 (4-6)",
    status: "Active"
  },
  {
    id: "2",
    name: "Hệ quản trị Cơ sở dữ liệu",
    major: "Hệ thống thông tin",
    code: "CO2011",
    instructorName: "ThS. Lê Hoa",
    instructorInitials: "LH",
    instructorColor: "bg-orange-100 text-orange-600",
    students: "85/90",
    schedule: "T3 (7-9), T5 (7-9)",
    status: "Active"
  },
  {
    id: "3",
    name: "Mạng máy tính cơ bản",
    major: "Mạng & Truyền thông",
    code: "CO2007",
    instructorName: "TS. Phạm Quân",
    instructorInitials: "PQ",
    instructorColor: "bg-indigo-100 text-indigo-600",
    students: "45/50",
    schedule: "T6 (1-4)",
    status: "Inactive"
  },
  {
    id: "4",
    name: "An toàn thông tin",
    major: "Khoa học máy tính",
    code: "CO3001",
    instructorName: "TS. Vũ Đức",
    instructorInitials: "VD",
    instructorColor: "bg-cyan-100 text-cyan-600",
    students: "60/60",
    schedule: "T4 (10-12)",
    status: "Active"
  }
];
