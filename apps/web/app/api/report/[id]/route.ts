import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const report = await prisma.uRLCheck.findUnique({ where: { id: params.id } });
  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  const signals = asStringArray(report.signals);
  const rationale = asStringArray(report.reasons);

  return NextResponse.json({
    score: report.score,
    verdict: report.verdict,
    signals,
    reasons: signals,
    rationale,
    url: report.url
  });
}
