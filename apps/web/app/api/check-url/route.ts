import { NextResponse } from 'next/server';
import { z } from 'zod';
import { scoreUrl } from '@scamshield/scoring';
import { prisma } from '../../../lib/db';
import { rateLimit } from '../../../lib/rate-limit';
import { generateRationale } from '../../../lib/ai';

const schema = z.object({
  url: z.string().min(1)
});

function extractUrl(input: string) {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const match = trimmed.match(/https?:\/\/[\w.-]+[^\s]*/i);
  if (match) {
    return match[0];
  }
  throw new Error('No URL found in the provided text.');
}

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anon';
  if (!rateLimit(`check:${ip}`)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  try {
    const targetUrl = extractUrl(parsed.data.url);
    const { score, label, signals } = scoreUrl({ url: targetUrl });
    const reasons = await generateRationale(signals, label);

    const record = await prisma.uRLCheck.create({
      data: {
        url: targetUrl,
        score,
        verdict: label,
        signals,
        reasons
      }
    });

    return NextResponse.json({
      score,
      verdict: label,
      reasons,
      signals,
      reportId: record.id
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
