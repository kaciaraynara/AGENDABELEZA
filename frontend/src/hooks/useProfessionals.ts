/**
 * useProfessionals — React Query hooks para profissionais
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { professionalsApi, CreateProfessionalPayload, UpdateProfessionalPayload } from '@/lib/api/professionals.api';
import { getApiErrorMessage } from '@/lib/axios';

export const PROFESSIONALS_KEY = 'professionals';

export function useProfessionals() {
  return useQuery({
    queryKey: [PROFESSIONALS_KEY, 'list'],
    queryFn: () => professionalsApi.list(),
  });
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: [PROFESSIONALS_KEY, id],
    queryFn: () => professionalsApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProfessionalPayload) => professionalsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFESSIONALS_KEY] });
      toast.success('Profissional adicionado com sucesso');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao adicionar profissional'));
    },
  });
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfessionalPayload }) =>
      professionalsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFESSIONALS_KEY] });
      toast.success('Profissional atualizado');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao atualizar profissional'));
    },
  });
}

export function useDeleteProfessional() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => professionalsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROFESSIONALS_KEY] });
      toast.success('Profissional removido');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao remover profissional'));
    },
  });
}
