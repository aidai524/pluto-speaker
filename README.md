# Pluto Speaker

一个基于 OpenAI 的音频交互 API 系统，使用 Hono 框架构建，部署在 Cloudflare Workers 上。

## 功能特点

- 用户认证 (使用 Supabase)
- 文本转语音
- 语音转文本
- 语音对话
- 支持二进制和 JSON 格式的音频响应

## 技术栈

- Hono (Web 框架)
- OpenAI API (音频处理)
- Supabase (用户管理)
- Cloudflare Workers (部署平台)
- TypeScript

## 快速开始

1. 克隆仓库
```bash
git clone https://github.com/yourusername/pluto-speaker.git
cd pluto-speaker
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 配置环境变量
复制 wrangler.toml.example 到 wrangler.toml 并填写你的配置：
```toml
[vars]
SUPABASE_URL = "your-supabase-url"
SUPABASE_ANON_KEY = "your-supabase-anon-key"
JWT_SECRET = "your-jwt-secret"
OPENAI_API_KEY = "your-openai-api-key"
```

4. 本地开发
```bash
npm run dev
# 或
yarn dev
```

5. 部署
```bash
npm run deploy
# 或
yarn deploy
```

## API 文档

详细的 API 文档请查看 [API.md](API.md)。

## 开发

### 项目结构
```
pluto-speaker
├── README.md
├── package.json
├── src
│   ├── index.ts
│   ├── routes
│   │   ├── auth.ts
│   │   └── audio.ts
│   ├── middleware
│   │   └── auth.ts
│   ├── services
│   │   ├── auth.service.ts
│   │   └── audio.service.ts
│   ├── config
│   │   ├── supabase.ts
│   │   └── openai.ts
│   └── types
│       ├── auth.types.ts
│       ├── audio.types.ts
│       └── env.types.ts
├── tsconfig.json
└── wrangler.toml
```

### 本地开发

1. 启动开发服务器：
```bash
npm run dev
```

2. 测试 API：
```bash
curl -X POST http://localhost:8787/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "test@example.com", "password": "password123"}'
```

## 部署

1. 登录到 Cloudflare：
```bash
npx wrangler login
```

2. 部署到 Cloudflare Workers：
```bash
npm run deploy
```

## 贡献

欢迎提交 Pull Request 和 Issue！

## 许可证

MIT