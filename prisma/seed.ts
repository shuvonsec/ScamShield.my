import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

function hashEmail(email: string) {
  return createHash('sha256').update(email.toLowerCase()).digest('hex');
}

async function main() {
  const user = await prisma.user.upsert({
    where: { emailHash: hashEmail('demo@sme.local') },
    update: {},
    create: {
      emailHash: hashEmail('demo@sme.local'),
      role: 'admin',
      plan: 'pro'
    }
  });

  const project = await prisma.project.upsert({
    where: { id: 'demo-project' },
    update: {},
    create: {
      id: 'demo-project',
      name: 'Demo SME',
      domain: 'demo.example',
      ownerId: user.id
    }
  });

  const scan = await prisma.scan.create({
    data: {
      projectId: project.id,
      status: 'completed',
      finishedAt: new Date(),
      findings: {
        create: [
          {
            severity: 'high',
            category: 'headers',
            title: 'Missing Content-Security-Policy',
            evidence: { header: 'Content-Security-Policy', present: false },
            fix: { recommendation: 'Apply ShieldStack CSP playbook' }
          },
          {
            severity: 'medium',
            category: 'waf',
            title: 'No WAF protections detected',
            evidence: { provider: 'Cloudflare', detected: false },
            fix: { recommendation: 'Enable ShieldStack Cloudflare WAF playbook' }
          }
        ]
      }
    }
  });

  await prisma.urlCheck.create({
    data: {
      url: 'http://login-example-secure-bonus.com/verify',
      score: 82,
      verdict: 'malicious',
      signals: [
        { type: 'token', label: 'Contains phishing token "login"' },
        { type: 'tld', label: 'Risky TLD .com' },
        { type: 'length', label: 'URL length > 80 characters' }
      ],
      reasons: ['Spoofed login flow', 'Multiple red flags detected']
    }
  });

  console.log({ user, project, scan });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
