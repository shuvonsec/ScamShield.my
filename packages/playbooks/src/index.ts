export interface PlaybookChange {
  type: 'config' | 'file' | 'cloudflare';
  path: string;
  description: string;
  diff?: string;
}

export interface PlaybookContext {
  mode?: 'apply' | 'rollback' | 'preview';
  findingId?: string;
  projectId?: string;
  params?: Record<string, unknown>;
}

export interface Playbook {
  id: string;
  name: string;
  description: string;
  risks: string[];
  apply(context: PlaybookContext): PlaybookChange[];
  rollback(context: PlaybookContext): PlaybookChange[];
}

const playbooks: Playbook[] = [
  {
    id: 'wp-hardening',
    name: 'WordPress ShieldStack Hardening',
    description: 'Locks down WordPress login, disables xmlrpc, and enables auto updates.',
    risks: ['Brute-force login', 'XML-RPC abuse', 'Outdated core/plugins'],
    apply: () => [
      {
        type: 'file',
        path: 'wp-config.php',
        description: 'Enforce automatic updates and disable file editing.',
        diff: `define('WP_AUTO_UPDATE_CORE', true);\ndefine('DISALLOW_FILE_EDIT', true);`
      },
      {
        type: 'config',
        path: '.htaccess',
        description: 'Rate limit wp-login.php and block xmlrpc.php.',
        diff: `<Files xmlrpc.php>\n  order deny,allow\n  deny from all\n</Files>`
      }
    ],
    rollback: () => []
  },
  {
    id: 'laravel-headers',
    name: 'Laravel/Nginx Secure Headers',
    description: 'Applies recommended security headers and blocks sensitive files.',
    risks: ['Missing security headers', 'Sensitive file exposure'],
    apply: () => [
      {
        type: 'config',
        path: 'nginx.conf',
        description: 'Inject security headers and block /.env access.',
        diff: `add_header Content-Security-Policy "default-src 'self'" always;\nadd_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;\nlocation ~ \\.env { deny all; }`
      }
    ],
    rollback: () => []
  },
  {
    id: 'cloudflare-waf',
    name: 'Cloudflare WAF Guard',
    description: 'Creates Cloudflare firewall rules to block malicious traffic and rate limit logins.',
    risks: ['Credential stuffing', 'Bot abuse'],
    apply: () => [
      {
        type: 'cloudflare',
        path: 'waf/rules',
        description: 'Create login rate limiting rule',
        diff: JSON.stringify({
          action: 'challenge',
          expression: "http.request.uri.path contains \"/login\"",
          ratelimit: { threshold: 10, period: 60 }
        })
      }
    ],
    rollback: () => []
  },
  {
    id: 'csp-builder',
    name: 'Generic CSP + Headers',
    description: 'Applies secure defaults for CSP, HSTS, Referrer-Policy and X-Frame-Options.',
    risks: ['Clickjacking', 'XSS via loose CSP'],
    apply: () => [
      {
        type: 'config',
        path: 'headers',
        description: 'Add secure headers to reverse proxy configuration.',
        diff: `Content-Security-Policy: default-src 'self'; img-src 'self' data:; script-src 'self'; object-src 'none'\nReferrer-Policy: strict-origin-when-cross-origin\nX-Frame-Options: DENY`
      }
    ],
    rollback: () => []
  }
];

export function getPlaybooks() {
  return playbooks;
}

export function getPlaybook(id: string) {
  return playbooks.find((playbook) => playbook.id === id);
}
