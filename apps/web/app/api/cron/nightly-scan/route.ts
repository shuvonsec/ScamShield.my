import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { reconDomain } from '@scamshield/recon';

export async function GET() {
  const projects = await prisma.project.findMany();
  const results = [];

  for (const project of projects) {
    const scan = await prisma.scan.create({
      data: { projectId: project.id, status: 'running' }
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
    results.push({ project: project.id, scan: scan.id });
  }

  return NextResponse.json({ ok: true, results });
}
