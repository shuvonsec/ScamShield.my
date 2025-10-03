export type VerdictLabel = 'safe' | 'unknown' | 'suspicious' | 'malicious';

export type ScoreResult = {
  score: number;
  label: VerdictLabel;
  signals: string[];
};

const suspiciousTokens = [
  'login',
  'verify',
  'reset',
  'bank',
  'wallet',
  'invoice',
  'bonus',
  'gift',
  'prize'
];

const riskyTlds = ['.zip', '.mov', '.rest', '.quest', '.country'];

export function scoreUrl(rawUrl: string): ScoreResult {
  const url = new URL(rawUrl);
  const signals: string[] = [];
  let score = 0;

  if (url.hostname.includes('xn--')) {
    score += 20;
    signals.push('URL contains punycode/IDN characters.');
  }

  if (url.href.length > 80) {
    score += 10;
    signals.push('URL length is unusually long.');
  }

  const path = `${url.pathname}${url.search}${url.hash}`;
  const digits = (url.hostname + path).replace(/\D/g, '').length;
  const letters = (url.hostname + path).replace(/[^a-zA-Z]/g, '').length;
  if (digits > 0 && digits / Math.max(letters, 1) > 0.5) {
    score += 10;
    signals.push('High digit-to-letter ratio indicative of obfuscation.');
  }

  for (const token of suspiciousTokens) {
    if (url.href.toLowerCase().includes(token)) {
      score += 8;
      signals.push(`Contains high-risk keyword: ${token}`);
    }
  }

  if (url.pathname.includes('@')) {
    score += 15;
    signals.push('Contains @ character in path which may hide real destination.');
  }

  const subdomainCount = url.hostname.split('.').length - 2;
  if (subdomainCount > 2) {
    score += 10;
    signals.push('Multiple nested subdomains detected.');
  }

  if (riskyTlds.some((tld) => url.hostname.endsWith(tld))) {
    score += 15;
    signals.push('Domain ends with a risky or abuse-prone TLD.');
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    score += 5;
    signals.push('Non-HTTP protocol detected.');
  }

  if (url.searchParams.toString().length > 100) {
    score += 5;
    signals.push('Query string is unusually long.');
  }

  score = Math.min(100, score);

  let label: VerdictLabel = 'safe';
  if (score >= 70) {
    label = 'malicious';
  } else if (score >= 40) {
    label = 'suspicious';
  } else if (score >= 20) {
    label = 'unknown';
  }

  return { score, label, signals };
}

export function scoreText(text: string): ScoreResult {
  const urls = text.match(/https?:\/\/[^\s]+/g);
  if (!urls) {
    return {
      score: 10,
      label: 'unknown',
      signals: ['No URL detected. Assess the sender before acting.']
    };
  }
  const urlScore = scoreUrl(urls[0]);
  return {
    ...urlScore,
    signals: ['Extracted URL from message.', ...urlScore.signals]
  };
}
