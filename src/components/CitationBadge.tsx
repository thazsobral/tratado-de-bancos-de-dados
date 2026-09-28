import React from 'react';
import { BookOpen } from 'lucide-react';
import { OFFICIAL_SOURCES } from '../data/officialSources';

interface CitationBadgeProps {
  sourceId: string;
  onSelectSource: (sourceId: string) => void;
  label?: string;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({
  sourceId,
  onSelectSource,
  label,
}) => {
  const source = OFFICIAL_SOURCES.find((s) => s.id === sourceId);
  if (!source) return null;

  const displayCode = label || source.referenceCode;

  return (
    <button
      onClick={() => onSelectSource(sourceId)}
      className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 text-[11px] font-mono font-medium rounded border border-indigo-300/80 dark:border-indigo-800 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer align-baseline select-none"
      title={`Ver fonte oficial e paper acadêmico: ${source.title} (${source.authors}, ${source.year})`}
    >
      <BookOpen className="w-2.5 h-2.5 text-indigo-600 dark:text-indigo-400" />
      <span>[{displayCode}]</span>
    </button>
  );
};
