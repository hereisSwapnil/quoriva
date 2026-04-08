'use client';
import { Paper } from '@/types';

interface Props {
  paper: Paper;
  isSelected: boolean;
  onExplain: (paper: Paper) => void;
  index?: number;
}

const sourceColors = {
  semantic_scholar: { bg: 'bg-[color:var(--brand)]/12', text: 'text-[color:var(--brand)]', border: 'border-[color:var(--brand)]/25', label: 'Semantic Scholar' },
  pubmed: { bg: 'bg-[color:var(--accent)]/12', text: 'text-[color:var(--accent)]', border: 'border-[color:var(--accent)]/28', label: 'PubMed' },
  arxiv: { bg: 'bg-[color:#b31b1b]/12', text: 'text-[color:#9c1717]', border: 'border-[color:#b31b1b]/28', label: 'arXiv' },
};

export default function PaperCard({ paper, isSelected, onExplain, index }: Props) {
  const src = sourceColors[paper.source];

  return (
    <div
      className={`group relative rounded-2xl border p-5 cursor-pointer transition-all duration-200 animotion-fade-in-up ${
        isSelected
          ? 'border-[color:var(--brand)]/60 bg-[color:var(--brand)]/8'
          : 'border-[color:var(--line)] bg-[color:var(--surface)] hover:border-[color:var(--brand)]/30 hover:-translate-y-[1px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.07)]'
      }`}
      style={{ animationDelay: index !== undefined ? `${index * 0.08}s` : '0s' }}
      onClick={() => onExplain(paper)}
    >
      {isSelected && (
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[color:var(--brand)] to-transparent rounded-t-2xl" />
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-ui tracking-[0.14em] uppercase ${src.bg} ${src.text} ${src.border}`}>
            {src.label}
          </span>
          {paper.fieldsOfStudy?.slice(0, 2).map(f => (
            <span key={f} className="text-[10px] px-2 py-0.5 rounded-full border border-[color:var(--line)] text-[color:var(--text-muted)] font-ui">
              {f}
            </span>
          ))}
        </div>
        {paper.year && (
          <span className="text-[color:var(--text-muted)] text-xs font-ui shrink-0">{paper.year}</span>
        )}
      </div>

      <h3 className="text-[color:var(--text)] text-[15px] font-ui font-semibold leading-snug mb-3 line-clamp-3 transition-colors">
        {paper.title}
      </h3>

      {paper.authors.length > 0 && (
        <p className="text-[color:var(--text-muted)] text-xs font-ui mb-3 truncate">
          {paper.authors.slice(0, 3).join(', ')}{paper.authors.length > 3 ? ' et al.' : ''}
        </p>
      )}

      <p className="text-[color:var(--text-muted)] text-xs font-ui leading-relaxed line-clamp-2 mb-4">
        {paper.abstract}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-[color:var(--text-muted)] text-xs font-ui">
          {paper.citationCount > 0 && (
            <span className="flex items-center gap-1">
              <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {paper.citationCount.toLocaleString()} citations
            </span>
          )}
          {paper.journal && (
            <span className="truncate max-w-[160px] text-[color:var(--text-muted)]">{paper.journal}</span>
          )}
        </div>

        <button
          onClick={e => { e.stopPropagation(); onExplain(paper); }}
          className={`text-xs px-3 py-1.5 rounded-lg font-ui transition-all duration-150 ${
            isSelected
              ? 'bg-[color:var(--brand)] text-[color:var(--surface)]'
              : 'border border-[color:var(--line)] text-[color:var(--text-muted)] hover:border-[color:var(--brand)]/40 hover:text-[color:var(--brand)]'
          }`}
        >
          {isSelected ? 'Explaining ✓' : 'Explain this →'}
        </button>
      </div>
    </div>
  );
}
