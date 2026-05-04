# Progress Log

## 2026-05-03
- 初始化计划文件与目标。
- 明确 P0 验收边界与阶段拆分。

## 2026-05-04（阶段推进）
- SSH 推送链路已切换验证，远端 `main` 可访问。
- 发现练习仓库已有较完整初始骨架（backend/frontend/prisma/docker-compose）。
- 修复后端单测：`app.controller.spec.ts` 从旧 HelloWorld 断言改为 `health` 断言。
- 增加后端 `.env`（含 `DATABASE_URL`、`JWT_SECRET`、`PORT`），解除 Prisma 校验阻塞。
- 通过后端基础自检：`npm test`、`prisma validate`、`prisma generate`。
- 修复前端构建阻塞：补齐 devDependencies 实装（`npm install --include=dev`），恢复 `vue-tsc` 可执行。
- 前端构建通过：`npm run build`。

## 2026-05-04（继续开发）
- 完成前端 API 封装：`api/client.ts`、`api/auth.ts`、`api/articles.ts`。
- 完成 Pinia Store：`stores/auth.ts`、`stores/articles.ts`。
- 完成页面与路由：首页、登录、注册、文章详情、发布文章。
- 完成 App 路由壳与样式体系重构。
- 修复后端 lint 问题（unused import / floating promise）。
- 新增仓库根 `.gitignore`，清理 node_modules/dist/.env 版本污染风险。
- 新增并更新 `docs/acceptance-report.md`（P0 验收现状、阻塞、复测记录）。
- 再次验证通过：
  - frontend `npm run build` ✅
  - backend `npm run build` ✅
  - backend `npm run test` ✅
  - backend `npm run lint` ✅
  - prisma `validate/generate` ✅
- 当前阻塞：运行环境缺少 `docker` / `mysqld`，无法在本机完成 MySQL 启动与 `prisma migrate` 真落库验证。
