#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

echo "[1/7] backend lint"
cd "$ROOT/backend"
npm run -s lint

echo "[2/7] backend build"
npm run -s build

echo "[3/7] backend test"
npm run -s test

echo "[4/7] backend e2e smoke (skip prisma connect)"
SKIP_PRISMA_CONNECT=true npm run -s test:e2e

echo "[5/7] prisma validate + generate"
npx prisma validate
npx prisma generate

echo "[6/7] frontend build"
cd "$ROOT/frontend"
npm run -s build

echo "[7/7] done (MySQL/migrate skipped by request)"
