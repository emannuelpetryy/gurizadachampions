'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export default function NavItem({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  const pathname = usePathname();
  const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
  return <Link href={href} className={`${className}${active ? ' is-active' : ''}`}>{children}</Link>;
}
