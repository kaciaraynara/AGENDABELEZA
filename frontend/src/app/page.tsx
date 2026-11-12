import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-white text-[#1E1624] flex flex-col font-sans antialiased selection:bg-[#EFE8F4] selection:text-[#4B2C5E]">
      {/* Navegacao Superior Minimalista */}
      <header className="w-full bg-white/95 backdrop-blur-sm border-b border-[#EAE2F0] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold tracking-tight text-[#1E1624]">
            Agenda<span className="text-[#5E3A73]">Beleza</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B5E75]">
            <a href="#demonstracao" className="hover:text-[#5E3A73] transition-colors">
              Painel
            </a>
            <a href="#como-funciona" className="hover:text-[#5E3A73] transition-colors">
              Como funciona
            </a>
            <a href="#planos" className="hover:text-[#5E3A73] transition-colors">
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="px-3.5 py-2 text-sm font-medium text-[#6B5E75] hover:text-[#1E1624] transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="px-4 sm:px-5 py-2 text-sm font-semibold text-white bg-[#5E3A73] hover:bg-[#4B2C5E] rounded-lg transition-colors shadow-sm"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section com Fundo Branco e Detalhes Minimalistas */}
      <section className="relative overflow-hidden pt-20 sm:pt-24 pb-16 px-5 sm:px-8 bg-white">
        {/* Detalhe minimalista de pontos suaves no fundo */}
        <div
          className="absolute inset-0 pointer-events-none opacity-45"
          style={{
            backgroundImage: 'radial-gradient(#D9CDE3 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        {/* Linhas finas decorativas minimalistas */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-[#D9CDE3] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1E1624] tracking-tight leading-[1.18] mb-5">
            O espa&ccedil;o de beleza organizado do jeito que suas clientes merecem
          </h1>

          <p className="text-base sm:text-lg text-[#6B5E75] max-w-xl mx-auto mb-9 leading-relaxed">
            Envie um link exclusivo para cada cliente escolher o procedimento e o hor&aacute;rio pelo celular, enquanto voc&ecirc; acompanha a agenda do dia em um s&oacute; lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link
              href="/cadastro"
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-white bg-[#5E3A73] hover:bg-[#4B2C5E] rounded-lg shadow-sm hover:-translate-y-0.5 transition-all text-center"
            >
              Cadastrar meu espa&ccedil;o gr&aacute;tis
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-[#5E3A73] bg-[#FAF7FC] border border-[#DDD1E6] hover:bg-[#F3EDF8] rounded-lg hover:-translate-y-0.5 transition-all text-center"
            >
              Acessar minha conta
            </Link>
          </div>
        </div>
      </section>

      {/* Cards Demonstrativos */}
      <section id="demonstracao" className="relative py-12 px-5 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="grid lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          {/* Card 1: Vitrine da Cliente */}
          <div className="lg:col-span-5 bg-white border border-[#EAE2F0] rounded-2xl p-6 shadow-[0_2px_16px_rgba(94,58,115,0.04)] hover:border-[#C8B6D6] transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#F6F2F9]">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A8BA6] block">
                    Link p&uacute;blico da cliente
                  </span>
                  <p className="text-sm font-bold text-[#1E1624] mt-0.5">
                    /salao/studio-lilas
                  </p>
                </div>
                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-[#F6F2F9] text-[#5E3A73] border border-[#E2D6EB]">
                  Aberto hoje
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-[#6B5E75] mb-2">
                    Procedimento selecionado
                  </p>
                  <div className="p-3.5 bg-[#FAF7FC] border border-[#E2D6EB] rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#1E1624]">Hidrata&ccedil;&atilde;o + Escova</p>
                      <p className="text-[11px] text-[#6B5E75] mt-0.5">50 min &bull; Com Camila</p>
                    </div>
                    <span className="text-xs font-bold text-[#5E3A73]">R$ 95,00</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#6B5E75] mb-2">
                    Hor&aacute;rios dispon&iacute;veis
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    <span className="py-2 text-center text-xs font-semibold bg-[#5E3A73] text-white rounded-lg">
                      14:00
                    </span>
                    <span className="py-2 text-center text-xs text-[#6B5E75] bg-[#FAF7FC] border border-[#EAE2F0] rounded-lg">
                      15:00
                    </span>
                    <span className="py-2 text-center text-xs text-[#6B5E75] bg-[#FAF7FC] border border-[#EAE2F0] rounded-lg">
                      16:30
                    </span>
                    <span className="py-2 text-center text-xs text-[#6B5E75] bg-[#FAF7FC] border border-[#EAE2F0] rounded-lg">
                      17:30
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#F6F2F9]">
              <div className="w-full py-2.5 text-center text-xs font-semibold text-white bg-[#1E1624] rounded-lg">
                Confirmar Agendamento
              </div>
            </div>
          </div>

          {/* Card 2: Painel do Salao */}
          <div className="lg:col-span-7 bg-white border border-[#EAE2F0] rounded-2xl p-6 shadow-[0_2px_16px_rgba(94,58,115,0.04)] hover:border-[#C8B6D6] transition-all duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-[#F6F2F9]">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9A8BA6] block">
                  Painel do Sal&atilde;o
                </span>
                <h2 className="text-base font-bold text-[#1E1624] mt-0.5">
                  Atendimentos de hoje
                </h2>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="px-3 py-1 bg-[#FAF7FC] border border-[#EAE2F0] rounded-lg text-[#6B5E75]">
                  Pendentes: <strong className="text-[#5E3A73]">1</strong>
                </span>
                <span className="px-3 py-1 bg-[#FAF7FC] border border-[#EAE2F0] rounded-lg text-[#6B5E75]">
                  Confirmados: <strong className="text-[#1E1624]">2</strong>
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-[#FAF7FC] border border-[#E2D6EB] rounded-xl flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#5E3A73] bg-white border border-[#E2D6EB] px-2.5 py-1.5 rounded-lg">
                    14:00
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1E1624]">Mariana Souza</p>
                    <p className="text-[11px] text-[#6B5E75]">Corte + Escova &bull; Camila</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3EDF8] text-[#5E3A73]">
                  Aguardando
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#EAE2F0] rounded-xl flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#1E1624] bg-[#FAF7FC] border border-[#EAE2F0] px-2.5 py-1.5 rounded-lg">
                    15:30
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1E1624]">Juliana Oliveira</p>
                    <p className="text-[11px] text-[#6B5E75]">Design de Sobrancelhas &bull; Ana</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Confirmado
                </span>
              </div>

              <div className="p-3.5 bg-white border border-[#EAE2F0] rounded-xl flex items-center justify-between hover:-translate-y-0.5 transition-transform">
                <div className="flex items-center gap-3.5">
                  <span className="text-xs font-bold text-[#1E1624] bg-[#FAF7FC] border border-[#EAE2F0] px-2.5 py-1.5 rounded-lg">
                    17:00
                  </span>
                  <div>
                    <p className="text-xs font-bold text-[#1E1624]">Beatriz Fontes</p>
                    <p className="text-[11px] text-[#6B5E75]">Manicure em Gel &bull; Larissa</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Confirmado
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-16 px-5 sm:px-8 bg-[#FAF7FC] border-y border-[#EAE2F0]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1624] mb-2">Feito para a rotina do seu sal&atilde;o</h2>
            <p className="text-sm text-[#6B5E75]">Do celular ao computador, tudo sincronizado em segundos.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-[#EAE2F0] rounded-2xl hover:border-[#C8B6D6] hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-bold text-[#5E3A73] bg-[#F3EDF8] px-2.5 py-1 rounded-md mb-3">
                01
              </span>
              <h3 className="text-base font-bold text-[#1E1624] mb-1.5">Monte seu cat&aacute;logo</h3>
              <p className="text-xs sm:text-sm text-[#6B5E75] leading-relaxed">
                Cadastre servi&ccedil;os, valores e a dura&ccedil;&atilde;o de cada procedimento para organizar os hor&aacute;rios sem furos.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE2F0] rounded-2xl hover:border-[#C8B6D6] hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-bold text-[#5E3A73] bg-[#F3EDF8] px-2.5 py-1 rounded-md mb-3">
                02
              </span>
              <h3 className="text-base font-bold text-[#1E1624] mb-1.5">Compartilhe seu link</h3>
              <p className="text-xs sm:text-sm text-[#6B5E75] leading-relaxed">
                Deixe o endere&ccedil;o do seu espa&ccedil;o na bio do Instagram para suas clientes agendarem a qualquer hora.
              </p>
            </div>

            <div className="p-6 bg-white border border-[#EAE2F0] rounded-2xl hover:border-[#C8B6D6] hover:-translate-y-1 transition-all duration-300">
              <span className="inline-block text-xs font-bold text-[#5E3A73] bg-[#F3EDF8] px-2.5 py-1 rounded-md mb-3">
                03
              </span>
              <h3 className="text-base font-bold text-[#1E1624] mb-1.5">Atenda com tranquilidade</h3>
              <p className="text-xs sm:text-sm text-[#6B5E75] leading-relaxed">
                Acompanhe os agendamentos confirmados pelo celular ou tablet e mantenha a equipe alinhada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-16 sm:py-20 px-5 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1E1624] mb-2">Planos transparentes</h2>
          <p className="text-sm text-[#6B5E75]">Comece gr&aacute;tis por 7 dias. Sem fidelidade.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white p-7 border border-[#EAE2F0] rounded-2xl shadow-sm hover:border-[#C8B6D6] transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1E1624]">Starter</h3>
                <span className="text-[11px] font-medium text-[#6B5E75]">Atendimento Individual</span>
              </div>
              <div className="text-3xl font-extrabold text-[#1E1624] mb-5">
                R$ 19,90 <span className="text-xs font-normal text-[#6B5E75]">/m&ecirc;s</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#6B5E75] space-y-2.5 mb-7 border-t border-[#F6F2F9] pt-4">
                <li>&bull; Link exclusivo para agendamentos</li>
                <li>&bull; Gest&atilde;o completa da agenda do dia</li>
                <li>&bull; Cadastro de servi&ccedil;os e pre&ccedil;os</li>
              </ul>
            </div>
            <Link
              href="/cadastro"
              className="w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-[#5E3A73] bg-[#FAF7FC] border border-[#DDD1E6] hover:bg-[#F3EDF8] rounded-lg transition-colors"
            >
              Come&ccedil;ar no Starter
            </Link>
          </div>

          <div className="bg-white p-7 border-2 border-[#5E3A73] rounded-2xl shadow-sm flex flex-col justify-between relative hover:-translate-y-0.5 transition-all">
            <span className="absolute -top-3 right-6 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white bg-[#5E3A73] rounded-full">
              Mais escolhido
            </span>
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-bold text-[#1E1624]">Professional</h3>
                <span className="text-[11px] font-medium text-[#5E3A73]">Sal&otilde;es com Equipe</span>
              </div>
              <div className="text-3xl font-extrabold text-[#5E3A73] mb-5">
                R$ 39,90 <span className="text-xs font-normal text-[#6B5E75]">/m&ecirc;s</span>
              </div>
              <ul className="text-xs sm:text-sm text-[#6B5E75] space-y-2.5 mb-7 border-t border-[#F6F2F9] pt-4">
                <li>&bull; Tudo o que existe no Starter</li>
                <li>&bull; Agenda individual por profissional</li>
                <li>&bull; Painel completo de atendimentos da equipe</li>
              </ul>
            </div>
            <Link
              href="/cadastro"
              className="w-full py-2.5 text-center text-xs sm:text-sm font-semibold text-white bg-[#5E3A73] hover:bg-[#4B2C5E] rounded-lg transition-colors shadow-sm"
            >
              Come&ccedil;ar no Professional
            </Link>
          </div>
        </div>
      </section>

      {/* Rodape */}
      <footer className="mt-auto py-8 px-6 bg-[#FAF7FC] border-t border-[#EAE2F0] text-xs text-[#6B5E75]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Agenda<span className="text-[#5E3A73] font-semibold">Beleza</span> &mdash; Organiza&ccedil;&atilde;o di&aacute;ria para o seu espa&ccedil;o.
          </p>
          <div className="flex gap-5">
            <Link href="/login" className="hover:text-[#5E3A73] transition-colors">
              Entrar
            </Link>
            <Link href="/cadastro" className="hover:text-[#5E3A73] transition-colors">
              Criar conta
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}