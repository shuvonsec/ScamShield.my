import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { ReportShare } from '@/components/report-share';
import { EvidenceAccordion } from '@/components/evidence-accordion';
import { VerdictPill } from '@/components/verdict-pill';

function resolveBaseUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}

async function fetchReport(id: string) {
  const response = await fetch(`${resolveBaseUrl()}/api/report/${id}`, {
    next: { revalidate: 300 }
  });
  if (!response.ok) {
    return null;
  }
  return (await response.json()) as {
    score: number;
    verdict: 'safe' | 'unknown' | 'suspicious' | 'malicious';
    signals: string[];
    reasons: string[];
    rationale: string[];
    url: string;
  };
}

export default async function ReportPage({ params }: { params: { id: string } }) {
  const report = await fetchReport(params.id);
  if (!report) {
    notFound();
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">ScamShield.my report</h1>
            <p className="text-sm text-slate-300">{report.url}</p>
          </div>
          <ReportShare reportId={params.id} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <VerdictPill verdict={report.verdict} score={report.score} />
          <span className="text-sm text-slate-300">Score is between 0 (safe) to 100 (malicious).</span>
        </div>
      </section>
      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">Signals</h2>
        <Suspense fallback={<p className="text-sm text-slate-300">Loading...</p>}>
          <EvidenceAccordion signals={report.signals} />
        </Suspense>
      </section>
      <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold">AI rationale</h2>
        <ul className="list-disc space-y-2 pl-5 text-sm text-slate-200">
          {report.rationale.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
