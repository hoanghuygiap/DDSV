import { Department, Major, AdminClass, Semester, Course, SubjectClass, ClassRegistration } from "../types/academic.type";
import { mockDepartments, mockMajors, mockAdminClasses, mockSemesters, mockCourses, mockSubjectClasses, mockClassRegistrations } from "../mocks/academic.mock";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const AcademicService = {
  getDepartments: async (): Promise<Department[]> => {
    await delay(300);
    return mockDepartments;
  },

  getMajors: async (): Promise<Major[]> => {
    await delay(300);
    return mockMajors;
  },

  getAdminClasses: async (): Promise<AdminClass[]> => {
    await delay(300);
    return mockAdminClasses;
  },

  getSemesters: async (): Promise<Semester[]> => {
    await delay(300);
    return mockSemesters;
  },

  getCourses: async (): Promise<Course[]> => {
    await delay(300);
    return mockCourses;
  },

  getSubjectClasses: async (): Promise<SubjectClass[]> => {
    await delay(300);
    return mockSubjectClasses;
  },

  getClassRegistrations: async (): Promise<ClassRegistration[]> => {
    await delay(300);
    return mockClassRegistrations;
  }
};
