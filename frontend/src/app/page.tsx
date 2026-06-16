/**
 * Página raiz — redireciona para /dashboard (autenticado) ou /login
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function RootPage() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('__ab_auth');

  if (isAuthenticated) {
    redirect('/dashboard');
  } else {
    redirect('/login');
  }
}
