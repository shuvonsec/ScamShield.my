import { Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@scamshield/ui';

export type FindingView = {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  category: string;
  evidence: string;
  createdAt: string;
};

const severityMap: Record<FindingView['severity'], string> = {
  critical: 'destructive',
  high: 'destructive',
  medium: 'default',
  low: 'outline'
};

export function FindingsPanel({ findings }: { findings: FindingView[] }) {
  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader>
        <CardTitle>Latest findings</CardTitle>
        <CardDescription>
          Review evidence, confirm risk, or apply a virtual patch to mitigate instantly.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {findings.map((finding) => (
          <div key={finding.id} className="rounded-md border border-slate-800 bg-slate-950/60 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold">{finding.title}</h3>
                <p className="text-xs uppercase tracking-wide text-slate-400">{finding.category}</p>
              </div>
              <Badge variant={severityMap[finding.severity]}>{finding.severity}</Badge>
            </div>
            <p className="mt-3 text-sm text-slate-300">{finding.evidence}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" asChild>
                <a href={`/findings/${finding.id}`}>View details</a>
              </Button>
              <Button size="sm" asChild>
                <a href={`/playbooks/apply?findingId=${finding.id}`}>Apply playbook</a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
