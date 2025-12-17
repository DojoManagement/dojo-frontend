// src/api/athletes.api.ts
import { apiClient } from '../utils/api-client';
import { Athlete, CreateAthleteDTO, UpdateAthleteDTO } from '../types/athlete.types';

export const athletesApi = {
  getAll: async (): Promise<Athlete[]> => {
    const response = await apiClient.get<{ items: Athlete[] }>('/athletes');
    return response.data.items;
  },

  getById: async (id: number): Promise<Athlete> => {
    const response = await apiClient.get<Athlete>(`/athletes/${id}`);
    return response.data;
  },

  create: async (data: Omit<CreateAthleteDTO, 'id'>): Promise<Athlete> => {
    // ✅ NÃO envia ID na criação
    console.log('📤 Criando atleta (sem ID):', data);
    const response = await apiClient.post<Athlete>('/athletes', data);
    return response.data;
  },

  update: async (id: number, data: Athlete): Promise<Athlete> => {
    // ✅ Envia ID na atualização
    console.log('📤 Atualizando atleta:', id, data);
    const response = await apiClient.put<Athlete>(`/athletes/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/athletes/${id}`);
  },
};