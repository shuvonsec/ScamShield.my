#!/usr/bin/env bash
set -euo pipefail

if ! command -v curl >/dev/null; then
  echo "curl is required" >&2
  exit 1
fi

if ! command -v jq >/dev/null; then
  echo "jq is required" >&2
  exit 1
fi

BASE_URL=${1:-"http://localhost:3000"}
URL_TO_CHECK=${2:-"https://login-bonus-update.zip/verify"}

echo "Submitting URL to ScamShield..."
CHECK_RESPONSE=$(curl -sS -X POST "$BASE_URL/api/check-url" -H 'Content-Type: application/json' -d "{\"url\":\"$URL_TO_CHECK\"}")
REPORT_ID=$(echo "$CHECK_RESPONSE" | jq -r '.reportId')

echo "Response: $CHECK_RESPONSE"

echo "Fetching shareable report $REPORT_ID"
REPORT=$(curl -sS "$BASE_URL/api/report/$REPORT_ID")
echo "$REPORT"
