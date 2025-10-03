# ScamShield.my & ShieldStack

ScamShield.my (consumer) and ShieldStack (SME) form an AI-assisted anti-scam and hardening platform delivered as a pnpm-based monorepo targeting Vercel + GitHub deployments.

## Quickstart

```bash
pnpm install
pnpm --filter web prisma generate
pnpm --filter web prisma db push
pnpm --filter web prisma db seed
pnpm dev
```

The web app runs on `http://localhost:3000`. Worker utilities can be started with `pnpm dev:worker`.

### Environment

Copy `.env.example` to `.env.local` and provide:

- `NEXT_PUBLIC_SITE_URL` – the base URL of the Next.js app (e.g. `https://scamshield-my.vercel.app`).
- `WORKER_PROCESS_URL` – public URL for QStash to call worker endpoint. On Vercel this should match the production domain; for local development leave as `http://localhost:3000` to execute scans inline.
- QStash, OpenAI, and integration tokens as needed.

For Vercel, add the above variables via the dashboard and ensure the GitHub App webhook targets `https://<your-domain>/api/github/install-webhook`.

## Tests & Quality

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Deploy

1. Provision Neon Postgres and set `DATABASE_URL`.
2. Configure secrets in Vercel (`OPENAI_API_KEY`, `QSTASH_URL`, `QSTASH_TOKEN`, `CLOUDFLARE_API_TOKEN`, etc.).
3. `vercel link` then `vercel --prod`.
4. Configure GitHub App webhook to `/api/github/install-webhook`.

## Monorepo Layout

- `/apps/web` – Next.js 15 app hosting ScamShield.my public checker & ShieldStack dashboard.
- `/apps/worker` – Background job processor for recon scans & playbook execution.
- `/packages/*` – Shared scoring, recon, playbook logic, and UI components.
- `/prisma` – Database schema and seed data.
- `/extension` – Chrome MV3 extension for context menu checks.
- `/docs` – Architecture, API, and threat model docs.

## Security Notes

- Follows 90-day evidence retention (enforced at the data layer).
- Heuristic-first scoring with optional OpenAI rationale fallback.
- Background jobs executed via Vercel Cron + Upstash QStash, with inline fallback for local dev.
- GitHub App integration persists installations for auto-hardening PRs.

Refer to `docs/THREAT_MODEL.md` for abuse considerations and mitigations.
