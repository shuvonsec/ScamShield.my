import { describe, expect, it, vi, beforeEach } from 'vitest';
import { POST } from '../../apps/web/app/api/check-url/route';

vi.mock('../../apps/web/lib/db', () => {
  return {
    prisma: {
      uRLCheck: {
        create: vi.fn(async ({ data }) => ({ id: 'report-123', ...data }))
      }
    }
  };
});

vi.mock('../../apps/web/lib/ai', () => ({
  generateRationale: vi.fn(async () => ['Rationale one', 'Rationale two'])
}));

describe('POST /api/check-url', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a score for valid URL', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://login-bank-secure.mov/reset' })
    });
    const response = await POST(request);
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.verdict).toBe('malicious');
    expect(json.reportId).toBe('report-123');
  });

  it('rejects missing url', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({})
    });
    const response = await POST(request);
    expect(response.status).toBe(400);
  });
});
