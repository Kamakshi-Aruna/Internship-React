# Claude AI Demo — Cloudflare Pages + React

A beginner-friendly project demonstrating how to build AI-powered features
using **Claude** (Anthropic) deployed on **Cloudflare Pages**.

---

## What's Inside

| Feature | Route | Concepts Shown |
|---|---|---|
| CV Summariser | `/cv-summariser` | System prompt, context injection, JSON parsing |
| JD Generator | `/jd-generator` | Multi-field context injection, structured output |

---

## How It Works (Architecture)

```
Browser (React)
    │
    │  POST /api/summarise-cv   ← Cloudflare Pages Function
    │  POST /api/generate-jd    ← Cloudflare Pages Function
    │
    ▼
Cloudflare Worker (functions/api/*.js)
    │
    │  calls https://api.anthropic.com/v1/messages
    │
    ▼
Claude API → returns JSON → Worker parses → React renders
```

**Why Cloudflare Functions?**
- Your `ANTHROPIC_API_KEY` stays secret on the server — never exposed to the browser
- Zero cold starts, runs at the edge globally
- Free tier is very generous

---

## Key Concepts

### 1. System Prompt
Tells Claude WHO it is and WHAT FORMAT to return.
```js
const systemPrompt = `You are an expert HR assistant.
Always respond with valid JSON only...`
```

### 2. Context Injection
Inject user data into the message so Claude has real information to work with.
```js
const userMessage = `Summarise this CV:\n\n${cvText}`
```

### 3. Structured Output (JSON Parsing)
Ask Claude to return JSON → parse it → render each field in React.
```js
const summary = JSON.parse(claudeData.content[0].text)
// Now you have: summary.name, summary.skills, summary.highlights etc.
```

---

## Local Development

### Step 1 — Install dependencies
```bash
npm install
```

### Step 2 — Add your API key
Create a `.dev.vars` file (Cloudflare's local secrets file):
```
ANTHROPIC_API_KEY=sk-ant-...
```
> `.dev.vars` is gitignored — never commit it!

### Step 3 — Run both servers
```bash
# Terminal 1: React frontend (Vite)
npm run dev

# Terminal 2: Cloudflare Worker (handles /api routes)
npx wrangler pages dev dist --compatibility-date=2024-01-01
```

> Vite proxies `/api` calls to the Cloudflare Worker automatically (see `vite.config.js`)

---

## Deploy to Cloudflare Pages

```bash
# 1. Build the React app
npm run build

# 2. Deploy (first time — creates the project)
npx wrangler pages deploy dist

# 3. Add your secret in the dashboard:
#    Cloudflare Dashboard → Pages → claude-ai-demo
#    → Settings → Environment Variables → Add ANTHROPIC_API_KEY
```

---

## File Structure

```
claude-ai-demo/
├── functions/
│   └── api/
│       ├── summarise-cv.js   ← Cloudflare Worker: CV → Claude → JSON
│       └── generate-jd.js    ← Cloudflare Worker: form → Claude → JSON
├── src/
│   ├── App.jsx               ← Router + layout
│   ├── pages/
│   │   ├── CVSummariser.jsx  ← CV input + summary card
│   │   └── JDGenerator.jsx   ← JD form + rendered output
│   └── components/
│       └── PromptDebugger.jsx ← Shows exact prompts sent to Claude
├── wrangler.jsonc            ← Cloudflare config
├── vite.config.js            ← Vite + proxy config
└── .dev.vars                 ← Local secrets (gitignored!)
```