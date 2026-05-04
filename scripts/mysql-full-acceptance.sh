#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT"

echo "[1/5] start mysql"
docker compose up -d mysql

echo "[2/5] wait mysql healthy"
for i in $(seq 1 60); do
  STATUS=$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}no-health{{end}}' realworld-mysql 2>/dev/null || true)
  if [ "$STATUS" = "healthy" ]; then
    echo "mysql healthy"
    break
  fi
  if [ "$i" -eq 60 ]; then
    echo "mysql not healthy in time"
    exit 1
  fi
  sleep 2
done

echo "[3/5] prisma migrate deploy"
cd "$ROOT/backend"
npx prisma migrate deploy

echo "[4/5] non-mysql acceptance"
cd "$ROOT"
./scripts/acceptance-no-mysql.sh

echo "[5/5] mvp e2e"
./scripts/e2e-mvp.sh

echo "mysql full acceptance passed"
