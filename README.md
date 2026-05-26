# Week 6 — AI API Route + Streaming + Supabase Storage

The final week adds **AI-powered content generation** to CardVault. Generate professional bios and descriptions using DeepSeek (or OpenAI) with **streaming responses** displayed token-by-token. All generations are saved to Supabase and browsable in a history panel.

## ✨ Features

- **Server-Side AI API Route** — API key never leaves the server
- **Streaming Responses** — Tokens stream to the client in real-time via `ReadableStream`
- **Chat-Like UI** — Messages with user/assistant bubbles and a blinking cursor
- **Generation History** — Past generations saved to Supabase, viewable in-app
- **Dual Provider Support** — Switch between DeepSeek and OpenAI via env var
- **Rate Limiting** — In-memory rate limiter (30 RPM) to prevent abuse
- **Token Limits** — Documented and configurable per-request token caps
- All features from Weeks 3–5 included

## 🏗️ Architecture

```
┌──────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Browser    │─────>│  Next.js API      │─────>│  DeepSeek   │
│  (Client)    │<─────│  /api/ai/generate │<─────│  API        │
│              │      │                    │      │             │
│  Streams     │      │  - Auth check      │      │  Streaming  │
│  tokens to   │      │  - Rate limit      │      │  response   │
│  chat UI     │      │  - Save to DB      │      │             │
└──────────────┘      └────────┬───────────┘      └─────────────┘
                               │
                      ┌────────▼───────────┐
                      │   Supabase         │
                      │   ai_generations   │
                      │   table            │
                      └────────────────────┘
```

**Key Security:**
- `DEEPSEEK_API_KEY` is a server-only env var — never prefixed with `NEXT_PUBLIC_`
- The `/api/ai/generate` route requires authentication
- Rate limiting prevents abuse (30 requests/minute)
- Results are scoped to the authenticated user via RLS

## 📁 Project Structure

```
week-06-ai-content-generator/
├── app/
│   ├── api/
│   │   ├── ai/generate/route.ts  # Streaming AI API route
│   │   └── notify/route.ts
│   ├── generate/page.tsx          # AI generation UI
│   ├── admin/page.tsx
│   ├── submit/page.tsx
│   ├── auth/callback/route.ts
│   ├── login/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── ai/provider.ts            # DeepSeek/OpenAI client + streaming
│   ├── email/resend.ts
│   ├── session/anonymous.ts
│   ├── auth/actions.ts
│   ├── supabase/client.ts
│   ├── supabase/server.ts
│   └── db/
│       ├── cards.ts
│       └── categories.ts
├── components/
│   ├── ImageUpload.tsx
│   ├── DeleteModal.tsx
│   ├── AuthButton.tsx
│   ├── UserMenu.tsx
│   ├── Header.tsx
│   ├── CategoryFilter.tsx
│   ├── CardGrid.tsx
│   └── BusinessCard.tsx
├── data/
│   ├── 001_schema.sql
│   ├── 002_rls_policies.sql
│   ├── 003_seed.sql
│   ├── 004_submissions.sql
│   └── 005_ai_schema.sql         # AI generations table
└── .env.example
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Run in order in Supabase SQL Editor:
1. `data/001_schema.sql`
2. `data/002_rls_policies.sql`
3. `data/003_seed.sql`
4. `data/004_submissions.sql`
5. `data/005_ai_schema.sql`

### 3. AI Provider Setup

**DeepSeek (Default):**
1. Sign up at [platform.deepseek.com](https://platform.deepseek.com)
2. Create an API key
3. Add to `.env.local` as `DEEPSEEK_API_KEY`

**OpenAI (Alternative):**
1. Sign up at [platform.openai.com](https://platform.openai.com)
2. Create an API key
3. Set `OPENAI_API_KEY` and `AI_PROVIDER=openai` in `.env.local`

### 4. Configure Environment
```bash
cp .env.example .env.local
```

### 5. Run
```bash
npm run dev
```

Visit [http://localhost:3000/generate](http://localhost:3000/generate) for the AI tool.

## 🌐 Deploy to Vercel

1. Set **Root Directory** to `week-06-ai-content-generator`
2. Add all env vars (including `DEEPSEEK_API_KEY`)
3. `DEEPSEEK_API_KEY` is automatically server-only (no `NEXT_PUBLIC_` prefix)
4. Deploy

## 📊 Token Limits & Rate Limiting

| Parameter | Value |
|-----------|-------|
| Max tokens per request | 600 |
| Model (DeepSeek) | `deepseek-chat` |
| Model (OpenAI) | `gpt-4o-mini` |
| Temperature | 0.7 |
| Rate limit | 30 requests/minute |
| Rate limit scope | Per server instance (in-memory) |

> **Note**: The rate limiter is in-memory and resets on server restart. For production, use Redis or a database-backed rate limiter.

## 🧪 Testing Checklist

- [ ] AI generation page at `/generate` requires sign-in
- [ ] Filling in name/title/company and clicking Generate starts streaming
- [ ] Tokens appear one-by-one with a blinking cursor
- [ ] Completed generation shows success toast
- [ ] Generation is saved to `ai_generations` table in Supabase
- [ ] History panel shows past generations
- [ ] Switching between Bio/Description generates different output
- [ ] API returns 401 for unauthenticated requests
- [ ] Rate limit error shows when spamming requests
- [ ] AI API key is NOT in client-side JavaScript bundles
