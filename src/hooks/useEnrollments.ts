import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { enrollmentsApi } from '../api/enrollments.api';
import type { CreateEnrollmentDTO, UpdateEnrollmentDTO } from '../types/enrollment.types';

export function useEnrollments() {
  const queryClient = useQueryClient();

  const { data: enrollments, isLoading, error } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentsApi.getAll(),
  });

  const createEnrollment = useMutation({
    mutationFn: (data: CreateEnrollmentDTO) => enrollmentsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const updateEnrollment = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEnrollmentDTO }) => 
      enrollmentsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  const deleteEnrollment = useMutation({
    mutationFn: (id: string) => enrollmentsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });

  return {
    enrollments,
    isLoading,
    error,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
  };
}