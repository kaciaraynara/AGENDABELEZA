/**
 * Next.js Proxy — Proteção de rotas (Next.js 16+)
 *
 * Rotas protegidas: /dashboard, /agendamentos, /servicos, /profissionais
 * Verifica presença do cookie __ab_auth (sincronizado pelo AuthSync client-side).
 */

import { NextRequest, NextResponse } from 'next/server';

// Rotas que exigem autenticação
const PROTECTED_PATHS = [
  '/dashboard',
  '/agendamentos',
  '/servicos',
  '/profissionais',
];

// Rotas que só devem ser acessadas sem autenticação
const AUTH_PATHS = ['/login', '/cadastro'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Verifica token via cookie (sincronizado pelo AuthSync)
  const authCookie = request.cookies.get('__ab_auth');
  const isAuthenticated = Boolean(authCookie?.value);

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  const isAuthPath = AUTH_PATHS.some((path) => pathname.startsWith(path));

  // Rota protegida sem autenticação → redirect /login
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rota de auth com autenticação ativa → redirect /dashboard
  if (isAuthPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Aplica em todas as rotas EXCETO:
     * - _next/static, _next/image
     * - favicon.ico
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};
