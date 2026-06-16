/**
 * useServices — React Query hooks para serviços
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { servicesApi, CreateServicePayload, UpdateServicePayload } from '@/lib/api/services.api';
import { getApiErrorMessage } from '@/lib/axios';

export const SERVICES_KEY = 'services';

export function useServices() {
  return useQuery({
    queryKey: [SERVICES_KEY, 'list'],
    queryFn: () => servicesApi.list(),
  });
}

export function useService(id: string) {
  return useQuery({
    queryKey: [SERVICES_KEY, id],
    queryFn: () => servicesApi.getById(id),
    enabled: Boolean(id),
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServicePayload) => servicesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success('Serviço criado com sucesso');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao criar serviço'));
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateServicePayload }) =>
      servicesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success('Serviço atualizado com sucesso');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao atualizar serviço'));
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => servicesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SERVICES_KEY] });
      toast.success('Serviço removido');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao remover serviço'));
    },
  });
}
