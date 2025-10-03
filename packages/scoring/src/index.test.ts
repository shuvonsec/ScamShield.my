import { describe, expect, it } from 'vitest';
import { deriveVerdict, scoreUrl } from './index';

describe('deriveVerdict', () => {
  it('classifies safe scores', () => {
    expect(deriveVerdict(5)).toBe('safe');
  });
  it('classifies unknown scores', () => {
    expect(deriveVerdict(25)).toBe('unknown');
  });
  it('classifies suspicious scores', () => {
    expect(deriveVerdict(45)).toBe('suspicious');
  });
  it('classifies malicious scores', () => {
    expect(deriveVerdict(65)).toBe('malicious');
  });
});

describe('scoreUrl', () => {
  it('flags phishing tokens', () => {
    const result = scoreUrl({ url: 'https://secure-login-update-bonus.mov/account' });
    expect(result.signals.some((s) => s.type === 'token')).toBe(true);
    expect(result.label).toBe('malicious');
  });

  it('handles invalid urls', () => {
    expect(() => scoreUrl({ url: 'not-a-url' })).toThrowError('Invalid URL provided.');
  });
});
