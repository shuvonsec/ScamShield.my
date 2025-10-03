import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const schema = z.object({
  name: z.string().min(3),
  domain: z.string().min(3)
});

async function resolveOwnerId() {
  const existing = await prisma.user.findFirst({ orderBy: { createdAt: 'asc' } });
  if (existing) {
    return existing.id;
  }
  const bootstrap = await prisma.user.create({
    data: {
      email: 'bootstrap@scamshield.my',
      role: 'admin',
      plan: 'free'
    }
  });
  return bootstrap.id;
}

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const ownerId = await resolveOwnerId();

  const project = await prisma.project.create({
    data: {
      name: parsed.data.name,
      domain: parsed.data.domain,
      ownerId
    }
  });

  return NextResponse.json({ projectId: project.id });
}
