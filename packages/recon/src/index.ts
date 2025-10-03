export type ReconFinding = {
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  evidence: Record<string, unknown>;
  fix: Record<string, unknown>;
};

export type ReconResult = {
  subdomains: string[];
  findings: ReconFinding[];
};

const COMMON_SUBDOMAINS = ['www', 'admin', 'portal', 'vpn', 'mail'];

export async function runRecon(domain: string): Promise<ReconResult> {
  const subdomains = await enumerateSubdomains(domain);
  const probes = await Promise.all(subdomains.map((host) => probeHttp(host)));
  const findings: ReconFinding[] = [];

  for (const probe of probes) {
    findings.push(...auditSecurityHeaders(probe));
    findings.push(...detectCmsIssues(probe));
  }

  return {
    subdomains,
    findings
  };
}

export async function enumerateSubdomains(domain: string) {
  const generated = COMMON_SUBDOMAINS.map((prefix) => `${prefix}.${domain}`);
  return [domain, ...generated];
}

type ProbeResult = {
  host: string;
  status: number;
  headers: Record<string, string>;
  technologies: string[];
};

export async function probeHttp(host: string): Promise<ProbeResult> {
  try {
    const response = await fetch(`https://${host}`, { method: 'HEAD' });
    return {
      host,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      technologies: fingerprint(response.headers)
    };
  } catch (error) {
    return {
      host,
      status: 0,
      headers: {},
      technologies: []
    };
  }
}

function fingerprint(headers: Headers) {
  const tech: string[] = [];
  if (headers.get('server')?.toLowerCase().includes('nginx')) tech.push('nginx');
  if (headers.get('x-powered-by')?.toLowerCase().includes('php')) tech.push('php');
  if (headers.get('x-powered-by')?.toLowerCase().includes('express')) tech.push('express');
  return tech;
}

function auditSecurityHeaders(probe: ProbeResult): ReconFinding[] {
  const findings: ReconFinding[] = [];
  const headers = probe.headers;

  const requiredHeaders = ['content-security-policy', 'strict-transport-security', 'x-frame-options'];
  for (const key of requiredHeaders) {
    if (!headers[key]) {
      findings.push({
        severity: 'medium',
        category: 'headers',
        title: `${probe.host} missing ${key}`,
        evidence: { host: probe.host, header: key },
        fix: { recommendation: `Apply security header ${key}` }
      });
    }
  }

  return findings;
}

function detectCmsIssues(probe: ProbeResult): ReconFinding[] {
  const findings: ReconFinding[] = [];
  if (probe.technologies.includes('php')) {
    findings.push({
      severity: 'high',
      category: 'cms',
      title: `${probe.host} appears to run PHP without hardened headers`,
      evidence: { host: probe.host, technologies: probe.technologies },
      fix: { playbook: 'laravel-nginx' }
    });
  }
  if (probe.headers['x-generator']?.toLowerCase().includes('wordpress')) {
    findings.push({
      severity: 'critical',
      category: 'wordpress',
      title: `${probe.host} WordPress installation missing XML-RPC hardening`,
      evidence: { host: probe.host },
      fix: { playbook: 'wordpress-hardening' }
    });
  }
  return findings;
}
