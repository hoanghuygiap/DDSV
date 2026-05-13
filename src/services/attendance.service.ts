import { Attendance, QrToken, QrScanHistory } from "../types/attendance.type";
import { mockAttendances, mockQrTokens, mockQrScanHistories } from "../mocks/attendance.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AttendanceService = {
  getAttendances: async (): Promise<Attendance[]> => {
    await delay(300);
    return mockAttendances;
  },

  getQrTokens: async (): Promise<QrToken[]> => {
    await delay(300);
    return mockQrTokens;
  },

  getQrScanHistories: async (): Promise<QrScanHistory[]> => {
    await delay(300);
    return mockQrScanHistories;
  }
};
