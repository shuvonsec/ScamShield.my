export interface SubdomainResult {
  host: string;
  source: string;
}

export interface HttpProbeResult {
  url: string;
  status: number;
  title?: string;
  technologies: string[];
  headers: Record<string, string>;
}

export interface FindingInput {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  title: string;
  evidence: Record<string, unknown>;
}

export interface ReconResult {
  subdomains: SubdomainResult[];
  http: HttpProbeResult[];
  findings: FindingInput[];
}

export interface ReconOptions {
  domain: string;
}

const commonHeaders = ['content-security-policy', 'strict-transport-security', 'referrer-policy', 'x-frame-options'];

export async function reconDomain({ domain }: ReconOptions): Promise<ReconResult> {
  const guessedSubdomains = ['www', 'app', 'admin'].map((sub) => ({
    host: `${sub}.${domain}`,
    source: 'guess'
  }));

  const httpResults: HttpProbeResult[] = guessedSubdomains.map((entry) => ({
    url: `https://${entry.host}`,
    status: 200,
    title: `${entry.host} placeholder`,
    technologies: ['nginx', 'shieldstack-analyzer'],
    headers: {
      'content-security-policy': "default-src 'self'",
      server: 'shieldstack-mock'
    }
  }));

  const findings: FindingInput[] = [];

  httpResults.forEach((result) => {
    commonHeaders.forEach((header) => {
      if (!result.headers[header]) {
        findings.push({
          severity: header === 'content-security-policy' ? 'high' : 'medium',
          category: 'headers',
          title: `Missing ${header}`,
          evidence: { url: result.url, header }
        });
      }
    });

    if (result.technologies.includes('wordpress')) {
      findings.push({
        severity: 'medium',
        category: 'cms',
        title: 'WordPress site detected without ShieldStack hardening',
        evidence: { url: result.url }
      });
    }
  });

  return {
    subdomains: guessedSubdomains,
    http: httpResults,
    findings
  };
}
