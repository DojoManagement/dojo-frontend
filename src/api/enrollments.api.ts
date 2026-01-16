// src/api/enrollments.api.ts
import { apiClient } from '../utils/api-client';
import { Enrollment, CreateEnrollmentDTO, UpdateEnrollmentDTO } from '../types/enrollment.types';

export const enrollmentsApi = {
  getAll: async (filters?: { athlete_id?: string; class_id?: string }): Promise<Enrollment[]> => {
    const params = new URLSearchParams();
    if (filters?.athlete_id) params.append('athlete_id', filters.athlete_id.toString());
    if (filters?.class_id) params.append('class_id', filters.class_id.toString());
    
    const response = await apiClient.get<{ items: Enrollment[] }>(`/enrollments?${params}`);
    return response.data.items;
  },

  create: async (data: CreateEnrollmentDTO): Promise<Enrollment> => {
    const response = await apiClient.post<Enrollment>('/enrollments', data);
    return response.data;
  },

  update: async (id: string, data: UpdateEnrollmentDTO): Promise<Enrollment> => {
    const response = await apiClient.put<Enrollment>(`/enrollments/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/enrollments/${id}`);
  },
};