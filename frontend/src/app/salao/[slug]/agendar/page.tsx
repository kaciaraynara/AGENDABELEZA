/**
 * Fluxo público de agendamento — /salao/[slug]/agendar
 */

import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Agendar — ${slug}`,
    description: `Faça seu agendamento no salão ${slug}.`,
  };
}

export default async function AgendarPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-cream">
      {/* Header simples */}
      <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3">
        <a
          href={`/salao/${slug}`}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Voltar
        </a>
        <span className="text-sm text-muted-foreground">/</span>
        <span className="text-sm font-medium">Agendar horário</span>
      </div>

      {/* Fluxo de agendamento — próximo step */}
      <div className="max-w-lg mx-auto px-4 py-10">
        <div className="bg-card rounded-xl border border-border p-6 space-y-4">
          <div>
            <h1 className="text-lg font-semibold">Fazer agendamento</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Escolha o serviço, profissional e horário
            </p>
          </div>

          {/* Steps — próximo step */}
          <div className="flex items-center gap-2 py-2">
            {['Serviço', 'Profissional', 'Horário', 'Dados'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium ${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {i + 1}
                  </div>
                  <span className={`text-xs ${i === 0 ? 'font-medium' : 'text-muted-foreground'}`}>
                    {step}
                  </span>
                </div>
                {i < 3 && <div className="w-6 h-px bg-border" />}
              </div>
            ))}
          </div>

          <div className="py-10 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            Fluxo de agendamento — Step 12b
          </div>
        </div>
      </div>
    </main>
  );
}
