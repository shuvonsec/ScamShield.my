export type VerdictLabel = 'safe' | 'unknown' | 'suspicious' | 'malicious';

export interface Signal {
  type: string;
  label: string;
  score: number;
}

export interface ScoreResult {
  score: number;
  label: VerdictLabel;
  signals: Signal[];
}

const riskyTlds = new Set(['zip', 'mov', 'tk', 'ml', 'ga', 'cf', 'gq']);
const phishingTokens = ['login', 'verify', 'reset', 'bank', 'wallet', 'invoice', 'bonus', 'gift', 'prize'];

export interface ScoreOptions {
  url: string;
}

function normalizeUrl(rawUrl: string) {
  try {
    return new URL(rawUrl.trim());
  } catch (error) {
    throw new Error('Invalid URL provided.');
  }
}

function signal(label: string, score: number, type: string): Signal {
  return { label, score, type };
}

function isPunycode(hostname: string) {
  return hostname.includes('xn--');
}

export function scoreUrl({ url }: ScoreOptions): ScoreResult {
  const parsed = normalizeUrl(url);
  const signals: Signal[] = [];
  let total = 0;

  const host = parsed.hostname;
  const path = parsed.pathname + parsed.search;

  if (parsed.href.length > 80) {
    const s = signal('URL length exceeds 80 characters', 10, 'length');
    signals.push(s);
    total += s.score;
  }

  const subdomainCount = host.split('.').length - 2;
  if (subdomainCount > 2) {
    const s = signal('Excessive subdomains detected', 12, 'subdomain');
    signals.push(s);
    total += s.score;
  }

  if (/@/.test(path)) {
    const s = signal('Contains @ in path, often used to mask destinations', 18, 'obfuscation');
    signals.push(s);
    total += s.score;
  }

  if (isPunycode(host)) {
    const s = signal('Internationalized (punycode) hostname detected', 15, 'idn');
    signals.push(s);
    total += s.score;
  }

  const tld = host.split('.').pop()?.toLowerCase() ?? '';
  if (riskyTlds.has(tld)) {
    const s = signal(`Risky top-level domain .${tld}`, 20, 'tld');
    signals.push(s);
    total += s.score;
  }

  const digitRatio = host.replace(/[^0-9]/g, '').length / Math.max(1, host.length);
  if (digitRatio > 0.3) {
    const s = signal('High digit-to-letter ratio in hostname', 10, 'lexical');
    signals.push(s);
    total += s.score;
  }

  const tokenHits = phishingTokens.filter((token) => parsed.href.toLowerCase().includes(token));
  if (tokenHits.length) {
    const s = signal(`Contains phishing tokens: ${tokenHits.join(', ')}`, 25, 'token');
    signals.push(s);
    total += s.score;
  }

  if (/https?:\/\/.+https?:\/\//.test(url)) {
    const s = signal('Multiple URL schemas detected (possible redirection chain)', 12, 'redirect');
    signals.push(s);
    total += s.score;
  }

  const verdict = deriveVerdict(total);

  return {
    score: total,
    label: verdict,
    signals
  };
}

export function deriveVerdict(score: number): VerdictLabel {
  if (score >= 60) {
    return 'malicious';
  }
  if (score >= 40) {
    return 'suspicious';
  }
  if (score >= 20) {
    return 'unknown';
  }
  return 'safe';
}
