import { Schedule, Session, LeaveSchedule } from "../types/schedule.type";
import { mockSchedules, mockSessions, mockLeaveSchedules } from "../mocks/schedule.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const ScheduleService = {
  getSchedules: async (): Promise<Schedule[]> => {
    await delay(300);
    return mockSchedules;
  },

  getSessions: async (): Promise<Session[]> => {
    await delay(300);
    return mockSessions;
  },

  getLeaveSchedules: async (): Promise<LeaveSchedule[]> => {
    await delay(300);
    return mockLeaveSchedules;
  }
};
