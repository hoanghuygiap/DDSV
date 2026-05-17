import { Lecturer, Student } from "../types/user.type";
import { mockLecturers, mockStudents } from "../mocks/user.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const UserService = {
  getLecturers: async (): Promise<Lecturer[]> => {
    await delay(300);
    return mockLecturers;
  },

  getStudents: async (): Promise<Student[]> => {
    await delay(300);
    return mockStudents;
  }
};
