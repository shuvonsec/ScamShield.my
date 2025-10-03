import { prisma } from '../../lib/db';
import { Card, CardContent, CardHeader, CardTitle } from '@scamshield/ui/card';
import Link from 'next/link';

export default async function DashboardOverview() {
  const [projectCount, findingCount] = await Promise.all([
    prisma.project.count(),
    prisma.finding.count()
  ]);

  const recentFindings = await prisma.finding.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { scan: { include: { project: true } } }
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-3xl font-bold">ShieldStack overview</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{projectCount}</p>
            <p className="text-sm text-slate-400">Domains under continuous monitoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Open findings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-semibold">{findingCount}</p>
            <p className="text-sm text-slate-400">Security gaps awaiting action</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent findings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentFindings.map((finding) => (
            <div key={finding.id} className="rounded border border-slate-800 bg-slate-900/50 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span className="font-semibold uppercase text-slate-400">{finding.severity}</span>
                <span>{finding.createdAt.toLocaleString()}</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-100">{finding.title}</p>
              <p className="text-sm text-slate-300">{finding.category} · {finding.scan.project.name}</p>
              <Link
                href={`/dashboard/projects/${finding.scan.projectId}?finding=${finding.id}`}
                className="mt-3 inline-flex text-sm text-slate-200 underline"
              >
                View playbooks
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
