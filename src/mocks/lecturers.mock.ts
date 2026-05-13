export interface Lecturer {
  id: string;
  name: string;
  title: string;
  code: string;
  department: string;
  email: string;
  status: "ACTIVE" | "ON_LEAVE" | "RETIRED";
  avatarText: string;
  avatarColor: string;
}

export const mockLecturers: Lecturer[] = [
  { 
    id: "1", 
    name: "Nguyễn Văn Phong", 
    title: "Giáo sư", 
    code: "GV00124", 
    department: "Khoa Khoa học Máy tính", 
    email: "phong.nv@hust.edu.vn", 
    status: "ACTIVE",
    avatarText: "NP",
    avatarColor: "bg-[#1e325c] text-white"
  },
  { 
    id: "2", 
    name: "Trần Thị Thu Hà", 
    title: "Phó Giáo sư", 
    code: "GV00125", 
    department: "Kỹ thuật Phần mềm", 
    email: "ha.ttt@hust.edu.vn", 
    status: "ACTIVE",
    avatarText: "TH",
    avatarColor: "bg-[#38bdf8] text-white"
  },
  { 
    id: "3", 
    name: "Lê Minh Đức", 
    title: "Giảng viên", 
    code: "GV00142", 
    department: "Hệ thống Thông tin", 
    email: "duc.lm@hust.edu.vn", 
    status: "ON_LEAVE",
    avatarText: "LĐ",
    avatarColor: "bg-amber-200 text-amber-800"
  },
  { 
    id: "4", 
    name: "Phạm Tuyết Mai", 
    title: "Tiến sĩ", 
    code: "GV00201", 
    department: "An toàn Thông tin", 
    email: "mai.pt@hust.edu.vn", 
    status: "ACTIVE",
    avatarText: "PM",
    avatarColor: "bg-[#1e325c] text-white"
  },
  { 
    id: "5", 
    name: "Vũ Quang Huy", 
    title: "Thạc sĩ", 
    code: "GV00088", 
    department: "Mạng máy tính", 
    email: "huy.vq@hust.edu.vn", 
    status: "RETIRED",
    avatarText: "VH",
    avatarColor: "bg-red-200 text-red-800"
  },
];
