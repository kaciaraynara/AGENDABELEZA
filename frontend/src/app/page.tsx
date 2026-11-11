import Link from 'next/link';

export default function PaginaInicial() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-sans">
      {/* Barra de navegacao */}
      <header className="w-full bg-white border-b border-stone-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
            Agenda<span className="text-rose-700">Beleza</span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-sm text-stone-600">
            <a href="#como-funciona" className="hover:text-stone-900">
              Como funciona
            </a>
            <a href="#planos" className="hover:text-stone-900">
              Planos
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-1.5 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      {/* Secao principal */}
      <section className="py-16 md:py-24 px-4 bg-white border-b border-stone-200">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-wider text-rose-700 font-semibold mb-3">
            Atendimento e organizacao para o seu espaco
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-snug mb-5">
            Sua agenda organizada e seus clientes agendando online
          </h1>
          <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto mb-8">
            Envie o link do seu salao para suas clientes marcarem horario direto pelo celular,
            sem perder tempo respondendo mensagens repetidas no dia a dia.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-white bg-rose-700 hover:bg-rose-800 rounded-md text-center"
            >
              Comecar agora
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-6 py-2.5 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-md text-center"
            >
              Acessar minha conta
            </Link>
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="py-16 px-4 bg-stone-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Como funciona na rotina</h2>
            <p className="text-sm text-stone-600">Simples para quem atende e pratico para quem agenda.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white border border-stone-200 rounded-lg">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">Passo 1</span>
              <h3 className="text-lg font-bold text-stone-900 mt-2 mb-2">Cadastre seus servicos</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Coloque os procedimentos que voce faz, o tempo de duracao de cada um e o valor cobrado.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-lg">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">Passo 2</span>
              <h3 className="text-lg font-bold text-stone-900 mt-2 mb-2">Compartilhe sua pagina</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Coloque o link do salao na bio do Instagram ou mande para suas clientes quando perguntarem horarios.
              </p>
            </div>

            <div className="p-6 bg-white border border-stone-200 rounded-lg">
              <span className="text-xs font-semibold text-rose-700 uppercase tracking-wide">Passo 3</span>
              <h3 className="text-lg font-bold text-stone-900 mt-2 mb-2">Acompanhe pelo painel</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Veja os agendamentos que chegaram para o dia, quem vai atender e marque os concluidos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planos */}
      <section id="planos" className="py-16 px-4 bg-white border-t border-stone-200">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-stone-900 mb-2">Valores dos planos</h2>
            <p className="text-sm text-stone-600">Sem contrato de fidelidade. Cancele quando precisar.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="p-6 bg-stone-50 border border-stone-200 rounded-lg flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Individual</span>
                <h3 className="text-xl font-bold text-stone-900 mt-1 mb-2">Starter</h3>
                <div className="text-2xl font-bold text-stone-900 mb-4">
                  R$ 19,90 <span className="text-xs font-normal text-stone-500">/mes</span>
                </div>
                <ul className="text-sm text-stone-600 space-y-2 mb-6">
                  <li>Pagina publica de agendamento</li>
                  <li>Controle de horarios do dia</li>
                  <li>Cadastro de servicos e precos</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full py-2 text-center text-sm font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-100 rounded-md"
              >
                Escolher este
              </Link>
            </div>

            <div className="p-6 bg-white border-2 border-stone-900 rounded-lg flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">Com equipe</span>
                <h3 className="text-xl font-bold text-stone-900 mt-1 mb-2">Professional</h3>
                <div className="text-2xl font-bold text-stone-900 mb-4">
                  R$ 39,90 <span className="text-xs font-normal text-stone-500">/mes</span>
                </div>
                <ul className="text-sm text-stone-600 space-y-2 mb-6">
                  <li>Tudo o que tem no Starter</li>
                  <li>Mais de um profissional na mesma conta</li>
                  <li>Visao geral de atendimentos da equipe</li>
                </ul>
              </div>
              <Link
                href="/register"
                className="w-full py-2 text-center text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md"
              >
                Escolher este
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Rodape */}
      <footer className="py-8 px-4 bg-stone-100 border-t border-stone-200 text-center text-xs text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>AgendaBeleza - Sistema para saloes e espacos de beleza.</p>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-stone-900">
              Entrar
            </Link>
            <Link href="/register" className="hover:text-stone-900">
              Cadastrar
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}