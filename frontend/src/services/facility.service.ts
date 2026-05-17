import { Classroom, ClassroomWifi, Device } from "../types/facility.type";
import { mockClassrooms, mockClassroomWifis, mockDevices } from "../mocks/facility.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const FacilityService = {
  getClassrooms: async (): Promise<Classroom[]> => {
    await delay(300);
    return mockClassrooms;
  },

  getClassroomWifis: async (): Promise<ClassroomWifi[]> => {
    await delay(300);
    return mockClassroomWifis;
  },

  getDevices: async (): Promise<Device[]> => {
    await delay(300);
    return mockDevices;
  }
};
