import { Role, Permission, RolePermission, Account, AccountRole } from "../types/auth.type";

export const mockRoles: Role[] = [
  { id: 1, ten_vai_tro: "Admin" },
  { id: 2, ten_vai_tro: "Giảng viên" },
  { id: 3, ten_vai_tro: "Sinh viên" },
];

export const mockPermissions: Permission[] = [
  { id: 1, ma_quyen: "VIEW_DASHBOARD", nhom: "Dashboard", mo_ta: "Xem bảng điều khiển" },
  { id: 2, ma_quyen: "MANAGE_USERS", nhom: "User", mo_ta: "Quản lý người dùng" },
  { id: 3, ma_quyen: "MANAGE_CLASSES", nhom: "Class", mo_ta: "Quản lý lớp học" },
  { id: 4, ma_quyen: "VIEW_ATTENDANCE", nhom: "Attendance", mo_ta: "Xem điểm danh" }
];

export const mockRolePermissions: RolePermission[] = [
  { vai_tro_id: 1, quyen_id: 1 },
  { vai_tro_id: 1, quyen_id: 2 },
  { vai_tro_id: 1, quyen_id: 3 },
  { vai_tro_id: 1, quyen_id: 4 },
  { vai_tro_id: 2, quyen_id: 1 },
  { vai_tro_id: 2, quyen_id: 4 },
  { vai_tro_id: 3, quyen_id: 1 },
  { vai_tro_id: 3, quyen_id: 4 },
];

export const mockAccounts: Account[] = [
  { 
    id: 1, 
    username: "admin", 
    password_hash: "$2a$10$xyz...", 
    ho_ten: "Quản trị viên", 
    email: "admin@unicheck.edu.vn", 
    kich_hoat: true, 
    failed_attempts: 0,
    last_login: new Date().toISOString()
  },
  { 
    id: 2, 
    username: "gv01", 
    password_hash: "$2a$10$xyz...", 
    ho_ten: "Nguyễn Văn A", 
    email: "nva@unicheck.edu.vn", 
    kich_hoat: true, 
    failed_attempts: 0,
    last_login: new Date().toISOString()
  },
  { 
    id: 3, 
    username: "sv01", 
    password_hash: "$2a$10$xyz...", 
    ho_ten: "Trần Thị B", 
    email: "ttb@unicheck.edu.vn", 
    kich_hoat: true, 
    failed_attempts: 0,
    last_login: new Date().toISOString()
  },
];

export const mockAccountRoles: AccountRole[] = [
  { tai_khoan_id: 1, vai_tro_id: 1 },
  { tai_khoan_id: 2, vai_tro_id: 2 },
  { tai_khoan_id: 3, vai_tro_id: 3 },
];
