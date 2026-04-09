import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[color:var(--line)]/50 bg-[color:var(--bg-soft)]/30 py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-5 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 opacity-90 hover:opacity-100 transition-opacity">
              <Image src="/logo.png" alt="Quoriva logo" width={28} height={28} className="h-7 w-7 object-contain grayscale-[0.3]" />
              <span className="font-ui text-lg font-semibold tracking-[0.14em] text-[color:var(--text)] uppercase">
                QUORIVA
              </span>
            </Link>
            <p className="text-[color:var(--text-muted)] text-sm leading-relaxed max-w-sm font-ui mb-6">
              Research made readable. We search 100M+ papers across Semantic Scholar, PubMed, and arXiv to bring you clear, actionable insights in plain English.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/hereisSwapnil/quoriva"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[color:var(--line)] flex items-center justify-center text-[color:var(--text-muted)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] transition-all"
                aria-label="GitHub"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
                </svg>
              </a>
              <a
                href="https://www.npmjs.com/package/quoriva-mcp"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[color:var(--line)] flex items-center justify-center text-[color:var(--text-muted)] hover:border-[color:var(--brand)] hover:text-[color:var(--brand)] hover:scale-110 active:scale-95 transition-all duration-200"
                aria-label="NPM"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,4H4V20h8V8h4V20h4V4" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="text-[color:var(--brand)] text-[11px] font-ui font-semibold tracking-[0.18em] uppercase mb-5">
              Tools
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="https://www.npmjs.com/package/quoriva-mcp" target="_blank" rel="noopener noreferrer" className="text-sm font-ui text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors">
                  MCP Server
                </a>
              </li>
              <li>
                <Link href="/about" className="text-sm font-ui text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors">
                  About Quoriva
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="text-[color:var(--brand)] text-[11px] font-ui font-semibold tracking-[0.18em] uppercase mb-5">
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="https://arxiv.org" target="_blank" rel="noopener noreferrer" className="text-sm font-ui text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors">
                  ArXiv Open Access
                </a>
              </li>
              <li>
                <a href="https://www.semanticscholar.org" target="_blank" rel="noopener noreferrer" className="text-sm font-ui text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors">
                  Semantic Scholar API
                </a>
              </li>
              <li>
                <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" rel="noopener noreferrer" className="text-sm font-ui text-[color:var(--text-muted)] hover:text-[color:var(--text)] transition-colors">
                  PubMed / NCBI
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[color:var(--line)]/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[color:var(--text-muted)] text-[11px] font-ui tracking-[0.05em]">
            &copy; {currentYear} Quoriva. Built for teams who love to learn.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] uppercase tracking-[0.2em] font-ui text-[color:var(--text-muted)]/50">
              Private & Encrypted
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-ui text-[color:var(--text-muted)]/50">
              Open Source
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
