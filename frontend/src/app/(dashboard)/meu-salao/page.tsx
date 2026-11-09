'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { salonApi } from '@/lib/api/salon.api';

const salonSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  phone: z.string().min(8, 'Telefone é obrigatório'),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  description: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  businessHours: z.string().optional(),
  avatarUrl: z.string().url('URL inválida').optional().or(z.literal('')),
});

type SalonFormData = z.infer<typeof salonSchema>;

export default function MeuSalaoPage() {
  const { salon, refreshMe } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<SalonFormData>({
    resolver: zodResolver(salonSchema),
    defaultValues: {
      name: salon?.name ?? '',
      phone: salon?.phone ?? '',
      email: salon?.email ?? '',
      description: salon?.description ?? '',
      address: salon?.address ?? '',
      city: salon?.city ?? '',
      state: salon?.state ?? '',
      zipCode: salon?.zipCode ?? '',
      businessHours: salon?.businessHours ?? '',
      avatarUrl: salon?.avatarUrl ?? '',
    },
  });

  useEffect(() => {
    if (salon) {
      reset({
        name: salon.name,
        phone: salon.phone,
        email: salon.email ?? '',
        description: salon.description ?? '',
        address: salon.address ?? '',
        city: salon.city ?? '',
        state: salon.state ?? '',
        zipCode: salon.zipCode ?? '',
        businessHours: salon.businessHours ?? '',
        avatarUrl: salon.avatarUrl ?? '',
      });
    }
  }, [salon, reset]);

  async function onSubmit(data: SalonFormData) {
    try {
      setIsSaving(true);
      await salonApi.update(data);
      await refreshMe();
      toast.success('Perfil atualizado com sucesso!');
      reset(data); // Reseta o estado isDirty com os novos valores
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Erro ao atualizar perfil.');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Meu Salão"
        description="Gerencie as informações do seu salão, que ficarão visíveis para seus clientes."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card border border-border rounded-xl p-6">
        
        {/* Informações Básicas */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Informações Básicas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nome do Salão</Label>
              <Input id="name" {...register('name')} />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="avatarUrl">URL do Logotipo/Foto</Label>
              <Input id="avatarUrl" placeholder="https://exemplo.com/logo.png" {...register('avatarUrl')} />
              {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone (WhatsApp)</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description">Descrição / Sobre nós</Label>
              <Input id="description" {...register('description')} />
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="businessHours">Horário de Funcionamento (ex: Seg a Sex, 09h às 18h)</Label>
              <Input id="businessHours" {...register('businessHours')} />
            </div>
          </div>
        </section>

        {/* Localização */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Localização</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="address">Endereço Completo</Label>
              <Input id="address" placeholder="Rua das Flores, 123 - Centro" {...register('address')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" {...register('city')} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="state">Estado (UF)</Label>
              <Input id="state" placeholder="SP" {...register('state')} />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={!isDirty || isSaving}>
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  );
}
