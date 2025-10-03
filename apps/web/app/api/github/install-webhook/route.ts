import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload || !payload.installation) {
    return NextResponse.json({ error: 'Invalid webhook payload' }, { status: 400 });
  }

  await prisma.githubInstallation.upsert({
    where: { installationId: payload.installation.id },
    create: {
      installationId: payload.installation.id,
      account: payload.installation.account?.login ?? 'unknown',
      repositories: payload.repositories ?? []
    },
    update: {
      account: payload.installation.account?.login ?? 'unknown',
      repositories: payload.repositories ?? []
    }
  });

  return NextResponse.json({ ok: true });
}
