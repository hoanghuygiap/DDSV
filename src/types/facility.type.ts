export interface Classroom {
  id: number;
  ten_phong: string;
  latitude?: number;
  longitude?: number;
  ban_kinh_gps_m?: number;
  require_gps?: boolean;
  require_wifi?: boolean;
}

export interface ClassroomWifi {
  id: number;
  phong_hoc_id: number;
  bssid: string;
}

export interface Device {
  id: number;
  sinh_vien_id: number;
  device_id: string;
  lan_cuoi: string; // Datetime string
  push_token?: string;
  platform: "IOS" | "ANDROID" | "WEB"; // Enum simulation
}
