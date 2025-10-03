import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const payload = await request.json();
  const installationId = payload.installation?.id;
  const repositories = payload.repositories ?? [];

  if (!installationId) {
    return NextResponse.json({ error: 'Missing installation id' }, { status: 400 });
  }

  await prisma.githubInstallation.upsert({
    where: { installationId: String(installationId) },
    update: {
      repositories,
      account: payload.account
    },
    create: {
      installationId: String(installationId),
      repositories,
      account: payload.account
    }
  });

  return NextResponse.json({ ok: true });
}
