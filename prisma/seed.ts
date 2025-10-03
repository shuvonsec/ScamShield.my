import { PrismaClient } from '@prisma/client';
import { scoreUrl } from '@scamshield/scoring';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@scamshield.my' },
    update: {},
    create: {
      email: 'demo@scamshield.my',
      role: 'admin',
      plan: 'enterprise'
    }
  });

  const project = await prisma.project.upsert({
    where: { domain: 'demo-shieldstack.my' },
    update: {},
    create: {
      name: 'Demo SME',
      domain: 'demo-shieldstack.my',
      ownerId: user.id
    }
  });

  const scan = await prisma.scan.create({
    data: {
      projectId: project.id,
      status: 'completed',
      startedAt: new Date(Date.now() - 3600_000),
      finishedAt: new Date()
    }
  });

  await prisma.finding.createMany({
    data: [
      {
        scanId: scan.id,
        severity: 'high',
        category: 'headers',
        title: 'Missing Content-Security-Policy',
        evidence: { header: 'content-security-policy', host: 'demo-shieldstack.my' },
        fix: { playbook: 'csp-builder' },
        status: 'open'
      },
      {
        scanId: scan.id,
        severity: 'medium',
        category: 'wordpress',
        title: 'WordPress XML-RPC enabled',
        evidence: { endpoint: '/xmlrpc.php' },
        fix: { playbook: 'wordpress-hardening' },
        status: 'open'
      }
    ]
  });

  const malicious = scoreUrl('http://update.bank-login.my-account-verification.com/login@evil.com');
  await prisma.uRLCheck.create({
    data: {
      url: 'http://update.bank-login.my-account-verification.com/login@evil.com',
      score: malicious.score,
      verdict: malicious.label,
      signals: malicious.signals,
      reasons: ['Detected suspicious banking login domain', 'Contains @ symbol hiding true destination']
    }
  });

  console.log('Seed completed.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
