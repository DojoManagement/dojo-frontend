// src/api/attendances.api.ts
import { apiClient } from '../utils/api-client';
import { Attendance, CreateAttendanceDTO } from '../types/attendance.types';

export const attendancesApi = {
  getAll: async (filters?: { athlete_id?: number; class_id?: number }): Promise<Attendance[]> => {
    const params = new URLSearchParams();
    if (filters?.athlete_id) params.append('athlete_id', filters.athlete_id.toString());
    if (filters?.class_id) params.append('class_id', filters.class_id.toString());
    
    const response = await apiClient.get<{ items: Attendance[] }>(`/attendances?${params}`);
    return response.data.items;
  },

  getById: async (id: number): Promise<Attendance> => {
    const response = await apiClient.get<Attendance>(`/attendances/${id}`);
    return response.data;
  },

  create: async (data: CreateAttendanceDTO): Promise<Attendance> => {
    const response = await apiClient.post<Attendance>('/attendances', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/attendances/${id}`);
  },
};