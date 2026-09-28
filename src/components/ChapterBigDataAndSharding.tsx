import React, { useState } from 'react';
import { Share2, Server, Cpu, HardDrive, ArrowRight, Play, RefreshCw, Send, CheckCircle } from 'lucide-react';
import { CitationBadge } from './CitationBadge';

interface ShardRecord {
  id: string;
  key: string;
  hashVal: number;
  assignedNode: number;
  data: string;
}

interface ChapterBigDataAndShardingProps {
  onSelectSource: (sourceId: string) => void;
}

export const ChapterBigDataAndSharding: React.FC<ChapterBigDataAndShardingProps> = ({ onSelectSource }) => {
  // Sharding Simulator State
  const [newKey, setNewKey] = useState<string>('usuario_842');
  const [newData, setNewData] = useState<string>('Transação R$ 250,00');
  const [shardedRecords, setShardedRecords] = useState<ShardRecord[]>([
    { id: '1', key: 'cliente_101', hashVal: 489, assignedNode: 0, data: 'São Paulo - SP' },
    { id: '2', key: 'cliente_204', hashVal: 812, assignedNode: 1, data: 'Rio de Janeiro - RJ' },
    { id: '3', key: 'cliente_309', hashVal: 153, assignedNode: 2, data: 'Belo Horizonte - MG' },
    { id: '4', key: 'pedido_994', hashVal: 620, assignedNode: 1, data: 'Item: Livro de BD' },
    { id: '5', key: 'pedido_112', hashVal: 331, assignedNode: 0, data: 'Item: SSD NVMe' },
  ]);

  // MapReduce Simulator State
  const [mrMode, setMrMode] = useState<'naive' | 'mapreduce'>('mapreduce');
  const [mrRunning, setMrRunning] = useState<boolean>(false);
  const [networkTransferred, setNetworkTransferred] = useState<string>('0 MB');
  const [mrStepLog, setMrStepLog] = useState<string[]>([]);

  // Simple string hash function
  const simpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const handleAddShardRecord = () => {
    if (!newKey.trim()) return;
    const hash = simpleHash(newKey);
    const assigned = hash % 3; // 3 Nodes: 0, 1, 2
    const newRec: ShardRecord = {
      id: Date.now().toString(),
      key: newKey.trim(),
      hashVal: hash,
      assignedNode: assigned,
      data: newData.trim() || 'Payload genérico',
    };
    setShardedRecords([newRec, ...shardedRecords]);
    setNewKey(`item_${Math.floor(Math.random() * 900 + 100)}`);
  };

  const runNetworkSimulation = async (mode: 'naive' | 'mapreduce') => {
    setMrMode(mode);
    setMrRunning(true);
    setMrStepLog([]);
    const logs: string[] = [];

    if (mode === 'naive') {
      logs.push('🚀 [INÍCIO]: Solicitação de agregação global (Contagem de 100 Milhões de Vendas)');
      logs.push('📡 ABORDAGEM INGÊNUA: Mover todos os dados brutos dos nós periféricos para o Nó Mestre');
      setMrStepLog([...logs]);
      await new Promise((r) => setTimeout(r, 600));

      logs.push('⏳ Transferindo 4.000 MB do Nó 1 pela rede física...');
      setNetworkTransferred('4.000 MB');
      setMrStepLog([...logs]);
      await new Promise((r) => setTimeout(r, 700));

      logs.push('⏳ Transferindo 4.000 MB do Nó 2 pela rede física...');
      setNetworkTransferred('8.000 MB');
      setMrStepLog([...logs]);
      await new Promise((r) => setTimeout(r, 700));

      logs.push('⏳ Transferindo 4.000 MB do Nó 3 pela rede física...');
      setNetworkTransferred('12.000 MB (12 GB de tráfego!)');
      setMrStepLog([...logs]);
      await new Promise((r) => setTimeout(r, 700));

      logs.push('⚠️ GARGALO SEVERO: Placas de rede saturadas, latência de 14.8 segundos, switch sob alto consumo.');
      logs.push('🏁 Resultado final consolidado após transferir 12 GB de dados brutos inalterados.');
      setMrStepLog([...logs]);
    } else {
      logs.push('🚀 [INÍCIO]: Solicitação de agregação global via paradigma MapReduce');
      logs.push('⚡ PRINCÍPIO DE OURO: "Enviar o código (5 KB) até onde o dado está gravado"');
      setMrStepLog([...logs]);
      await new Promise((r) => setTimeout(r, 600));

      logs.push('📤 Despachando binário da função Map (5 KB) para os Nós 1, 2 e 3...');
      setNetworkTransferred('15 KB (Código despachado)');
      setMrStepLog([...logs]);
      await new Promise((r) => setTimeout(r, 700));

      logs.push('⚙️ FASE MAP LOCAL: Cada nó processa seus próprios blocos em paralelo no silício local (zero rede!).');
      setMrStepLog([...logs]);
      await new Promise((r) => setTimeout(r, 800));

      logs.push('📥 FASE REDUCE: Cada nó devolve apenas um único número inteiro (subtotal parcial de 8 bytes).');
      setNetworkTransferred('15.02 KB (Total transferido)');
      logs.push('✅ SUCESSO INSTANTÂNEO: Latência de apenas 180 ms. 99,999% de economia de banda de rede!');
      setMrStepLog([...logs]);
    }

    setMrRunning(false);
  };

  const nodeNames = [
    { id: 0, name: 'Nó Alfa (Shard 0)', color: 'border-indigo-500/40' },
    { id: 1, name: 'Nó Beta (Shard 1)', color: 'border-emerald-500/40' },
    { id: 2, name: 'Nó Gama (Shard 2)', color: 'border-amber-500/40' },
  ];

  return (
    <section id="capitulo-bigdata" className="py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Subtitle */}
        <div className="text-xs uppercase tracking-widest font-sans text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
          Capítulo Quinto
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          A Escala Planetária: Sharding e a Sabedoria do MapReduce
        </h2>

        <p className="mt-4 text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-indigo-600/40 dark:border-indigo-400/40 pl-4 py-1">
          &ldquo;Quando os dados superam a capacidade física de um único computador, você tem duas escolhas: comprar um servidor tão caro quanto um avião ou aprender a arte de dividir e conquistar em enxames de máquinas.&rdquo;
        </p>

        {/* Narrative Section */}
        <div className="mt-8 space-y-6 text-stone-800 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed text-justify">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-indigo-700 dark:first-letter:text-indigo-400">
            A escalabilidade vertical (<em className="italic">Scale-Up</em>) é tentadora: basta instalar processadores mais potentes e pentes adicionais de memória RAM no mesmo chassi. Entretanto, as leis da física e da economia cobram seu tributo: há um limite rígido de barramentos PCIe e slots DIMM, e o preço de um supercomputador cresce de forma hiperbólica.
          </p>

          <p>
            A alternativa inescapável é a escalabilidade horizontal (<em className="italic">Scale-Out</em>): distribuir centenas de terabytes por meio de clusters formados por dezenas ou centenas de servidores comuns. Mas como saber em qual máquina reside o dado de cada cliente sem precisar consultar todos os nós em todas as leituras?
          </p>

          <p>
            A resposta é o <strong className="font-semibold text-stone-900 dark:text-stone-100">Sharding</strong> (Particionamento Horizontal). Ao utilizar funções criptográficas ou de espalhamento sobre a chave primária (<code className="font-mono text-xs">hash(key) % N_nós</code>), qualquer cliente descobre deterministicamente em qual nó específico da rede a tupla foi gravada, sem intermediários centralizados.
          </p>
        </div>

        {/* Interactive Sharding Simulator */}
        <div className="mt-12 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs">
          <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
            <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Simulador Interativo de Sharding por Hash Consistente
            </h3>
            <p className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-0.5">
              Insira chaves de dados e veja a fórmula determinística calcular o destino exato no cluster de 3 nós.
            </p>

            {/* Input Row */}
            <div className="mt-4 flex flex-wrap items-center gap-3 font-sans text-xs">
              <div className="flex-1 min-w-[140px]">
                <label className="text-stone-500 text-[10px] uppercase block mb-1">Chave de Partição (Shard Key)</label>
                <input
                  type="text"
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-mono"
                  placeholder="ex: cliente_99"
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <label className="text-stone-500 text-[10px] uppercase block mb-1">Payload / Conteúdo</label>
                <input
                  type="text"
                  value={newData}
                  onChange={(e) => setNewData(e.target.value)}
                  className="w-full px-3 py-1.5 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  placeholder="ex: Saldo R$ 800"
                />
              </div>

              <button
                onClick={handleAddShardRecord}
                className="mt-5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap self-end"
              >
                <span>Distribuir no Cluster</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3 Nodes Representation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 font-sans text-xs">
            {nodeNames.map((node) => {
              const nodeRecords = shardedRecords.filter((r) => r.assignedNode === node.id);
              return (
                <div
                  key={node.id}
                  className={`p-4 rounded-lg border bg-white/90 dark:bg-stone-800/80 ${node.color} flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-700/60">
                      <div className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100">
                        <Server className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                        <span>{node.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-stone-500">
                        {nodeRecords.length} {nodeRecords.length === 1 ? 'tupla' : 'tuplas'}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2 max-h-40 overflow-y-auto">
                      {nodeRecords.length === 0 ? (
                        <div className="text-stone-400 dark:text-stone-500 italic text-[11px] py-4 text-center">
                          Aguardando particionamento...
                        </div>
                      ) : (
                        nodeRecords.map((rec) => (
                          <div
                            key={rec.id}
                            className="p-2 rounded bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-stone-700/60 text-[11px]"
                          >
                            <div className="font-mono font-semibold text-indigo-700 dark:text-indigo-300 truncate">
                              {rec.key}
                            </div>
                            <div className="text-stone-500 truncate text-[10px] mt-0.5">
                              {rec.data}
                            </div>
                            <div className="text-[9px] font-mono text-stone-400 mt-1">
                              hash({rec.key}) = {rec.hashVal} % 3 = {node.id}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MapReduce Principle Section */}
        <div className="mt-14 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs font-sans">
          <div className="pb-4 border-b border-stone-200 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                O Paradigma MapReduce: &ldquo;Envie o Código até o Dado&rdquo;
              </h3>
              <CitationBadge sourceId="dean-mapreduce-2004" onSelectSource={onSelectSource} />
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed">
              Em 2004, Jeffrey Dean e Sanjay Ghemawat revolucionaram o processamento de petabytes no Google ao enunciar um axioma pragmático no paper do simpósio OSDI:
              <em> A velocidade dos switches de rede é a parte mais lenta de um datacenter. Se você mover 10 Terabytes de dados até o programa, a rede colapsará. Mas se você enviar um programa de 50 Kilobytes até o disco rígido onde o dado já está gravado, o resultado é quase instantâneo.</em>
            </p>
          </div>

          {/* Interactive Network Efficiency Comparison */}
          <div className="my-5 flex flex-wrap items-center gap-3 text-xs">
            <button
              onClick={() => runNetworkSimulation('naive')}
              disabled={mrRunning}
              className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:border-stone-400 font-medium transition-colors cursor-pointer disabled:opacity-50 whitespace-nowrap"
            >
              Simular: Mover Dados Brutos (Ingênuo)
            </button>

            <button
              onClick={() => runNetworkSimulation('mapreduce')}
              disabled={mrRunning}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>Simular: MapReduce (&ldquo;Mover o Código&rdquo;)</span>
              <Send className="w-3.5 h-3.5" />
            </button>

            <div className="ml-auto text-xs text-stone-500">
              Tráfego de Rede Total: <strong className="text-stone-900 dark:text-stone-100 font-mono text-sm">{networkTransferred}</strong>
            </div>
          </div>

          {/* Execution Telemetry Terminal */}
          <div className="p-3.5 rounded-lg bg-stone-950 text-stone-200 font-mono text-xs leading-relaxed max-h-48 overflow-y-auto border border-stone-800">
            <div className="text-stone-500 pb-1 border-b border-stone-800 text-[11px] flex justify-between">
              <span>Tráfego no Switch de Datacenter</span>
              <span>Modo: {mrMode === 'naive' ? 'Transferência Centralizada de Arquivos' : 'MapReduce Distribuído (HDFS / Spark)'}</span>
            </div>
            <div className="pt-2 space-y-1">
              {mrStepLog.length === 0 ? (
                <span className="text-stone-600 italic">Clique em um dos botões acima para comparar o consumo de rede entre as duas abordagens.</span>
              ) : (
                mrStepLog.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.includes('GARGALO')
                        ? 'text-rose-400 font-semibold'
                        : log.includes('SUCESSO') || log.includes('PRINCÍPIO')
                          ? 'text-emerald-400 font-medium'
                          : 'text-stone-300'
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
