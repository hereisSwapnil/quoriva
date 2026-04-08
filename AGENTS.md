<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Quoriva Agent Guide

This file is the shared context + operating contract for AI agents working in this repository.

## Product at a glance

- Product name: Quoriva
- What it does: Searches Semantic Scholar, PubMed, and arXiv, resolving direct paper URLs, and turns paper abstracts into practical plain-English explanations
- Primary audience: Non-specialists (product teams, operators, analysts, curious generalists)
- Tone: Calm, practical, evidence-first

## Tech stack

- Next.js 16.2.3 (App Router)
- React 19.2.4
- TypeScript
- Tailwind CSS v4
- OpenAI SDK (server-side API route)

## Local commands

- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Start prod build locally: `npm run start`

## Environment variables

- Required: `OPENAI_API_KEY`
- Location: strictly local in `.env.local` (reference template in `.env.example`)
- Never commit secrets or key-like values

## App architecture

- `app/page.tsx`: Main client page orchestrating search, selection, and explanation state
- `app/api/search/route.ts`: Aggregates Semantic Scholar, PubMed, arXiv, detects direct URLs, normalizes + deduplicates + ranks papers
- `app/api/explain/route.ts`: Sends selected paper context to OpenAI and returns structured explanation text
- `components/SearchBar.tsx`: Query input + suggestion pills
- `components/PaperCard.tsx`: Result card + source metadata + explain action
- `components/ExplainerPanel.tsx`: Explanation renderer (section parsing + loading + copy)
- `components/HeroSection.tsx`: Landing hero and top navigation
- `app/about/page.tsx`: About page and trust/data-source messaging
- `types/index.ts`: Shared `Paper` interface contract

## Core data flow

1. User searches a topic or direct URL in `SearchBar`
2. Frontend calls `GET /api/search?q=...`
3. Backend checks if query is a direct URL. If yes, it fetches that exact paper first, then uses its title for further search.
4. Backend queries Semantic Scholar, PubMed, and arXiv in parallel based on the final query string.
5. Backend maps responses to shared `Paper` type, deduplicates, sorts by citation count, separating `directPaper` if present, and returns top results.
6. User selects a paper
7. Frontend calls `POST /api/explain` with selected paper payload
8. Backend prompts OpenAI and returns structured markdown-like sections
9. `ExplainerPanel` parses `##` headings and renders readable blocks

## API contracts (high-level)

- `GET /api/search`
  - Input: query param `q` (can be text or a direct paper URL)
  - Output: `{ papers: Paper[], directPaper?: Paper }` or `{ error: string }`
- `POST /api/explain`
  - Input: `{ paper: Paper }`
  - Output: `{ explanation: string }` or `{ error: string }`

## UI and brand constraints

- Keep Quoriva visual language: warm academic, calm, editorial
- Keep typography choices consistent with current app (`Fraunces` + `Cabin`)
- Preserve clear source attribution and paper links for trust
- Favor readable, plain language in any user-facing copy

## Coding guardrails for agents

- Prefer minimal, focused changes over broad refactors
- Keep strict TypeScript compatibility
- Reuse existing types from `types/index.ts`
- Maintain current API response shapes unless a coordinated change is requested
- Handle failures gracefully in both API routes and UI states
- Avoid introducing new dependencies unless necessary

## When editing Next.js code

- Confirm patterns against docs in `node_modules/next/dist/docs/` before introducing new APIs
- Assume common older Next.js examples may be outdated
- Follow current App Router conventions already used by this repo

## Definition of done for agent tasks

- Change is consistent with product purpose and brand tone
- Existing behavior is preserved unless intentionally changed
- Lint/build impact is considered (run when relevant)
- Documentation is updated if behavior or workflow changed

## Agent handoff checklist

- Briefly state what changed and why
- Reference exact files touched
- Note any unresolved risks/assumptions
- Include quick verify steps (commands or manual checks)
