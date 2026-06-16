/**
 * useBilling — Hooks de React Query para billing/assinatura
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { billingApi } from '@/lib/api/billing.api';
import { getApiErrorMessage } from '@/lib/axios';
import type { CreateCheckoutPayload } from '@/types/billing.types';

export const BILLING_KEYS = {
  plans: ['billing', 'plans'] as const,
  status: ['billing', 'status'] as const,
};

/** Retorna a lista de planos disponíveis (público) */
export function useBillingPlans() {
  return useQuery({
    queryKey: BILLING_KEYS.plans,
    queryFn: () => billingApi.getPlans(),
    staleTime: 1000 * 60 * 10, // 10 min — planos mudam raramente
  });
}

/** Retorna o status atual da assinatura do OWNER autenticado */
export function useBillingStatus() {
  return useQuery({
    queryKey: BILLING_KEYS.status,
    queryFn: () => billingApi.getStatus(),
    staleTime: 1000 * 60 * 2, // 2 min
    retry: 1,
  });
}

/** Inicia o checkout Stripe e redireciona para a URL de pagamento */
export function useCreateCheckout() {
  return useMutation({
    mutationFn: (payload: CreateCheckoutPayload) =>
      billingApi.createCheckout(payload),
    onSuccess: (data) => {
      if (data.checkoutUrl) {
        toast.success('Redirecionando para o pagamento…');
        window.location.href = data.checkoutUrl;
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao iniciar checkout. Tente novamente.'));
    },
  });
}

/** Cancela a assinatura atual */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => billingApi.cancel(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BILLING_KEYS.status });
      toast.success('Assinatura cancelada com sucesso.');
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, 'Erro ao cancelar assinatura.'));
    },
  });
}
