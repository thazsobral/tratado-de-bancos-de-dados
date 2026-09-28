import React from 'react';
import { ArrowDown, Compass, BookOpen, Sparkles, Github } from 'lucide-react';
import frontispieceImage from '../assets/images/editorial_frontispiece_1790579516062.jpg';

interface HeroFrontispieceProps {
  onOpenSources: () => void;
}

export const HeroFrontispiece: React.FC<HeroFrontispieceProps> = ({ onOpenSources }) => {
  return (
    <section id="topo" className="pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Editorial Accession / Volume Header */}
        <div className="text-xs uppercase tracking-widest font-sans text-stone-500 dark:text-stone-400 font-medium mb-3">
          Volume I · Tratado de Engenharia de Software · Edição Interativa 2026
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          A Arquitetura Oculta dos Bancos de Dados
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed">
          Uma investigação profunda e interativa sobre a superação do caos dos sistemas de arquivos, as garantias matemáticas do ACID, o caminho invisível de uma query e a mecânica das Árvores B+.
        </p>

        {/* Curatorial Frontispiece Engraving Plate */}
        <div className="mt-10 max-w-3xl mx-auto">
          <div className="relative p-2 sm:p-3 rounded-xl border border-stone-300 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 shadow-xs">
            <div className="overflow-hidden rounded-lg border border-stone-200 dark:border-stone-800 aspect-16/9 bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <img
                src={frontispieceImage}
                alt="Frontispício do Tratado Ilustrado de Bancos de Dados mostrando arquivo mecânico e arquitetura de dados"
                className="w-full h-full object-cover grayscale contrast-125 dark:invert-0 hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </div>
            <div className="text-center mt-3 text-xs font-serif italic text-stone-500 dark:text-stone-400">
              Prancha I — A Biblioteca de Registros Infinitos: Da taxonomia física à máquina de estado transacional.
            </div>
          </div>
        </div>

        {/* Fast Overview Badges / Stats */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-xs font-sans text-stone-600 dark:text-stone-400 border-y border-stone-200 dark:border-stone-800 py-4">
          <div>
            <strong className="text-stone-900 dark:text-stone-100 block text-base font-serif font-semibold">5 Capítulos</strong>
            <span>Progressão Didática</span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />
          <div>
            <strong className="text-stone-900 dark:text-stone-100 block text-base font-serif font-semibold">4 Simuladores</strong>
            <span>Laboratórios de Código & I/O</span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />
          <div>
            <strong className="text-stone-900 dark:text-stone-100 block text-base font-serif font-semibold">60 Anos</strong>
            <span>De CODASYL a Bancos Vetoriais</span>
          </div>
          <div className="h-6 w-px bg-stone-200 dark:bg-stone-800 hidden sm:block" />
          <button
            onClick={onOpenSources}
            className="text-left group cursor-pointer"
          >
            <strong className="text-indigo-700 dark:text-indigo-400 group-hover:underline block text-base font-serif font-semibold flex items-center gap-1">
              <span>12 Fontes Oficiais</span>
              <BookOpen className="w-3.5 h-3.5" />
            </strong>
            <span>Papers ACM, IEEE & ISO</span>
          </button>
        </div>

        {/* Scroll CTA & GitHub Action */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#prologo"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-sans font-medium transition-colors shadow-xs"
          >
            <span>Iniciar leitura do Prólogo</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
          </a>

          <a
            href="https://github.com/thazsobral/tratado-bancos-de-dados"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white/80 dark:bg-stone-800/80 hover:bg-white dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-sans font-medium transition-colors"
          >
            <Github className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>Repositório no GitHub</span>
          </a>
        </div>
      </div>
    </section>
  );
};
