'use client';
import { Paper } from '@/types';

interface Props {
  paper: Paper | null;
  explanation: string;
  isLoading: boolean;
}

function parseExplanation(text: string) {
  const sections: { icon: string; heading: string; content: string }[] = [];
  const lines = text.split('\n');
  let current: { icon: string; heading: string; content: string } | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^##\s+(.*)/);
    if (headingMatch) {
      if (current) sections.push(current);
      const full = headingMatch[1].trim();
      const emojiMatch = full.match(/^([\u{1F000}-\u{1FFFF}]|[\u2600-\u27BF]|⚠️|🧠|❓|🔬|✨|🌍|💡)/u);
      const icon = emojiMatch ? emojiMatch[0] : '•';
      const heading = full.replace(icon, '').trim();
      current = { icon, heading, content: '' };
    } else if (current && line.trim()) {
      current.content += (current.content ? ' ' : '') + line.trim();
    }
  }
  if (current) sections.push(current);
  return sections;
}

export default function ExplainerPanel({ paper, explanation, isLoading }: Props) {
  if (!paper && !isLoading) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center mt-[35px]">
        <div className="w-12 h-12 rounded-full border border-[color:var(--line)] flex items-center justify-center mx-auto mb-4">
          <svg width="20" height="20" fill="none" stroke="currentColor" className="text-[color:var(--text-muted)]" strokeWidth="1.5" viewBox="0 0 24 24">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <p className="text-[color:var(--text-muted)] text-sm font-ui">Pick a paper and Quoriva will translate the abstract into plain language.</p>
      </div>
    );
  }

  const sections = explanation ? parseExplanation(explanation) : [];
  
  const chatPrompt = paper ? `Here is an academic paper I'm researching:\n\nTitle: ${paper.title}\nAuthors: ${paper.authors?.join(', ') || 'Unknown'}\nAbstract: ${paper.abstract}\nURL: ${paper.url}\n\nI have a few questions about this methodology:` : '';

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animotion-slide-info-panel mt-[35px]">
      {paper && (
        <div className="p-5 border-b border-[color:var(--line)]/70 bg-[color:var(--surface-strong)]/55">
          <p className="text-[color:var(--text-muted)] text-[10px] font-ui tracking-[0.16em] uppercase mb-2">Now explaining</p>
          <h2 className="text-[color:var(--text)] text-sm font-ui font-semibold leading-snug line-clamp-2">{paper.title}</h2>
          <div className="mt-3 flex items-center gap-3">
            <a
              href={paper.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-[color:var(--brand)] font-ui hover:text-[color:var(--brand-strong)] transition-colors"
              onClick={e => e.stopPropagation()}
            >
              View original paper ↗
            </a>
            {paper.doi && (
              <span className="text-[10px] text-[color:var(--text-muted)] font-ui truncate">DOI: {paper.doi}</span>
            )}
          </div>
        </div>
      )}

      <div className="p-5">
        {isLoading && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex gap-1.5 animotion-dots-scale">
                <span style={{ animationDelay: '0ms' }} />
                <span style={{ animationDelay: '200ms' }} />
                <span style={{ animationDelay: '400ms' }} />
              </div>
              <span className="text-[color:var(--text-muted)] text-xs font-ui">OpenAI is reading the paper...</span>
            </div>
            {[80, 60, 90, 70, 55].map((w, i) => (
              <div key={i} className="space-y-2">
                <div className="h-2.5 bg-[color:var(--surface-strong)] rounded animate-pulse" style={{ width: `${w}%` }} />
                <div className="h-2.5 bg-[color:var(--surface-strong)] rounded animate-pulse" style={{ width: `${w - 15}%`, animationDelay: '0.1s' }} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && sections.length > 0 && (
          <div className="space-y-6">
            {sections.map((section, i) => (
              <div key={i} className="group">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-base" style={{ fontSize: '16px' }}>{section.icon}</span>
                  <h3 className="text-[color:var(--brand)] text-xs font-ui tracking-[0.14em] uppercase">{section.heading}</h3>
                </div>
                <p className="text-[color:var(--text)] text-sm font-ui leading-relaxed pl-6 border-l border-[color:var(--line)]">
                  {section.content}
                </p>
              </div>
            ))}

            <div className="mt-6 pt-5 border-t border-[color:var(--line)]/80 flex gap-3">
              <button
                onClick={() => {
                  const text = sections.map(s => `${s.icon} ${s.heading}\n${s.content}`).join('\n\n');
                  navigator.clipboard.writeText(text);
                }}
                className="flex-1 py-2 rounded-lg border border-[color:var(--line)] text-[color:var(--text-muted)] text-xs font-ui hover:border-[color:var(--brand)]/40 hover:text-[color:var(--brand)] transition-all"
              >
                Copy explanation
              </button>
              {paper?.url && (
                <a
                  href={paper.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 rounded-lg border border-[color:var(--line)] text-[color:var(--text-muted)] text-xs font-ui hover:border-[color:var(--brand)]/40 hover:text-[color:var(--brand)] transition-all text-center"
                >
                  Read full paper ↗
                </a>
              )}
            </div>

            <div className="mt-3 flex gap-3">
              <a
                href={`https://chatgpt.com/?q=${encodeURIComponent(chatPrompt)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg border border-[#10A37F]/30 text-[#10A37F] text-xs font-ui hover:bg-[#10A37F]/10 transition-all text-center"
              >
                Ask ChatGPT ↗
              </a>
              <a
                href={`https://claude.ai/new?q=${encodeURIComponent(chatPrompt)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 rounded-lg border border-[#D97757]/30 text-[#D97757] text-xs font-ui hover:bg-[#D97757]/10 transition-all text-center"
              >
                Ask Claude ↗
              </a>
            </div>
          </div>
        )}

        {!isLoading && !sections.length && explanation && (
          <p className="text-[color:var(--text)] text-sm font-ui leading-relaxed whitespace-pre-wrap">{explanation}</p>
        )}
      </div>
    </div>
  );
}
