import React from 'react';
import { X, BookOpen, Clock, ArrowRight } from 'lucide-react';

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  isOpen,
  onClose,
  activeSection,
}) => {
  if (!isOpen) return null;

  const chapters = [
    {
      id: 'prologo',
      num: 'Prólogo',
      title: 'O Caos do Caderno e as Falhas dos Sistemas de Arquivos',
      desc: 'Por que o SGBD nasceu: redundância, concorrência descontrolada e anomalias de escrita no disco.',
      readTime: '4 min',
    },
    {
      id: 'capitulo-acid',
      num: 'Capítulo I',
      title: 'O Altar do ACID e o Preço da Certeza',
      desc: 'Atomicidade, Consistência, Isolamento e Durabilidade. WAL (Write-Ahead Logging) e MVCC.',
      readTime: '6 min',
    },
    {
      id: 'capitulo-query',
      num: 'Capítulo II',
      title: 'Por Baixo do Capô: A Jornada de uma Query',
      desc: 'Do texto SQL ao Lexer, AST, Otimizador de Consultas por Custo (CBO) e o abismo de latência da RAM vs Disco.',
      readTime: '7 min',
    },
    {
      id: 'capitulo-bplus',
      num: 'Capítulo III',
      title: 'O Segredo da Velocidade: Árvores B+ e Indexação',
      desc: 'Por que árvores binárias falham em disco. Fan-out massivo, nós roteadores e folhas duplamente encadeadas.',
      readTime: '8 min',
    },
    {
      id: 'capitulo-modelos',
      num: 'Capítulo IV',
      title: 'A Árvore Genealógica: Dos Anos 60 à Era Vetorial',
      desc: 'CODASYL, a Revolução Relacional de Codd, NoSQL & Teorema CAP, NewSQL e Bancos Vetoriais para IA.',
      readTime: '9 min',
    },
    {
      id: 'capitulo-bigdata',
      num: 'Capítulo V',
      title: 'A Escala Planetária: Sharding e MapReduce',
      desc: 'Escalabilidade vertical vs horizontal, fragmentação consistente e a lei: "mova o código até o dado".',
      readTime: '7 min',
    },
    {
      id: 'epilogo',
      num: 'Epílogo',
      title: 'Síntese, Glossário Técnico & Créditos',
      desc: 'Conclusão conceitual, dicionário essencial de termos de engenharia e referências de estudo.',
      readTime: '3 min',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="w-full max-w-md h-full bg-[#FAF8F5] dark:bg-[#15171C] text-stone-900 dark:text-stone-100 shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col p-6 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-label="Sumário da Obra"
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-lg font-serif font-semibold tracking-tight">Sumário da Obra</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar sumário"
            className="p-1 rounded text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-3 mb-6">
          Um roteiro progressivo da mecânica dos dados: dos limites físicos de blocos magnéticos às arquiteturas de nós distribuídos.
        </p>

        <div className="space-y-4 flex-1">
          {chapters.map((ch) => {
            const isActive = activeSection === ch.id;
            return (
              <a
                key={ch.id}
                href={`#${ch.id}`}
                onClick={onClose}
                className={`block p-3.5 rounded-lg border transition-all ${
                  isActive
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-xs'
                    : 'border-stone-200 dark:border-stone-800/80 bg-white/60 dark:bg-stone-900/40 hover:border-stone-400 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-sans text-stone-500 dark:text-stone-400 mb-1">
                  <span className="font-semibold text-indigo-700 dark:text-indigo-400">{ch.num}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {ch.readTime}
                  </span>
                </div>
                <h3 className="text-sm font-serif font-semibold text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 transition-colors">
                  {ch.title}
                </h3>
                <p className="text-xs font-sans text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
                  {ch.desc}
                </p>
              </a>
            );
          })}
        </div>

        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-xs font-sans text-stone-500 dark:text-stone-400 text-center">
          Tratado Didático sobre Engenharia de Dados &copy; 2026
        </div>
      </div>
    </div>
  );
};
