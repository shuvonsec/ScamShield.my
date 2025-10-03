'use client';

import { useState } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import { Button } from '@scamshield/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@scamshield/ui/card';
import { EvidenceAccordion } from '../components/evidence-accordion';
import { VerdictBadge } from '../components/verdict-badge';

interface CheckResponse {
  score: number;
  verdict: 'safe' | 'unknown' | 'suspicious' | 'malicious';
  reasons: string[];
  signals: { type: string; label: string }[];
  reportId: string;
}

export default function HomePage() {
  const [url, setUrl] = useState('https://example.com');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error ?? 'Unable to score URL');
      }
      const data = (await res.json()) as CheckResponse;
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const shareLink = result ? `${window.location.origin}/report/${result.reportId}` : '';

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-4xl font-bold">ScamShield.my</h1>
        <p className="text-muted-foreground">
          Paste a suspicious URL, SMS or WhatsApp message and get an explainable risk verdict.
        </p>
      </header>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 rounded-lg border border-slate-800 bg-slate-900/60 p-6 shadow-lg"
      >
        <label className="text-sm font-medium" htmlFor="url">
          URL or message
        </label>
        <textarea
          id="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="min-h-[120px] rounded-md border border-slate-700 bg-slate-950 p-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-500"
          placeholder="https://mybank-login-secure.com"
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check now'}
        </Button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </form>
      {result && (
        <Card className="border-slate-800 bg-slate-900/80">
          <CardHeader className="flex flex-col gap-2">
            <CardTitle className="flex items-center justify-between">
              <span>Risk verdict</span>
              <VerdictBadge verdict={result.verdict} score={result.score} />
            </CardTitle>
            <p className="text-sm text-slate-300">
              Recommended action: {result.reasons[0] ?? 'Stay cautious and verify directly with the sender'}.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <EvidenceAccordion signals={result.signals} />
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
              <h3 className="mb-2 font-semibold text-slate-100">Why this verdict</h3>
              <ul className="list-disc space-y-1 pl-6">
                {result.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigator.clipboard.writeText(shareLink)}
                disabled={!shareLink}
              >
                <Share2 className="mr-2 h-4 w-4" /> Share report
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() =>
                  navigator.clipboard.writeText(
                    `Please review this suspicious link: ${shareLink}\nReport to your bank/telco immediately if you clicked it.`,
                  )
                }
                disabled={!shareLink}
              >
                Copy report to bank/telco
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-2xl font-semibold">ShieldStack for SMEs</h2>
        <p className="mt-2 text-sm text-slate-300">
          Upgrade to ShieldStack for automated recon, continuous findings, and virtual patching playbooks.
        </p>
        <Button className="mt-4" variant="secondary" onClick={() => (window.location.href = '/dashboard')}>
          View SME dashboard
        </Button>
      </section>
    </main>
  );
}
