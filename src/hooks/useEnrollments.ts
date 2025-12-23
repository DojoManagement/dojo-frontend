// src/hooks/useEnrollments.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '../api/enrollments.api';

export const useEnrollments = (filters?: { athlete_id?: number; class_id?: number }) => {
  const queryClient = useQueryClient();

  const { data: enrollments, isLoading, error } = useQuery({
    queryKey: ['enrollments', filters],
    queryFn: () => enrollmentsApi.getAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: enrollmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: enrollmentsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  return {
    enrollments,
    isLoading,
    error,
    createEnrollment: createMutation.mutate,
    deleteEnrollment: deleteMutation.mutate,
  };
};