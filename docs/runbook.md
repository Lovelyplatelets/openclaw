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

1. Start MySQL and ensure `DATABASE_URL` works.
2. Run migrations:

```bash
cd backend
npx prisma migrate dev
```

3. Start backend (`npm run start:dev`) and frontend (`npm run dev`).
4. Run MVP e2e:

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
