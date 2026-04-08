import Image from 'next/image';
import Link from 'next/link';

const principles = [
  {
    title: 'Readable first',
    copy: 'Every explanation should make sense to a non-specialist without sacrificing scientific intent.',
  },
  {
    title: 'Traceable by default',
    copy: 'Each summary links back to the original publication so your team can validate claims quickly.',
  },
  {
    title: 'Built for decisions',
    copy: 'Quoriva turns academic context into practical input for product, policy, and strategy work.',
  },
];

const sources = [
  {
    name: 'Semantic Scholar',
    detail: 'Large-scale scholarly graph with broad cross-domain coverage.',
    link: 'https://api.semanticscholar.org/',
  },
  {
    name: 'PubMed',
    detail: 'Trusted biomedical index from the U.S. National Library of Medicine.',
    link: 'https://www.ncbi.nlm.nih.gov/books/NBK25501/',
  },
  {
    name: 'arXiv',
    detail: 'Open-access archive for scholarly articles in physics, mathematics, and computer science.',
    link: 'https://arxiv.org/help/api',
  },
  {
    name: 'OpenAI',
    detail: 'Structured summarization layer for accessible plain-language explanations.',
    link: 'https://platform.openai.com/',
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen text-[color:var(--text)]">
      <section className="max-w-5xl mx-auto px-5 md:px-6 py-10 md:py-14">
        <div className="mb-9 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo.png" alt="Quoriva logo" width={36} height={36} className="h-9 w-9 object-contain" />
            <span className="font-ui text-xl font-semibold tracking-[0.16em] text-[color:var(--text)]">
              QUORIVA
            </span>
          </Link>
          <Link
            href="/"
            className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 text-xs font-ui uppercase tracking-[0.14em] text-[color:var(--text-muted)] hover:border-[color:var(--brand)]/45 hover:text-[color:var(--brand)] transition-colors"
          >
            Back to search
          </Link>
        </div>

        <div className="glass-panel rounded-3xl p-7 md:p-10">
          <p className="font-ui text-xs uppercase tracking-[0.18em] text-[color:var(--brand)] mb-3">About Quoriva</p>
          <h1 className="font-display text-4xl md:text-6xl leading-[0.95] text-balance mb-5">
            Research clarity for teams that move fast.
          </h1>
          <p className="font-ui text-[color:var(--text-muted)] max-w-3xl leading-relaxed text-base md:text-lg">
            Quoriva helps teams understand scientific evidence without spending hours decoding dense papers. We combine trusted public indexes with AI summaries so you can identify what matters, faster.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <article key={item.title} className="glass-panel rounded-2xl p-5">
              <h2 className="font-display text-2xl mb-2 text-[color:var(--brand-strong)]">{item.title}</h2>
              <p className="font-ui text-sm text-[color:var(--text-muted)] leading-relaxed">{item.copy}</p>
            </article>
          ))}
        </div>

        <div className="mt-8 glass-panel rounded-2xl p-6 md:p-7">
          <h2 className="font-display text-3xl mb-4">Data and trust</h2>
          <p className="font-ui text-[color:var(--text-muted)] mb-5">
            Quoriva does not invent paper metadata. Search results are sourced from established research catalogs, and every explanation includes a link to the original publication.
          </p>
          <div className="grid gap-3">
            {sources.map((source) => (
              <a
                key={source.name}
                href={source.link}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 hover:border-[color:var(--brand)]/40 transition-colors"
              >
                <p className="font-ui text-sm font-semibold text-[color:var(--text)]">{source.name}</p>
                <p className="font-ui text-sm text-[color:var(--text-muted)]">{source.detail}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
