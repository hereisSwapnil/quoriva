import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[680px] h-[320px] bg-[color:var(--brand)]/10 blur-[90px] rounded-full" />
        <div className="absolute top-10 right-[8%] w-[180px] h-[180px] rounded-full border border-[color:var(--line)]/50" />
        <div className="absolute top-24 left-[5%] w-[120px] h-[120px] rounded-full border border-[color:var(--brand)]/20" />
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-6 pt-14 md:pt-20 pb-10 md:pb-12 relative">
        <div className="mb-9 flex items-center justify-between animate-[fadein_320ms_ease-out]">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo.png" alt="Quoriva logo" width={36} height={36} className="h-9 w-9 object-contain" priority />
            <span className="font-ui text-xl font-semibold tracking-[0.16em] text-[color:var(--text)]">
              QUORIVA
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-xs font-ui uppercase tracking-[0.14em] text-[color:var(--text-muted)] hover:border-[color:var(--brand)]/45 hover:text-[color:var(--brand)] transition-colors"
            >
              About
            </Link>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[color:var(--text-muted)] hover:text-[color:var(--brand)] transition-colors"
              aria-label="GitHub Repository"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] mb-7 md:mb-8 animate-[fadein_400ms_ease-out]">
          <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--brand)] animate-pulse" />
          <span className="text-[color:var(--brand)] text-[11px] tracking-[0.16em] uppercase font-ui">Semantic Scholar + PubMed + arXiv + OpenAI</span>
        </div>

        <h1 className="text-5xl md:text-7xl leading-[0.94] mb-6 font-display tracking-tight text-balance animate-[rise_450ms_ease-out]">
          <span>Follow the</span>
          <br />
          <span className="italic text-[color:var(--brand)]">signal, not the jargon.</span>
          <br />
          <span>Understand papers in minutes.</span>
        </h1>

        <p className="text-[color:var(--text-muted)] text-base md:text-lg max-w-2xl leading-relaxed font-ui animate-[fadein_550ms_ease-out]">
          Quoriva is your research interpreter for product, policy, and curious minds. Search trusted sources, then turn dense abstracts into useful plain-English briefings.
        </p>

        <div className="mt-9 md:mt-10 flex flex-wrap gap-x-4 gap-y-2 text-xs text-[color:var(--text-muted)] tracking-[0.14em] uppercase font-ui animate-[fadein_650ms_ease-out]">
          <span>Built for teams</span>
          <span className="text-[color:var(--line)]">/</span>
          <span>100M+ papers</span>
          <span className="text-[color:var(--line)]">/</span>
          <span>Explainable AI</span>
        </div>
      </div>
    </div>
  );
}
