import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athletesApi } from '../api/athletes.api';
import { CreateAthleteDTO, Athlete } from '../types/athlete.types';

export const useAthletes = () => {
  const queryClient = useQueryClient();

  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: athletesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<CreateAthleteDTO, 'id'>) => athletesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Athlete }) =>
      athletesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: athletesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });

  return {
    athletes,
    isLoading,
    error,
    createAthlete: createMutation.mutate,
    updateAthlete: updateMutation.mutate,
    deleteAthlete: deleteMutation.mutate,
  };
};