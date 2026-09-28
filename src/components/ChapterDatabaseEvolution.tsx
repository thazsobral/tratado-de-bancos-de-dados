import React, { useState } from 'react';
import { GitBranch, Table, Cpu, Compass, Layers, Check, X, Sparkles } from 'lucide-react';
import { DatabaseModelRecord } from '../types';
import { CitationBadge } from './CitationBadge';

interface ChapterDatabaseEvolutionProps {
  onSelectSource: (sourceId: string) => void;
}

export const ChapterDatabaseEvolution: React.FC<ChapterDatabaseEvolutionProps> = ({ onSelectSource }) => {
  const [selectedParadigm, setSelectedParadigm] = useState<string>('all');
  const [activeModelModal, setActiveModelModal] = useState<DatabaseModelRecord | null>(null);

  const databaseModels: DatabaseModelRecord[] = [
    {
      id: 'hierarchical',
      era: 'Anos 1960',
      paradigm: 'Hierárquico & Rede',
      coreConcept: 'Árvores rígidas pai-filho e grafos de ponteiros manuais em fita e disco.',
      consistencyModel: 'Manual / Imperativo',
      scalingModel: 'Vertical em Mainframes',
      representativeTech: ['IBM IMS', 'CODASYL', 'IDMS'],
      bestFor: 'Sistemas de reservas aéreas Apollo nos anos 60 e contabilidade em lote.',
      weakness: 'Se um ponteiro quebrava, o banco corrompia. Mudança de esquema exigia reescrever todos os programas em Cobol.',
      dataStructure: 'Árvore N-ária & Listas Encadeadas de Disco com Cursores',
    },
    {
      id: 'relational',
      era: '1970 – Presente',
      paradigm: 'Relacional (SQL)',
      coreConcept: 'Álgebra relacional, tabelas 2D com linhas/colunas e junções (JOINs) declarativas.',
      consistencyModel: 'ACID Estrito (Serializável)',
      scalingModel: 'Vertical (Scale-up) / Réplicas de Leitura',
      representativeTech: ['PostgreSQL', 'MySQL', 'Oracle', 'SQL Server', 'SQLite'],
      bestFor: 'Sistemas bancários, ERPs, comércio eletrônico e aplicações de missão crítica com regras de integridade rígidas.',
      weakness: 'Escalar escritas horizontalmente através de múltiplos nós é complexo e exige sharding artesanal.',
      dataStructure: 'Árvores B+ e Heap Files com Buffer Pool',
    },
    {
      id: 'nosql-doc',
      era: 'Anos 2000',
      paradigm: 'NoSQL: Documentos',
      coreConcept: 'Esquema flexível (schemaless) em JSON/BSON hierárquico, sem necessidade de migrations antecipadas.',
      consistencyModel: 'BASE / Consistência Eventual',
      scalingModel: 'Horizontal Nativo (Sharding por Chave)',
      representativeTech: ['MongoDB', 'CouchDB', 'Firestore'],
      bestFor: 'Catálogos dinâmicos de e-commerce, perfis de usuário e prototipagem ágil.',
      weakness: 'Falta de integridade referencial nativa (JOINs caros ou inexistentes); duplicação frequente de dados.',
      dataStructure: 'B-Trees sobre BSON e LSM-Trees (WiredTiger)',
    },
    {
      id: 'nosql-kv',
      era: 'Anos 2000',
      paradigm: 'NoSQL: Chave-Valor',
      coreConcept: 'Tabela hash distribuída ultraveloz: busca direta O(1) através de uma chave textual.',
      consistencyModel: 'Configurável (Eventual / Imediata)',
      scalingModel: 'Particionamento por Hash Consistente',
      representativeTech: ['Redis', 'Amazon DynamoDB', 'Memcached'],
      bestFor: 'Sessões de usuário em tempo real, caches ultrarrápidos, filas e contadores de visualizações.',
      weakness: 'Incapaz de realizar consultas analíticas ou filtros complexos por atributos secundários.',
      dataStructure: 'In-Memory Hash Tables / Skip Lists / Bitmaps',
    },
    {
      id: 'nosql-column',
      era: 'Anos 2000',
      paradigm: 'NoSQL: Wide-Column',
      coreConcept: 'Dados armazenados por famílias de colunas esparsas, otimizados para altíssima vazão de escrita distribuída.',
      consistencyModel: 'Consistência Ajustável (Quorum N/W/R)',
      scalingModel: 'Horizontal Massivo (Centenas de Nós)',
      representativeTech: ['Apache Cassandra', 'ScyllaDB', 'HBase'],
      bestFor: 'Telemetria de IoT, logs de cliques, séries temporais e chats em escala de bilhões de mensagens.',
      weakness: 'Modelagem orientada estritamente às queries planejadas; mudar a pergunta exige remodelar a tabela.',
      dataStructure: 'LSM-Trees (Log-Structured Merge-Tree) e MemTables',
    },
    {
      id: 'newsql',
      era: 'Anos 2010',
      paradigm: 'NewSQL',
      coreConcept: 'Combina a semântica SQL e garantias ACID completas com escalabilidade horizontal planetária.',
      consistencyModel: 'ACID Distribuído (External Consistency)',
      scalingModel: 'Horizontal Automático com Consenso',
      representativeTech: ['Google Spanner', 'CockroachDB', 'TiDB', 'YugabyteDB'],
      bestFor: 'Grandes instituições financeiras globais que necessitam de consistência estrita sem abrir mão de escala distribuída.',
      weakness: 'Latência de escrita elevada decorrente da sincronização de consenso de rede (Paxos/Raft) e custo de infraestrutura.',
      dataStructure: 'Raft / Paxos sobre LSM-Tree particionada + Relógios Atômicos (TrueTime)',
    },
    {
      id: 'vector',
      era: 'Anos 2020 (Era IA)',
      paradigm: 'Bancos Vetoriais (Vector DB)',
      coreConcept: 'Armazena embeddings (vetores numéricos de alta dimensão, ex: 1536 dimensões) e busca por proximidade semântica.',
      consistencyModel: 'Consistência Eventual / Snapshot',
      scalingModel: 'Horizontal com Sharding de Grafo',
      representativeTech: ['Pinecone', 'Milvus', 'Qdrant', 'Weaviate', 'pgvector'],
      bestFor: 'Busca semântica, RAG (Retrieval-Augmented Generation) para LLMs, recomendação de imagens e IA generativa.',
      weakness: 'As buscas são probabilísticas (ANN - Vizinhos Mais Próximos Aproximados), não retornam garantia 100% exata.',
      dataStructure: 'HNSW (Hierarchical Navigable Small World) & Grafos de Proximidade',
    },
  ];

  const paradigms = [
    { key: 'all', label: 'Todos os Modelos' },
    { key: 'relational', label: 'Relacional (SQL)' },
    { key: 'nosql', label: 'Família NoSQL' },
    { key: 'newsql', label: 'NewSQL Distribuído' },
    { key: 'vector', label: 'Vetoriais (IA)' },
  ];

  const filteredModels = databaseModels.filter((m) => {
    if (selectedParadigm === 'all') return true;
    if (selectedParadigm === 'relational') return m.id === 'relational' || m.id === 'hierarchical';
    if (selectedParadigm === 'nosql') return m.id.startsWith('nosql');
    if (selectedParadigm === 'newsql') return m.id === 'newsql';
    if (selectedParadigm === 'vector') return m.id === 'vector';
    return true;
  });

  return (
    <section id="capitulo-modelos" className="py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Editorial Subtitle */}
        <div className="text-xs uppercase tracking-widest font-sans text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
          Capítulo Quarto
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          A Árvore Genealógica: Dos Anos 60 aos Vetores da IA
        </h2>

        <p className="mt-4 text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-indigo-600/40 dark:border-indigo-400/40 pl-4 py-1">
          &ldquo;Nenhum modelo de banco de dados nasce por vaidade teórica; cada paradigma é uma resposta desesperada aos novos limites impostos pela escala dos negócios humanos.&rdquo;
        </p>

        {/* Narrative Section */}
        <div className="mt-8 space-y-6 text-stone-800 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed text-justify">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-indigo-700 dark:first-letter:text-indigo-400">
            Em 1970, o matemático britânico Edgar F. Codd publicou pela IBM o manifesto que alteraria os rumos da civilização digital: <em className="italic">&ldquo;A Relational Model of Data for Large Shared Data Banks&rdquo;</em>
            <CitationBadge sourceId="codd-1970" onSelectSource={onSelectSource} />. Antes de Codd, os desenvolvedores navegavam manualmente ponteiros físicos gravados em fita com código imperativo (modelo CODASYL). Se a estrutura física do disco mudasse, centenas de programas em Cobol quebravam instantaneamente.
          </p>

          <p>
            Codd propôs uma cisão radical: a <strong className="font-semibold text-stone-900 dark:text-stone-100">independência física dos dados</strong>. O programador passou a lidar exclusivamente com relações matemáticas (tabelas e tuplas) por meio de uma linguagem declarativa que se tornaria o padrão universal: o <strong className="font-semibold text-stone-900 dark:text-stone-100">SQL</strong>
            <CitationBadge sourceId="iso-sql-2023" onSelectSource={onSelectSource} />.
          </p>

          <p>
            Três décadas depois, a explosão da Web 2.0 colocou os motores relacionais contra a parede. Eric Brewer postulou o <strong className="font-semibold text-stone-900 dark:text-stone-100">Teorema CAP</strong>
            <CitationBadge sourceId="brewer-cap-2012" onSelectSource={onSelectSource} />: em uma rede de computadores distribuídos sujeita a falhas de comunicação (Partição), é matematicamente impossível garantir ao mesmo tempo Consistência Estrita (C) e Disponibilidade 100% (A). Assim nasceu a onda NoSQL, sacrificando o ACID rígido em prol de latência e escala horizontal; seguida pelo NewSQL, que domesticou o consenso com relógios atômicos
            <CitationBadge sourceId="corbett-spanner-2012" onSelectSource={onSelectSource} />; e culminando hoje nos Bancos Vetoriais, onde os dados não são linhas de texto, mas coordenadas semânticas no hiperespaço da Inteligência Artificial
            <CitationBadge sourceId="malkov-hnsw-2018" onSelectSource={onSelectSource} />.
          </p>
        </div>

        {/* Interactive Paradigm Matrix Filter */}
        <div className="mt-12 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Table className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Matriz Comparativa da Evolução dos Bancos de Dados
              </h3>
              <p className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                Filtre os paradigmas para inspecionar trade-offs de consistência, estruturas internas e casos de uso ideais.
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 font-sans text-xs">
              {paradigms.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedParadigm(p.key)}
                  className={`px-3 py-1.5 rounded-md border transition-all cursor-pointer whitespace-nowrap ${
                    selectedParadigm === p.key
                      ? 'bg-white dark:bg-stone-800 border-indigo-600 dark:border-indigo-400 text-stone-900 dark:text-stone-100 font-medium shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Matrix Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 font-sans text-xs">
            {filteredModels.map((model) => (
              <div
                key={model.id}
                onClick={() => setActiveModelModal(model)}
                className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-800/80 hover:border-indigo-500/60 dark:hover:border-indigo-400/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-stone-500 dark:text-stone-400 pb-2 border-b border-stone-100 dark:border-stone-700/60">
                    <span className="font-mono text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{model.era}</span>
                    <span className="text-[11px] uppercase tracking-wider">{model.paradigm}</span>
                  </div>

                  <h4 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mt-2">
                    {model.paradigm}
                  </h4>

                  <p className="text-stone-600 dark:text-stone-300 mt-1.5 leading-relaxed text-xs">
                    {model.coreConcept}
                  </p>

                  <div className="mt-3 space-y-1.5 text-[11px] text-stone-500 dark:text-stone-400">
                    <div>
                      <strong className="text-stone-700 dark:text-stone-300 font-medium">Consistência:</strong> {model.consistencyModel}
                    </div>
                    <div>
                      <strong className="text-stone-700 dark:text-stone-300 font-medium">Estrutura Interna:</strong> {model.dataStructure}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-700/60 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {model.representativeTech.slice(0, 3).map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 text-[10px] font-mono border border-stone-200 dark:border-stone-700"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400 text-[11px] font-medium hover:underline">
                    Ver detalhes &rarr;
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Special Focus Box: Why Vector DBs don't use B+ Trees */}
          <div className="mt-6 p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60 text-xs font-sans">
            <div className="flex items-center gap-2 font-semibold text-indigo-900 dark:text-indigo-300 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Por que a Árvore B+ falha catastroficamente na Busca Vetorial da IA?</span>
            </div>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
              Árvores B+ pressupõem uma <strong>ordem linear unidimensional</strong> (<code className="font-mono text-xs">A &lt; B &lt; C</code> ou <code className="font-mono text-xs">1 &lt; 2 &lt; 3</code>). No entanto, um embedding gerado por um modelo de IA (como Gemini ou OpenAI) possui 768 ou 1536 dimensões. Nesse espaço hiperdimensional ocorre a <em>&ldquo;Maldição da Dimensionalidade&rdquo;</em>: todos os pontos ficam quase equidistantes uns dos outros e o particionamento em árvore colapsa em varredura total. A solução moderna é o algoritmo <strong className="font-medium text-stone-900 dark:text-stone-100">HNSW (Hierarchical Navigable Small World)</strong>, que cria autoestradas de navegação em grafos para encontrar os vizinhos mais próximos em tempo submilisegundo.
            </p>
          </div>
        </div>

        {/* Modal for detailed inspection of a database paradigm */}
        {activeModelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
            <div className="w-full max-w-xl bg-[#FAF8F5] dark:bg-[#15171C] border border-stone-300 dark:border-stone-700 rounded-xl p-6 shadow-2xl text-stone-900 dark:text-stone-100 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
                <div>
                  <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 font-semibold">{activeModelModal.era}</span>
                  <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">{activeModelModal.paradigm}</h3>
                </div>
                <button
                  onClick={() => setActiveModelModal(null)}
                  className="p-1 rounded text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-4 space-y-3 text-xs leading-relaxed">
                <div>
                  <strong className="text-stone-800 dark:text-stone-200 block text-xs uppercase tracking-wider mb-0.5">Conceito Central:</strong>
                  <p className="text-stone-600 dark:text-stone-400">{activeModelModal.coreConcept}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-2.5 rounded bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block text-[10px] uppercase">Garantia de Consistência</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{activeModelModal.consistencyModel}</span>
                  </div>
                  <div className="p-2.5 rounded bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 block text-[10px] uppercase">Estrutura de Armazenamento</span>
                    <span className="font-semibold text-stone-900 dark:text-stone-100">{activeModelModal.dataStructure}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <strong className="text-emerald-700 dark:text-emerald-400 block text-xs uppercase tracking-wider mb-0.5">Cenário Ideal de Uso:</strong>
                  <p className="text-stone-600 dark:text-stone-400">{activeModelModal.bestFor}</p>
                </div>

                <div className="pt-2">
                  <strong className="text-rose-700 dark:text-rose-400 block text-xs uppercase tracking-wider mb-0.5">Ponto Fraco & Limitações:</strong>
                  <p className="text-stone-600 dark:text-stone-400">{activeModelModal.weakness}</p>
                </div>

                <div className="pt-2">
                  <strong className="text-stone-800 dark:text-stone-200 block text-xs uppercase tracking-wider mb-1">Motores de Referência:</strong>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModelModal.representativeTech.map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 font-mono text-indigo-700 dark:text-indigo-300">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 text-right">
                <button
                  onClick={() => setActiveModelModal(null)}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors cursor-pointer"
                >
                  Concluir Leitura
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
