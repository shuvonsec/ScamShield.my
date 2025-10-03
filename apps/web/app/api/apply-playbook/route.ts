import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getPlaybook } from '@scamshield/playbooks';

const schema = z.object({
  projectId: z.string().min(1),
  playbookId: z.string().min(1),
  params: z.record(z.any()).optional()
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const playbook = getPlaybook(parsed.data.playbookId);
  if (!playbook) {
    return NextResponse.json({ error: 'Playbook not found' }, { status: 404 });
  }

  const changes = playbook.apply({
    mode: 'apply',
    projectId: parsed.data.projectId,
    params: parsed.data.params
  });

  return NextResponse.json({ status: 'queued', changes });
}
