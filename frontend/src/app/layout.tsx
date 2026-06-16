/**
 * Root Layout — AgendaBeleza
 * Configura providers globais: React Query, Toaster, AuthSync
 */import type { Metadata } from 'next';
import './globals.css';

import { QueryProvider } from '@/providers/query-provider';

export const metadata: Metadata = {
  title: 'AgendaBeleza',
  description: 'Sistema inteligente para salões',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}