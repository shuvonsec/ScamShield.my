# Architecture Overview

```
┌─────────────┐     ┌───────────────┐     ┌────────────┐
│  Web App    │───▶ │ Next API      │───▶ │  Postgres  │
│ (Next.js)   │     │ Routes        │     │ (Neon)     │
└─────┬───────┘     └──────┬────────┘     └────────────┘
      │                    │
      │                    │
      │            ┌───────▼────────┐
      │            │ Background     │
      │            │ Worker (QStash)│
      │            └───────┬────────┘
      │                    │
      ▼                    ▼
┌────────────┐     ┌───────────────┐
│ AI client  │     │ Integrations  │
│ (OpenAI)   │     │ (Cloudflare,  │
└────────────┘     │ GitHub, Slack)│
                    └───────────────┘
```

- **apps/web** hosts the ScamShield consumer checker and ShieldStack SME dashboard in a single Next.js 15 project using the App Router. Both share Tailwind and shadcn/ui components from `packages/ui`.
- **apps/worker** exposes edge-friendly API handlers for cron/QStash invocations handling scheduled scans and async tasks.
- **packages/scoring** encapsulates deterministic URL heuristics and optional AI rationales.
- **packages/recon** provides recon primitives (subdomain enumeration, HTTP probing, header audits) used by scheduled scans.
- **packages/playbooks** defines remediation playbooks with `apply`/`rollback` helpers and change previews.
- **prisma** defines the relational schema and seed data. Prisma Client is shared via `apps/web/lib/db.ts`.
- **docs** capture architecture, API, and threat modeling for auditors.

## Data Flow
1. Users submit URLs via ScamShield UI (`/api/check-url`). The API invokes the scoring engine, stores `URLCheck`, optionally requests AI rationales, and returns shareable report IDs.
2. SME users manage projects. `/api/scan` schedules tasks via QStash processed by `apps/worker`. Scan jobs use `packages/recon` to populate `Finding` records.
3. Findings can trigger Slack alerts and offer remediation via `packages/playbooks` which generate config snippets or GitHub PR patches.
4. Nightly cron triggers `/api/cron/nightly-scan` to enqueue scans for all active projects.

## Security Notes
- All secrets pulled from environment variables. No credentials in code.
- Rate limiting guards high-risk endpoints; see `apps/web/lib/rate-limit.ts`.
- Email addresses hashed before persistence where possible.
