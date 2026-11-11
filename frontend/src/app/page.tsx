import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#292524] flex flex-col font-sans antialiased selection:bg-[#FDE68A] selection:text-[#1C1917]">
      {/* Barra de navegacao minimalista */}
      <header className="w-full bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E7E5E4] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#1C1917]">
            Agenda<span className="text-[#D97706]">Beleza</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-8 text-sm font-medium text-[#78716C]">
            <a href="#demonstracao" className="hover:text-[#1C1917] transition-colors">
              O sistema
            </a>
            <a href="#planos" className="hover:text-[#1C1917] transition-colors">
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-[#57534E] hover:text-[#1C1917] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-[#1C1917] hover:bg-[#292524] rounded-lg transition-colors shadow-sm"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section Direto e Clean */}
      <section className="pt-20 pb-14 px-6 max-w-4xl mx-auto text-center">
        <span className="inline-block px-3 py-1 mb-5 text-xs font-semibold uppercase tracking-wider text-[#B45309] bg-[#FEF3C7] rounded-full">
          Gestao e Agendamento Online
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1C1917] tracking-tight leading-[1.2] mb-5">
          Sua rotina de atendimentos sem a bagunça do WhatsApp
        </h1>
        <p className="text-lg text-[#57534E] max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Suas clientes escolhem servico e horario por um link exclusivo. Voce acompanha os atendimentos do dia em um painel simples e sem complicacao.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-[#D97706] hover:bg-[#B45309] rounded-lg transition-colors shadow-sm"
          >
            Cadastrar meu espaco
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-[#44403C] bg-white border border-[#D6D3D1] hover:bg-[#F5F5F4] rounded-lg transition-colors"
          >
            Acessar conta
          </Link>
        </div>
      </section>

      {/* Preview Real do Produto: Cards Demonstrativos */}
      <section id="demonstracao" className="py-12 px-6 max-w-5xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Card 1: Visao da Cliente */}
          <div className="lg:col-span-5 bg-white border border-[#E7E5E4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F5F5F4]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8A29E]">Visao da Cliente</span>
                <p className="text-sm font-semibold text-[#1C1917]">agendabeleza.com/salao-exemplo</p>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wide">1. Escolha o procedimento</span>
                <div className="mt-2 space-y-2">
                  <div className="p-3 bg-[#F5F5F4] border border-[#E7E5E4] rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1C1917]">Corte e Escova Modelada</p>
                      <p className="text-[11px] text-[#78716C]">Duracao: 50 min</p>
                    </div>
                    <span className="text-xs font-bold text-[#B45309]">R$ 80,00</span>
                  </div>
                  <div className="p-3 bg-white border border-[#E7E5E4] rounded-lg flex items-center justify-between opacity-75">
                    <div>
                      <p className="text-xs font-bold text-[#1C1917]">Design de Sobrancelhas</p>
                      <p className="text-[11px] text-[#78716C]">Duracao: 30 min</p>
                    </div>
                    <span className="text-xs font-bold text-[#78716C]">R$ 45,00</span>
                  </div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-[#78716C] uppercase tracking-wide">2. Horarios livres hoje</span>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  <span className="py-1.5 text-center text-xs font-bold bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] rounded-md">
                    14:00
                  </span>
                  <span className="py-1.5 text-center text-xs text-[#78716C] bg-[#FAFAF9] border border-[#E7E5E4] rounded-md">
                    15:00
                  </span>
                  <span className="py-1.5 text-center text-xs text-[#78716C] bg-[#FAFAF9] border border-[#E7E5E4] rounded-md">
                    16:30
                  </span>
                  <span className="py-1.5 text-center text-xs text-[#78716C] bg-[#FAFAF9] border border-[#E7E5E4] rounded-md">
                    17:30
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <div className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#1C1917] rounded-lg">
                  Confirmar Agendamento
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Visao do Painel do Salao */}
          <div className="lg:col-span-7 bg-white border border-[#E7E5E4] rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F5F5F4]">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#A8A29E]">Visao do Painel</span>
                <h3 className="text-base font-bold text-[#1C1917]">Agenda do Dia — Quarta-feira</h3>
              </div>
              <span className="text-xs font-medium text-[#78716C] bg-[#F5F5F4] px-2.5 py-1 rounded-md">
                3 atendimentos
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl text-center">
                <p className="text-[11px] text-[#78716C]">Pendentes</p>
                <p className="text-lg font-bold text-[#D97706]">1</p>
              </div>
              <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl text-center">
                <p className="text-[11px] text-[#78716C]">Confirmados</p>
                <p className="text-lg font-bold text-emerald-600">2</p>
              </div>
              <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl text-center">
                <p className="text-[11px] text-[#78716C]">Concluidos</p>
                <p className="text-lg font-bold text-[#1C1917]">5</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 bg-[#FAFAF9] border border-[#E7E5E4] rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1917]">14:00</span>
                    <span className="text-xs font-semibold text-[#44403C]">Mariana Souza</span>
                  </div>
                  <p className="text-[11px] text-[#78716C]">Corte e Escova • Atendente: Camila</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]">
                  Pendente
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E7E5E4] rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1917]">15:30</span>
                    <span className="text-xs font-semibold text-[#44403C]">Juliana Ramos</span>
                  </div>
                  <p className="text-[11px] text-[#78716C]">Coloracao Completa • Atendente: Rafael</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmado
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E7E5E4] rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#1C1917]">17:00</span>
                    <span className="text-xs font-semibold text-[#44403C]">Beatriz Lima</span>
                  </div>
                  <p className="text-[11px] text-[#78716C]">Manicure e Pedicure • Atendente: Ana</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmado
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 px-6 max-w-4xl mx-auto w-full border-t border-[#E7E5E4]">
        <div className="text-center mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1C1917] mb-2">Valores dos planos</h2>
          <p className="text-sm text-[#78716C]">Sem taxa de instalacao ou fidelidade. Cancele quando quiser.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-7 border border-[#E7E5E4] rounded-2xl flex flex-col justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#78716C]">Atendimento Individual</span>
              <h3 className="text-xl font-bold text-[#1C1917] mt-1 mb-2">Plano Starter</h3>
              <div className="text-3xl font-extrabold text-[#1C1917] mb-6">
                R$ 19,90 <span className="text-sm font-normal text-[#78716C]">/mes</span>
              </div>
              <ul className="text-xs text-[#57534E] space-y-2.5 mb-8">
                <li>• Pagina publica com link exclusivo para clientes</li>
                <li>• Gestao de horarios e agendamentos do dia</li>
                <li>• Cadastro de catalogo de servicos e precos</li>
                <li>• Suporte para um unico profissional</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-2.5 text-center text-xs font-bold text-[#1C1917] bg-[#F5F5F4] hover:bg-[#E7E5E4] rounded-lg transition-colors"
            >
              Comecar com Starter
            </Link>
          </div>

          <div className="bg-white p-7 border-2 border-[#D97706] rounded-2xl flex flex-col justify-between shadow-sm relative">
            <span className="absolute -top-3 right-6 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#D97706] rounded-full">
              Ideal para saloes
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B45309]">Com Equipe</span>
              <h3 className="text-xl font-bold text-[#1C1917] mt-1 mb-2">Plano Professional</h3>
              <div className="text-3xl font-extrabold text-[#1C1917] mb-6">
                R$ 39,90 <span className="text-sm font-normal text-[#78716C]">/mes</span>
              </div>
              <ul className="text-xs text-[#57534E] space-y-2.5 mb-8">
                <li>• Todas as funcoes do plano Starter</li>
                <li>• Cadastro de multiplos profissionais na mesma conta</li>
                <li>• Painel com divisao de atendimentos por equipe</li>
                <li>• Relatorio basico de agendamentos realizados</li>
              </ul>
            </div>
            <Link
              href="/register"
              className="w-full py-2.5 text-center text-xs font-bold text-white bg-[#D97706] hover:bg-[#B45309] rounded-lg transition-colors shadow-sm"
            >
              Comecar com Professional
            </Link>
          </div>
        </div>
      </section>

      {/* Rodape */}
      <footer className="py-8 px-6 bg-white border-t border-[#E7E5E4] text-xs text-[#78716C]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 AgendaBeleza. Sistema de gestao e agendamento para saloes.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-[#1C1917]">
              Entrar
            </Link>
            <Link href="/register" className="hover:text-[#1C1917]">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}