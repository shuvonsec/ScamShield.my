# API Reference

## POST /api/check-url

Request:
```json
{ "url": "https://example.com" }
```

Response:
```json
{
  "score": 42,
  "verdict": "suspicious",
  "reasons": ["Mock rationale"],
  "signals": ["URL length is unusually long."],
  "reportId": "uuid",
  "rationale": ["Mock rationale"]
}
```

## GET /api/report/:id
Returns cached verdict and evidence.

## POST /api/projects
Body: `{ "name": string, "domain": string }`
Returns `{ "projectId": string }`

## POST /api/scan
Body: `{ "projectId": string }`
Queues a recon scan via QStash and returns `{ "scanId": string }`.

## GET /api/scan/:id
Returns findings, summary, and recommended actions.

## POST /api/apply-playbook
Body: `{ "projectId?": string, "playbookId": string, "params": object }`
Returns `{ "status": "queued", "changes": PlaybookChange[] }`.

## POST /api/github/install-webhook
Accepts GitHub App installation payloads and stores metadata for autopatches.

## GET /api/cron/nightly-scan
Cron-triggered endpoint to enqueue scans for every project.
