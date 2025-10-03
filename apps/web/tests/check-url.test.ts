import { describe, expect, it, vi } from 'vitest';

const prismaMock = {
  uRLCheck: {
    create: vi.fn().mockResolvedValue({ id: 'report-123' })
  }
};

vi.mock('../lib/prisma', () => ({
  prisma: prismaMock
}));

vi.mock('../lib/rationale', () => ({
  generateRationale: vi.fn().mockResolvedValue(['Mock rationale'])
}));

import { POST } from '../app/api/check-url/route';

describe('POST /api/check-url', () => {
  it('rejects too-short payload', async () => {
    const response = await POST(new Request('http://localhost', { method: 'POST', body: JSON.stringify({ url: 'bad' }) }));
    expect(response.status).toBe(400);
  });

  it('creates report for valid url', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ url: 'https://example.com/login' })
      })
    );
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.reportId).toBe('report-123');
    expect(json.rationale[0]).toBe('Mock rationale');
    expect(json.reasons.length).toBeGreaterThan(0);
  });

  it('handles text content when URL parsing fails', async () => {
    const response = await POST(
      new Request('http://localhost', {
        method: 'POST',
        body: JSON.stringify({ url: 'Your account will be suspended, click here http://phish' })
      })
    );
    expect(response.status).toBe(200);
    const json = await response.json();
    expect(json.signals[0]).toContain('Extracted URL');
  });
});
