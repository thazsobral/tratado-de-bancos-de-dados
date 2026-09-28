export type ThemeMode = 'light' | 'dark';

export interface ChapterNav {
  id: string;
  number: string;
  title: string;
  subtitle: string;
}

export interface BPlusNode {
  id: string;
  isLeaf: boolean;
  keys: number[];
  children?: BPlusNode[];
  values?: { id: number; title: string; block: number }[];
  nextLeafId?: string;
  prevLeafId?: string;
}

export interface SearchStep {
  stepNumber: number;
  nodeId: string;
  description: string;
  targetKey: number;
  visitedKeys: number[];
  type: 'root' | 'internal' | 'leaf' | 'match' | 'sequential';
}

export interface DatabaseModelRecord {
  id: string;
  era: string;
  paradigm: string;
  coreConcept: string;
  consistencyModel: string;
  scalingModel: string;
  representativeTech: string[];
  bestFor: string;
  weakness: string;
  dataStructure: string;
}

export interface OfficialPaperCitation {
  id: string;
  title: string;
  authors: string;
  year: number;
  venue: string;
  referenceCode: string;
  doiOrUrl: string;
  category: 'fundamentos' | 'concorrencia_wal' | 'query_engine' | 'indices' | 'distribuidos' | 'vetorial_ia';
  originalAbstract: string;
  mathematicalContribution: string;
  realWorldImplementation: string;
  standardReference?: string;
}
