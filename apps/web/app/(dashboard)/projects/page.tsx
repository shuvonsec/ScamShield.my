import Link from 'next/link';
import { prisma } from '../../../lib/db';
import { Button } from '@scamshield/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@scamshield/ui/card';

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { scans: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-sm text-slate-400">Domains monitored by ShieldStack.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">Add project</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => {
          const lastScan = project.scans[0];
          return (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.name}</CardTitle>
                <CardDescription>{project.domain}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-300">
                <p>Last scan: {lastScan?.finishedAt?.toLocaleString() ?? 'Not yet scanned'}</p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/dashboard/projects/${project.id}`}>View findings</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
