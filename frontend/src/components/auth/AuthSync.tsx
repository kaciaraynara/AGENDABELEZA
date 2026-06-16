/**
 * AuthSync — Sincroniza o token do localStorage com o cookie __ab_auth
 *
 * O Next.js middleware roda no Edge (server-side) e só consegue ler cookies,
 * não localStorage. Este componente client mantém os dois em sincronia.
 *
 * Deve ser renderizado uma vez no root layout.
 */

'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';

function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

export function AuthSync() {
  const { token, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;

    if (token) {
      setCookie('__ab_auth', '1'); // valor "1" = autenticado (não expõe JWT no cookie)
    } else {
      deleteCookie('__ab_auth');
    }
  }, [token, isHydrated]);

  return null;
}
