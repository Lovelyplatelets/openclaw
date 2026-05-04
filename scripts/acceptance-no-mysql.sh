#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "[1/6] backend lint"
cd "$ROOT/backend"
npm run -s lint

echo "[2/6] backend build"
npm run -s build

echo "[3/6] backend test"
npm run -s test

echo "[4/6] prisma validate + generate"
npx prisma validate
npx prisma generate

echo "[5/6] frontend build"
cd "$ROOT/frontend"
npm run -s build

echo "[6/6] done (MySQL/migrate skipped by request)"
