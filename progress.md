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
- 修复文章+标签关联流程，避免真实 DB 写入失败。
- 新增无 MySQL 验收脚本 `scripts/acceptance-no-mysql.sh` 并执行通过。
- 新增 `SKIP_PRISMA_CONNECT` 开关，支持无 MySQL 环境后端启动与 e2e。
- 新增 MySQL 就绪后 MVP 端到端脚本 `scripts/e2e-mvp.sh`。
- 新增 `docs/runbook.md`，统一无 MySQL 阶段与 MySQL 阶段执行手册。

## 2026-05-04（MySQL阶段切换）
- 按用户要求切换到 MySQL 相关开发。
- 生成 Prisma 初始迁移：`backend/prisma/migrations/20260504000000_init/migration.sql`。
- 增强 `docker-compose.yml`：增加 MySQL 健康检查。
- 新增一键全量脚本：`scripts/mysql-full-acceptance.sh`（起库→迁移→非MySQL验收→MVP e2e）。
- 运行环境检查：当前宿主机仍无 `docker` 可执行；`prisma migrate status` 报 `P1001 localhost:3306` 不可达（环境阻塞，非代码问题）。
