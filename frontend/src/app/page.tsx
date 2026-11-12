import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1F1E1C] flex flex-col antialiased selection:bg-[#C59B6D]/20 selection:text-[#1F1E1C]">
      {/* CabeÃ§alho alinhado Ã  identidade do Login */}
      <header className="w-full bg-[#FAF8F5]/90 backdrop-blur-sm border-b border-[#EBE7E0] sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold tracking-tight text-[#1F1E1C]">
            Agenda<span className="text-[#C59B6D]">Beleza</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-8 text-sm text-[#78736E]">
            <a href="#demonstracao" className="hover:text-[#1F1E1C] transition-colors">
              DemonstraÃ§Ã£o
            </a>
            <a href="#planos" className="hover:text-[#1F1E1C] transition-colors">
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm text-[#57534E] hover:text-[#1F1E1C] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-4 py-2 text-sm font-medium text-white bg-[#1F1E1C] hover:bg-[#33312E] rounded-lg transition-colors"
            >
              Criar conta grÃ¡tis
            </Link>
          </div>
        </div>
      </header>

      {/* Chamada Principal (mesma estÃ©tica do Login, sem o selo superior) */}
      <section className="pt-16 pb-12 px-6 max-w-3xl mx-auto text-center">
        <h1 className="text-3xl sm:text-5xl font-bold text-[#1F1E1C] tracking-tight leading-[1.2] mb-4">
          A agenda do seu salÃ£o organizada em um sÃ³ lugar
        </h1>
        <p className="text-base sm:text-lg text-[#78736E] max-w-xl mx-auto mb-8 leading-relaxed">
          Compartilhe o link do seu espaÃ§o para suas clientes escolherem serviÃ§o, profissional e horÃ¡rio direto pelo celular.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="w-full sm:w-auto px-7 py-2.5 text-sm font-medium text-white bg-[#1F1E1C] hover:bg-[#33312E] rounded-lg transition-colors"
          >
            Criar conta grÃ¡tis
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-7 py-2.5 text-sm font-medium text-[#1F1E1C] bg-white border border-[#DED9D0] hover:bg-[#F4F1EC] rounded-lg transition-colors"
          >
            Entrar na minha conta
          </Link>
        </div>
      </section>

      {/* Cards Demonstrativos com o mesmo acabamento do Card de Login */}
      <section id="demonstracao" className="py-10 px-6 max-w-5xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          {/* Card 1: PÃ¡gina PÃºblica da Cliente */}
          <div className="lg:col-span-5 bg-white border border-[#EBE7E0] rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F4F1EC]">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#A09A93] block">
                    Link pÃºblico da cliente
                  </span>
                  <p className="text-sm font-bold text-[#1F1E1C] mt-0.5">
                    /salao/studio-beleza
                  </p>
                </div>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#8C6D46] border border-[#E6DEC8]">
                  Online
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#57534E] mb-2">
                    Procedimento selecionado
                  </p>
                  <div className="p-3.5 bg-[#FAF8F5] border border-[#E6DEC8] rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1F1E1C]">Corte + Escova Modelada</p>
                      <p className="text-[11px] text-[#78736E] mt-0.5">50 minutos â€¢ Com Camila</p>
                    </div>
                    <span className="text-xs font-bold text-[#8C6D46]">R$ 85,00</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#57534E] mb-2">
                    HorÃ¡rios disponÃ­veis
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <span className="py-1.5 text-center text-xs font-medium bg-[#1F1E1C] text-white rounded-md">
                      14:00
                    </span>
                    <span className="py-1.5 text-center text-xs text-[#57534E] bg-[#FAF8F5] border border-[#EBE7E0] rounded-md">
                      15:00
                    </span>
                    <span className="py-1.5 text-center text-xs text-[#57534E] bg-[#FAF8F5] border border-[#EBE7E0] rounded-md">
                      16:30
                    </span>
                    <span className="py-1.5 text-center text-xs text-[#57534E] bg-[#FAF8F5] border border-[#EBE7E0] rounded-md">
                      17:30
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F4F1EC]">
              <div className="w-full py-2 text-center text-xs font-medium text-white bg-[#1F1E1C] rounded-lg">
                Confirmar horÃ¡rio
              </div>
            </div>
          </div>

          {/* Card 2: VisÃ£o Interna da Agenda do SalÃ£o */}
          <div className="lg:col-span-7 bg-white border border-[#EBE7E0] rounded-xl p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F4F1EC]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#A09A93] block">
                  Painel do salÃ£o
                </span>
                <h2 className="text-base font-bold text-[#1F1E1C] mt-0.5">
                  Agenda de hoje
                </h2>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EBE7E0] rounded-md text-[#57534E]">
                  Pendentes: <strong className="text-[#1F1E1C]">1</strong>
                </span>
                <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EBE7E0] rounded-md text-[#57534E]">
                  Confirmados: <strong className="text-[#1F1E1C]">2</strong>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#FAF8F5] border border-[#EBE7E0] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#1F1E1C] bg-white border border-[#EBE7E0] px-2.5 py-1.5 rounded-md">
                    14:00
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F1E1C]">Mariana Souza</p>
                    <p className="text-[11px] text-[#78736E]">Corte + Escova â€¢ Profissional: Camila</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#FBF6EE] text-[#9A7442] border border-[#E8D8C0]">
                  Aguardando
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#EBE7E0] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#1F1E1C] bg-[#FAF8F5] border border-[#EBE7E0] px-2.5 py-1.5 rounded-md">
                    15:30
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F1E1C]">Juliana Oliveira</p>
                    <p className="text-[11px] text-[#78736E]">ColoraÃ§Ã£o e HidrataÃ§Ã£o â€¢ Profissional: Rafael</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F2F7F4] text-[#3B6E52] border border-[#CDE2D5]">
                  Confirmado
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#EBE7E0] rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#1F1E1C] bg-[#FAF8F5] border border-[#EBE7E0] px-2.5 py-1.5 rounded-md">
                    17:00
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F1E1C]">Beatriz Fontes</p>
                    <p className="text-[11px] text-[#78736E]">Manicure e Pedicure â€¢ Profissional: Ana</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F2F7F4] text-[#3B6E52] border border-[#CDE2D5]">
                  Confirmado
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SeÃ§Ã£o de Planos no mesmo estilo de card */}
      <section id="planos" className="py-16 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-[#1F1E1C] mb-1.5">Planos para o seu espaÃ§o</h2>
          <p className="text-sm text-[#78736E]">Comece com 7 dias de teste grÃ¡tis. Cancele quando quiser.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-7 border border-[#EBE7E0] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1F1E1C]">Starter</h3>
                <span className="text-[11px] text-[#78736E]">Individual</span>
              </div>
              <div className="text-2xl font-bold text-[#1F1E1C] mb-5">
                R$ 19,90 <span className="text-xs font-normal text-[#78736E]">/mÃªs</span>
              </div>
              <ul className="text-xs text-[#57534E] space-y-2.5 mb-7 border-t border-[#F4F1EC] pt-4">
                <li>GestÃ£o da agenda diÃ¡ria</li>
                <li>Link pÃºblico para agendamento de clientes</li>
                <li>Cadastro de serviÃ§os, tempos e valores</li>
              </ul>
            </div>
            <Link
              href="/cadastro"
              className="w-full py-2.5 text-center text-xs font-medium text-[#1F1E1C] bg-[#FAF8F5] border border-[#DED9D0] hover:bg-[#F4F1EC] rounded-lg transition-colors"
            >
              ComeÃ§ar no Starter
            </Link>
          </div>

          <div className="bg-white p-7 border border-[#C59B6D] rounded-xl shadow-[0_2px_12px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1F1E1C]">Professional</h3>
                <span className="text-[11px] font-medium text-[#8C6D46] bg-[#FBF6EE] px-2.5 py-0.5 rounded-full border border-[#E8D8C0]">
                  Equipes e SalÃµes
                </span>
              </div>
              <div className="text-2xl font-bold text-[#1F1E1C] mb-5">
                R$ 39,90 <span className="text-xs font-normal text-[#78736E]">/mÃªs</span>
              </div>
              <ul className="text-xs text-[#57534E] space-y-2.5 mb-7 border-t border-[#F4F1EC] pt-4">
                <li>Todos os recursos do plano Starter</li>
                <li>Agenda separada para mÃºltiplos profissionais</li>
                <li>VisÃ£o geral dos atendimentos do salÃ£o</li>
              </ul>
            </div>
            <Link
              href="/cadastro"
              className="w-full py-2.5 text-center text-xs font-medium text-white bg-[#1F1E1C] hover:bg-[#33312E] rounded-lg transition-colors"
            >
              ComeÃ§ar no Professional
            </Link>
          </div>
        </div>
      </section>

      {/* RodapÃ© discreto */}
      <footer className="mt-auto py-6 px-6 border-t border-[#EBE7E0] text-xs text-[#78736E]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Agenda<span className="text-[#C59B6D] font-semibold">Beleza</span> â€” OrganizaÃ§Ã£o diÃ¡ria para salÃµes.
          </p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-[#1F1E1C]">
              Entrar
            </Link>
            <Link href="/cadastro" className="hover:text-[#1F1E1C]">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
