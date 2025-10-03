# API Reference

All endpoints are served from the Next.js app under `/api`. Authentication for SME routes uses session tokens (not included in this scaffold) or API keys.

## `POST /api/check-url`
- **Body:** `{ "url": string }`
- **Response:** `{ score: number, verdict: 'safe'|'unknown'|'suspicious'|'malicious', reasons: string[], signals: Signal[], reportId: string }`

## `GET /api/report/:id`
Returns cached report information for sharing with friends and banks.

## `POST /api/projects`
Create a new project with `{ name, domain }`.

## `POST /api/scan`
Trigger a recon scan for the provided `projectId`. This enqueues work for the worker app.

## `GET /api/scan/:id`
Fetch scan findings and a summary.

## `POST /api/apply-playbook`
Apply a remediation playbook. Payload: `{ projectId, playbookId, params }`.

## `POST /api/github/install-webhook`
Handles GitHub App installation events and stores metadata for future PR automation.

All responses follow `{ data, error }` shape where appropriate for typed clients.
