import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/db';
import { reconDomain } from '@scamshield/recon';

const schema = z.object({
  projectId: z.string().min(1)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const project = await prisma.project.findUnique({ where: { id: parsed.data.projectId } });
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const scan = await prisma.scan.create({
    data: {
      projectId: project.id,
      status: 'running'
    }
  });

  const recon = await reconDomain({ domain: project.domain });

  await prisma.scan.update({
    where: { id: scan.id },
    data: {
      status: 'completed',
      finishedAt: new Date(),
      findings: {
        createMany: {
          data: recon.findings.map((finding) => ({
            severity: finding.severity,
            category: finding.category,
            title: finding.title,
            evidence: finding.evidence,
            status: 'open'
          }))
        }
      }
    }
  });

  return NextResponse.json({ scanId: scan.id });
}
