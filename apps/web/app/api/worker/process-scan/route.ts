import { NextResponse } from 'next/server';
import { processScan } from '@scamshield/jobs';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const scanId = typeof body.scanId === 'string' ? body.scanId : undefined;
  if (!scanId) {
    return NextResponse.json({ error: 'Missing scanId' }, { status: 400 });
  }
  const result = await processScan({ prisma, scanId });
  return NextResponse.json(result);
}
