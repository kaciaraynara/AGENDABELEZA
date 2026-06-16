/**
 * Cadastro Page — Formulário funcional de registro de OWNER + Salão
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { getApiErrorMessage } from '@/lib/axios';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z
    .string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter um número'),
  phone: z.string().optional(),
  salonName: z.string().min(2, 'Nome do salão obrigatório'),
  salonSlug: z
    .string()
    .min(2, 'URL obrigatória')
    .regex(/^[a-z0-9-]+$/, 'Apenas letras minúsculas, números e hífen'),
  salonPhone: z.string().min(8, 'Telefone do salão obrigatório'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function CadastroPage() {
  const { register: registerUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  // Auto-gerar slug a partir do nome do salão
  function handleSalonNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    const slug = value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    setValue('salonSlug', slug);
  }

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true);
    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        salon: {
          name: data.salonName,
          slug: data.salonSlug,
          phone: data.salonPhone,
        },
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Erro ao criar conta'));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            Agenda<span className="text-gold">Beleza</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Comece gratuitamente — sem cartão de crédito
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-7">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Criar sua conta</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Já tem conta?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Entrar
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            {/* Dados pessoais */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Seus dados
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                placeholder="Ana Oliveira"
                disabled={isLoading}
                {...register('name')}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                disabled={isLoading}
                {...register('email')}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mín. 8 caracteres"
                autoComplete="new-password"
                disabled={isLoading}
                {...register('password')}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Separator />

            {/* Dados do salão */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Seu salão
              </p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salonName">Nome do salão</Label>
              <Input
                id="salonName"
                placeholder="Studio Ana"
                disabled={isLoading}
                {...register('salonName', {
                  onChange: handleSalonNameChange,
                })}
                className={errors.salonName ? 'border-destructive' : ''}
              />
              {errors.salonName && (
                <p className="text-xs text-destructive">{errors.salonName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salonSlug">URL pública do salão</Label>
              <div className="flex items-center rounded-lg border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
                <span className="px-3 py-2 text-xs text-muted-foreground bg-muted border-r border-input whitespace-nowrap">
                  agendabeleza.com/salao/
                </span>
                <Input
                  id="salonSlug"
                  placeholder="studio-ana"
                  disabled={isLoading}
                  {...register('salonSlug')}
                  className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              {errors.salonSlug && (
                <p className="text-xs text-destructive">{errors.salonSlug.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="salonPhone">Telefone do salão</Label>
              <Input
                id="salonPhone"
                type="tel"
                placeholder="(85) 99999-0001"
                disabled={isLoading}
                {...register('salonPhone')}
                className={errors.salonPhone ? 'border-destructive' : ''}
              />
              {errors.salonPhone && (
                <p className="text-xs text-destructive">{errors.salonPhone.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full mt-2" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Criando conta...
                </span>
              ) : (
                'Criar conta grátis'
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Ao criar sua conta, você concorda com os{' '}
              <span className="text-primary cursor-pointer hover:underline">
                Termos de Uso
              </span>
              .
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
