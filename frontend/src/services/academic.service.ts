import api from "@/api/axios"
import type { Department, Major, AdminClass, Semester, Course, SubjectClass, ClassRegistration } from "../types/academic.type"

export const AcademicService = {
  getDepartments: async (): Promise<Department[]> => {
    const res = await api.get("/faculties")
    return res.data.data ?? []
  },

  getMajors: async (): Promise<Major[]> => {
    const res = await api.get("/majors")
    return res.data.data ?? []
  },

  getAdminClasses: async (): Promise<AdminClass[]> => {
    const res = await api.get("/classes")
    return res.data.data ?? []
  },

  getSemesters: async (): Promise<Semester[]> => {
    const res = await api.get("/semesters")
    return res.data.data ?? []
  },

  getCourses: async (): Promise<Course[]> => {
    const res = await api.get("/subjects")
    return res.data.data ?? []
  },

  getSubjectClasses: async (params?: { page?: number; limit?: number; keyword?: string }): Promise<SubjectClass[]> => {
    const res = await api.get("/course-classes", { params })
    return res.data.data ?? []
  },

  getClassRegistrations: async (courseClassId: number): Promise<ClassRegistration[]> => {
    const res = await api.get(`/course-classes/${courseClassId}/students`)
    return res.data.data ?? []
  },
}
