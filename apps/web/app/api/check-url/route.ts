import { NextResponse } from 'next/server';
import { z } from 'zod';
import { scoreText, scoreUrl } from '@scamshield/scoring';
import { prisma } from '@/lib/prisma';
import { generateRationale } from '@/lib/rationale';

const bodySchema = z.object({
  url: z.string().min(5)
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  let result;
  try {
    result = scoreUrl(parsed.data.url);
  } catch (error) {
    result = scoreText(parsed.data.url);
  }

  const heuristicReasons = result.signals.length
    ? result.signals
    : ['No high-risk heuristics triggered, but remain cautious.'];

  const rationale = await generateRationale({
    url: parsed.data.url,
    verdict: result.label,
    signals: heuristicReasons
  });

  const urlCheck = await prisma.uRLCheck.create({
    data: {
      url: parsed.data.url,
      score: result.score,
      verdict: result.label,
      signals: heuristicReasons,
      reasons: rationale
    }
  });

  return NextResponse.json({
    score: result.score,
    verdict: result.label,
    reasons: heuristicReasons,
    signals: heuristicReasons,
    reportId: urlCheck.id,
    rationale
  });
}
