import { NextResponse } from 'next/server';
import { z } from 'zod';
import { library } from '@scamshield/playbooks';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  projectId: z.string().uuid().optional(),
  playbookId: z.string(),
  params: z.record(z.any()).default({})
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const playbook = library.find((item) => item.id === parsed.data.playbookId);
  if (!playbook) {
    return NextResponse.json({ error: 'Playbook not found' }, { status: 404 });
  }

  const changes = await playbook.apply(parsed.data.params);

  if (parsed.data.projectId) {
    await prisma.activityLog.create({
      data: {
        projectId: parsed.data.projectId,
        action: `Applied playbook ${playbook.name}`,
        metadata: changes
      }
    });
  }

  return NextResponse.json({ status: 'queued', changes });
}
