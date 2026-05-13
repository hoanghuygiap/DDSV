export interface Role {
  id: number;
  ten_vai_tro: string;
}

export interface Permission {
  id: number;
  ma_quyen: string;
  nhom: string;
  mo_ta: string;
}

export interface RolePermission {
  vai_tro_id: number;
  quyen_id: number;
}

export interface Account {
  id: number;
  username: string;
  password_hash: string;
  ho_ten: string;
  email: string;
  kich_hoat: boolean;
  refresh_token?: string;
  last_login?: string; // Using string for ISO dates
  failed_attempts: number;
  lock_until?: string; // Using string for ISO dates
}

export interface AccountRole {
  tai_khoan_id: number;
  vai_tro_id: number;
}
