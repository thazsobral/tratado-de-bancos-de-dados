import React, { useState } from 'react';
import { X, ExternalLink, BookOpen, Search, Check, Layers, Code, FileText, Bookmark } from 'lucide-react';
import { OFFICIAL_SOURCES } from '../data/officialSources';
import { OfficialPaperCitation } from '../types';

interface OfficialSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSourceId?: string | null;
}

export const OfficialSourcesModal: React.FC<OfficialSourcesModalProps> = ({
  isOpen,
  onClose,
  initialSourceId,
}) => {
  const [selectedSourceId, setSelectedSourceId] = useState<string>(
    initialSourceId || OFFICIAL_SOURCES[0].id
  );
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Update selected if initialSourceId changes
  React.useEffect(() => {
    if (initialSourceId) {
      setSelectedSourceId(initialSourceId);
    }
  }, [initialSourceId]);

  if (!isOpen) return null;

  const categories = [
    { key: 'all', label: 'Todas as Fontes (12)' },
    { key: 'fundamentos', label: 'Fundamentos & ISO' },
    { key: 'indices', label: 'Árvores & Índices' },
    { key: 'concorrencia_wal', label: 'ACID, WAL & POSIX' },
    { key: 'query_engine', label: 'Otimizador & Execução' },
    { key: 'distribuidos', label: 'Distribuídos & CAP' },
    { key: 'vetorial_ia', label: 'Vetoriais & IA' },
  ];

  const filteredSources = OFFICIAL_SOURCES.filter((s) => {
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.referenceCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.realWorldImplementation.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const selectedSource: OfficialPaperCitation =
    OFFICIAL_SOURCES.find((s) => s.id === selectedSourceId) || OFFICIAL_SOURCES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-xs">
      <div 
        className="w-full max-w-4xl h-[90vh] bg-[#FAF8F5] dark:bg-[#15171C] border border-stone-300 dark:border-stone-800 rounded-xl shadow-2xl flex flex-col overflow-hidden text-stone-900 dark:text-stone-100 font-sans"
        role="dialog"
        aria-modal="true"
        aria-label="Acervo de Fontes Oficiais e Papers Seminais"
      >
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between gap-4 bg-white/70 dark:bg-stone-900/60">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                Acervo de Fontes Oficiais & Papers Seminais
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Documentação primária, artigos revisados por pares (ACM, IEEE, OSDI) e normas internacionais (ISO/IEC, POSIX).
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar acervo de fontes"
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls Ribbon */}
        <div className="px-5 py-3 border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/40 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between text-xs">
          {/* Categories Horizontal Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((c) => (
              <button
                key={c.key}
                onClick={() => setActiveCategory(c.key)}
                className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  activeCategory === c.key
                    ? 'bg-white dark:bg-stone-800 text-indigo-700 dark:text-indigo-400 font-medium shadow-xs border border-stone-200 dark:border-stone-700'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar autor, paper ou código..."
              className="w-full pl-8 pr-3 py-1 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
            />
          </div>
        </div>

        {/* Main Content: 2 Columns (Catalog List + Dossier Details) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: List of Papers */}
          <div className="w-full md:w-5/12 border-r border-stone-200 dark:border-stone-800 overflow-y-auto divide-y divide-stone-200 dark:divide-stone-800/80 bg-white/40 dark:bg-stone-950/20">
            {filteredSources.length === 0 ? (
              <div className="p-6 text-center text-xs text-stone-500 italic">
                Nenhum paper localizado com os critérios informados.
              </div>
            ) : (
              filteredSources.map((source) => {
                const isSelected = source.id === selectedSource.id;
                return (
                  <button
                    key={source.id}
                    onClick={() => setSelectedSourceId(source.id)}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer block ${
                      isSelected
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-l-3 border-indigo-600 dark:border-indigo-400'
                        : 'hover:bg-stone-100/70 dark:hover:bg-stone-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 dark:text-stone-400 mb-1">
                      <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                        {source.referenceCode}
                      </span>
                      <span>{source.year}</span>
                    </div>

                    <h4 className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 line-clamp-2 leading-snug">
                      {source.title}
                    </h4>

                    <p className="text-[11px] text-stone-600 dark:text-stone-400 truncate mt-1">
                      {source.authors}
                    </p>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: In-depth Paper Dossier */}
          <div className="w-full md:w-7/12 p-5 sm:p-6 overflow-y-auto bg-stone-50/40 dark:bg-stone-900/30 text-xs space-y-4">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-indigo-700 dark:text-indigo-400 font-semibold mb-1">
                <span>{selectedSource.referenceCode}</span>
                <span>·</span>
                <span>{selectedSource.year}</span>
                {selectedSource.standardReference && (
                  <>
                    <span>·</span>
                    <span className="text-stone-500 dark:text-stone-400">{selectedSource.standardReference}</span>
                  </>
                )}
              </div>

              <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-100 leading-snug">
                {selectedSource.title}
              </h3>

              <div className="text-xs font-medium text-stone-700 dark:text-stone-300 mt-1">
                Autores: <span className="font-normal text-stone-600 dark:text-stone-400">{selectedSource.authors}</span>
              </div>

              <div className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 font-mono">
                {selectedSource.venue}
              </div>

              {selectedSource.doiOrUrl && (
                <a
                  href={selectedSource.doiOrUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1 mt-2 text-indigo-700 dark:text-indigo-400 hover:underline font-mono text-[11px]"
                >
                  <span>Acessar Publicação Oficial / DOI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Abstract */}
            <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider flex items-center gap-1">
                <FileText className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                Síntese do Resumo Original (Abstract)
              </span>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-serif italic text-xs sm:text-[13px]">
                &ldquo;{selectedSource.originalAbstract}&rdquo;
              </p>
            </div>

            {/* Theoretical / Mathematical Proof */}
            <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-stone-500 tracking-wider flex items-center gap-1">
                <Bookmark className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                Contribuição Matemática & Formal
              </span>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                {selectedSource.mathematicalContribution}
              </p>
            </div>

            {/* Real World Open Source Engine Implementation */}
            <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-900 text-stone-200 space-y-1.5 font-mono text-[11px]">
              <span className="text-[10px] uppercase font-semibold text-indigo-400 tracking-wider flex items-center gap-1 font-sans">
                <Code className="w-3 h-3 text-indigo-400" />
                Implementação Real nos Motores Atuais
              </span>
              <p className="text-stone-300 leading-relaxed">
                {selectedSource.realWorldImplementation}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/60 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
          <span>O rigor científico constitui a espinha dorsal de qualquer motor de banco de dados moderno.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors cursor-pointer"
          >
            Fechar Acervo
          </button>
        </div>
      </div>
    </div>
  );
};
