import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      {/* Topo / Navbar */}
      <header className="w-full bg-stone-950/80 backdrop-blur-md border-b border-stone-800/80 sticky top-0 z-50 transition-all">
        <div className="max-w-6xl mx-auto px-5 h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-1.5 group">
            <span className="text-2xl font-black tracking-tight text-white transition-transform group-hover:scale-105">
              Agenda<span className="text-amber-500">Beleza</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-300">
            <a href="#como-funciona" className="hover:text-amber-400 transition-colors">
              Como funciona
            </a>
            <a href="#planos" className="hover:text-amber-400 transition-colors">
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-stone-300 hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-bold text-stone-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 px-4 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-900">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-amber-500/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-bold uppercase tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-full">
            Plataforma para Salões e Profissionais da Beleza
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
            Sua agenda cheia e seu salão atendendo{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              sem parar no WhatsApp
            </span>
          </h1>

          <p className="text-lg md:text-xl text-stone-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Um link direto para a sua cliente agendar em segundos, escolher o serviço, o profissional e o horário, direto pelo celular.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-bold text-stone-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
            >
              Criar meu salão agora
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-stone-200 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 rounded-xl hover:-translate-y-0.5 transition-all text-center"
            >
              Já tenho cadastro
            </Link>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20 px-4 bg-stone-950 border-t border-stone-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">Simples e prático</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 mb-3">Como funciona o seu salão no ar</h2>
            <p className="text-stone-400 text-sm max-w-lg mx-auto">Você configura em poucos minutos e já começa a receber agendamentos online.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-7 bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest block mb-3">
                Etapa 01
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Cadastre seus serviços</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Informe o nome do procedimento, valor e tempo de duração para travar a agenda com precisão.
              </p>
            </div>

            <div className="p-7 bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest block mb-3">
                Etapa 02
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Divulgue o seu link</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Coloque o link exclusivo na bio do Instagram ou envie para suas clientes confirmarem horários.
              </p>
            </div>

            <div className="p-7 bg-stone-900/90 border border-stone-800 hover:border-amber-500/50 rounded-2xl transition-all duration-300 hover:-translate-y-1">
              <span className="text-xs font-black text-amber-500 uppercase tracking-widest block mb-3">
                Etapa 03
              </span>
              <h3 className="text-xl font-bold text-white mb-2">Acompanhe os atendimentos</h3>
              <p className="text-stone-400 text-sm leading-relaxed">
                Veja os clientes marcados no painel diário, quem vai atender e marque os serviços concluídos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-20 px-4 bg-stone-900 border-t border-stone-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-amber-500 font-bold">Investimento transparente</span>
            <h2 className="text-3xl font-extrabold text-white mt-2 mb-3">Escolha o plano ideal para seu espaço</h2>
            <p className="text-stone-400 text-sm">Sem fidelidade, sem letras miúdas. Cancele quando quiser.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8">
            {/* Starter */}
            <div className="p-8 bg-stone-950 border border-stone-800 rounded-3xl flex flex-col justify-between hover:border-stone-700 transition-all">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Atendimento Individual</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">Starter</h3>
                <div className="text-4xl font-black text-white mb-6">
                  R$ 19,90 <span className="text-sm font-normal text-stone-400">/mês</span>
                </div>
                <ul className="text-sm text-stone-300 space-y-3 mb-8">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Página pública de agendamento exclusiva
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Painel diário de horários
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Catálogo de serviços e preços
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full py-3 text-center text-sm font-bold text-stone-200 bg-stone-800 hover:bg-stone-700 hover:text-white rounded-xl transition-colors"
              >
                Escolher Starter
              </Link>
            </div>

            {/* Professional */}
            <div className="relative p-8 bg-gradient-to-b from-stone-950 to-stone-900 border-2 border-amber-500 rounded-3xl flex flex-col justify-between shadow-2xl shadow-amber-500/10 hover:shadow-amber-500/20 transition-all">
              <div className="absolute -top-3.5 right-6 px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-stone-950 bg-amber-400 rounded-full shadow-md">
                Mais Escolhido
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Para Salões e Equipes</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-3">Professional</h3>
                <div className="text-4xl font-black text-amber-400 mb-6">
                  R$ 39,90 <span className="text-sm font-normal text-stone-400">/mês</span>
                </div>
                <ul className="text-sm text-stone-200 space-y-3 mb-8">
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Todas as funções do Starter
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Múltiplos profissionais na mesma conta
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Visão geral e distribuição de atendimentos
                  </li>
                  <li className="flex items-center gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Suporte prioritário
                  </li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full py-3 text-center text-sm font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 transition-all"
              >
                Escolher Professional
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="mt-auto py-10 px-4 bg-stone-950 border-t border-stone-800 text-xs text-stone-500">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 AgendaBeleza. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <Link href="/login" className="hover:text-amber-400 transition-colors">
              Acessar conta
            </Link>
            <Link href="/register" className="hover:text-amber-400 transition-colors">
              Cadastrar salão
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}