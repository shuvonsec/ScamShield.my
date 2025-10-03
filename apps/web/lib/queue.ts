import { processScan } from '@scamshield/jobs';
import { prisma } from './prisma';

const QSTASH_URL = process.env.QSTASH_URL;
const QSTASH_TOKEN = process.env.QSTASH_TOKEN;

function resolveBaseUrl() {
  if (process.env.WORKER_PROCESS_URL) {
    return process.env.WORKER_PROCESS_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}

export async function enqueueScan(payload: { scanId: string }) {
  if (!QSTASH_URL || !QSTASH_TOKEN) {
    console.warn('QStash not configured; executing scan inline.');
    await processScan({ prisma, scanId: payload.scanId });
    return;
  }

  const endpoint = `${resolveBaseUrl()}/worker/process-scan`;

  await fetch(`${QSTASH_URL}/v2/publish`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${QSTASH_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      url: endpoint,
      body: payload
    })
  });
}
