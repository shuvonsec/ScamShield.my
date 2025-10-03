import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { enqueueScan } from '@/lib/queue';

const schema = z.object({ projectId: z.string().uuid() });

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const scan = await prisma.scan.create({
    data: {
      projectId: parsed.data.projectId,
      status: 'queued',
      startedAt: new Date()
    }
  });

  await enqueueScan({ scanId: scan.id });

  return NextResponse.json({ scanId: scan.id });
}
