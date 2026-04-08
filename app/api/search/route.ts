import { NextRequest, NextResponse } from 'next/server';
import { Paper } from '@/types';

interface SemanticScholarAuthor {
  name: string;
}

interface SemanticScholarPaper {
  paperId: string;
  title?: string;
  authors?: SemanticScholarAuthor[];
  year?: number;
  abstract?: string;
  citationCount?: number;
  externalIds?: { DOI?: string };
  publicationVenue?: { name?: string };
  fieldsOfStudy?: string[];
}

interface SemanticScholarResponse {
  data?: SemanticScholarPaper[];
}

function parsePubMedArticles(xml: string): Paper[] {
  const papers: Paper[] = [];
  const articleMatches = xml.match(/<PubmedArticle>[\s\S]*?<\/PubmedArticle>/g) || [];

  for (const article of articleMatches) {
    const titleMatch = article.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
    const abstractMatch = article.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/);
    const pmidMatch = article.match(/<PMID[^>]*>(\d+)<\/PMID>/);
    const yearMatch = article.match(/<PubDate>[\s\S]*?<Year>(\d{4})<\/Year>/);
    const journalMatch = article.match(/<Title>([\s\S]*?)<\/Title>/);
    const authorMatches = [...article.matchAll(/<LastName>([\s\S]*?)<\/LastName>[\s\S]*?<ForeName>([\s\S]*?)<\/ForeName>/g)];
    const doiMatch = article.match(/<ArticleId IdType="doi">([\s\S]*?)<\/ArticleId>/);

    const abstract = abstractMatch ? abstractMatch[1].replace(/<[^>]+>/g, '') : '';
    if (!abstract || abstract.length < 50) continue;

    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '') : 'Untitled';
    const pmid = pmidMatch ? pmidMatch[1] : '';
    if (!pmid) continue;

    papers.push({
      id: `pm_${pmid}`,
      title,
      authors: authorMatches.slice(0, 4).map((m) => `${m[1]} ${m[2]}`),
      year: yearMatch ? parseInt(yearMatch[1]) : null,
      abstract,
      citationCount: 0,
      source: 'pubmed',
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      doi: doiMatch ? doiMatch[1] : undefined,
      journal: journalMatch ? journalMatch[1] : undefined,
      fieldsOfStudy: ['Medicine', 'Biology'],
    });
  }

  return papers;
}

function parseArXivEntries(xml: string): Paper[] {
  const entryMatches = xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  const papers: Paper[] = [];

  for (const entry of entryMatches) {
    const idMatch = entry.match(/<id>([\s\S]*?)<\/id>/);
    const titleMatch = entry.match(/<title>([\s\S]*?)<\/title>/);
    const summaryMatch = entry.match(/<summary>([\s\S]*?)<\/summary>/);
    const publishedMatch = entry.match(/<published>(\d{4})-\d{2}-\d{2}T/);
    const doiMatch = entry.match(/<arxiv:doi[^>]*>([\s\S]*?)<\/arxiv:doi>/);
    const categoryMatches = [...entry.matchAll(/<category[^>]*term="([^"]+)"/g)];
    const authorMatches = [...entry.matchAll(/<author>[\s\S]*?<name>([\s\S]*?)<\/name>[\s\S]*?<\/author>/g)];

    const abstract = summaryMatch ? summaryMatch[1].replace(/\s+/g, ' ').trim() : '';
    if (!abstract || abstract.length < 50) continue;

    const rawId = idMatch ? idMatch[1].trim() : '';
    const arxivId = rawId.split('/').pop() || rawId;
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : 'Untitled';

    papers.push({
      id: `ax_${arxivId}`,
      title,
      authors: authorMatches.slice(0, 4).map((m) => m[1].replace(/\s+/g, ' ').trim()),
      year: publishedMatch ? parseInt(publishedMatch[1]) : null,
      abstract,
      citationCount: 0,
      source: 'arxiv',
      url: rawId || `https://arxiv.org/abs/${arxivId}`,
      doi: doiMatch ? doiMatch[1].trim() : undefined,
      journal: 'arXiv',
      fieldsOfStudy: categoryMatches.slice(0, 3).map((m) => m[1]),
    });
  }

  return papers;
}

function parseSupportedPaperUrl(raw: string): { source: Paper['source']; id: string } | null {
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    const segments = url.pathname.split('/').filter(Boolean);

    if (host.includes('semanticscholar.org') && segments.includes('paper')) {
      const id = segments[segments.length - 1];
      if (id) return { source: 'semantic_scholar', id };
    }

    if (host.includes('pubmed.ncbi.nlm.nih.gov')) {
      const id = segments[0];
      if (id && /^\d+$/.test(id)) return { source: 'pubmed', id };
    }

    if (host.includes('arxiv.org')) {
      const first = segments[0];
      const second = segments[1] || '';
      if ((first === 'abs' || first === 'pdf' || first === 'html') && second) {
        const clean = second.replace(/\.pdf$/i, '');
        return { source: 'arxiv', id: clean };
      }
    }

    return null;
  } catch {
    return null;
  }
}

async function fetchSemanticScholarById(paperId: string): Promise<Paper | null> {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/${encodeURIComponent(paperId)}?fields=paperId,title,authors,year,abstract,citationCount,externalIds,publicationVenue,fieldsOfStudy`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Quoriva/1.0' },
    });
    if (!res.ok) return null;

    const p = (await res.json()) as SemanticScholarPaper;
    if (!p.abstract || p.abstract.length < 50) return null;

    return {
      id: `ss_${p.paperId}`,
      title: p.title || 'Untitled',
      authors: (p.authors || []).slice(0, 4).map((a) => a.name),
      year: p.year ?? null,
      abstract: p.abstract,
      citationCount: p.citationCount || 0,
      source: 'semantic_scholar',
      url: `https://www.semanticscholar.org/paper/${p.paperId}`,
      doi: p.externalIds?.DOI,
      journal: p.publicationVenue?.name,
      fieldsOfStudy: p.fieldsOfStudy || [],
    };
  } catch {
    return null;
  }
}

async function fetchPubMedById(pmid: string): Promise<Paper | null> {
  try {
    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&retmode=xml`;
    const fetchRes = await fetch(fetchUrl);
    if (!fetchRes.ok) return null;

    const xml = await fetchRes.text();
    const papers = parsePubMedArticles(xml);
    return papers[0] || null;
  } catch {
    return null;
  }
}

async function fetchArXivById(arxivId: string): Promise<Paper | null> {
  try {
    const url = `https://export.arxiv.org/api/query?id_list=${encodeURIComponent(arxivId)}&max_results=1`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Quoriva/1.0' },
    });
    if (!res.ok) return null;

    const xml = await res.text();
    const papers = parseArXivEntries(xml);
    return papers[0] || null;
  } catch {
    return null;
  }
}

async function fetchPaperFromUrl(raw: string): Promise<Paper | null> {
  const parsed = parseSupportedPaperUrl(raw);
  if (!parsed) return null;

  if (parsed.source === 'semantic_scholar') {
    return fetchSemanticScholarById(parsed.id);
  }
  if (parsed.source === 'pubmed') {
    return fetchPubMedById(parsed.id);
  }

  return fetchArXivById(parsed.id);
}

async function searchSemanticScholar(query: string): Promise<Paper[]> {
  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&fields=paperId,title,authors,year,abstract,citationCount,externalIds,publicationVenue,fieldsOfStudy&limit=6`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Quoriva/1.0' },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as SemanticScholarResponse;

    return (data.data || [])
      .filter(
        (p): p is SemanticScholarPaper & { abstract: string } =>
          typeof p.abstract === 'string' && p.abstract.length > 50
      )
      .map((p) => ({
        id: `ss_${p.paperId}`,
        title: p.title || 'Untitled',
        authors: (p.authors || []).slice(0, 4).map((a) => a.name),
        year: p.year ?? null,
        abstract: p.abstract,
        citationCount: p.citationCount || 0,
        source: 'semantic_scholar' as const,
        url: `https://www.semanticscholar.org/paper/${p.paperId}`,
        doi: p.externalIds?.DOI,
        journal: p.publicationVenue?.name,
        fieldsOfStudy: p.fieldsOfStudy || [],
      }));
  } catch {
    return [];
  }
}

async function searchPubMed(query: string): Promise<Paper[]> {
  try {
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=4&sort=relevance&retmode=json`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return [];
    const searchData = await searchRes.json();
    const ids: string[] = searchData.esearchresult?.idlist || [];
    if (ids.length === 0) return [];

    const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids.join(',')}&retmode=xml`;
    const fetchRes = await fetch(fetchUrl);
    if (!fetchRes.ok) return [];
    const xml = await fetchRes.text();

    return parsePubMedArticles(xml);
  } catch {
    return [];
  }
}

async function searchArXiv(query: string): Promise<Paper[]> {
  try {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=4&sortBy=relevance&sortOrder=descending`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Quoriva/1.0' },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    return parseArXivEntries(xml);
  } catch {
    return [];
  }
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json({ error: 'Query required' }, { status: 400 });

  const directPaper = await fetchPaperFromUrl(q);
  const query = directPaper?.title || q;

  const [ssPapers, pmPapers, axPapers] = await Promise.all([
    searchSemanticScholar(query),
    searchPubMed(query),
    searchArXiv(query),
  ]);

  const seen = new Set<string>();
  const papers: Paper[] = [];
  for (const p of [directPaper, ...ssPapers, ...pmPapers, ...axPapers]) {
    if (!p) continue;
    if (!seen.has(p.title.toLowerCase().slice(0, 40))) {
      seen.add(p.title.toLowerCase().slice(0, 40));
      papers.push(p);
    }
  }

  papers.sort((a, b) => b.citationCount - a.citationCount);
  
  if (directPaper) {
    const similarPapers = papers.filter((p) => p.id !== directPaper.id).slice(0, 8);
    return NextResponse.json({ directPaper, papers: similarPapers });
  }

  return NextResponse.json({ papers: papers.slice(0, 8) });
}
