'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  Scissors,
  Users,
  Store,
} from 'lucide-react';

const links = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Agendamentos',
    href: '/agendamentos',
    icon: Calendar,
  },
  {
    label: 'Serviços',
    href: '/servicos',
    icon: Scissors,
  },
  {
    label: 'Profissionais',
    href: '/profissionais',
    icon: Users,
  },
  {
    label: 'Meu Salão',
    href: '/salao',
    icon: Store,
  },
  {
    label: 'Assinatura',
    href: '/billing',
    icon: CreditCard,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen border-r border-[#E9E1D7] bg-white">
      <div className="p-6 border-b border-[#E9E1D7]">
        <h1 className="text-2xl font-bold text-[#1F1F1F]">
          Agenda<span className="text-[#C8A96B]">Beleza</span>
        </h1>
      </div>

      <nav className="p-4 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          const active = pathname.includes(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`
                flex items-center gap-3 rounded-xl px-4 py-3
                transition-all duration-200
                ${active
                  ? 'bg-[#FAF8F5] text-[#C8A96B]'
                  : 'text-[#555] hover:bg-[#FAF8F5]'
                }
              `}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}