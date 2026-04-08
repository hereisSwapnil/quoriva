'use client';
import { useState, KeyboardEvent } from 'react';

const SUGGESTIONS = [
  'longevity and aging',
  'LLM hallucinations',
  'gut microbiome depression',
  'CRISPR cancer therapy',
  'sleep memory consolidation',
  'quantum computing error correction',
];

interface Props {
  onSearch: (q: string) => void;
  isLoading: boolean;
}

export default function SearchBar({ onSearch, isLoading }: Props) {
  const [value, setValue] = useState('');

  const submit = () => {
    if (value.trim() && !isLoading) onSearch(value.trim());
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div className="mb-2 animate-[fadein_350ms_ease-out]">
      <div className="glass-panel relative flex items-center gap-3 p-1 rounded-2xl focus-within:border-[color:var(--brand)]/60 transition-colors duration-200">
        <div className="pl-4 text-[color:var(--text-muted)]">
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={onKey}
          placeholder="Search topic or paste Semantic Scholar / PubMed / arXiv (abs, pdf, html) link"
          className="flex-1 bg-transparent py-3.5 text-[color:var(--text)] placeholder-[color:var(--text-muted)]/80 text-sm outline-none font-ui"
          disabled={isLoading}
        />

        <button
          onClick={submit}
          disabled={isLoading || !value.trim()}
          className="mr-1 px-5 py-2.5 rounded-xl bg-[color:var(--brand)] text-[color:var(--surface)] text-sm font-ui tracking-wide disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[color:var(--brand-strong)] transition-colors duration-150 whitespace-nowrap"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map(s => (
          <button
            key={s}
            onClick={() => { setValue(s); onSearch(s); }}
            disabled={isLoading}
            className="px-3 py-1 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] text-[color:var(--text-muted)] text-xs font-ui hover:border-[color:var(--brand)]/40 hover:text-[color:var(--brand)] transition-all duration-150"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
