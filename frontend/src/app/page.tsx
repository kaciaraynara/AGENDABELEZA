import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-white text-[#1F162B] flex flex-col font-sans selection:bg-[#EDE9FE] selection:text-[#5B21B6]">
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#EAE2F0] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F162B] transition-transform hover:scale-[1.02]">
            Agenda<span className="text-[#7C3AED]">Beleza</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6C5D7A]">
            <a href="#como-funciona" className="hover:text-[#7C3AED] transition-colors">
              ExperiÃªncia
            </a>
            <a href="#demonstracao" className="hover:text-[#7C3AED] transition-colors">
              Painel
            </a>
            <a href="#planos" className="hover:text-[#7C3AED] transition-colors">
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-3.5 py-2 text-sm font-medium text-[#6C5D7A] hover:text-[#1F162B] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-4 sm:px-5 py-2 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-sm shadow-[#7C3AED]/20 hover:shadow-md hover:shadow-[#7C3AED]/25 hover:-translate-y-0.5 transition-all"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden pt-16 sm:pt-24 pb-16 px-5 sm:px-8 bg-gradient-to-b from-white via-[#FAF7FC] to-white">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[540px] h-[260px] bg-[#DDD6FE]/45 blur-[110px] pointer-events-none rounded-full" />

        <div className="relative max-w-3xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 mb-6 text-xs font-semibold tracking-wide text-[#6D28D9] bg-[#F3EBF9] border border-[#E9D5FF] rounded-full">
            Cuidado, beleza e rotina organizada
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1F162B] tracking-tight leading-[1.18] mb-5">
            O espaÃ§o de beleza organizado do jeito que suas clientes merecem
          </h1>

          <p className="text-base sm:text-lg text-[#6C5D7A] max-w-xl mx-auto mb-9 leading-relaxed">
            Tenha um link leve e elegante para cada cliente escolher o procedimento e o horÃ¡rio pelo celular, enquanto vocÃª acompanha tudo em tempo real.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl shadow-md shadow-[#7C3AED]/20 hover:shadow-lg hover:-translate-y-0.5 transition-all text-center"
            >
              Cadastrar meu espaÃ§o grÃ¡tis
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-[#5B21B6] bg-[#FAF7FC] border border-[#DDD6FE] hover:bg-[#F3EBF9] rounded-xl hover:-translate-y-0.5 transition-all text-center"
            >
              Acessar minha conta
            </Link>
          </div>
        </div>
      </section>

      <section id="demonstracao" className="py-12 px-5 sm:px-8 max-w-5xl mx-auto w-full animate-fade-up-delay">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          <div className="lg:col-span-5 bg-white border border-[#EAE2F0] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#C4B5FD] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#FAF7FC]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9F8FB0] block">
                    Link pÃºblico da cliente
                  </span>
                  <p className="text-sm font-bold text-[#1F162B] mt-0.5">
                    /salao/studio-lilas
                  </p>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F3EBF9] text-[#6D28D9] border border-[#E9D5FF]">
                  Aberto hoje
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#6C5D7A] mb-2">
                    Procedimento selecionado
                  </p>
                  <div className="p-3.5 bg-[#FAF7FC] border border-[#E9D5FF] rounded-xl flex items-center justify-between transition-colors hover:bg-[#F3EBF9]">
                    <div>
                      <p className="text-xs font-bold text-[#1F162B]">HidrataÃ§Ã£o + Escova</p>
                      <p className="text-[11px] text-[#6C5D7A] mt-0.5">50 min â€¢ Com Camila</p>
                    </div>
                    <span className="text-xs font-bold text-[#7C3AED]">R$ 95,00</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#6C5D7A] mb-2">
                    HorÃ¡rios disponÃ­veis
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <span className="py-2 text-center text-xs font-semibold bg-[#7C3AED] text-white rounded-lg shadow-sm">
                      14:00
                    </span>
                    <span className="py-2 text-center text-xs text-[#6C5D7A] bg-[#FAF7FC] border border-[#EAE2F0] hover:border-[#C4B5FD] rounded-lg transition-colors">
                      15:00
                    </span>
                    <span className="py-2 text-center text-xs text-[#6C5D7A] bg-[#FAF7FC] border border-[#EAE2F0] hover:border-[#C4B5FD] rounded-lg transition-colors">
                      16:30
                    </span>
                    <span className="py-2 text-center text-xs text-[#6C5D7A] bg-[#FAF7FC] border border-[#EAE2F0] hover:border-[#C4B5FD] rounded-lg transition-colors">
                      17:30
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#FAF7FC]">
              <div className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#1F162B] rounded-xl">
                Confirmar Agendamento
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-[#EAE2F0] rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#C4B5FD] transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#FAF7FC]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9F8FB0] block">
                  Painel de GestÃ£o
                </span>
                <h2 className="text-base font-bold text-[#1F162B] mt-0.5">
                  Atendimentos de hoje
                </h2>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1 bg-[#FAF7FC] border border-[#EAE2F0] rounded-lg text-[#6C5D7A]">
                  Pendentes: <strong className="text-[#7C3AED]">1</strong>
                </span>
                <span className="px-3 py-1 bg-[#FAF7FC] border border-[#EAE2F0] rounded-lg text-[#6C5D7A]">
                  Confirmados: <strong className="text-[#1F162B]">2</strong>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#FAF7FC] border border-[#E9D5FF] rounded-xl flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#6D28D9] bg-white border border-[#E9D5FF] px-2.5 py-1.5 rounded-lg">
                    14:00
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F162B]">Mariana Souza</p>
                    <p className="text-[11px] text-[#6C5D7A]">Corte + Escova â€¢ Camila</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3EBF9] text-[#7C3AED]">
                  Aguardando
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#EAE2F0] rounded-xl flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#1F162B] bg-[#FAF7FC] border border-[#EAE2F0] px-2.5 py-1.5 rounded-lg">
                    15:30
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F162B]">Juliana Oliveira</p>
                    <p className="text-[11px] text-[#6C5D7A]">Design de Sobrancelhas â€¢ Ana</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmado
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#EAE2F0] rounded-xl flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#1F162B] bg-[#FAF7FC] border border-[#EAE2F0] px-2.5 py-1.5 rounded-lg">
                    17:00
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1F162B]">Beatriz Fontes</p>
                    <p className="text-[11px] text-[#6C5D7A]">Manicure em Gel â€¢ Larissa</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Confirmado
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="py-16 px-5 sm:px-8 bg-[#FAF7FC] border-y border-[#EAE2F0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1F162B] mb-2">Feito para a rotina do seu salÃ£o</h2>
            <p className="text-sm text-[#6C5D7A]">Do celular ao computador, tudo sincronizado em segundos.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#EAE2F0] rounded-2xl hover:border-[#C4B5FD] hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-bold text-[#7C3AED] bg-[#F3EBF9] px-2.5 py-1 rounded-md mb-3">
                01
              </span>
              <h3 className="text-base font-bold text-[#1F162B] mb-1.5">Monte seu catÃ¡logo</h3>
              <p className="text-xs sm:text-sm text-[#6C5D7A] leading-relaxed">
                Cadastre serviÃ§os, valores e a duraÃ§Ã£o de cada procedimento para organizar os horÃ¡rios sem furos.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE2F0] rounded-2xl hover:border-[#C4B5FD] hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-bold text-[#7C3AED] bg-[#F3EBF9] px-2.5 py-1 rounded-md mb-3">
                02
              </span>
              <h3 className="text-base font-bold text-[#1F162B] mb-1.5">Compartilhe seu link</h3>
              <p className="text-xs sm:text-sm text-[#6C5D7A] leading-relaxed">
                Deixe o endereÃ§o do seu espaÃ§o na bio do Instagram para suas clientes agendarem a qualquer hora.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE2F0] rounded-2xl hover:border-[#C4B5FD] hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-bold text-[#7C3AED] bg-[#F3EBF9] px-2.5 py-1 rounded-md mb-3">
                03
              </span>
              <h3 className="text-base font-bold text-[#1F162B] mb-1.5">Atenda com tranquilidade</h3>
              <p className="text-xs sm:text-sm text-[#6C5D7A] leading-relaxed">
                Acompanhe os agendamentos confirmados pelo celular ou tablet e mantenha a equipe alinhada.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="py-16 sm:py-20 px-5 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F162B] mb-2">Planos transparentes</h2>
          <p className="text-sm text-[#6C5D7A]">Comece grÃ¡tis por 7 dias. Sem fidelidade.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-7 border border-[#EAE2F0] rounded-2xl shadow-sm hover:border-[#C4B5FD] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1F162B]">Starter</h3>
                <span className="text-[11px] font-medium text-[#6C5D7A]">Atendimento Individual</span>
              </div>
              <div className="text-3xl font-extrabold text-[#1F162B] mb-5">
                R$ 19,90 <span className="text-xs font-normal text-[#6C5D7A]">/mÃªs</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#6C5D7A] space-y-2.5 mb-7 border-t border-[#FAF7FC] pt-4">
                <li>â€¢ Link exclusivo para agendamentos</li>
                <li>â€¢ GestÃ£o completa da agenda do dia</li>
                <li>â€¢ Cadastro de serviÃ§os e preÃ§os</li>
              </ul>
            </div>
            <Link
              href="/cadastro"
              className="w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-[#5B21B6] bg-[#FAF7FC] border border-[#DDD6FE] hover:bg-[#F3EBF9] rounded-xl transition-colors"
            >
              ComeÃ§ar no Starter
            </Link>
          </div>

          <div className="bg-white p-7 border-2 border-[#7C3AED] rounded-2xl shadow-md shadow-[#7C3AED]/10 flex flex-col justify-between relative hover:-translate-y-0.5 transition-all">
            <span className="absolute -top-3 right-6 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#7C3AED] rounded-full">
              Mais escolhido
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1F162B]">Professional</h3>
                <span className="text-[11px] font-medium text-[#6D28D9]">SalÃµes com Equipe</span>
              </div>
              <div className="text-3xl font-extrabold text-[#7C3AED] mb-5">
                R$ 39,90 <span className="text-xs font-normal text-[#6C5D7A]">/mÃªs</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#6C5D7A] space-y-2.5 mb-7 border-t border-[#FAF7FC] pt-4">
                <li>â€¢ Tudo o que existe no Starter</li>
                <li>â€¢ Agenda individual por profissional</li>
                <li>â€¢ Painel completo de atendimentos da equipe</li>
              </ul>
            </div>
            <Link
              href="/cadastro"
              className="w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] rounded-xl transition-colors shadow-sm"
            >
              ComeÃ§ar no Professional
            </Link>
          </div>
        </div>
      </section>

      <footer className="mt-auto py-8 px-6 bg-[#FAF7FC] border-t border-[#EAE2F0] text-xs text-[#6C5D7A]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Agenda<span className="text-[#7C3AED] font-semibold">Beleza</span> â€” Cuidado e organizaÃ§Ã£o para o seu espaÃ§o.
          </p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-[#7C3AED] transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro" className="hover:text-[#7C3AED] transition-colors">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}