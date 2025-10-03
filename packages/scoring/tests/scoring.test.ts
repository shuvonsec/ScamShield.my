import { describe, expect, it } from 'vitest';
import { scoreUrl, scoreText } from '../src';

describe('scoreUrl', () => {
  it('flags risky tld and @ symbol', () => {
    const result = scoreUrl('http://bank-login.verify-update.zip/login@attacker.com');
    expect(result.score).toBeGreaterThanOrEqual(40);
    expect(result.label).toBe('suspicious');
    expect(result.signals).toContain('Contains @ character in path which may hide real destination.');
  });

  it('considers safe urls low score', () => {
    const result = scoreUrl('https://www.bnm.gov.my/');
    expect(result.score).toBeLessThan(20);
    expect(result.label).toBe('safe');
  });
});

describe('scoreText', () => {
  it('extracts url', () => {
    const result = scoreText('Check this https://example.com now');
    expect(result.signals[0]).toContain('Extracted URL');
  });
});
