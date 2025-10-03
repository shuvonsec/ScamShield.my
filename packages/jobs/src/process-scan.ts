import type { PrismaClient } from '@prisma/client';
import { runRecon } from '@scamshield/recon';
import { library } from '@scamshield/playbooks';

export type ProcessScanOptions = {
  prisma: PrismaClient;
  scanId: string;
};

export async function processScan({ prisma, scanId }: ProcessScanOptions) {
  const scan = await prisma.scan.findUnique({
    where: { id: scanId },
    include: { project: true }
  });

  if (!scan) {
    throw new Error(`Scan ${scanId} not found`);
  }

  await prisma.scan.update({
    where: { id: scan.id },
    data: { status: 'running' }
  });

  const recon = await runRecon(scan.project.domain);

  for (const finding of recon.findings) {
    await prisma.finding.create({
      data: {
        scanId: scan.id,
        severity: finding.severity,
        category: finding.category,
        title: finding.title,
        evidence: finding.evidence,
        fix: finding.fix,
        status: 'open'
      }
    });
  }

  await prisma.scan.update({
    where: { id: scan.id },
    data: {
      status: 'completed',
      finishedAt: new Date()
    }
  });

  return {
    findings: recon.findings.length,
    recommendedPlaybooks: library.map((playbook) => ({
      id: playbook.id,
      name: playbook.name
    }))
  };
}
