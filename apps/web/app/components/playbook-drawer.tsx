'use client';

import { useState } from 'react';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@scamshield/ui';

type Playbook = {
  id: string;
  name: string;
  description: string;
  risks: string[];
};

type Props = {
  playbooks: Playbook[];
};

export function PlaybookDrawer({ playbooks }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const apply = async () => {
    if (!selected) return;
    await fetch('/api/apply-playbook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ playbookId: selected })
    });
  };

  return (
    <Card className="border-slate-800 bg-slate-900/60">
      <CardHeader>
        <CardTitle>Playbooks</CardTitle>
        <CardDescription>
          Curated remediations for common stacks. Apply instantly or export as GitHub PR.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Apply playbook</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select a playbook</DialogTitle>
            </DialogHeader>
            <Label htmlFor="playbook" className="text-sm">
              Choose a hardening action
            </Label>
            <Select value={selected ?? ''} onValueChange={setSelected}>
              <SelectTrigger id="playbook">
                <SelectValue placeholder="Select playbook" />
              </SelectTrigger>
              <SelectContent>
                {playbooks.map((playbook) => (
                  <SelectItem key={playbook.id} value={playbook.id}>
                    {playbook.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selected ? (
              <div className="rounded-md border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-200">
                <h3 className="font-semibold">{playbooks.find((p) => p.id === selected)?.name}</h3>
                <p className="mt-2 text-slate-300">
                  {playbooks.find((p) => p.id === selected)?.description}
                </p>
              </div>
            ) : null}
            <DialogFooter>
              <Button disabled={!selected} onClick={apply}>
                Apply now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
