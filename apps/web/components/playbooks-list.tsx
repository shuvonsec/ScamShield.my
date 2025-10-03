import { getPlaybooks } from '@scamshield/playbooks';
import { Card, CardContent, CardHeader, CardTitle } from '@scamshield/ui/card';
import { Button } from '@scamshield/ui/button';

interface PlaybooksListProps {
  highlightFindingId?: string;
}

export function PlaybooksList({ highlightFindingId }: PlaybooksListProps) {
  const playbooks = getPlaybooks();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {playbooks.map((playbook) => (
        <Card key={playbook.id} className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle>{playbook.name}</CardTitle>
            <p className="text-sm text-slate-300">{playbook.description}</p>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-300">
            <div>
              <h4 className="font-semibold text-slate-100">Addresses</h4>
              <ul className="list-disc space-y-1 pl-5">
                {playbook.risks.map((risk) => (
                  <li key={risk}>{risk}</li>
                ))}
              </ul>
            </div>
            <Button
              size="sm"
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(playbook.apply({ mode: 'preview', findingId: highlightFindingId }), null, 2),
                )
              }
            >
              Copy playbook actions
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
