// src/hooks/useClasses.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { classesApi } from '../api/classes.api';
import { CreateClassDTO } from '../types/class.types';

export const useClasses = () => {
  const queryClient = useQueryClient();

  const { data: classes, isLoading, error } = useQuery({
    queryKey: ['classes'],
    queryFn: classesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: classesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateClassDTO & { id: number; current_students: number } }) =>
      classesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: classesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
  });

  return {
    classes,
    isLoading,
    error,
    createClass: createMutation.mutate,
    updateClass: updateMutation.mutate,
    deleteClass: deleteMutation.mutate,
  };
};