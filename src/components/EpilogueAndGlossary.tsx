import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Check, ChevronDown, ChevronUp, Github } from 'lucide-react';

interface GlossaryTerm {
  term: string;
  pronounce?: string;
  category: string;
  definition: string;
  analogy: string;
}

interface EpilogueAndGlossaryProps {
  onOpenSources: () => void;
  onSelectSource: (sourceId: string) => void;
}

export const EpilogueAndGlossary: React.FC<EpilogueAndGlossaryProps> = ({
  onOpenSources,
  onSelectSource,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const glossaryTerms: GlossaryTerm[] = [
    {
      term: 'ACID',
      category: 'Confiabilidade',
      definition: 'Acrônimo para Atomicidade, Consistência, Isolamento e Durabilidade. Conjunto de garantias que assegura a integridade de transações em bancos relacionais.',
      analogy: 'O código de leis inquebrável de um cartório digital de segurança máxima.',
    },
    {
      term: 'WAL (Write-Ahead Logging)',
      category: 'Armazenamento',
      definition: 'Técnica em que as alterações são registradas em um arquivo de log sequencial em disco rígido ANTES de serem aplicadas às páginas de dados na memória RAM.',
      analogy: 'O caderno de anotações imediatas do caixa, antes de atualizar o balanço oficial encadernado.',
    },
    {
      term: 'Árvore B+ (B+ Tree)',
      category: 'Estruturas de Dados',
      definition: 'Estrutura em árvore auto-balanceada com alto fator de ramificação (fan-out), cujos nós internos guardam apenas chaves roteadoras e todas as tuplas residem em folhas duplamente encadeadas.',
      analogy: 'Um catálogo de biblioteca de três níveis onde o último andar possui uma passarela contínua entre todas as estantes.',
    },
    {
      term: 'Buffer Pool',
      category: 'Arquitetura',
      definition: 'Área da memória RAM dedicada a reter páginas de dados (frames de 4KB ou 8KB) para evitar acessos lentos de I/O de disco.',
      analogy: 'A bancada de trabalho do relojoeiro com as ferramentas mais usadas, evitando ir ao armário dos fundos.',
    },
    {
      term: 'MVCC (Multi-Version Concurrency Control)',
      category: 'Concorrência',
      definition: 'Mecanismo em que cada registro mantém múltiplas versões históricas com carimbos de tempo, permitindo que consultas de leitura nunca bloqueiem operações de escrita.',
      analogy: 'Fotocópias com carimbo de hora: quem está lendo o jornal das 10h não impede que o editor publique a edição das 11h.',
    },
    {
      term: 'Teorema CAP',
      category: 'Sistemas Distribuídos',
      definition: 'Postulado por Eric Brewer afirmando que nenhum sistema distribuído em rede particionada pode oferecer simultaneamente Consistência Estrita e 100% de Disponibilidade.',
      analogy: 'O triângulo impossível da engenharia: entre rápido, barato e perfeito, só é possível escolher dois.',
    },
    {
      term: 'Sharding',
      category: 'Escala',
      definition: 'Técnica de particionamento horizontal que divide os registros de uma tabela gigante entre múltiplos nós físicos independentes de um cluster.',
      analogy: 'Repartir uma lista telefônica de uma nação inteira em 26 tomos, um para cada letra do alfabeto.',
    },
    {
      term: 'MapReduce',
      category: 'Big Data',
      definition: 'Modelo de computação distribuída que divide a tarefa em processamento local paralelo nos nós onde o dado reside (Map) e consolidação centralizada do resultado (Reduce).',
      analogy: 'Pedir que cada estudante conte os livros da sua própria mochila e apenas levante a mão com o total, em vez de despejar todas as mochilas no chão do pátio.',
    },
    {
      term: 'HNSW (Hierarchical Navigable Small World)',
      category: 'Bancos Vetoriais / IA',
      definition: 'Estrutura baseada em grafos em camadas para busca rápida de vizinhos mais próximos aproximados (ANN) em espaços hiperdimensionais de embeddings.',
      analogy: 'O jogo dos seis graus de separação: usar rodovias interestaduais no topo para cruzar o país e ruas locais embaixo para achar a casa exata.',
    },
    {
      term: 'fsync()',
      category: 'Sistema Operacional',
      definition: 'Chamada de sistema POSIX que força o kernel e a controladora de armazenamento a descarregarem buffers voláteis e gravarem os bytes fisicamente no meio magnético ou flash.',
      analogy: 'O carimbo de tinta indelével: garante que a tinta secou no papel antes de dispensar a testemunha.',
    },
  ];

  const filteredTerms = glossaryTerms.filter(
    (t) =>
      t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="epilogo" className="py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Subtitle */}
        <div className="text-xs uppercase tracking-widest font-sans text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
          Epílogo & Referências
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          A Arte da Persistência Inabalável
        </h2>

        <div className="mt-8 space-y-6 text-stone-800 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed text-justify">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-indigo-700 dark:first-letter:text-indigo-400">
            A jornada dos bancos de dados é a própria crônica da civilização técnica. Das primeiras gravações em placas de argila na antiga Mesopotâmia às árvores B+ balanceadas no silício e aos grafos de proximidade da Inteligência Artificial, o anseio humano permaneceu idêntico: preservar a verdade dos fatos contra o desgaste do tempo, a falha dos instrumentos e a voracidade do caos.
          </p>

          <p>
            Compreender o que ocorre por baixo do capô — do compilador de queries ao buffer pool, das invariantes do ACID aos compromissos da partição distribuída — transforma o desenvolvedor comum em um verdadeiro arquiteto de sistemas resilientes.
          </p>
        </div>

        {/* Technical Glossary Component */}
        <div className="mt-14 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Glossário Essencial de Engenharia de Dados
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Consulte definições técnicas rigorosas e analogias didáticas dos conceitos estudados.
              </p>
            </div>

            {/* Search filter */}
            <div className="relative min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar termo ou conceito..."
                className="w-full pl-8 pr-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs"
              />
            </div>
          </div>

          {/* Terms Accordion */}
          <div className="my-5 divide-y divide-stone-200 dark:divide-stone-800 text-xs">
            {filteredTerms.length === 0 ? (
              <div className="py-6 text-center text-stone-500 italic">
                Nenhum termo correspondente encontrado.
              </div>
            ) : (
              filteredTerms.map((item, idx) => {
                const isExpanded = expandedIndex === idx;
                return (
                  <div key={idx} className="py-3">
                    <button
                      onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                      className="w-full flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {item.term}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200/70 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                          {item.category}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 pl-2 space-y-2 text-stone-700 dark:text-stone-300 text-xs leading-relaxed animate-in fade-in duration-200">
                        <p>{item.definition}</p>
                        <div className="p-2.5 rounded bg-white/70 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-700/60 text-stone-600 dark:text-stone-400 italic">
                          <strong className="not-italic text-indigo-700 dark:text-indigo-400 font-medium">Analogia Didática:</strong> &ldquo;{item.analogy}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Official Sources & Standards Direct Callout */}
        <div className="mt-14 p-6 rounded-xl border border-indigo-200 dark:border-indigo-900/70 bg-gradient-to-br from-indigo-50/70 to-stone-50 dark:from-indigo-950/30 dark:to-stone-900/50 shadow-xs font-sans">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-100 dark:border-indigo-900/50">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-indigo-700 dark:text-indigo-400 mb-1">
                <BookOpen className="w-4 h-4" />
                <span>Base Teórica & Documentação Primária</span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
                Acervo de Papers Seminais e Normas Internacionais
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Consulte os 12 artigos canônicos revisados por pares (ACM, IEEE, USENIX OSDI) e especificações oficiais (ISO/IEC 9075, POSIX.1).
              </p>
            </div>

            <button
              onClick={onOpenSources}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium text-xs transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5 shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explorar 12 Fontes Oficiais</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
            <div 
              onClick={() => onSelectSource('codd-1970')}
              className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60 hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">ACM CACM 1970</span>
              <strong className="font-serif text-stone-900 dark:text-stone-100 block text-xs mt-0.5">Edgar F. Codd</strong>
              <span className="text-stone-500 text-[11px] leading-tight block mt-1">A Relational Model of Data for Large Shared Data Banks</span>
            </div>

            <div 
              onClick={() => onSelectSource('bayer-mccreight-1972')}
              className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60 hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">Acta Informatica 1972</span>
              <strong className="font-serif text-stone-900 dark:text-stone-100 block text-xs mt-0.5">Bayer & McCreight</strong>
              <span className="text-stone-500 text-[11px] leading-tight block mt-1">Organization and Maintenance of Large Ordered Indices</span>
            </div>

            <div 
              onClick={() => onSelectSource('mohan-aries-1992')}
              className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60 hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">ACM TODS 1992</span>
              <strong className="font-serif text-stone-900 dark:text-stone-100 block text-xs mt-0.5">Mohan et al. (ARIES)</strong>
              <span className="text-stone-500 text-[11px] leading-tight block mt-1">A Transaction Recovery Method Supporting Write-Ahead Logging</span>
            </div>
          </div>
        </div>

        {/* Inspiration Note / Credits */}
        <div className="mt-14 p-5 rounded-lg border border-dashed border-stone-300 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 text-xs font-sans text-stone-600 dark:text-stone-400">
          <div className="font-semibold text-stone-900 dark:text-stone-100 mb-1">
            Nota de Inspiração & Referência Curatorial:
          </div>
          <p>
            Conteúdo didático e estrutural inspirado no roteiro: <em>&ldquo;Roadmap de Aprendizado e Desmistificação de Bancos de Dados&rdquo;</em>, articulando os fundamentos de sistemas de computação de Edgar F. Codd, Rudolf Bayer, Jim Gray, Jeffrey Dean e da comunidade de software livre.
          </p>
        </div>

        {/* Mandatory Official Footer with GitHub Repo Link */}
        <footer className="mt-16 pt-8 border-t border-stone-200 dark:border-stone-800 text-center font-sans text-xs text-stone-500 dark:text-stone-400 leading-relaxed space-y-3">
          <div className="flex justify-center items-center">
            <a
              href="https://github.com/thazsobral/tratado-de-bancos-de-dados"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-stone-300 dark:border-stone-700 bg-stone-100/70 dark:bg-stone-800/70 hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-sans transition-colors cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Ver Código-Fonte no GitHub</span>
            </a>
          </div>
          <p>
            Desenvolvido por ThazSobral para fins de Educação Tecnológica Prática e Interativa. © 2026 — Todos os direitos reservados.
          </p>
        </footer>
      </div>
    </section>
  );
};
