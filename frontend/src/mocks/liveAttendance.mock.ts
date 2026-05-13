export interface LiveStudent {
  mssv: string;
  name: string;
  time: string;
  status: "PRESENT" | "LATE";
  gpsValid: boolean;
}

export const mockLiveStudents: LiveStudent[] = [
  { mssv: "20210001", name: "Nguyễn Văn An", time: "08:15:22", status: "PRESENT", gpsValid: true },
  { mssv: "20210045", name: "Trần Thị Bích", time: "08:14:10", status: "PRESENT", gpsValid: true },
  { mssv: "20210102", name: "Lê Hoàng Cường", time: "08:12:05", status: "LATE", gpsValid: false },
  { mssv: "20210255", name: "Phạm Dũng", time: "08:05:30", status: "PRESENT", gpsValid: true },
  { mssv: "20210310", name: "Hoàng Em", time: "08:02:15", status: "PRESENT", gpsValid: true },
];
