import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athletesApi } from '../api/athletes.api';
import { CreateAthleteDTO, UpdateAthleteDTO } from '../types/athlete.types';

export const useAthletes = () => {
  const queryClient = useQueryClient();

  const { data: athletes, isLoading, error } = useQuery({
    queryKey: ['athletes'],
    queryFn: athletesApi.getAll,
  });

  const createAthlete = useMutation({
    mutationFn: (data: CreateAthleteDTO) => athletesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });

  const updateAthlete = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAthleteDTO }) =>
      athletesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });

  const deleteAthlete = useMutation({
    mutationFn: (id: number) => athletesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['athletes'] });
    },
  });

  return {
    athletes,
    isLoading,
    error,
    createAthlete,
    updateAthlete,
    deleteAthlete,
  };
};