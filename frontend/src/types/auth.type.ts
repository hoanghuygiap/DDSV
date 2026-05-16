export interface Role {
  id: number
  ten_vai_tro: string
}

export interface Permission {
  id: number
  ma_quyen: string
  nhom: string
  mo_ta: string
}

export interface AuthUser {
  id: number
  username: string
  ho_ten: string
  email: string
  kich_hoat: boolean
  roles: string[]
}

export interface LoginResponse {
  success: boolean
  access_token: string
  refresh_token: string
  user: AuthUser
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}
