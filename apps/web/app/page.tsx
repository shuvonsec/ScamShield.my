import Link from 'next/link';
import { ShieldAlert, ShieldCheck, Share2 } from 'lucide-react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@scamshield/ui';

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16">
      <section className="grid gap-10 md:grid-cols-2">
        <Card className="safe-gradient border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-slate-900">ScamShield.my</CardTitle>
            <CardDescription className="text-slate-900/80">
              Check suspicious links, SMS, and WhatsApp messages instantly with explainable AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild variant="secondary" className="bg-slate-900 text-slate-100">
              <Link href="/check">Launch Scam Checker</Link>
            </Button>
            <p className="text-sm text-slate-900/70">
              Share results easily, install as PWA, and stay ahead of scammers.
            </p>
          </CardContent>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl">
              <ShieldCheck className="h-6 w-6 text-safe" /> ShieldStack
            </CardTitle>
            <CardDescription>
              SME-grade recon, continuous monitoring, and guided remediation playbooks.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/dashboard">Open SME Dashboard</Link>
            </Button>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-suspicious" /> Continuous domain and subdomain scanning
              </li>
              <li className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-safe" /> One-click virtual patching playbooks
              </li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
