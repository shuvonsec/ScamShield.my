import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  const scan = await prisma.scan.findUnique({
    where: { id: params.id },
    include: { findings: true, project: true }
  });

  if (!scan) {
    return NextResponse.json({ error: 'Scan not found' }, { status: 404 });
  }

  const summary = {
    total: scan.findings.length,
    high: scan.findings.filter((f) => f.severity === 'high' || f.severity === 'critical').length,
    medium: scan.findings.filter((f) => f.severity === 'medium').length
  };

  return NextResponse.json({
    findings: scan.findings,
    project: { id: scan.projectId, domain: scan.project.domain },
    summary,
    actions: ['apply-playbook', 'share-report']
  });
}
