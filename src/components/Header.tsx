import React from 'react';
import { Sun, Moon, BookOpen, Compass, Github } from 'lucide-react';
import { ThemeMode } from '../types';

interface HeaderProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  activeSection: string;
  onOpenToc: () => void;
  onOpenSources: () => void;
  readingProgress: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onToggleTheme,
  activeSection,
  onOpenToc,
  onOpenSources,
  readingProgress,
}) => {
  const navItems = [
    { id: 'prologo', label: 'Prólogo' },
    { id: 'capitulo-acid', label: '01. ACID' },
    { id: 'capitulo-query', label: '02. A Query' },
    { id: 'capitulo-bplus', label: '03. Árvore B+' },
    { id: 'capitulo-modelos', label: '04. Evolução' },
    { id: 'capitulo-bigdata', label: '05. Big Data' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 dark:border-stone-800 bg-[#FAF8F5]/90 dark:bg-[#121316]/90 backdrop-blur-md transition-colors duration-300">
      {/* Reading Progress Hairline Bar */}
      <div 
        className="absolute top-0 left-0 h-[2px] bg-indigo-600 dark:bg-indigo-400 transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(readingProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <a 
          href="#topo" 
          className="text-base sm:text-lg font-serif font-semibold tracking-tight text-stone-900 dark:text-stone-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap"
        >
          Tratado de Bancos de Dados
        </a>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs sm:text-sm font-sans text-stone-600 dark:text-stone-400">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`transition-colors whitespace-nowrap pb-0.5 border-b-2 ${
                  isActive
                    ? 'border-indigo-600 dark:border-indigo-400 text-stone-900 dark:text-stone-100 font-medium'
                    : 'border-transparent hover:text-stone-900 dark:hover:text-stone-100 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <button
            onClick={onOpenSources}
            aria-label="Abrir acervo de fontes oficiais e papers seminais"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-sans font-medium text-indigo-700 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white bg-indigo-50/80 dark:bg-indigo-950/50 border border-indigo-200/80 dark:border-indigo-800/80 rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Fontes Oficiais</span>
          </button>

          <a
            href="https://github.com/thazsobral/tratado-de-bancos-de-dados"
            target="_blank"
            rel="noopener noreferrer"
            title="Ver código-fonte no GitHub"
            aria-label="Repositório no GitHub"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-sans font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            <Github className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span className="hidden md:inline">GitHub</span>
          </a>

          <button
            onClick={onOpenToc}
            aria-label="Abrir sumário do livro"
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-sans font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Sumário</span>
          </button>

          <button
            type="button"
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Alternar para Modo Claro (Papel Alabastro)' : 'Alternar para Modo Escuro (Ardósia Nanquim)'}
            aria-label={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-sans font-medium text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white bg-stone-100/80 dark:bg-stone-800/80 border border-stone-200/80 dark:border-stone-700/80 rounded transition-all cursor-pointer hover:border-indigo-400 dark:hover:border-indigo-500"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline text-[11px]">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden md:inline text-[11px]">Escuro</span>
              </>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
