export type PlaybookChange = {
  description: string;
  file?: string;
  diff?: string;
};

export type Playbook = {
  id: string;
  name: string;
  description: string;
  risks: string[];
  apply: (params: Record<string, unknown>) => Promise<PlaybookChange[]>;
  rollback: (params: Record<string, unknown>) => Promise<PlaybookChange[]>;
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function noopRollback() {
  return [{ description: 'Rollback pending implementation.' }];
}

export const library: Playbook[] = [
  {
    id: 'wordpress-hardening',
    name: 'WordPress Hardening Essentials',
    description: 'Disable XML-RPC, enforce updates, and audit plugins.',
    risks: ['Brute force', 'Plugin abuse', 'XML-RPC amplification'],
    async apply() {
      await delay(50);
      return [
        { description: 'Disable xmlrpc.php via .htaccess rule', file: '.htaccess', diff: '-<Files xmlrpc.php>\n+deny from all' },
        { description: 'Enable automatic core and plugin updates', file: 'wp-config.php' },
        { description: 'Generate plugin audit report', file: 'reports/plugin-audit.json' }
      ];
    },
    rollback: noopRollback
  },
  {
    id: 'laravel-nginx',
    name: 'Laravel & Nginx Security Headers',
    description: 'Applies security headers, rate limits, and blocks sensitive files.',
    risks: ['Missing security headers', 'Exposure of .env', 'Credential stuffing'],
    async apply() {
      await delay(50);
      return [
        { description: 'Add security headers middleware', file: 'app/Http/Middleware/SecureHeaders.php' },
        { description: 'Update nginx.conf with rate limiting', file: 'deploy/nginx.conf' },
        { description: 'Block /.env and /.git locations', file: 'deploy/nginx.conf' }
      ];
    },
    rollback: noopRollback
  },
  {
    id: 'cloudflare-waf',
    name: 'Cloudflare WAF Shield',
    description: 'Creates WAF custom rules for login protection and scam blocking.',
    risks: ['Credential stuffing', 'Phishing pages', 'Bot attacks'],
    async apply(params) {
      await delay(50);
      return [
        { description: 'Create firewall rule to challenge suspicious login attempts', diff: JSON.stringify(params) },
        { description: 'Enable bot fight mode', diff: 'bot_fight_mode: on' }
      ];
    },
    rollback: noopRollback
  },
  {
    id: 'csp-builder',
    name: 'Content Security Policy Builder',
    description: 'Generates a CSP with report-only toggle.',
    risks: ['XSS', 'Malicious script injection'],
    async apply(params) {
      const reportOnly = Boolean(params.reportOnly);
      await delay(10);
      return [
        {
          description: `Apply CSP header (${reportOnly ? 'report-only' : 'enforce'})`,
          diff: `Content-Security-Policy${reportOnly ? '-Report-Only' : ''}: default-src 'self'; img-src 'self' data:; connect-src 'self';`
        }
      ];
    },
    rollback: noopRollback
  }
];
