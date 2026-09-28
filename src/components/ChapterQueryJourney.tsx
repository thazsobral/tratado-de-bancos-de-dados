import React, { useState } from 'react';
import { Cpu, Database, Play, Sparkles, Server, HardDrive, Check, ArrowRight, CornerDownRight, Zap } from 'lucide-react';
import { CitationBadge } from './CitationBadge';

interface QueryPreset {
  id: string;
  name: string;
  sql: string;
  tokens: string[];
  astSummary: string;
  plans: {
    name: string;
    cost: number;
    diskIO: string;
    chosen: boolean;
    reason: string;
  }[];
  bufferPoolScenario: {
    pageRequested: string;
    cacheHit: boolean;
    ramLatency: string;
    diskLatency: string;
    detail: string;
  };
}

interface ChapterQueryJourneyProps {
  onSelectSource: (sourceId: string) => void;
}

export const ChapterQueryJourney: React.FC<ChapterQueryJourneyProps> = ({ onSelectSource }) => {
  const queryPresets: QueryPreset[] = [
    {
      id: 'q1',
      name: 'Busca por ID Único',
      sql: 'SELECT nome, saldo FROM clientes WHERE id = 42;',
      tokens: ['SELECT', 'nome', ',', 'saldo', 'FROM', 'clientes', 'WHERE', 'id', '=', '42', ';'],
      astSummary: 'SelectStmt(target: [nome, saldo], from: clientes, qual: [id = 42])',
      plans: [
        {
          name: 'Seq Scan (Varredura Sequencial)',
          cost: 1420.5,
          diskIO: '10.000 páginas lidas',
          chosen: false,
          reason: 'Custo altíssimo: precisaria ler a tabela inteira do primeiro ao último byte.',
        },
        {
          name: 'Index Scan via Árvore B+ (idx_clientes_id)',
          cost: 3.15,
          diskIO: '2 páginas lidas (Raiz -> Folha)',
          chosen: true,
          reason: 'Custo mínimo: busca logarítmica direta com apenas 2 saltos de página.',
        },
      ],
      bufferPoolScenario: {
        pageRequested: 'Page #402 (Bloco de Dados do Registro 42)',
        cacheHit: true,
        ramLatency: '85 nanosegundos',
        diskLatency: '0 ms (Evitado!)',
        detail: 'Página já residia no Buffer Pool da RAM. Retorno instantâneo sem encostar no disco!',
      },
    },
    {
      id: 'q2',
      name: 'Filtro por Faixa de Valores',
      sql: 'SELECT * FROM transacoes WHERE valor > 5000.00;',
      tokens: ['SELECT', '*', 'FROM', 'transacoes', 'WHERE', 'valor', '>', '5000.00', ';'],
      astSummary: 'SelectStmt(target: [*], from: transacoes, qual: [valor > 5000.00])',
      plans: [
        {
          name: 'Bitmap Index Scan (idx_valor)',
          cost: 210.8,
          diskIO: '45 páginas filtradas',
          chosen: true,
          reason: 'Constrói um bitmap em memória dos ponteiros das tuplas e busca os blocos em ordem física contígua.',
        },
        {
          name: 'Seq Scan direto em disco',
          cost: 3890.0,
          diskIO: '25.000 páginas lidas',
          chosen: false,
          reason: 'Descartado: a seletividade estimada indica que apenas 2% das linhas atendem ao critério.',
        },
      ],
      bufferPoolScenario: {
        pageRequested: 'Page #1108 (Bloco de Índices de Valor)',
        cacheHit: false,
        ramLatency: '100 ns',
        diskLatency: '1.2 milissegundos (Leitura SSD)',
        detail: 'Cache Miss! O motor realizou I/O de disco para carregar a página na RAM e desalojou a página menos usada (LRU).',
      },
    },
    {
      id: 'q3',
      name: 'Atualização Transacional com WAL',
      sql: "UPDATE pedidos SET status = 'PAGO' WHERE id = 1042;",
      tokens: ['UPDATE', 'pedidos', 'SET', 'status', '=', "'PAGO'", 'WHERE', 'id', '=', '1042', ';'],
      astSummary: "UpdateStmt(table: pedidos, target: status='PAGO', qual: [id = 1042])",
      plans: [
        {
          name: 'Index Update com Gravação no WAL',
          cost: 4.8,
          diskIO: '1 append sequencial no log',
          chosen: true,
          reason: 'Localiza a linha via índice B+, altera na RAM (dirty page) e adiciona 1 registro no WAL para garantir durabilidade.',
        },
      ],
      bufferPoolScenario: {
        pageRequested: 'Page #8920 (Buffer Frame sujo marcado como DIRTY)',
        cacheHit: true,
        ramLatency: '120 ns',
        diskLatency: '0.4 ms (Escrita sequencial no WAL via fsync)',
        detail: 'A página na RAM torna-se suja (Dirty). O banco NÃO regrava a tabela inteira no disco agora; o bgwriter fará isso em lote.',
      },
    },
  ];

  const [selectedPreset, setSelectedPreset] = useState<QueryPreset>(queryPresets[0]);
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    { title: '1. Lexer & Parser', icon: Sparkles, desc: 'Gramática e Árvore AST' },
    { title: '2. Otimizador CBO', icon: Cpu, desc: 'Cálculo de Custo & I/O' },
    { title: '3. Buffer Pool (RAM)', icon: Database, desc: 'Cache de Páginas 4KB/8KB' },
    { title: '4. Hierarquia Física', icon: HardDrive, desc: 'O Abismo das Latências' },
  ];

  return (
    <section id="capitulo-query" className="py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Subtitle */}
        <div className="text-xs uppercase tracking-widest font-sans text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
          Capítulo Segundo
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          Por Baixo do Capô: A Jornada de uma Query e o Buffer Pool
        </h2>

        <p className="mt-4 text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-indigo-600/40 dark:border-indigo-400/40 pl-4 py-1">
          &ldquo;Quando você digita SELECT, o banco não é um leitor apressado que vasculha pastas: ele é uma refinaria industrial que traduz texto em código de máquina, pondera custos de hardware e trava uma batalha milimétrica contra a física do disco.&rdquo;
        </p>

        {/* Narrative Prose */}
        <div className="mt-8 space-y-6 text-stone-800 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed text-justify">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-indigo-700 dark:first-letter:text-indigo-400">
            A linguagem SQL, padronizada internacionalmente pelo comitê ISO/IEC
            <CitationBadge sourceId="iso-sql-2023" onSelectSource={onSelectSource} />,
            é essencialmente <em className="italic">declarativa</em>. Ao escrever uma consulta, o engenheiro de software expressa com clareza <strong className="font-semibold text-stone-900 dark:text-stone-100">o que</strong> deseja obter, mas não dita <strong className="font-semibold text-stone-900 dark:text-stone-100">como</strong> o motor deve percorrê-lo no silício.
          </p>

          <p>
            Essa separação entre o reino lógico e a realidade física é responsabilidade do <strong className="font-semibold text-stone-900 dark:text-stone-100">Pipeline de Processamento de Consultas</strong>. Entre o recebimento do pacote TCP na porta 5432 (ou 3306) e a entrega das linhas resultantes, a consulta atravessa quatro câmaras de transformação.
          </p>
        </div>

        {/* Interactive Query Journey Explorer */}
        <div className="mt-12 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs">
          <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Simulador Interativo: A Jornada de Execução da Consulta
            </h3>
            <p className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-1">
              Escolha uma instrução SQL abaixo e avance pelas fases internas do motor de banco de dados.
            </p>

            {/* Presets Segmented Selector */}
            <div className="flex flex-wrap gap-2 mt-4 font-sans text-xs">
              {queryPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setActiveStep(0);
                  }}
                  className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                    selectedPreset.id === preset.id
                      ? 'bg-white dark:bg-stone-800 border-indigo-600 dark:border-indigo-400 text-stone-900 dark:text-stone-100 font-medium shadow-xs'
                      : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-400'
                  }`}
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Current SQL Code Display */}
            <div className="mt-3 p-3 rounded-lg bg-stone-950 font-mono text-xs sm:text-sm text-indigo-300 border border-stone-800 flex items-center justify-between">
              <code>{selectedPreset.sql}</code>
            </div>
          </div>

          {/* Stepper Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-6 font-sans text-xs">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-stone-800 border-indigo-600 dark:border-indigo-400 shadow-xs'
                      : 'bg-white/50 dark:bg-stone-900/30 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1 font-semibold text-stone-900 dark:text-stone-100">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-stone-400'}`} />
                    <span>{s.title}</span>
                  </div>
                  <div className="text-[11px] text-stone-500 truncate">{s.desc}</div>
                </button>
              );
            })}
          </div>

          {/* Step Detail Card */}
          <div className="p-5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-800/80 font-sans">
            {activeStep === 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200 dark:border-stone-700">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Estágio 1: Análise Léxica & Sintática (Parser)</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Tempo: ~15 µs</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  O texto bruto da query é desmembrado em uma sequência de símbolos léxicos (<code className="font-mono text-xs">Tokens</code>) e estruturado em uma Árvore de Sintaxe Abstrata (<code className="font-mono text-xs">AST</code>) que valida a gramática antes de consultar o catálogo.
                </p>

                {/* Tokens visualization */}
                <div>
                  <span className="text-xs uppercase text-stone-500 tracking-wider block mb-1.5">Tokens Identificados pelo Lexer:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPreset.tokens.map((token, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-xs font-mono bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
                      >
                        {token}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-700 text-xs font-mono text-stone-700 dark:text-stone-300">
                  <span className="text-stone-400 block mb-1">// Árvore Sintática Abstrata (AST) Gerada:</span>
                  {selectedPreset.astSummary}
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200 dark:border-stone-700">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                    <span>Estágio 2: Otimizador Baseado em Custo (CBO) & Modelo Volcano</span>
                    <CitationBadge sourceId="selinger-1979" onSelectSource={onSelectSource} />
                    <CitationBadge sourceId="graefe-volcano-1994" onSelectSource={onSelectSource} />
                  </div>
                  <span className="text-indigo-600 dark:text-indigo-400">Tempo: ~40 µs</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  O otimizador avalia a tabela de estatísticas (<code className="font-mono text-xs">pg_stats</code> / histogramas de distribuição) para estimar quantas páginas de disco serão lidas e quantos ciclos de CPU serão consumidos em cada estratégia de busca, baseado no algoritmo formulado no projeto System R da IBM. A árvore física resultante executa pelo modelo iterador Volcano (<code className="font-mono text-xs">open()</code>, <code className="font-mono text-xs">next()</code>, <code className="font-mono text-xs">close()</code>).
                </p>

                <div className="space-y-3">
                  {selectedPreset.plans.map((plan, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-lg border text-xs ${
                        plan.chosen
                          ? 'border-emerald-500/80 bg-emerald-50/40 dark:bg-emerald-950/20 text-stone-900 dark:text-stone-100'
                          : 'border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/40 opacity-75'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-1">
                        <span className="flex items-center gap-1.5">
                          {plan.chosen ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px]">PLANO ESCOLHIDO</span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px]">DESCARTADO</span>
                          )}
                          {plan.name}
                        </span>
                        <span className="font-mono tabular-nums text-xs">Custo Estimado: {plan.cost.toFixed(1)}</span>
                      </div>
                      <div className="text-stone-600 dark:text-stone-400 mt-1">
                        <strong>Estimativa de I/O:</strong> {plan.diskIO}
                      </div>
                      <div className="text-stone-500 dark:text-stone-400 mt-0.5 italic">
                        {plan.reason}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200 dark:border-stone-700">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Estágio 3: Buffer Pool & Gerenciador de Páginas</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Páginas de 8KB (PostgreSQL) / 16KB (MySQL InnoDB)</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  Os bancos não leem registros isolados do disco: eles trabalham exclusivamente com <strong>páginas completas</strong> carregadas na memória RAM (<code className="font-mono text-xs">Buffer Pool</code>).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-xs space-y-1.5">
                    <span className="text-stone-500 uppercase tracking-wider block text-[10px]">Página Solicitada</span>
                    <div className="font-mono font-semibold text-stone-900 dark:text-stone-100">{selectedPreset.bufferPoolScenario.pageRequested}</div>
                    <div className="pt-2 flex items-center gap-2">
                      <span className="text-stone-500">Resultado no Cache:</span>
                      {selectedPreset.bufferPoolScenario.cacheHit ? (
                        <span className="px-2 py-0.5 rounded font-semibold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[11px]">
                          ⚡ CACHE HIT (RAM)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded font-semibold bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[11px]">
                          ⏳ CACHE MISS (DISCO)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 text-xs space-y-1.5">
                    <span className="text-stone-500 uppercase tracking-wider block text-[10px]">Métricas de Latência de Acesso</span>
                    <div className="flex justify-between">
                      <span className="text-stone-600 dark:text-stone-400">Latência na RAM:</span>
                      <span className="font-mono font-semibold text-indigo-600 dark:text-indigo-400">{selectedPreset.bufferPoolScenario.ramLatency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-600 dark:text-stone-400">Latência de I/O em Disco:</span>
                      <span className="font-mono font-semibold text-stone-900 dark:text-stone-100">{selectedPreset.bufferPoolScenario.diskLatency}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800 text-xs text-stone-700 dark:text-stone-300">
                  <span className="font-semibold text-indigo-800 dark:text-indigo-300 block mb-0.5">Diagnóstico da Operação:</span>
                  {selectedPreset.bufferPoolScenario.detail}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200 dark:border-stone-700">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">Estágio 4: A Física do Hardware — O Abismo das Latências</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Regra de Ouro: Evite I/O Aleatório</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  Para compreender a obsessão dos arquitetos de banco de dados com índices e memória RAM, observe a escala de tempo real se 1 ciclo de CPU equivalesse a 1 segundo humano:
                </p>

                {/* Latency Comparison Table */}
                <div className="overflow-x-auto text-xs">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-stone-200 dark:border-stone-700 text-left text-stone-500 uppercase tracking-wider text-[10px]">
                        <th className="py-2 pr-3">Camada Física</th>
                        <th className="py-2 pr-3">Tempo Real</th>
                        <th className="py-2 pr-3">Escala Humana Proporcional</th>
                        <th className="py-2">Impacto no SGBD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 dark:divide-stone-800 text-stone-800 dark:text-stone-300 font-mono">
                      <tr>
                        <td className="py-2 pr-3 font-sans font-medium">Registrador da CPU</td>
                        <td className="py-2 pr-3 text-indigo-600 dark:text-indigo-400">0.5 ns</td>
                        <td className="py-2 pr-3 font-sans">1 batimento cardíaco (1s)</td>
                        <td className="py-2 font-sans text-stone-500">Cálculos aritméticos e filtros</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans font-medium">Cache L1 / L2</td>
                        <td className="py-2 pr-3 text-indigo-600 dark:text-indigo-400">1 – 4 ns</td>
                        <td className="py-2 pr-3 font-sans">Tomar um gole de café (5s)</td>
                        <td className="py-2 font-sans text-stone-500">Hash tables locais</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-3 font-sans font-medium">Memória Principal (RAM)</td>
                        <td className="py-2 pr-3 text-indigo-600 dark:text-indigo-400">100 ns</td>
                        <td className="py-2 pr-3 font-sans">Caminhar até a esquina (3 min)</td>
                        <td className="py-2 font-sans text-stone-500">Buffer Pool / Índice em RAM</td>
                      </tr>
                      <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                        <td className="py-2 pr-3 font-sans font-semibold text-amber-700 dark:text-amber-400">SSD NVMe (Flash)</td>
                        <td className="py-2 pr-3 text-amber-700 dark:text-amber-400">100.000 ns (100 µs)</td>
                        <td className="py-2 pr-3 font-sans font-medium">Viagem de avião a Paris (2 dias)</td>
                        <td className="py-2 font-sans text-stone-500">Leitura de bloco frio do banco</td>
                      </tr>
                      <tr className="bg-rose-50/50 dark:bg-rose-950/20">
                        <td className="py-2 pr-3 font-sans font-semibold text-rose-700 dark:text-rose-400">HDD Mecânico (Seek)</td>
                        <td className="py-2 pr-3 text-rose-700 dark:text-rose-400">10.000.000 ns (10 ms)</td>
                        <td className="py-2 pr-3 font-sans font-medium">Viagem de caravela no século XVI (6 meses)</td>
                        <td className="py-2 font-sans text-stone-500">Pior pesadelo: Full Table Scan em disco</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-stone-500 italic mt-2">
                  * Moral da história: Realizar um único acesso desnecessário ao disco equivale a fazer a CPU esperar meses na escala humana. É por essa razão que existem as Árvores B+.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
