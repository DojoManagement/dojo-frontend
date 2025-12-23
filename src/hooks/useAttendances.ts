// src/hooks/useAttendances.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { attendancesApi } from '../api/attendances.api';

export const useAttendances = (filters?: { athlete_id?: number; class_id?: number }) => {
  const queryClient = useQueryClient();

  const { data: attendances, isLoading, error } = useQuery({
    queryKey: ['attendances', filters],
    queryFn: () => attendancesApi.getAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: attendancesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: attendancesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendances'] });
    },
  });

  return {
    attendances,
    isLoading,
    error,
    createAttendance: createMutation.mutate,
    deleteAttendance: deleteMutation.mutate,
  };
};