# Quoriva — Research Made Readable

Quoriva is an AI-assisted research briefing app. It searches papers from **Semantic Scholar**, **PubMed**, and **arXiv**, and can resolve direct article URLs. It then translates complex abstracts into practical plain-English explanations for non-specialists.

## Setup (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your OpenAI API key
Edit `.env.local`:
```
OPENAI_API_KEY=your_key_here
```
Get a key at https://platform.openai.com/api-keys

### 3. Run locally
```bash
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel (free)

```bash
npm install -g vercel
vercel
```
Set the `OPENAI_API_KEY` environment variable in your Vercel dashboard.

## Brand direction

- Name: **Quoriva**
- Voice: calm, practical, evidence-first
- Audience: product teams, operators, analysts, and curious generalists
- Promise: faster understanding, less jargon

## How it works

1. **Search** — User types a topic or pastes a direct paper URL. The app directly fetches the paper if a URL is provided, and simultaneously queries Semantic Scholar (100M+ papers), PubMed (35M+ biomedical papers), and arXiv (2M+ scholarly articles) for similar results.
2. **Deduplicate & rank** — Results are deduplicated by title and sorted by citation count. Separates the explicit `directPaper` if a URL was searched.
3. **Explain** — Select any paper. OpenAI reads the abstract and returns a structured 7-section explanation.

## Monetization ideas
- Free: 3 explanations/day
- Pro ($7/mo): Unlimited explanations + PDF export + email digest
- Team ($19/mo): Shared library + annotations

## Data sources
- [Semantic Scholar API](https://api.semanticscholar.org/) — Free, no auth needed for basic search
- [PubMed E-utilities](https://www.ncbi.nlm.nih.gov/books/NBK25501/) — Free, no auth needed
- [arXiv API](https://arxiv.org/help/api) — Free, open-access archive
- [OpenAI API](https://platform.openai.com/) — Requires API key

## Stack
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- OpenAI SDK
- Google Fonts (Fraunces + Cabin)
