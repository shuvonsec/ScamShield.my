import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const scan = await prisma.scan.findUnique({
    where: { id: params.id },
    include: {
      findings: true
    }
  });

  if (!scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
  }

  const summary = {
    status: scan.status,
    findings: scan.findings.length
  };

  const actions = scan.findings.map((finding) => ({
    id: finding.id,
    title: `Apply playbook for ${finding.category}`
  }));

  return NextResponse.json({
    findings: scan.findings,
    summary,
    actions
  });
}
