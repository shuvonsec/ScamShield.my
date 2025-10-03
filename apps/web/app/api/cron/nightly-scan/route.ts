import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { enqueueScan } from '@/lib/queue';

export async function GET() {
  const projects = await prisma.project.findMany();
  const now = new Date();

  for (const project of projects) {
    const scan = await prisma.scan.create({
      data: {
        projectId: project.id,
        status: 'queued',
        startedAt: now
      }
    });
    await enqueueScan({ scanId: scan.id });
  }

  return NextResponse.json({ queued: projects.length });
}
