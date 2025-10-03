import { notFound } from 'next/navigation';
import { prisma } from '../../../../lib/db';
import { PlaybooksList } from '../../../../components/playbooks-list';
import { Button } from '@scamshield/ui/button';

interface ProjectPageProps {
  params: { id: string };
  searchParams: { finding?: string };
}

export default async function ProjectPage({ params, searchParams }: ProjectPageProps) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      scans: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { findings: true }
      }
    }
  });

  if (!project) {
    notFound();
  }

  const findings = project.scans.flatMap((scan) => scan.findings);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        <p className="text-sm text-slate-400">{project.domain}</p>
      </div>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Findings</h2>
        <div className="space-y-2">
          {findings.map((finding) => (
            <div key={finding.id} className="rounded border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex flex-wrap items-center justify-between text-sm text-slate-300">
                <span className="font-semibold uppercase text-slate-400">{finding.severity}</span>
                <span>{finding.createdAt.toLocaleString()}</span>
              </div>
              <p className="mt-2 text-lg font-semibold text-slate-100">{finding.title}</p>
              <pre className="mt-2 overflow-x-auto rounded bg-slate-950 p-3 text-xs text-slate-300">
                {JSON.stringify(finding.evidence, null, 2)}
              </pre>
              <div className="mt-3 flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a href={`/api/apply-playbook?projectId=${project.id}&findingId=${finding.id}`}>
                    Apply recommended playbook
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold">Playbooks</h2>
        <PlaybooksList highlightFindingId={searchParams.finding} />
      </section>
    </div>
  );
}
