import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../../../lib/db';

const schema = z.object({
  name: z.string().min(1),
  domain: z.string().min(1)
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      domain: parsed.data.domain,
      ownerId: 'demo-owner'
    }
  });

  return NextResponse.json({ projectId: project.id });
}
