import { describe, expect, it, vi } from 'vitest';
import { POST } from '../../apps/web/app/api/check-url/route';

vi.mock('../../apps/web/lib/db', () => ({
  prisma: {
    uRLCheck: {
      create: vi.fn(async ({ data }) => ({ id: 'share-xyz', ...data }))
    }
  }
}));

vi.mock('../../apps/web/lib/ai', () => ({
  generateRationale: vi.fn(async (signals: any, verdict: string) => [
    `Verdict: ${verdict}`,
    signals[0]?.label ?? 'No signals'
  ])
}));

describe('ScamShield checker flow', () => {
  it('submits url and receives report id', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://bonus-reset-login.zip/account' })
      })
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.reportId).toBe('share-xyz');
    expect(body.reasons.length).toBeGreaterThan(0);
  });
});
