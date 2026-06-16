/**
 * Página pública do salão — /salao/[slug]
 */

import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `Salão ${slug}`,
    description: `Agende um horário no salão ${slug} pelo AgendaBeleza.`,
  };
}

export default async function SalaoPublicoPage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-charcoal text-white py-16 px-6 text-center">
        <p className="text-sm text-gold font-medium uppercase tracking-widest mb-2">
          AgendaBeleza
        </p>
        <h1 className="text-3xl font-semibold">Salão · {slug}</h1>
        <p className="text-sm text-white/60 mt-2">
          Agende o seu horário de forma rápida e fácil
        </p>
        <a
          href={`/salao/${slug}/agendar`}
          className="inline-block mt-6 px-6 py-3 bg-gold text-charcoal text-sm font-semibold rounded-lg hover:bg-gold-dark transition-colors"
        >
          Agendar agora
        </a>
      </div>

      {/* Conteúdo — próximo step */}
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-sm font-medium mb-4">Serviços disponíveis</h2>
          <div className="py-8 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
            Lista de serviços — Step 12b
          </div>
        </div>
      </div>
    </main>
  );
}
