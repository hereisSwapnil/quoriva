export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number | null;
  abstract: string;
  citationCount: number;
  source: 'semantic_scholar' | 'pubmed' | 'arxiv';
  url: string;
  doi?: string;
  journal?: string;
  fieldsOfStudy?: string[];
}
