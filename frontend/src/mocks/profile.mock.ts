export interface ActivityLog {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  type: "login" | "qr" | "update";
}

export const mockUserProfile = {
  name: "PGS. TS Nguyễn Văn An",
  id: "10293847",
  department: "Khoa Công nghệ Thông tin",
  email: "nvan@hcmut.edu.vn",
  phone: "+84 90 123 4567",
  avatarUrl: "https://github.com/shadcn.png"
};

export const mockActivityLogs: ActivityLog[] = [
  { id: "1", action: "Đăng nhập hệ thống", details: "IP: 192.168.1.45 (TP.HCM)", timestamp: "Hôm nay, 08:30 AM", type: "login" },
  { id: "2", action: "Tạo mã QR Điểm danh", details: "Lớp CO3005 - Lập trình Web", timestamp: "Hôm qua, 13:00 PM", type: "qr" },
  { id: "3", action: "Cập nhật số điện thoại", details: "Thay đổi thông tin liên hệ cá nhân", timestamp: "12/10/2023, 09:15 AM", type: "update" },
];
