// src/api/classes.api.ts
import { apiClient } from '../utils/api-client';
import { Class, CreateClassDTO } from '../types/class.types';

export const classesApi = {
  getAll: async (): Promise<Class[]> => {
    const response = await apiClient.get<{ items: Class[] }>('/classes');
    return response.data.items;
  },

  getById: async (id: string): Promise<Class> => {
    const response = await apiClient.get<Class>(`/classes/${id}`);
    return response.data;
  },

  create: async (data: CreateClassDTO): Promise<Class> => {
    const response = await apiClient.post<Class>('/classes', data);
    return response.data;
  },

  update: async (id: string, data: CreateClassDTO & { id: string; current_students: number }): Promise<Class> => {
    const response = await apiClient.put<Class>(`/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/classes/${id}`);
  },
};