# Threat Model

## Assets
- URL verdicts and evidence (low PII)
- SME project metadata, findings, remediation history
- GitHub/Cloudflare credentials

## Actors & Abuse Cases
- **Scammers** attempting to bypass heuristics with obfuscated URLs.
- **Bot abuse** hitting `/api/check-url` for enumeration.
- **Malicious tenant** abusing SME findings to probe other tenants.
- **Compromised webhook** tampering with GitHub/Slack integrations.

## Mitigations
- Deterministic heuristics with transparent signals; TODO: integrate WHOIS & threat feeds.
- Rate limit public endpoints (use Vercel middleware / edge functions) and add bot protection (hCaptcha/Turnstile) – placeholders noted.
- Store minimal user data; project ownership keyed by hashed email if needed.
- All secrets sourced from environment variables only; no static keys in repo.
- Signed QStash callbacks; fallback only active locally.
- Evidence retention 90 days (enforce via scheduled cleanup job – TODO stub in worker).

## Residual Risks
- AI rationales depend on LLM output; ensure moderation via OpenAI safety tools.
- Recon heuristics rely on HEAD requests; additional validation required when enabling autopatching.
- GitHub PR autopatches currently stubbed – manual review required before merge.
