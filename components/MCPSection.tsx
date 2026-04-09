'use client';

import { useState } from 'react';

const CLIENTS = [
  {
    id: 'claude',
    label: 'Claude Desktop',
    config: `{
  "mcpServers": {
    "quoriva": {
      "command": "npx",
      "args": ["-y", "quoriva-mcp"]
    }
  }
}`,
    hint: '~/Library/Application Support/Claude/claude_desktop_config.json',
  },
  {
    id: 'cursor',
    label: 'Cursor',
    config: `{
  "mcpServers": {
    "quoriva": {
      "command": "npx",
      "args": ["-y", "quoriva-mcp"]
    }
  }
}`,
    hint: '.cursor/mcp.json  or  ~/.cursor/mcp.json',
  },
  {
    id: 'windsurf',
    label: 'Windsurf',
    config: `{
  "mcpServers": {
    "quoriva": {
      "command": "npx",
      "args": ["-y", "quoriva-mcp"]
    }
  }
}`,
    hint: '~/.codeium/windsurf/mcp_config.json',
  },
];

const TOOLS = [
  {
    name: 'quoriva_search_papers',
    desc: 'Search all three databases simultaneously and get citation-ranked results.',
  },
  {
    name: 'quoriva_get_paper',
    desc: 'Fetch full details of one paper by ID or direct URL.',
  },
  {
    name: 'quoriva_get_citations',
    desc: 'Traverse the forward citation graph — who cited this paper?',
  },
  {
    name: 'quoriva_get_references',
    desc: 'Walk the reference list backward — what did this paper cite?',
  },
  {
    name: 'quoriva_get_author_papers',
    desc: "Look up an author and retrieve their papers sorted by impact.",
  },
  {
    name: 'quoriva_recommend_papers',
    desc: 'Get AI-powered recommendations similar to any given paper.',
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-[10px] font-ui uppercase tracking-[0.14em] text-[color:var(--text-muted)] hover:text-[color:var(--brand)] transition-colors"
    >
      {copied ? (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function MCPSection() {
  const [activeClient, setActiveClient] = useState('claude');
  const active = CLIENTS.find((c) => c.id === activeClient)!;

  return (
    <section className="mt-24 mb-6 animate-[fadein_600ms_ease-out]">
      {/* Section header */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--accent)]" />
          <span className="text-[color:var(--accent)] text-[11px] tracking-[0.16em] uppercase font-ui">
            For AI Developers
          </span>
        </div>

        <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight mb-4 text-balance">
          Use Quoriva inside{' '}
          <span className="italic text-[color:var(--brand)]">your AI agent.</span>
        </h2>

        <p className="text-[color:var(--text-muted)] text-base max-w-xl leading-relaxed font-ui">
          Quoriva ships as a native MCP server. Add it to Claude Desktop, Cursor, or any
          MCP-compatible client — zero setup, no API key needed.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left — tools list */}
        <div className="glass-panel rounded-2xl p-6 md:p-7">
          <p className="text-[color:var(--text-muted)] text-[11px] tracking-[0.2em] uppercase font-ui mb-5">
            6 Available Tools
          </p>

          <ul className="space-y-3.5">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="flex gap-3 group">
                <span className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[color:var(--brand)]/40 group-hover:bg-[color:var(--brand)] transition-colors mt-[7px]" />
                <div>
                  <code className="text-[color:var(--brand)] text-sm font-mono">{tool.name}</code>
                  <p className="text-[color:var(--text-muted)] text-xs leading-relaxed font-ui mt-0.5">
                    {tool.desc}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-7 pt-5 border-t border-[color:var(--line)]">
            <p className="text-[color:var(--text-muted)] text-xs font-ui leading-relaxed">
              All sources — Semantic Scholar, PubMed, arXiv — available from a single tool call.
              No API key required. Rate-limit safe.
            </p>
          </div>
        </div>

        {/* Right — install snippet */}
        <div className="flex flex-col gap-4">
          {/* npx install badge */}
          <div className="glass-panel rounded-2xl p-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[color:var(--text-muted)] text-[11px] tracking-[0.2em] uppercase font-ui mb-1.5 flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                  <path d="M20,4H4V20h8V8h4V20h4V4" />
                </svg>
                Install via npm
              </p>
              <code className="text-[color:var(--text)] text-sm font-mono">
                npx <span className="text-[color:var(--brand)]">quoriva-mcp</span>
              </code>
            </div>
            <CopyButton text="npx quoriva-mcp" />
          </div>

          {/* Client tabs + config */}
          <div className="glass-panel rounded-2xl p-5 flex-1">
            {/* Tab switcher */}
            <div className="flex gap-1.5 mb-4 bg-[color:var(--bg-soft)] p-1 rounded-xl border border-[color:var(--line)]">
              {CLIENTS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveClient(c.id)}
                  className={`flex-1 py-1.5 text-xs font-ui rounded-lg transition-all duration-200 tracking-[0.08em] ${
                    activeClient === c.id
                      ? 'bg-[color:var(--brand)] text-[color:var(--surface)] shadow-sm'
                      : 'text-[color:var(--text-muted)] hover:text-[color:var(--text)]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Config block */}
            <div className="relative rounded-xl bg-[color:var(--text)]/[0.03] border border-[color:var(--line)] p-4">
              <div className="absolute top-3 right-3">
                <CopyButton text={active.config} />
              </div>
              <pre className="text-xs font-mono text-[color:var(--text)] leading-relaxed overflow-x-auto pr-14 whitespace-pre-wrap">
                {active.config}
              </pre>
            </div>

            <p className="text-[color:var(--text-muted)] text-[10px] font-ui tracking-[0.1em] mt-3 leading-relaxed">
              Add to{' '}
              <code className="font-mono text-[color:var(--brand)]/80">{active.hint}</code>
              {' '}and restart your client.
            </p>
          </div>

          {/* npm link */}
          <a
            href="https://www.npmjs.com/package/quoriva-mcp"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center justify-center gap-2 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] px-5 py-3 text-xs font-ui uppercase tracking-[0.14em] text-[color:var(--text-muted)] hover:border-[color:var(--brand)]/45 hover:text-[color:var(--brand)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
              <path d="M20,4H4V20h8V8h4V20h4V4" />
            </svg>
            View on npm — quoriva-mcp
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>

      {/* Divider below section */}
      <div className="mt-16 h-px w-full bg-[color:var(--line)]/60" />
    </section>
  );
}
