/**
 * Fluxo público de agendamento — /salao/[slug]/agendar
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { publicApi, type CreatePublicAppointmentPayload } from '@/lib/api/public.api';
import type { PublicSalonResponse, Service, Professional } from '@/types/api';
import { Store, Scissors, User, Calendar as CalendarIcon, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

const STEPS = ['Serviço', 'Profissional', 'Horário', 'Seus Dados'];

// Horários mockados para o MVP
const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
];

export default function AgendarPage() {
  const { slug } = useParams() as { slug: string };
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [salon, setSalon] = useState<PublicSalonResponse['salon'] | null>(null);
  
  // Data Fetching
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Booking State
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientData, setClientData] = useState({ name: '', phone: '', email: '' });

  useEffect(() => {
    async function init() {
      try {
        const [salonRes, srvRes, profRes] = await Promise.all([
          publicApi.getSalon(slug),
          publicApi.getServices(slug),
          publicApi.getProfessionals(slug)
        ]);
        setSalon(salonRes.salon);
        setServices(srvRes.services);
        setProfessionals(profRes.professionals);
        
        // Seta data de hoje por padrão (formato YYYY-MM-DD)
        setSelectedDate(new Date().toISOString().split('T')[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingInit(false);
      }
    }
    init();
  }, [slug]);

  const handleNext = () => {
    setStep(s => {
      let nextStep = Math.min(s + 1, STEPS.length - 1);
      // Pular passo do profissional se não houver nenhum cadastrado
      if (nextStep === 1 && professionals.length === 0) {
        nextStep = 2;
      }
      return nextStep;
    });
  };
  
  const handleBack = () => {
    setStep(s => {
      let prevStep = Math.max(s - 1, 0);
      // Se voltamos para o passo do profissional mas não há nenhum
      if (prevStep === 1 && professionals.length === 0) {
        prevStep = 0;
      }
      return prevStep;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) return;
    
    // Se o salão tem profissionais cadastrados, a seleção é obrigatória
    if (professionals.length > 0 && !selectedProf) return;

    setSubmitting(true);
    try {
      // Monta data ISO: YYYY-MM-DDT09:00:00.000Z
      const scheduledAt = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();
      
      const payload: CreatePublicAppointmentPayload = {
        clientName: clientData.name,
        clientPhone: clientData.phone,
        clientEmail: clientData.email,
        serviceId: selectedService.id,
        scheduledAt,
      };

      if (selectedProf) {
        payload.professionalId = selectedProf.id;
      }

      await publicApi.createAppointment(slug, payload);
      setSuccess(true);
    } catch (err) {
      alert('Erro ao realizar agendamento. Verifique seus dados e tente novamente.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Agendamento Confirmado!</h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          Seu horário para {selectedService?.name} {selectedProf ? `com ${selectedProf.name}` : ''} foi reservado com sucesso no salão {salon?.name}.
        </p>
        <button
          onClick={() => router.push(`/salao/${slug}`)}
          className="mt-8 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Voltar ao Salão
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/salao/${slug}`)} className="text-sm font-medium text-muted-foreground hover:text-foreground">
            ← Voltar
          </button>
          <span className="text-muted-foreground">|</span>
          <span className="text-sm font-bold text-foreground">{salon?.name || 'Agendamento'}</span>
        </div>
        <div className="text-xs font-semibold text-accent uppercase tracking-wider">
          Passo {step + 1} de {STEPS.length}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        
        {/* Progress Bar */}
        <div className="flex items-center justify-between mb-8 px-2">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-col items-center gap-2 relative z-0 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= i ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {i + 1}
              </div>
              <span className={`text-xs font-medium text-center ${step >= i ? 'text-foreground' : 'text-muted-foreground hidden sm:block'}`}>
                {label}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`absolute top-4 left-[50%] w-full h-[2px] -z-10 ${step > i ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Formulário Wizard */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 sm:p-8">
          
          {/* STEP 1: SERVIÇO */}
          {step === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-bold flex items-center gap-2"><Scissors size={20} className="text-accent" /> Escolha o Serviço</h2>
              <div className="grid gap-3">
                {services.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelectedService(s); handleNext(); }}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${selectedService?.id === s.id ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:border-accent/50'}`}
                  >
                    {s.imageUrl && (
                      <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-border">
                        <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{s.durationMinutes} min</p>
                    </div>
                    <span className="font-bold text-foreground">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(s.price))}
                    </span>
                  </button>
                ))}
                {services.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center">Nenhum serviço disponível.</p>}
              </div>
            </div>
          )}

          {/* STEP 2: PROFISSIONAL */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-bold flex items-center gap-2"><User size={20} className="text-accent" /> Escolha o Profissional</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {professionals.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { setSelectedProf(p); handleNext(); }}
                    className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${selectedProf?.id === p.id ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-border hover:border-accent/50'}`}
                  >
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground font-bold overflow-hidden border border-border shrink-0">
                      {p.avatarUrl ? (
                        <img src={p.avatarUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        p.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{p.name}</p>
                    </div>
                  </button>
                ))}
                {professionals.length === 0 && <p className="text-sm text-muted-foreground py-4 text-center sm:col-span-2">Nenhum profissional disponível.</p>}
              </div>
            </div>
          )}

          {/* STEP 3: HORÁRIO */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-bold flex items-center gap-2"><CalendarIcon size={20} className="text-accent" /> Escolha Data e Horário</h2>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Data do Agendamento</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-accent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Horários Disponíveis (Estimativa)</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {TIME_SLOTS.map(time => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 rounded-lg text-sm font-medium border transition-all ${selectedTime === time ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-input hover:border-accent'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleNext}
                  disabled={!selectedDate || !selectedTime}
                  className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl disabled:opacity-50 hover:bg-primary/90 flex justify-center items-center gap-2 transition-all"
                >
                  Continuar <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: DADOS E CONFIRMAÇÃO */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-lg font-bold flex items-center gap-2"><Store size={20} className="text-accent" /> Seus Dados</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Nome Completo *</label>
                  <input required type="text" value={clientData.name} onChange={e => setClientData({...clientData, name: e.target.value})} className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-accent outline-none" placeholder="Maria Silva" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">WhatsApp *</label>
                  <input required type="tel" value={clientData.phone} onChange={e => setClientData({...clientData, phone: e.target.value})} className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-accent outline-none" placeholder="(11) 99999-9999" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">E-mail (Opcional)</label>
                  <input type="email" value={clientData.email} onChange={e => setClientData({...clientData, email: e.target.value})} className="w-full p-3 rounded-xl border border-input bg-background focus:ring-2 focus:ring-accent outline-none" placeholder="maria@email.com" />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl border border-border">
                <h3 className="text-sm font-bold mb-2">Resumo do Agendamento</h3>
                <p className="text-sm text-muted-foreground"><strong>Serviço:</strong> {selectedService?.name}</p>
                {professionals.length > 0 && selectedProf && (
                  <p className="text-sm text-muted-foreground"><strong>Profissional:</strong> {selectedProf.name}</p>
                )}
                <p className="text-sm text-muted-foreground"><strong>Data/Hora:</strong> {selectedDate.split('-').reverse().join('/')} às {selectedTime}</p>
                <p className="text-sm font-bold text-foreground mt-2 border-t border-border pt-2">
                  Total: {selectedService && new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(selectedService.price))}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-accent text-accent-foreground font-bold rounded-xl disabled:opacity-70 hover:bg-accent/90 transition-all flex justify-center items-center shadow-md active:scale-95"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Agendamento'}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Botão Voltar (Steps > 0) */}
        {step > 0 && !success && (
          <button onClick={handleBack} className="mt-6 text-sm font-medium text-muted-foreground hover:text-foreground mx-auto block">
            ← Voltar passo anterior
          </button>
        )}

      </div>
    </main>
  );
}
