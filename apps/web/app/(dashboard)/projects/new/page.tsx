import ProjectForm from '@/components/project-form';

export default function NewProjectPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-semibold">Add project</h1>
      <p className="text-sm text-slate-300">Register a domain to begin scheduled recon scans.</p>
      <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/60 p-6">
        <ProjectForm />
      </div>
    </main>
  );
}
