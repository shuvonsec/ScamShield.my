# Threat Model

## Assets
- ScamShield reports and evidence
- SME project metadata and findings
- API keys for integrations (GitHub, Cloudflare, Slack)

## Actors
- Consumers (anonymous)
- SME administrators
- Malicious actors abusing public checker
- Insider threats

## Entry Points
- Public `/api/check-url`
- Authenticated SME APIs
- Webhooks (GitHub, QStash, Slack)

## Risks & Mitigations
- **Abuse of URL checker for phishing distribution**: Rate limit requests, monitor suspicious IPs, and cache responses to reduce compute.
- **Leakage of sensitive SME findings**: Auth gating, RBAC, hashed email storage, strict CORS.
- **Webhook forgery**: HMAC verification for GitHub/QStash payloads, allowlist origins.
- **Data retention**: Automatic purge after 90 days using worker cron.
- **AI misuse**: AI rationale limited to short summaries; fallback to deterministic explanations if AI unavailable.

## Privacy
- Emails hashed with SHA-256 + salt before persistence.
- Evidence redacted for PII prior to sharing externally.

## Future Work
- Integrate behavioral analytics for anomaly detection.
- Expand abuse rate limits with CAPTCHA challenge for Tor/bot networks.
