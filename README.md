# ScamShield.my & ShieldStack Monorepo

An open-core security suite featuring ScamShield.my — an AI-assisted consumer scam checker — and ShieldStack, a continuous security hardening companion for SMEs.

## Quickstart

```bash
pnpm install
pnpm db:generate
pnpm db:push
pnpm db:seed
pnpm dev
```

Visit `http://localhost:3000` for ScamShield.my and ShieldStack (switch via the dashboard menu).

## Tooling
- **Frontend:** Next.js 15 (App Router), Tailwind CSS, shadcn/ui components.
- **Backend:** Next.js API routes, Prisma ORM, Vercel cron & Upstash QStash workers.
- **Database:** Postgres (Neon ready).
- **AI:** OpenAI-compatible API with modular client.
- **CI:** GitHub Actions (`.github/workflows/ci.yml`).

For full documentation see [`/docs`](./docs).
