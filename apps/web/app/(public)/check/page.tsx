'use client';

import { useState } from 'react';
import { Loader2, Share2 } from 'lucide-react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
  Badge
} from '@scamshield/ui';
import { VerdictPill } from '@/components/verdict-pill';
import { EvidenceAccordion } from '@/components/evidence-accordion';
import { ReportShare } from '@/components/report-share';

type CheckResponse = {
  score: number;
  verdict: 'safe' | 'unknown' | 'suspicious' | 'malicious';
  reasons: string[];
  signals: string[];
  reportId: string;
  rationale: string[];
};

export default function CheckPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/check-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: input })
      });
      if (!response.ok) {
        throw new Error('Unable to score URL at this time.');
      }
      const data = (await response.json()) as CheckResponse;
      setResult(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-12">
      <Card className="border-slate-800 bg-slate-900/60">
        <CardHeader>
          <CardTitle>ScamShield.my Checker</CardTitle>
          <CardDescription>
            Paste a suspicious link, SMS, or WhatsApp message. We combine heuristics and AI to deliver a transparent
            verdict.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs defaultValue="url">
            <TabsList>
              <TabsTrigger value="url">URL</TabsTrigger>
              <TabsTrigger value="text">Text/SMS</TabsTrigger>
            </TabsList>
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Suspicious link</Label>
                <Input
                  id="url"
                  placeholder="https://example.com/login?ref=bank-alert"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                />
              </div>
            </TabsContent>
            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Paste the message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Dear customer, your account will be suspended..."
                />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button onClick={submit} disabled={loading || !input.trim()} className="w-full sm:w-auto">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Checking...
                </span>
              ) : (
                'Check now'
              )}
            </Button>
            <Badge variant="outline" className="border-slate-700 text-xs text-slate-300">
              Best effort verdicts. Review evidence before taking action.
            </Badge>
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
        </CardContent>
      </Card>

      {result ? (
        <Card className="border-slate-800 bg-slate-900/60">
          <CardHeader className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <CardTitle className="flex items-center gap-3 text-2xl">
                Verdict <VerdictPill verdict={result.verdict} score={result.score} />
              </CardTitle>
              <ReportShare reportId={result.reportId} />
            </div>
            <CardDescription>
              We detected the following signals. Share this report with your bank/telco if you received it as a scam.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EvidenceAccordion signals={result.signals} />
            <section className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">AI rationale</h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
                {result.rationale.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>
            <section className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Report & recommended action
              </h3>
              <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4 text-sm">
                <p className="mb-2 text-slate-200">
                  Copy and share this with your bank/telco or report via ScamShield:
                </p>
                <pre className="whitespace-pre-wrap text-xs text-slate-300">
{`Suspected scam detected via ScamShield.my (score: ${result.score}).
Reasons: ${result.reasons.join('; ')}.
Recommended action: do not click links, contact bank via official channels.`}
                </pre>
                <Button
                  variant="outline"
                  className="mt-3 w-full sm:w-auto"
                  onClick={() => navigator.clipboard.writeText(`Suspected scam detected: ${result.reasons.join(', ')}`)}
                >
                  <Share2 className="mr-2 h-4 w-4" /> Copy summary
                </Button>
              </div>
            </section>
          </CardContent>
        </Card>
      ) : null}
    </main>
  );
}
