<div align="center">

# 🎅 Pets Santa — AI 宠物圣诞写真工坊

**上传一张宠物照片，几秒内由 AI 生成奇幻的圣诞主题写真。**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)

[在线演示](#) · [反馈 Bug](../../issues) · [提交功能建议](../../issues) · [English](./README.md)

</div>

---

## 📖 目录

- [项目简介](#项目简介)
- [界面预览](#界面预览)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [系统架构](#系统架构)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [项目结构](#项目结构)
- [常用脚本](#常用脚本)
- [部署](#部署)
- [贡献指南](#贡献指南)
- [安全](#安全)
- [许可证](#许可证)

---

## 项目简介

**Pets Santa** 是一个全栈 AI 写真工坊：宠物主人上传一张狗、猫或其他爱宠的照片，即可一键生成圣诞主题的高质量写真——圣诞老人套装、精灵服、暖心壁炉、雪景森林等多种风格任意组合，背后由生成式 AI 驱动。

项目基于 **Next.js App Router** 全栈实现，包含真实的用户鉴权体系、由 **Stripe** 驱动的积分计费系统、基于 **Vercel Blob** 的图片存储、通过 **Drizzle ORM** 管理的 **Supabase（PostgreSQL）** 数据库，以及由 **Kie.ai（Nano Banana Pro）** API 驱动的 AI 图像生成能力。

> 如果你正在构建一款生产级别的 **AI SaaS** 产品，这个仓库是一个很好的参考样例：鉴权、积分、支付、异步 AI 任务处理与高完成度的营销落地页，一应俱全。

---

## 界面预览

### 人像编辑器 — 互动式贴纸编辑界面

选择服装、背景与宠物模型（或上传自己的宠物），实时在画布上调整贴纸、文字与装饰。

![人像编辑器截图](./public/SCR-20260624-kwfn-3.png)

### 我的创作 — 生成前后效果对比

每次生成的作品都会保存到个人画廊，原图与 AI 结果一键对比，支持一键下载。

![我的创作截图](./public/SCR-20260624-kwfn-2.png)

### 账单管理 — 透明的积分计费体系

实时查看剩余积分、购买记录，以及每一笔积分收支的完整流水。

![账单页面截图](./public/SCR-20260624-kwfn-5.png)

---

## 功能特性

| 功能 | 说明 |
| --- | --- |
| 🎨 **6 种圣诞造型** | 圣诞老人套装、精灵服、驯鹿连帽衫、暖心毛衣、冬日仙境、礼物盒惊喜 |
| 🖼️ **6 种节日场景** | 暖心壁炉、雪景森林、暖光氛围、星夜、糖果红、复古金 |
| 🐶 **灵活的宠物输入方式** | 支持上传自家宠物，也可使用预设宠物秒试效果 |
| ✨ **互动贴纸编辑器** | 在画布上实时拖拽、缩放、旋转节日装饰元素 |
| ⚡ **异步 AI 生成流水线** | 支持轮询与 Webhook 回调双重状态同步，保证任务可靠完成 |
| 🔐 **完整鉴权体系** | 邮箱密码登录 + Google OAuth（基于 Better Auth） |
| 💳 **积分计费系统** | Stripe Checkout 结账 + 签名校验的 Webhook |
| 📦 **个人创作画廊** | 按用户保存的原图与 AI 结果对比展示 |
| 🌗 **明暗主题切换** | 开箱即用的完整主题支持 |
| 🔒 **隐私优先** | 上传照片安全存储，仅用于图像生成 |

---

## 技术栈

| 层级 | 技术 |
| --- | --- |
| 框架 | [Next.js 16](https://nextjs.org/)（App Router，Turbopack） |
| 语言 | TypeScript |
| 界面 | Tailwind CSS v4、[shadcn/ui](https://ui.shadcn.com/)、Radix UI、[lucide-react](https://lucide.dev/) |
| 鉴权 | [Better Auth](https://www.better-auth.com/)（邮箱密码 + Google OAuth，含 username 插件） |
| 数据库 | [Supabase](https://supabase.com/)（PostgreSQL），通过 [Drizzle ORM](https://orm.drizzle.team/) 管理 |
| 文件存储 | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| 支付 | [Stripe](https://stripe.com/)（Checkout Sessions + Webhooks） |
| AI 图像生成 | [Kie.ai](https://kie.ai/) — Nano Banana Pro 模型 |
| 表单与校验 | React Hook Form + Zod |
| 通知提示 | Sonner（toast 提示） |

---

## 系统架构

```
                       ┌──────────────────────┐
                       │     浏览器 / 前端界面    │
                       │  人像编辑器（Next.js）  │
                       └──────────┬───────────┘
                                  │ 1. 上传照片
                                  ▼
                    /api/upload  ──────────────►  Vercel Blob
                                  │
                                  │ 2. 创建生成任务
                                  ▼
                    /api/generate ──────────────►  Kie.ai（Nano Banana Pro）
                                  │                       │
                                  │  3. 轮询 / 回调         │
                                  ▼                       ▼
              /api/generate/[taskId]  ◄──────  /api/callback
                                  │
                                  ▼
                       Supabase（PostgreSQL，通过 Drizzle）
                       - generation_task
                       - credit_transaction
                                  ▲
                                  │ 结账与 Webhook
                                  │
                    /api/checkout ────────────►  Stripe Checkout
                    /api/webhook  ◄────────────  Stripe Webhook（已签名）
```

1. 用户上传宠物照片，存储至 **Vercel Blob**。
2. `/api/generate` 校验用户积分余额，构建 Prompt，并在 **Kie.ai** 上创建异步生成任务。
3. 任务结果通过 **Kie.ai 的回调（callback）** 或客户端对 `/api/generate/[taskId]` 的**轮询**来同步状态。
4. 生成成功后扣减积分，并通过 **Drizzle ORM** 持久化到 **Supabase** 数据库。
5. 积分充值通过 **Stripe Checkout** 完成；**带签名校验的 Webhook**（`/api/webhook`）是唯一可信的积分发放来源，即使 Stripe 重试投递也能保证幂等。

---

## 快速开始

### 环境要求

- Node.js ≥ 18.18
- [pnpm](https://pnpm.io/)（推荐）或 bun / npm
- 一个 [Supabase](https://supabase.com/) 项目（PostgreSQL 连接字符串）
- 一个 [Stripe](https://stripe.com/) 账户（本地开发使用测试模式即可）
- 一个 [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) 存储桶及读写令牌
- 一个 [Kie.ai](https://kie.ai/) API Key
- （可选）Google OAuth 凭据，用于社交登录

### 1. 克隆仓库

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. 安装依赖

```bash
pnpm install
# 或：bun install / npm install
```

### 3. 配置环境变量

项目通过 **`.env.local`** 文件读取环境变量（详见 [`drizzle.config.ts`](./drizzle.config.ts)）。请在项目根目录创建该文件：

```bash
touch .env.local
```

完整的环境变量列表请参见下方 [环境变量](#环境变量) 一节。

### 4. 初始化数据库

将 Drizzle Schema 推送到你的 Supabase PostgreSQL 实例：

```bash
pnpm db:push
```

也可以选择生成并运行迁移文件：

```bash
pnpm db:generate
pnpm db:migrate
```

你也可以打开 Drizzle Studio 来直观查看数据：

```bash
pnpm db:studio
```

### 5. 启动开发服务器

```bash
pnpm dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

### 6. 配置本地支付测试 Webhook

使用 [Stripe CLI](https://stripe.com/docs/stripe-cli) 将事件转发到本地服务：

```bash
stripe listen --forward-to localhost:3000/api/webhook
```

将打印出的签名密钥填入 `STRIPE_WEBHOOK_SECRET`。

---

## 环境变量

所有变量均通过项目根目录下的 **`.env.local`** 文件读取，请勿将其提交到版本库。

| 变量名 | 说明 | 是否必填 |
| --- | --- | --- |
| `DATABASE_URL` | 应用运行时使用的 Supabase PostgreSQL 连接字符串 | ✅ |
| `DIRECT_URL` | 用于 Drizzle Kit 迁移的直连（非连接池）数据库地址 | ✅ |
| `NEXT_PUBLIC_BASE_URL` | 应用的公开访问地址，例如 `http://localhost:3000` 或生产环境域名 | ✅ |
| `GOOGLE_CLIENT_ID` | Google OAuth 客户端 ID，用于社交登录 | 可选 |
| `GOOGLE_CLIENT_SECRET` | Google OAuth 客户端密钥 | 可选 |
| `KIE_AI_API_KEY` | [Kie.ai](https://kie.ai/api-key) 接口密钥，用于调用 Nano Banana Pro 生图模型 | ✅ |
| `STRIPE_SECRET_KEY` | Stripe 服务端密钥 | ✅ |
| `STRIPE_WEBHOOK_SECRET` | 用于校验 Stripe Webhook 签名的密钥 | ✅ |
| `PRICE_ID` | 结账时使用的 Stripe 价格 ID（积分包） | ✅ |
| `BLOB_READ_WRITE_TOKEN` | 用于存储宠物照片与生成结果的 Vercel Blob 读写令牌 | ✅ |

> 💡 生产环境中，`NEXT_PUBLIC_BASE_URL` 也会用于构建 Kie.ai 的回调地址（`/api/callback`），请确保该地址是可公开访问的 HTTPS 域名。

---

## 项目结构

```
src/
├── app/
│   ├── (routes)/
│   │   ├── (auth)/          # 登录注册页
│   │   ├── (home)/          # 落地页
│   │   ├── billing/         # 账单与积分流水
│   │   ├── creations/       # "我的创作" 画廊
│   │   └── pricing/         # 定价页
│   └── api/
│       ├── auth/[...all]/   # Better Auth 处理器
│       ├── billing/         # 积分与支付数据
│       ├── callback/        # Kie.ai 生成回调
│       ├── checkout/        # Stripe Checkout 会话创建
│       ├── creations/       # 创作列表接口
│       ├── generate/        # 创建/轮询生成任务
│       ├── upload/          # Vercel Blob 图片上传
│       └── webhook/         # 签名校验的 Stripe Webhook 处理器
├── components/
│   ├── pets-santa/          # 落地页、人像编辑器、定价区块等
│   └── ui/                  # shadcn/ui 基础组件
├── db/
│   ├── schema/               # Drizzle Schema：鉴权、计费、生成任务
│   └── index.ts              # Drizzle 客户端
├── lib/
│   ├── auth/                 # Better Auth 客户端/服务端配置
│   ├── billing/               # Stripe 与积分逻辑
│   ├── generation/            # 生成任务编排逻辑
│   └── kie/                   # Kie.ai API 客户端与 Prompt 构建
└── proxy.ts                   # 路由保护中间件
```

---

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器（Turbopack） |
| `pnpm build` | 构建生产环境产物 |
| `pnpm start` | 启动生产服务器 |
| `pnpm lint` | 运行 ESLint 代码检查 |
| `pnpm db:generate` | 生成 Drizzle 迁移文件 |
| `pnpm db:migrate` | 应用迁移到数据库 |
| `pnpm db:push` | 直接推送 Schema 到数据库（不生成迁移文件） |
| `pnpm db:studio` | 打开 Drizzle Studio |

---

## 部署

本项目原生使用 **Vercel Blob** 作为存储方案，因此最适合直接部署在 **[Vercel](https://vercel.com/)** 上。

1. 将仓库推送到 GitHub。
2. 在 Vercel 上导入该项目。
3. 将上方 [环境变量](#环境变量) 表中的所有变量添加到 Vercel 项目设置中。
4. 将 `NEXT_PUBLIC_BASE_URL` 设置为你的生产域名。
5. 在 Stripe 中添加一个指向 `https://<你的域名>/api/webhook` 的 Webhook 端点，并将其签名密钥填入 `STRIPE_WEBHOOK_SECRET`。
6. 部署完成 🚀

---

## 贡献指南

欢迎提交 Issue、功能建议与 Pull Request！提交 PR 前请先阅读 [CONTRIBUTING.md](./CONTRIBUTING.md)，并遵守我们的 [行为准则](./CODE_OF_CONDUCT.md)。

> 注：CONTRIBUTING.md、CODE_OF_CONDUCT.md、SECURITY.md 目前仅提供英文版本。

## 安全

如果你发现安全漏洞，请**不要**直接提交公开 Issue，请参阅 [SECURITY.md](./SECURITY.md) 了解负责任的披露流程。

## 许可证

本项目采用 **MIT 许可证**开源，详情见 [LICENSE](./LICENSE) 文件。

---

<div align="center">

为所有爱宠人士用心打造 ❄️🎄

</div>
