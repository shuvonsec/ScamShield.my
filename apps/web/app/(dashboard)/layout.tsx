import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@scamshield/ui/button';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col gap-4 border-r border-slate-800 bg-slate-950/70 p-6 md:flex">
        <Link href="/" className="text-xl font-semibold">
          ScamShield.my
        </Link>
        <nav className="flex flex-col gap-2 text-sm text-slate-300">
          <Link href="/dashboard" className="hover:text-slate-100">
            Overview
          </Link>
          <Link href="/dashboard/projects" className="hover:text-slate-100">
            Projects
          </Link>
          <Link href="/dashboard/playbooks" className="hover:text-slate-100">
            Playbooks
          </Link>
          <Link href="/dashboard/activity" className="hover:text-slate-100">
            Activity
          </Link>
        </nav>
        <Button variant="outline" size="sm" asChild>
          <a href="mailto:hello@scamshield.my">Contact Support</a>
        </Button>
      </aside>
      <main className="flex flex-1 flex-col bg-slate-950/40 p-6">{children}</main>
    </div>
  );
}
