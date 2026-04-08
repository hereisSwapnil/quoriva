'use client';

import { useState, useRef } from 'react';
import SearchBar from '@/components/SearchBar';
import PaperCard from '@/components/PaperCard';
import ExplainerPanel from '@/components/ExplainerPanel';
import HeroSection from '@/components/HeroSection';
import { Paper } from '@/types';

export default function Home() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [directPaper, setDirectPaper] = useState<Paper | null>(null);
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [isSearching, setIsSearching] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [mobileView, setMobileView] = useState<'search' | 'explain'>('search');
  
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (q: string) => {
    setQuery(q);
    setIsSearching(true);
    setError('');
    setPapers([]);
    setDirectPaper(null);
    setSelectedPaper(null);
    setExplanation('');
    setMobileView('search');

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setPapers(data.papers || []);
      setDirectPaper(data.directPaper || null);
      
      if ((data.papers && data.papers.length > 0) || data.directPaper) {
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const handleExplain = async (paper: Paper) => {
    setSelectedPaper(paper);
    setExplanation('');
    setIsExplaining(true);
    setMobileView('explain');

    try {
      const res = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paper }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setExplanation(data.explanation);
    } catch {
      setExplanation('Failed to generate explanation. Please try again.');
    } finally {
      setIsExplaining(false);
    }
  };

  return (
    <main className="min-h-screen text-[color:var(--text)]">
      <HeroSection />

      <div className="max-w-6xl mx-auto px-5 md:px-6 pb-20 md:pb-24">
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />

        {error && (
          <div className="mt-6 p-4 rounded-2xl border border-[color:var(--danger)]/30 bg-[color:var(--danger)]/8 text-[color:var(--danger)] text-sm">
            {error}
          </div>
        )}

        {isSearching && (
          <div className="mt-12 flex flex-col items-center gap-4 animate-[fadein_250ms_ease-out]">
            <div className="flex items-center gap-1.5 animotion-dots-scale">
              <span style={{ animationDelay: '0ms' }} />
              <span style={{ animationDelay: '200ms' }} />
              <span style={{ animationDelay: '400ms' }} />
            </div>
            <p className="text-[color:var(--text-muted)] text-sm tracking-[0.22em] uppercase font-ui">
              Querying Semantic Scholar, PubMed & arXiv
            </p>
          </div>
        )}

        {(papers.length > 0 || directPaper) && (
          <div ref={resultsRef} className="mt-10">
            <div className="flex lg:hidden mb-6 bg-[color:var(--surface)] p-1.5 rounded-xl border border-[color:var(--line)]">
              <button
                onClick={() => setMobileView('search')}
                className={`flex-1 py-1.5 text-sm font-ui rounded-lg transition-all duration-200 ${mobileView === 'search' ? 'bg-[color:var(--brand)] text-[color:var(--surface)] shadow-md' : 'text-[color:var(--text-muted)]'}`}
              >
                Results
              </button>
              <button
                onClick={() => setMobileView('explain')}
                className={`flex-1 py-1.5 text-sm font-ui rounded-lg transition-all duration-200 ${mobileView === 'explain' ? 'bg-[color:var(--brand)] text-[color:var(--surface)] shadow-md' : 'text-[color:var(--text-muted)]'}`}
              >
                AI Explanation
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              <div className={`space-y-4 ${mobileView === 'explain' ? 'hidden lg:block' : ''}`}>
              {directPaper && (
                <>
                  <p className="text-[color:var(--text-muted)] text-xs tracking-[0.2em] uppercase mb-5 font-ui">
                    Searched Paper
                  </p>
                  <PaperCard
                    key={directPaper.id}
                    paper={directPaper}
                    isSelected={selectedPaper?.id === directPaper.id}
                    onExplain={handleExplain}
                    index={0}
                  />
                  {papers.length > 0 && (
                    <div className="pt-8 pb-2">
                      <div className="h-px w-full bg-[#E5E5E5] dark:bg-[#2A2A2A] mb-6"></div>
                      <p className="text-[color:var(--text-muted)] text-xs tracking-[0.2em] uppercase font-ui">
                        Similar Papers
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {!directPaper && papers.length > 0 && (
                <p className="text-[color:var(--text-muted)] text-xs tracking-[0.2em] uppercase mb-5 font-ui">
                  {papers.length} papers found for &ldquo;{query}&rdquo;
                </p>
              )}
              
              {papers.map((paper, i) => (
                <PaperCard
                  key={paper.id}
                  paper={paper}
                  isSelected={selectedPaper?.id === paper.id}
                  onExplain={handleExplain}
                  index={directPaper ? i + 1 : i}
                />
              ))}
            </div>

            <div className={`lg:sticky lg:top-8 lg:self-start ${mobileView === 'search' ? 'hidden lg:block' : ''}`}>
              <ExplainerPanel
                paper={selectedPaper}
                explanation={explanation}
                isLoading={isExplaining}
              />
            </div>
          </div>
          </div>
        )}

        {!isSearching && papers.length === 0 && !directPaper && query && (
          <div className="mt-16 text-center text-[color:var(--text-muted)]">
            <p className="text-lg">No papers found for &ldquo;{query}&rdquo;</p>
            <p className="text-sm mt-2">Try different keywords or a broader topic</p>
          </div>
        )}
      </div>
    </main>
  );
}
