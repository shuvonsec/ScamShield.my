import { Suspense } from 'react';
import { ProjectsTable } from '@/components/projects-table';
import { FindingsPanel } from '@/components/findings-panel';
import { PlaybookDrawer } from '@/components/playbook-drawer';
import { getProjectsWithLatestScans } from '@/lib/data';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const data = await getProjectsWithLatestScans();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-12">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold">ShieldStack Projects</h1>
        <p className="text-sm text-slate-300">
          Monitor your attack surface, triage findings, and apply virtual patching playbooks with one click.
        </p>
      </header>
      <Suspense fallback={<p className="text-sm text-slate-300">Loading projects...</p>}>
        <ProjectsTable projects={data.projects} />
      </Suspense>
      <div className="grid gap-6 lg:grid-cols-2">
        <Suspense fallback={<p className="text-sm text-slate-300">Loading findings...</p>}>
          <FindingsPanel findings={data.findings} />
        </Suspense>
        <PlaybookDrawer playbooks={data.playbooks} />
      </div>
    </main>
  );
}
