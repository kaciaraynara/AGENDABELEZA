/**
 * Página pública do salão — /salao/[slug]
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { publicApi } from '@/lib/api/public.api';
import type { PublicSalonResponse, Service } from '@/types/api';
import { Store, Scissors, MapPin } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function SalaoPublicoPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [salonData, setSalonData] = useState<PublicSalonResponse | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [salonRes, servicesRes] = await Promise.all([
          publicApi.getSalon(slug),
          publicApi.getServices(slug)
        ]);
        setSalonData(salonRes);
        setServices(servicesRes.services);
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar as informações deste salão. Verifique se o link está correto.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner className="w-8 h-8 text-primary" />
      </div>
    );
  }

  if (error || !salonData?.salon) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Store className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h1 className="text-xl font-semibold text-foreground">Salão não encontrado</h1>
        <p className="text-muted-foreground mt-2">{error || 'O link pode estar quebrado ou o salão foi desativado.'}</p>
      </div>
    );
  }

  const { salon } = salonData;

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Hero Profissional */}
      <div className="bg-primary text-primary-foreground py-20 px-6 text-center">
        <div className="w-24 h-24 bg-primary-foreground/10 rounded-full mx-auto flex items-center justify-center mb-6 overflow-hidden border-4 border-primary-foreground/20">
          {salon.avatarUrl ? (
            <img src={salon.avatarUrl} alt={`Logo do Salão ${salon.name}`} className="w-full h-full object-cover" />
          ) : (
            <Store className="w-10 h-10 text-primary-foreground" />
          )}
        </div>
        <h1 className="text-4xl font-bold tracking-tight">{salon.name}</h1>
        {(salon.address || salon.city) && (
          <p className="text-primary-foreground/80 mt-4 flex items-center justify-center gap-2">
            <MapPin size={16} />
            {[salon.address, salon.city, salon.state].filter(Boolean).join(', ')}
          </p>
        )}
        <button
          onClick={() => router.push(`/salao/${slug}/agendar`)}
          className="inline-block mt-8 px-8 py-3.5 bg-accent text-accent-foreground text-sm font-semibold rounded-lg hover:bg-accent/90 transition-all shadow-sm active:scale-95"
        >
          Agendar um Horário
        </button>
      </div>

      {/* Lista de Serviços */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Scissors size={20} className="text-accent" />
          Serviços Profissionais
        </h2>
        
        {services.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-border rounded-xl bg-card">
            <p className="text-muted-foreground">Este salão ainda não possui serviços cadastrados.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="bg-card border border-border p-5 rounded-xl hover:border-accent/50 transition-colors shadow-sm flex flex-col justify-between"
              >
                <div className="flex gap-4">
                  {service.imageUrl && (
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden border border-border">
                      <img src={service.imageUrl} alt={service.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">{service.name}</h3>
                    {service.description && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{service.description}</p>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(service.price))}
                  </span>
                  <span className="text-muted-foreground">{service.durationMinutes} min</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
