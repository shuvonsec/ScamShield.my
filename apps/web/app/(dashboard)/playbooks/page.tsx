import { PlaybooksList } from '../../../components/playbooks-list';

export default function PlaybooksPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Playbook library</h1>
      <p className="text-sm text-slate-400">Reusable virtual patching playbooks ready for one-click deployment.</p>
      <PlaybooksList />
    </div>
  );
}
