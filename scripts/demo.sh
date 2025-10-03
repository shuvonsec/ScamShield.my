#!/usr/bin/env bash
set -euo pipefail

URL=${1:-"https://update-bank-login.zip/login"}

echo "Checking $URL via local API..."
response=$(curl -sS -X POST http://localhost:3000/api/check-url -H 'Content-Type: application/json' -d "{\"url\":\"$URL\"}")
echo "$response" | jq '.'
