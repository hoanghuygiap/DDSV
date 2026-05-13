import { Notification, UserNotification, Warning, SystemLog, Config } from "../types/system.type";
import { mockNotifications, mockUserNotifications, mockWarnings, mockSystemLogs, mockConfigs } from "../mocks/system.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const SystemService = {
  getNotifications: async (): Promise<Notification[]> => {
    await delay(300);
    return mockNotifications;
  },

  getUserNotifications: async (): Promise<UserNotification[]> => {
    await delay(300);
    return mockUserNotifications;
  },

  getWarnings: async (): Promise<Warning[]> => {
    await delay(300);
    return mockWarnings;
  },

  getSystemLogs: async (): Promise<SystemLog[]> => {
    await delay(300);
    return mockSystemLogs;
  },

  getConfigs: async (): Promise<Config[]> => {
    await delay(300);
    return mockConfigs;
  }
};
