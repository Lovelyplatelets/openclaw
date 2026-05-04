# Task Plan

## Goal
将 `/home/node/.openclaw/workspace-engineer/code/openclaw-realword` 建成可运行的 RealWorld / Conduit 全栈项目，满足《验收标准》中所有 P0 项，且每个大版本完成后使用 SSH 推送到 GitHub。

## Current Constraints
- 技术栈固定：Vue 3 + TypeScript + Vite + Pinia + Vue Router / NestJS + Prisma + TypeScript / MySQL
- 必须自检：发现问题后修复，再重新验证
- 未通过所有 P0 前，不允许宣布完成
- 已进入 MySQL 阶段开发；当前环境仍缺少 docker/mysql 可执行，需待环境就绪做最终联调

## Phases
- [complete] Phase 1: 项目骨架、目录结构、基础配置、Docker MySQL
- [complete] Phase 2: 后端 NestJS + Prisma 初始化与健康检查（无 MySQL模式）
- [complete] Phase 3: 后端认证/用户/文章/标签/评论核心 API
- [complete] Phase 4: 前端 Vue 3 + Vite + Pinia + Router + API 封装
- [complete] Phase 5: 前端首页/登录/注册/文章详情/发布文章页面
- [complete] Phase 6: 联调前自检、构建、验收报告（无 MySQL模式）
- [in_progress] Phase 7: MySQL 落地链路（迁移、脚本、runbook、全量验收入口）
- [pending] Phase 8: MySQL 真实环境端到端验收补全与全绿报告

## Acceptance Targets
- MySQL 可启动
- Prisma validate/generate/migrate 通过
- backend build/test/e2e 通过
- frontend build 通过
- 注册/登录/当前用户/文章列表/文章详情/发布文章/评论/标签 MVP 端到端可用
- 输出完整验收报告
