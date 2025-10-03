import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const report = await prisma.uRLCheck.findUnique({
    where: { id: params.id }
  });

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  return NextResponse.json({
    score: report.score,
    verdict: report.verdict,
    signals: report.signals,
    reasons: report.reasons,
    url: report.url,
    createdAt: report.createdAt
  });
}
