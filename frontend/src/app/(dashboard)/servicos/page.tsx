/**
 * Serviços — CRUD completo de serviços do salão
 */

'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useServices,
  useCreateService,
  useUpdateService,
  useDeleteService,
} from '@/hooks/useServices';
import { PageHeader } from '@/components/shared/PageHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Service, ServiceCategory } from '@/types/api';

// ─── Constantes ───────────────────────────────────────────────────────────────

const CATEGORY_LABELS: Record<ServiceCategory, string> = {
  HAIRCUT: 'Corte',
  COLORING: 'Coloração',
  STYLING: 'Penteado',
  NAILS: 'Unhas',
  MASSAGE: 'Massagem',
  SKINCARE: 'Skincare',
  LASHES: 'Cílios',
  WAXING: 'Depilação',
  OTHER: 'Outro',
};

// ─── Schema de validação ──────────────────────────────────────────────────────

const serviceSchema = z.object({
  name: z.string().min(2, 'Nome obrigatório'),
  description: z.string().optional(),
  category: z.string().min(1, 'Categoria obrigatória'),
  price: z
    .string()
    .min(1, 'Preço obrigatório')
    .refine((v) => !isNaN(Number(v.replace(',', '.'))) && Number(v.replace(',', '.')) > 0, {
      message: 'Preço inválido',
    }),
  durationMinutes: z.coerce
    .number()
    .int()
    .min(5, 'Mínimo 5 minutos')
    .max(480, 'Máximo 480 minutos'),
});

type ServiceFormInput = z.input<typeof serviceSchema>;
type ServiceFormData = z.output<typeof serviceSchema>;

// ─── Dialog de criação/edição ─────────────────────────────────────────────────

interface ServiceDialogProps {
  service?: Service | null;
  open: boolean;
  onClose: () => void;
}

function ServiceDialog({ service, open, onClose }: ServiceDialogProps) {
  const { mutate: create, isPending: isCreating } = useCreateService();
  const { mutate: update, isPending: isUpdating } = useUpdateService();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ServiceFormInput, unknown, ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service
      ? {
          name: service.name,
          description: service.description ?? '',
          category: service.category,
          price: String(parseFloat(service.price).toFixed(2)).replace('.', ','),
          durationMinutes: service.durationMinutes,
        }
      : {},
  });

  const category = watch('category');

  function onSubmit(data: ServiceFormData) {
    const payload = {
      name: data.name,
      description: data.description || undefined,
      category: data.category,
      price: Number(data.price.replace(',', '.')),
      durationMinutes: data.durationMinutes,
    };

    if (service) {
      update({ id: service.id, data: payload }, { onSuccess: () => { reset(); onClose(); } });
    } else {
      create(payload, { onSuccess: () => { reset(); onClose(); } });
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) { reset(); onClose(); } }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{service ? 'Editar serviço' : 'Novo serviço'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="s-name">Nome do serviço</Label>
            <Input id="s-name" placeholder="Corte feminino" {...register('name')} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Categoria</Label>
            <Select
              value={category ?? ''}
              onValueChange={(v) => setValue('category', v ?? '')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="s-price">Preço (R$)</Label>
              <Input id="s-price" placeholder="50,00" {...register('price')} />
              {errors.price && <p className="text-xs text-destructive">{errors.price.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-duration">Duração (min)</Label>
              <Input id="s-duration" type="number" placeholder="60" {...register('durationMinutes')} />
              {errors.durationMinutes && <p className="text-xs text-destructive">{errors.durationMinutes.message}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="s-desc">Descrição (opcional)</Label>
            <Input id="s-desc" placeholder="Descrição do serviço..." {...register('description')} />
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" type="button" onClick={() => { reset(); onClose(); }} disabled={isPending}>
              Cancelar
            </Button>
            <Button size="sm" type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : service ? 'Salvar' : 'Criar serviço'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Card de serviço ──────────────────────────────────────────────────────────

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const price = parseFloat(service.price).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold truncate">{service.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {CATEGORY_LABELS[service.category as ServiceCategory] ?? service.category}
          </p>
        </div>
        <Badge variant={service.active ? 'default' : 'secondary'} className="text-xs shrink-0">
          {service.active ? 'Ativo' : 'Inativo'}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="font-semibold text-primary">{price}</span>
        <span className="text-muted-foreground text-xs">{service.durationMinutes} min</span>
      </div>

      {service.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">{service.description}</p>
      )}

      <div className="flex gap-2 pt-1">
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

export default function ServicosPage() {
  const { data, isLoading } = useServices();
  const { mutate: deleteService } = useDeleteService();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const services = data?.services ?? [];

  function handleEdit(service: Service) {
    setEditingService(service);
    setDialogOpen(true);
  }

  function handleNew() {
    setEditingService(null);
    setDialogOpen(true);
  }

  function handleClose() {
    setDialogOpen(false);
    setEditingService(null);
  }

  return (
    <div className="space-y-5 max-w-5xl">
      <PageHeader
        title="Serviços"
        description="Gerencie os serviços oferecidos pelo seu salão"
        action={
          <Button size="sm" onClick={handleNew}>
            + Novo serviço
          </Button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-3">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-5 w-16" />
            </div>
          ))}
        </div>
      ) : services.length === 0 ? (
        <EmptyState
          title="Nenhum serviço cadastrado"
          description="Adicione os serviços que seu salão oferece para que os clientes possam agendar."
          action={
            <Button size="sm" onClick={handleNew}>
              + Adicionar serviço
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => handleEdit(service)}
              onDelete={() => deleteService(service.id)}
            />
          ))}
        </div>
      )}

      <ServiceDialog
        service={editingService}
        open={dialogOpen}
        onClose={handleClose}
      />
    </div>
  );
}
