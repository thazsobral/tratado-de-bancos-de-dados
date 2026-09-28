import React, { useState } from 'react';
import { Network, Search, ArrowRight, Play, RotateCcw, ListFilter, Layers, Eye } from 'lucide-react';
import { CitationBadge } from './CitationBadge';

interface TreeNodeVisual {
  id: string;
  name: string;
  keys: number[];
  isLeaf: boolean;
  level: number;
  records?: { id: number; name: string }[];
}

interface ChapterBPlusTreeProps {
  onSelectSource: (sourceId: string) => void;
}

export const ChapterBPlusTree: React.FC<ChapterBPlusTreeProps> = ({ onSelectSource }) => {
  // B+ Tree structure for demonstration (keys from 1 to 90)
  // Root: [30, 60] -> 3 branches: [<30], [30-59], [>=60]
  // Level 1:
  //   Child 1: [10, 20] -> Leaves: [1-9], [10-19], [20-29]
  //   Child 2: [40, 50] -> Leaves: [30-39], [40-49], [50-59]
  //   Child 3: [70, 80] -> Leaves: [60-69], [70-79], [80-90]
  
  const [targetId, setTargetId] = useState<number>(45);
  const [searchMode, setSearchMode] = useState<'bplus' | 'scan' | 'range'>('bplus');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [ioOperations, setIoOperations] = useState<number>(0);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [resultFound, setResultFound] = useState<string | null>(null);

  // Range Search limits
  const [rangeStart, setRangeStart] = useState<number>(25);
  const [rangeEnd, setRangeEnd] = useState<number>(55);
  const [rangeMatchedIds, setRangeMatchedIds] = useState<number[]>([]);

  // Sample leaf pages data
  const leafPages: Record<string, { id: number; name: string }[]> = {
    'leaf-1': [{ id: 4, name: 'Alice Silva' }, { id: 7, name: 'Bob Souza' }, { id: 9, name: 'Carlos Lima' }],
    'leaf-2': [{ id: 12, name: 'Diana Rocha' }, { id: 15, name: 'Eduardo Vaz' }, { id: 18, name: 'Fernanda Dias' }],
    'leaf-3': [{ id: 22, name: 'Gustavo Reis' }, { id: 25, name: 'Helena Pires' }, { id: 28, name: 'Igor Santos' }],
    'leaf-4': [{ id: 32, name: 'Julia Martins' }, { id: 35, name: 'Kleber Nogueira' }, { id: 38, name: 'Laura Ramos' }],
    'leaf-5': [{ id: 42, name: 'Marcos Costa' }, { id: 45, name: 'Natalia Melo' }, { id: 48, name: 'Otavio Faria' }],
    'leaf-6': [{ id: 51, name: 'Paula Mendes' }, { id: 54, name: 'Quirino Leite' }, { id: 58, name: 'Rafael Castro' }],
    'leaf-7': [{ id: 62, name: 'Sabrina Cruz' }, { id: 65, name: 'Tiago Neves' }, { id: 69, name: 'Ursula Brandão' }],
    'leaf-8': [{ id: 72, name: 'Valter Prado' }, { id: 75, name: 'Wagner Lopes' }, { id: 78, name: 'Xavier Paiva' }],
    'leaf-9': [{ id: 82, name: 'Yara Alencar' }, { id: 85, name: 'Zeca Moreira' }, { id: 90, name: 'Álvaro Guimarães' }],
  };

  // Flattened dataset for Table Scan simulation (90 elements total simulation)
  const totalRecordsInTable = 90;

  const runBPlusSearch = async (key: number) => {
    setIsSearching(true);
    setVisitedNodes([]);
    setResultFound(null);
    setIoOperations(0);

    // Step 1: Root Node
    setVisitedNodes(['root']);
    setIoOperations(1);
    await new Promise((r) => setTimeout(r, 600));

    // Step 2: Internal Routing Node
    let internalNode = '';
    let leafNode = '';

    if (key < 30) {
      internalNode = 'internal-1';
      if (key < 10) leafNode = 'leaf-1';
      else if (key < 20) leafNode = 'leaf-2';
      else leafNode = 'leaf-3';
    } else if (key < 60) {
      internalNode = 'internal-2';
      if (key < 40) leafNode = 'leaf-4';
      else if (key < 50) leafNode = 'leaf-5';
      else leafNode = 'leaf-6';
    } else {
      internalNode = 'internal-3';
      if (key < 70) leafNode = 'leaf-7';
      else if (key < 80) leafNode = 'leaf-8';
      else leafNode = 'leaf-9';
    }

    setVisitedNodes(['root', internalNode]);
    setIoOperations(2);
    await new Promise((r) => setTimeout(r, 600));

    // Step 3: Leaf Node
    setVisitedNodes(['root', internalNode, leafNode]);
    setIoOperations(3);
    await new Promise((r) => setTimeout(r, 600));

    // Check match
    const recordsInLeaf = leafPages[leafNode] || [];
    const matched = recordsInLeaf.find((rec) => rec.id === key);
    if (matched) {
      setResultFound(`Registro encontrado no Bloco ${leafNode}: [ID ${matched.id}] ${matched.name}`);
    } else {
      setResultFound(`Chave ID ${key} não encontrada no índice (Folha examinada: ${leafNode}).`);
    }
    setIsSearching(false);
  };

  const runTableScan = async (key: number) => {
    setIsSearching(true);
    setVisitedNodes([]);
    setResultFound(null);
    setIoOperations(0);
    setScanProgress(0);

    const targetPos = Math.min(Math.max(key, 1), totalRecordsInTable);
    
    // Animate sequential scan
    for (let current = 1; current <= targetPos; current += 3) {
      setScanProgress(current);
      setIoOperations(current);
      await new Promise((r) => setTimeout(r, 30));
    }

    setScanProgress(targetPos);
    setIoOperations(targetPos);

    // Look up
    let found = false;
    for (const [leafName, recs] of Object.entries(leafPages)) {
      const match = recs.find((r) => r.id === key);
      if (match) {
        setResultFound(`Varredura concluída! Registro encontrado na posição ${targetPos}: [ID ${match.id}] ${match.name}`);
        found = true;
        break;
      }
    }
    if (!found) {
      setResultFound(`Varredura concluída após percorrer todas as ${targetPos} páginas. Chave ID ${key} não existe.`);
    }

    setIsSearching(false);
  };

  const runRangeScan = async () => {
    setIsSearching(true);
    setVisitedNodes([]);
    setResultFound(null);
    setRangeMatchedIds([]);

    // Step 1: Find start leaf in B+ Tree (Root -> Internal -> Leaf)
    setVisitedNodes(['root']);
    setIoOperations(1);
    await new Promise((r) => setTimeout(r, 500));

    let startInternal = rangeStart < 30 ? 'internal-1' : rangeStart < 60 ? 'internal-2' : 'internal-3';
    setVisitedNodes(['root', startInternal]);
    setIoOperations(2);
    await new Promise((r) => setTimeout(r, 500));

    // Determine initial leaf
    let initialLeafIndex = 1;
    if (rangeStart < 10) initialLeafIndex = 1;
    else if (rangeStart < 20) initialLeafIndex = 2;
    else if (rangeStart < 30) initialLeafIndex = 3;
    else if (rangeStart < 40) initialLeafIndex = 4;
    else if (rangeStart < 50) initialLeafIndex = 5;
    else if (rangeStart < 60) initialLeafIndex = 6;
    else if (rangeStart < 70) initialLeafIndex = 7;
    else if (rangeStart < 80) initialLeafIndex = 8;
    else initialLeafIndex = 9;

    const matchedList: number[] = [];
    const visitedLeaves: string[] = ['root', startInternal];

    // Traverse linked leaf list horizontally
    for (let l = initialLeafIndex; l <= 9; l++) {
      const leafKey = `leaf-${l}`;
      visitedLeaves.push(leafKey);
      setVisitedNodes([...visitedLeaves]);
      setIoOperations(visitedLeaves.length);
      await new Promise((r) => setTimeout(r, 400));

      const pageRecs = leafPages[leafKey] || [];
      for (const rec of pageRecs) {
        if (rec.id >= rangeStart && rec.id <= rangeEnd) {
          matchedList.push(rec.id);
          setRangeMatchedIds([...matchedList]);
        }
      }

      const maxInLeaf = pageRecs[pageRecs.length - 1]?.id || 0;
      if (maxInLeaf >= rangeEnd) {
        break; // Reached end of range!
      }
    }

    setResultFound(`Busca por Faixa concluída! ${matchedList.length} registros capturados caminhando horizontalmente pelos ponteiros da lista de folhas.`);
    setIsSearching(false);
  };

  const handleReset = () => {
    setVisitedNodes([]);
    setResultFound(null);
    setIoOperations(0);
    setScanProgress(0);
    setRangeMatchedIds([]);
    setIsSearching(false);
  };

  return (
    <section id="capitulo-bplus" className="py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Subtitle */}
        <div className="text-xs uppercase tracking-widest font-sans text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
          Capítulo Terceiro
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          O Segredo da Velocidade: Árvores B+ e Indexação
        </h2>

        <p className="mt-4 text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-indigo-600/40 dark:border-indigo-400/40 pl-4 py-1">
          &ldquo;Como localizar uma única página entre um bilhão de registros sem ler um megabyte a mais do que o estritamente necessário? A resposta é a mais elegante estrutura da ciência da computação.&rdquo;
        </p>

        {/* Narrative Section */}
        <div className="mt-8 space-y-6 text-stone-800 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed text-justify">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-indigo-700 dark:first-letter:text-indigo-400">
            A intuição natural de qualquer estudante de algoritmos seria usar uma Árvore Binária de Busca equilibrada (como uma AVL ou Rubro-Negra). Em memória RAM, elas são esplêndidas: oferecem complexidade <span className="font-mono text-xs">O(log₂ n)</span>. Contudo, no momento em que transferimos essa estrutura para o disco rígido magnético ou SSD, ela se torna uma catástrofe de engenharia.
          </p>

          <p>
            Uma árvore binária possui um fator de ramificação (<em className="italic">fan-out</em>) de apenas 2. Para indexar 1 bilhão de registros, a árvore atinge uma altura de <span className="font-mono text-xs">log₂(10⁹) ≈ 30 níveis</span>. Como cada nó residiria em um bloco distinto de disco, buscar uma chave exigiria 30 operações de I/O aleatório. No caso de discos mecânicos, isso equivaleria a <span className="font-mono text-xs">30 × 10ms = 300ms</span> de espera para uma única busca!
          </p>

          <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-sm font-sans not-italic space-y-2 my-6">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                A Solução Genial de Rudolf Bayer & Edward M. McCreight: A Árvore B+ (B-Plus Tree)
              </span>
              <CitationBadge sourceId="bayer-mccreight-1972" onSelectSource={onSelectSource} />
            </div>
            <ul className="space-y-1.5 text-stone-600 dark:text-stone-400 text-xs sm:text-sm list-disc pl-5">
              <li><strong>Fan-out massivo:</strong> Em vez de 2 filhos, cada nó tem o tamanho exato de uma página de disco (4KB ou 8KB), abrigando centenas ou milhares de chaves roteadoras por nó.</li>
              <li><strong>Altura microscópica:</strong> Com fan-out de 100, uma árvore de apenas 3 níveis indexa 1.000.000 de chaves (<span className="font-mono text-xs">100³</span>). Com altura 4, indexa 100 milhões!</li>
              <li><strong>Nós internos são meras placas de trânsito:</strong> Não guardam dados de tuplas; apenas chaves e ponteiros de navegação.</li>
              <li><strong>Folhas duplamente encadeadas:</strong> Todas as folhas no nível inferior são ligadas entre si por ponteiros horizontais (<code className="font-mono text-xs">prev &harr; next</code>). Consultas por intervalo (<code className="font-mono text-xs">BETWEEN</code>) nunca precisam subir de volta na árvore!</li>
            </ul>
          </div>
        </div>

        {/* Interactive B+ Tree Simulator */}
        <div className="mt-12 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 gap-3">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Network className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Simulador Interativo: B+ Tree vs Table Scan
              </h3>
              <p className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                Observe a disparidade de saltos de I/O em disco entre busca ramificada e varredura linear.
              </p>
            </div>

            {/* Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-800 rounded-lg text-xs font-sans">
              <button
                onClick={() => { setSearchMode('bplus'); handleReset(); }}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  searchMode === 'bplus'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Busca B+ Tree O(log n)
              </button>
              <button
                onClick={() => { setSearchMode('scan'); handleReset(); }}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  searchMode === 'scan'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Table Scan O(n)
              </button>
              <button
                onClick={() => { setSearchMode('range'); handleReset(); }}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  searchMode === 'range'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Range Query (Between)
              </button>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="my-5 flex flex-wrap items-center gap-4 text-xs font-sans">
            {searchMode !== 'range' ? (
              <div className="flex items-center gap-2">
                <label className="text-stone-600 dark:text-stone-400">ID para Busca (1 a 90):</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={targetId}
                  onChange={(e) => setTargetId(Number(e.target.value))}
                  disabled={isSearching}
                  className="w-16 px-2 py-1 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-center"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-stone-600 dark:text-stone-400">Intervalo WHERE id BETWEEN:</span>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={rangeStart}
                  onChange={(e) => setRangeStart(Number(e.target.value))}
                  disabled={isSearching}
                  className="w-14 px-2 py-1 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-center"
                />
                <span className="text-stone-400">E</span>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={rangeEnd}
                  onChange={(e) => setRangeEnd(Number(e.target.value))}
                  disabled={isSearching}
                  className="w-14 px-2 py-1 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono text-center"
                />
              </div>
            )}

            <button
              onClick={() => {
                if (searchMode === 'bplus') runBPlusSearch(targetId);
                else if (searchMode === 'scan') runTableScan(targetId);
                else runRangeScan();
              }}
              disabled={isSearching}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ml-auto"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isSearching ? 'Executando...' : 'Iniciar Busca'}</span>
            </button>

            <button
              onClick={handleReset}
              disabled={isSearching}
              className="p-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors cursor-pointer"
              title="Resetar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Telemetry Indicator */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-sans text-xs">
            <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60">
              <span className="text-stone-500 text-[10px] uppercase tracking-wider block">Leituras de Bloco (I/O)</span>
              <span className="text-xl font-bold font-mono text-stone-900 dark:text-stone-100 tabular-nums">
                {ioOperations} {ioOperations === 1 ? 'bloco' : 'blocos'}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60">
              <span className="text-stone-500 text-[10px] uppercase tracking-wider block">Complexidade</span>
              <span className="text-base font-semibold font-mono text-indigo-600 dark:text-indigo-400">
                {searchMode === 'bplus' ? 'O(log n)' : searchMode === 'scan' ? 'O(n)' : 'O(log n + k)'}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60 sm:col-span-2">
              <span className="text-stone-500 text-[10px] uppercase tracking-wider block">Status do Algoritmo</span>
              <span className="text-xs font-sans text-stone-800 dark:text-stone-200 font-medium truncate block mt-0.5">
                {resultFound ? resultFound : isSearching ? 'Varrendo ponteiros de página...' : 'Pronto para execução.'}
              </span>
            </div>
          </div>

          {/* Graphical Tree Display */}
          <div className="p-4 sm:p-6 rounded-lg bg-stone-900 text-stone-100 border border-stone-800 font-mono text-xs overflow-x-auto">
            {searchMode !== 'scan' ? (
              <div className="min-w-[560px] space-y-6 py-2">
                {/* Level 0: Root */}
                <div className="flex flex-col items-center">
                  <div className="text-[10px] uppercase text-stone-400 mb-1 font-sans">Nó Raiz (Root Page #01)</div>
                  <div
                    className={`px-4 py-2 rounded border text-center transition-all duration-300 ${
                      visitedNodes.includes('root')
                        ? 'border-indigo-400 bg-indigo-950/80 text-indigo-200 ring-2 ring-indigo-500/50 scale-105'
                        : 'border-stone-700 bg-stone-800/80 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span>[&lt; 30]</span>
                      <strong className="text-indigo-400 px-1.5 py-0.5 bg-stone-900 rounded border border-stone-700">30</strong>
                      <span>[30-59]</span>
                      <strong className="text-indigo-400 px-1.5 py-0.5 bg-stone-900 rounded border border-stone-700">60</strong>
                      <span>[&ge; 60]</span>
                    </div>
                  </div>
                  <div className="w-px h-6 bg-stone-700 my-1"></div>
                </div>

                {/* Level 1: Internal Routing Nodes */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'internal-1', label: 'Roteador A [<30]', keys: [10, 20] },
                    { id: 'internal-2', label: 'Roteador B [30-59]', keys: [40, 50] },
                    { id: 'internal-3', label: 'Roteador C [≥60]', keys: [70, 80] },
                  ].map((node) => (
                    <div key={node.id} className="flex flex-col items-center">
                      <div className="text-[10px] text-stone-400 mb-1 font-sans">{node.label}</div>
                      <div
                        className={`w-full py-2 px-2 rounded border text-center transition-all duration-300 text-[11px] ${
                          visitedNodes.includes(node.id)
                            ? 'border-indigo-400 bg-indigo-950/80 text-indigo-200 ring-2 ring-indigo-500/50 scale-105'
                            : 'border-stone-700 bg-stone-800/80 text-stone-300'
                        }`}
                      >
                        <div className="flex justify-center items-center gap-1.5">
                          <span>[{node.keys[0]}]</span>
                          <span className="text-stone-500">|</span>
                          <span>[{node.keys[1]}]</span>
                        </div>
                      </div>
                      <div className="w-px h-4 bg-stone-700 my-1"></div>
                    </div>
                  ))}
                </div>

                {/* Level 2: Linked Leaf Nodes (Double Linked List) */}
                <div>
                  <div className="text-[10px] uppercase text-stone-400 mb-2 text-center font-sans">
                    Nível de Folhas (Dados Reais / Tuplas) — Encadeamento Horizontal Duplo (&harr;)
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-[10px]">
                    {Object.entries(leafPages).map(([leafKey, recs], idx) => {
                      const isVisited = visitedNodes.includes(leafKey);
                      const hasRangeMatch = recs.some((r) => rangeMatchedIds.includes(r.id));
                      return (
                        <div
                          key={leafKey}
                          className={`p-1.5 rounded border text-center transition-all duration-300 flex flex-col justify-between ${
                            hasRangeMatch
                              ? 'border-emerald-400 bg-emerald-950/80 text-emerald-200 ring-2 ring-emerald-500/50'
                              : isVisited
                                ? 'border-indigo-400 bg-indigo-950/80 text-indigo-200 ring-2 ring-indigo-500/50'
                                : 'border-stone-800 bg-stone-850 text-stone-400'
                          }`}
                        >
                          <div className="font-sans font-semibold text-[9px] text-stone-400 mb-1">
                            Pág #{idx + 1}
                          </div>
                          <div className="space-y-0.5">
                            {recs.map((r) => (
                              <div
                                key={r.id}
                                className={`rounded px-1 py-0.5 ${
                                  r.id === targetId && searchMode === 'bplus' && isVisited
                                    ? 'bg-indigo-600 text-white font-bold'
                                    : rangeMatchedIds.includes(r.id)
                                      ? 'bg-emerald-600 text-white font-bold'
                                      : 'bg-stone-900/60'
                                }`}
                              >
                                ID {r.id}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Sequential Table Scan View */
              <div className="space-y-4 py-2">
                <div className="flex items-center justify-between text-xs text-stone-400 font-sans">
                  <span>Progresso do Full Table Scan (Leitura Linear em Disco):</span>
                  <span>{scanProgress} / {totalRecordsInTable} blocos lidos</span>
                </div>

                <div className="w-full bg-stone-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full transition-all duration-75"
                    style={{ width: `${(scanProgress / totalRecordsInTable) * 100}%` }}
                  ></div>
                </div>

                <div className="grid grid-cols-6 sm:grid-cols-10 gap-1 text-[10px] max-h-48 overflow-y-auto p-1">
                  {Array.from({ length: totalRecordsInTable }, (_, i) => i + 1).map((id) => (
                    <div
                      key={id}
                      className={`p-1 text-center rounded border transition-colors ${
                        id === targetId && scanProgress >= id
                          ? 'bg-emerald-600 border-emerald-400 text-white font-bold'
                          : id <= scanProgress
                            ? 'bg-rose-950/70 border-rose-800 text-rose-300'
                            : 'bg-stone-800/40 border-stone-800 text-stone-600'
                      }`}
                    >
                      #{id}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
