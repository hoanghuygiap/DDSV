import { Classroom, ClassroomWifi, Device } from "../types/facility.type";

export const mockClassrooms: Classroom[] = [
  { id: 1, ten_phong: "Phòng A1.1", latitude: 10.8231, longitude: 106.6297, ban_kinh_gps_m: 50, require_gps: true, require_wifi: true },
  { id: 2, ten_phong: "Phòng B2.3", latitude: 10.8232, longitude: 106.6298, ban_kinh_gps_m: 50, require_gps: false, require_wifi: false },
];

export const mockClassroomWifis: ClassroomWifi[] = [
  { id: 1, phong_hoc_id: 1, bssid: "00:11:22:33:44:55" },
  { id: 2, phong_hoc_id: 1, bssid: "66:77:88:99:AA:BB" },
];

export const mockDevices: Device[] = [
  { id: 1, sinh_vien_id: 1, device_id: "DEVICE_001", lan_cuoi: "2023-09-05T07:45:00Z", push_token: "token_123", platform: "IOS" },
  { id: 2, sinh_vien_id: 2, device_id: "DEVICE_002", lan_cuoi: "2023-09-05T07:46:00Z", push_token: "token_456", platform: "ANDROID" },
];
