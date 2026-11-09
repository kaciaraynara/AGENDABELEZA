/**
 * Profissionais — CRUD completo de profissionais do salão
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useProfessionals,
  useCreateProfessional,
  useUpdateProfessional,
  useDeleteProfessional,
} from '@/hooks/useProfessionals';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { Professional } from '@/types/api';

// ─── Schema ───────────────────────────────────────────────────────────────────

const professionalSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  phone: z.string().min(8, 'Telefone obrigatório'),
  bio: z.string().optional(),
  avatarUrl: z.string().url('Deve ser um URL válido').or(z.literal('')).optional(),
});

type ProfessionalFormData = z.infer<typeof professionalSchema>;

// ─── Dialog ───────────────────────────────────────────────────────────────────

interface ProfessionalDialogProps {
  professional?: Professional | null;
  open: boolean;
  onClose: () => void;
}

function ProfessionalDialog({ professional, open, onClose }: ProfessionalDialogProps) {
  const { mutate: create, isPending: isCreating } = useCreateProfessional();
  const { mutate: update, isPending: isUpdating } = useUpdateProfessional();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalSchema),
    defaultValues: professional
      ? { name: professional.name, phone: professional.phone, bio: professional.bio ?? '', avatarUrl: professional.avatarUrl ?? '' }
      : {},
  });

  function onSubmit(data: ProfessionalFormData) {
    const payload = {
      name: data.name,
      phone: data.phone,
      bio: data.bio || undefined,
      avatarUrl: data.avatarUrl || undefined,
    };

    if (professional) {
      update({ id: professional.id, data: payload }, { onSuccess: () => { reset(); onClose(); } });
    } else {
      create(payload, { onSuccess: () => { reset(); onClose(); } });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {professional ? 'Editar profissional' : 'Adicionar profissional'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Nome completo</Label>
            <Input id="p-name" placeholder="Ana Silva" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-phone">Telefone</Label>
            <Input id="p-phone" type="tel" placeholder="(85) 99999-0002" {...register('phone')} />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-bio">Bio / Especialidades (opcional)</Label>
            <Input id="p-bio" placeholder="Especialista em coloração e corte" {...register('bio')} />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="p-avatar">URL da Foto de Perfil (opcional)</Label>
            <Input id="p-avatar" placeholder="https://exemplo.com/foto.jpg" {...register('avatarUrl')} />
            {errors.avatarUrl && <p className="text-xs text-destructive">{errors.avatarUrl.message}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" type="button" onClick={() => { reset(); onClose(); }} disabled={isPending}>
              Cancelar
            </Button>
            <Button size="sm" type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : professional ? 'Salvar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Card de profissional ─────────────────────────────────────────────────────

function ProfessionalCard({
  professional,
  onEdit,
  onDelete,
}: {
  professional: Professional;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const initials = professional.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start gap-3">
        {professional.avatarUrl ? (
          <img src={professional.avatarUrl} alt={professional.name} className="h-10 w-10 shrink-0 rounded-full object-cover border border-border" />
        ) : (
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="text-sm font-semibold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold truncate">{professional.name}</h3>
            <Badge variant={professional.active ? 'default' : 'secondary'} className="text-xs">
              {professional.active ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{professional.phone}</p>
          {professional.bio && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{professional.bio}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={onEdit}>
          Editar
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onDelete}
        >
          Remover
        </Button>
      </div>
    </div>
  );
}

// ─── Página ──────────────────────────────────────────────────────────────────

export default function ProfissionaisPage() {
  const { data, isLoading } = useProfessionals();
  const { mutate: deleteProfessional } = useDeleteProfessional();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);

  const professionals = data?.professionals ?? [];

  function handleEdit(p: Professional) {
    setEditingProfessional(p);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingProfessional(null);
    setDialogOpen(true);
  }

  function handleClose() {
    setDialogOpen(false);
    setEditingProfessional(null);
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <PageHeader
        title="Profissionais"
        description="Equipe do seu salão"
        action={
          <Button size="sm" onClick={handleNew}>
            + Adicionar profissional
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <div className="flex gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : professionals.length === 0 ? (
        <EmptyState
          title="Nenhum profissional cadastrado"
          description="Adicione os profissionais da sua equipe para que os clientes possam escolher na hora de agendar."
          action={
            <Button size="sm" onClick={handleNew}>
              + Adicionar profissional
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {professionals.map((professional) => (
            <ProfessionalCard
              key={professional.id}
              professional={professional}
              onEdit={() => handleEdit(professional)}
              onDelete={() => deleteProfessional(professional.id)}
            />
          ))}
        </div>
      )}

      <ProfessionalDialog
        professional={editingProfessional}
        open={dialogOpen}
        onClose={handleClose}
      />
    </div>
  );
}
