---
_template:
  version: 1
  path: LLM_RULES.md
  sync: notify-only
---

# LLM Rules for kol-acyr-website

---

## ⚠️ CRITICAL STARTUP PROTOCOL - READ THIS FIRST ⚠️

**WHEN THE USER SAYS "read `LLM_RULES.md`" YOU MUST:**

1. **READ** `/docs/llm-context/ARCHITECTURE.md` — load-bearing decisions and constraints
2. **READ** `/docs/llm-context/AGENT-CONTEXT.md` — current project state
3. **READ** the latest session log from `/docs/llm-context/session-log/` (sort by date, most recent first)
4. **CHECK** `/docs/llm-context/session-bridge/` for `handoff-*.md` files. If the newest handoff has a timestamp newer than the newest session log, **also READ that handoff** — it carries in-flight state the session log doesn't. Otherwise skip. See `/docs/llm-context/session-bridge/README.md` for the full protocol.
5. **STOP** and say "Context loaded. What would you like me to work on?"
6. **WAIT** for the user to specify their task

**DO NOT:**
- Skip reading the context files
- Start working before the user specifies a task
- Propose anything that contradicts `ARCHITECTURE.md` without flagging the contradiction first

**IF THE USER ASKS "Do you understand?" or "Outline the task?":**
Respond with a clear plan of what you'll do BEFORE taking any action.

---

# LLM Agent Onboarding

Welcome to **kol-acyr-website** — Acyr brand site — Printful POD shop on the KOL design system.

## Quick Start

1. **Read this file** to understand the project structure
2. **Read** `/docs/llm-context/ARCHITECTURE.md` for load-bearing decisions
3. **Read** `/docs/llm-context/AGENT-CONTEXT.md` for current project state
4. **Check** `/docs/llm-context/session-log/` for the most recent session log
5. **Follow** the conventions and guidelines below

## Project Overview

Storefront SPA built on the KOL design system. Sells Printful print-on-demand products via Snipcart cart/checkout with PayPal as the payment gateway (Iceland merchant, Stripe unavailable). Routes cover shop, product detail, handmade, collections, blog, and standard policy pages. Deployed on Vercel as a static SPA — no backend yet; Printful fulfillment webhook is the next phase.

### Tech Stack

React 19 + Vite 8 + Tailwind 4 + react-router-dom 7, pnpm, deployed on Vercel

### Package Manager

<!-- If this project uses a specific package manager, document it here. Example: -->
<!-- **⚠️ IMPORTANT: This project uses Yarn, NOT npm** -->
<!-- Remove this section if no package.json. -->

## Directory Structure

<!-- Paste `tree -L 2` output or hand-write the top-level structure here -->

```
kol-acyr-website/
├── ...                            (project-specific)
├── docs/
│   ├── history.md                 decision history — the "why"
│   ├── backlog.md                 deferred work items (optional)
│   └── llm-context/
│       ├── README.md
│       ├── ARCHITECTURE.md        load-bearing decisions
│       ├── AGENT-CONTEXT.md       current state, roadmap, gotchas, contracts
│       └── session-log/
├── README.md
└── LLM_RULES.md                   this file
```

## LLM Context Protocol

This project uses **session logs** to maintain context across agents and sessions.

### Reading Context

**Always read the latest session log** in `/docs/llm-context/session-log/` before starting work. Session logs are named:
- `YYYY-MM-DD-brief-description.md`

Sort by date to find the most recent.

### Writing Context

When you complete significant work:
1. Create a new session log in `/docs/llm-context/session-log/`
2. Use the format: `YYYY-MM-DD-brief-description.md`
3. Include: session metadata, changes made, current state, next steps
4. Update `AGENT-CONTEXT.md` if the project's current state changed

Or use the `/log-work` skill to automate this.

## Working Conventions

### Code Style

- **No over-engineering** — Make only requested changes
- **Remove unused code** — Delete completely, no backwards-compat hacks
- **Edit over create** — Prefer modifying existing files
- **Use existing patterns** — Follow established naming and structure
- **Apply exact values** — When user specifies a concrete number, use it

### Filename Conventions

- **Protocol files UPPERCASE:** `LLM_RULES.md`, `ARCHITECTURE.md`, `AGENT-CONTEXT.md`, `README.md`, `SKILL.md`.
- **Content files kebab-case:** `history.md`, `backlog.md`, session logs.

### Non-goals

<!-- List anything explicitly out of scope. If none yet, delete this section. -->

### Git Workflow

- Only commit when explicitly asked
- Write clear, concise commit messages
- Never force push or use destructive commands without permission

