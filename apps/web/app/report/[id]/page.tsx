import { notFound } from 'next/navigation';
import { prisma } from '../../../lib/db';
import { VerdictBadge } from '../../../components/verdict-badge';
import { EvidenceAccordion } from '../../../components/evidence-accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@scamshield/ui/card';

interface ReportPageProps {
  params: { id: string };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const report = await prisma.uRLCheck.findUnique({
    where: { id: params.id }
  });

  if (!report) {
    notFound();
  }

  const signals = (report.signals as { type: string; label: string }[]) ?? [];
  const reasons = (report.reasons as string[]) ?? [];

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-semibold">ScamShield report</h1>
        <p className="text-sm text-slate-300">Share this with friends and your bank/telco to warn them.</p>
      </header>
      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader className="flex flex-col gap-2">
          <CardTitle className="flex items-center justify-between">
            <span>{report.url}</span>
            <VerdictBadge verdict={report.verdict as any} score={report.score} />
          </CardTitle>
          <p className="text-sm text-slate-300">Generated on {report.createdAt.toDateString()}.</p>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <EvidenceAccordion signals={signals} />
          <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
            <h3 className="mb-2 font-semibold text-slate-100">Why this matters</h3>
            <ul className="list-disc space-y-1 pl-6">
              {reasons.map((reason) => (
                <li key={reason}>{reason}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
