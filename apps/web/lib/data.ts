import { prisma } from './prisma';
import { getPlaybookSummaries } from './playbooks';

export async function getProjectsWithLatestScans() {
  const projects = await prisma.project.findMany({
    include: {
      scans: {
        orderBy: { startedAt: 'desc' },
        take: 1
      }
    }
  });

  const findings = await prisma.finding.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return {
    projects: projects.map((project) => ({
      id: project.id,
      name: project.name,
      domain: project.domain,
      status: project.scans[0]?.status === 'completed' ? 'healthy' : 'needs-action',
      lastScan: project.scans[0]?.finishedAt?.toISOString() ?? null
    })),
    findings: findings.map((finding) => ({
      id: finding.id,
      severity: finding.severity as 'critical' | 'high' | 'medium' | 'low',
      title: finding.title,
      category: finding.category,
      evidence: JSON.stringify(finding.evidence),
      createdAt: finding.createdAt.toISOString()
    })),
    playbooks: getPlaybookSummaries()
  };
}
