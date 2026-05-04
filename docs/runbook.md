# Runbook (No-MySQL stage / MySQL-ready stage)

## Stage A: No-MySQL validation

```bash
./scripts/acceptance-no-mysql.sh
```

Checks:
- backend lint/build/test/e2e-smoke
- prisma validate/generate
- frontend build

## Stage B: MySQL-ready full validation (when DB available)

1. Start MySQL + full acceptance in one shot:

```bash
./scripts/mysql-full-acceptance.sh
```

Or run steps manually:

```bash
cd backend
npx prisma migrate dev
```

Then start backend (`npm run start:dev`) and frontend (`npm run dev`), and run:

```bash
./scripts/e2e-mvp.sh
```

Covers:
- register
- login
- current user
- article create/list/detail
- comment create/delete
- tags
