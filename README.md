# RealWorld Vue3 + NestJS 全栈项目（零门槛部署指南）

> 目标：你按本文一步一步执行，不需要额外猜测，就能把项目跑起来并完成验收。

---

## 1. 项目结构

```text
openclaw-realword/
├── backend/                  # NestJS + Prisma + MySQL
├── frontend/                 # Vue3 + Vite + Pinia + Router
├── docker-compose.yml        # 本地 MySQL 容器（可选）
├── scripts/
│   ├── acceptance-no-mysql.sh
│   ├── e2e-mvp.sh
│   └── mysql-full-acceptance.sh
└── docs/
    ├── acceptance-report.md
    └── runbook.md
```

---

## 2. 环境要求

### 必需
- Node.js >= 20（建议 20/22）
- npm >= 10
- Git

### 数据库（二选一）
- 方案 A：你自己的远程 MySQL（推荐生产/服务器）
- 方案 B：本机 Docker 起 MySQL（开发机方便）

---

## 3. 第一步：拉代码

```bash
git clone <你的仓库地址>
cd openclaw-realword
```

---

## 4. 第二步：安装依赖

```bash
cd backend
npm install

cd ../frontend
npm install

cd ..
```

---

## 5. 第三步：配置后端环境变量（关键）

在 `backend/.env` 写入（没有就新建）：

```env
PORT=3000
DATABASE_URL="mysql://<db_user>:<db_password>@<db_host>:3306/realworld"
SHADOW_DATABASE_URL="mysql://<db_user>:<db_password>@<db_host>:3306/realworld_shadow"
JWT_SECRET="change-me"
```

### 变量说明
- `DATABASE_URL`：业务数据库（真实数据）
- `SHADOW_DATABASE_URL`：Prisma migrate dev 用的影子数据库（仅迁移比对）
- `JWT_SECRET`：JWT 签名密钥

> 注意：`migrate dev` 依赖 `SHADOW_DATABASE_URL`。如果没配或没权限，会报 P1010/P3014。

---

## 6. 第四步：准备 MySQL

## 方案 A：使用远程 MySQL（你当前实际使用）

确保有这两个库：
- `realworld`
- `realworld_shadow`

并给业务用户最小权限（只给这两个库）：

```sql
GRANT ALL PRIVILEGES ON realworld.* TO 'realworld'@'%';
GRANT ALL PRIVILEGES ON realworld_shadow.* TO 'realworld'@'%';
FLUSH PRIVILEGES;
```

## 方案 B：本机 Docker MySQL（可选）

```bash
docker compose up -d mysql
```

然后把 `.env` 的 `<db_host>` 改成 `127.0.0.1`。

---

## 7. 第五步：执行 Prisma 迁移

```bash
cd backend
npx prisma migrate status
npx prisma migrate dev --name init
npx prisma generate
cd ..
```

通过标准：
- `migrate status` 显示 up to date
- `migrate dev` 不报错（无 pending 或生成新迁移均可）
- `generate` 成功

---

## 8. 第六步：启动后端

```bash
cd backend
npm run start:dev
```

新开一个终端验证健康接口：

```bash
curl http://127.0.0.1:3000/api/health
```

期望返回：

```json
{"status":"ok"}
```

---

## 9. 第七步：启动前端

新开一个终端：

```bash
cd frontend
npm run dev
```

浏览器访问 Vite 输出地址（通常 `http://127.0.0.1:5173`）。

---

## 10. 第八步：一键验收（强烈建议）

## 10.1 无 MySQL 阶段验收

```bash
./scripts/acceptance-no-mysql.sh
```

会检查：
- backend lint/build/test/e2e-smoke
- prisma validate/generate
- frontend build

## 10.2 完整 MVP 业务链路验收（后端启动后执行）

```bash
./scripts/e2e-mvp.sh
```

会自动验证：
- 注册
- 登录
- 当前用户
- 发文
- 文章列表
- 文章详情
- 评论新增/删除
- 标签列表

全部通过会输出：

```text
MVP e2e passed
```

---

## 11. 服务器部署建议（最少步骤）

1. 拉代码 + 安装依赖（同上）
2. 配置 `backend/.env`（指向你的服务器 MySQL）
3. 迁移数据库：
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma generate
   ```
4. 构建：
   ```bash
   npm run build
   cd ../frontend && npm run build
   ```
5. 进程托管（建议 PM2/systemd）

示例（PM2）：

```bash
cd backend
npm i -g pm2
pm2 start dist/main.js --name realworld-backend
pm2 save
```

前端静态资源在 `frontend/dist`，可用 Nginx 托管。

---

## 12. 常见问题排查

### Q1: P1000 Authentication failed
- 用户名/密码错误，或 MySQL 用户 host 不匹配
- 检查 `.env` 的 URL 是否正确

### Q2: P1001 Can't reach database server
- `db_host` 或端口不通
- 检查安全组/防火墙/容器端口映射

### Q3: P1010 denied on shadow database
- `realworld_shadow` 未授权
- 给 `realworld_shadow.*` 权限即可（不需要全库 `*.*`）

### Q4: 后端日志显示启动成功，但 curl 连不上
- 多会话/容器网络隔离导致
- 在同一终端或同一运行环境内测试可达性

---

## 13. 一次性全流程命令（你已具备 MySQL 时）

```bash
cd openclaw-realword
cd backend && npx prisma migrate status && npx prisma migrate dev --name init && npx prisma generate && cd ..
./scripts/acceptance-no-mysql.sh
# 启动 backend 后再执行
./scripts/e2e-mvp.sh
```

---

## 14. 验收标准对应关系

- MySQL 可连接：第 6、7 步
- Prisma 迁移可用：第 7 步
- backend build/test：第 10.1 步
- frontend build：第 10.1 步
- MVP 功能：第 10.2 步

---

如果你希望，我下一步可以再补：
- `README-EN.md`（英文版）
- `deploy/nginx.conf` + `pm2.config.cjs`（生产部署模板）
