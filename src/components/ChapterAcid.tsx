import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, RotateCcw, Lock, Database, ArrowRight, HardDrive } from 'lucide-react';
import { CitationBadge } from './CitationBadge';

interface ChapterAcidProps {
  onSelectSource: (sourceId: string) => void;
}

export const ChapterAcid: React.FC<ChapterAcidProps> = ({ onSelectSource }) => {
  const [activeTab, setActiveTab] = useState<'A' | 'C' | 'I' | 'D'>('A');

  // Interactive Transfer Simulator State
  const [accountA, setAccountA] = useState<number>(200);
  const [accountB, setAccountB] = useState<number>(50);
  const [transferAmount, setTransferAmount] = useState<number>(100);
  const [simStep, setSimStep] = useState<number>(0);
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'success' | 'rollback'>('idle');
  const [failAtStep, setFailAtStep] = useState<boolean>(false);
  const [walLogs, setWalLogs] = useState<string[]>([]);

  const handleRunTransfer = async () => {
    setSimStatus('running');
    setSimStep(1);
    const logs = ['[BEGIN TRANSACTION]: Atribuído TXID #8902'];
    setWalLogs([...logs]);
    await new Promise((r) => setTimeout(r, 600));

    // Step 1: Debitar A
    setSimStep(2);
    logs.push('[WAL APPEND]: Debit Conta A (Saldo: 200 -> 100)');
    setWalLogs([...logs]);
    setAccountA(100);
    await new Promise((r) => setTimeout(r, 700));

    // Check if failure is simulated
    if (failAtStep) {
      setSimStep(3);
      logs.push('❌ [CRASH SIMULADO]: Queda de conexão de rede antes de creditar Conta B!');
      setWalLogs([...logs]);
      await new Promise((r) => setTimeout(r, 800));

      logs.push('🔄 [ROLLBACK ATÔMICO]: Lendo Undo-Log do WAL para reverter débitos não-comitados...');
      setWalLogs([...logs]);
      await new Promise((r) => setTimeout(r, 700));

      setAccountA(200);
      logs.push('🛡️ [ESTADO RESTAURADO]: Conta A restaurada para R$ 200,00. Nenhuma moeda perdida.');
      setWalLogs([...logs]);
      setSimStatus('rollback');
      return;
    }

    // Step 2: Creditar B
    setSimStep(4);
    logs.push('[WAL APPEND]: Credit Conta B (Saldo: 50 -> 150)');
    setWalLogs([...logs]);
    setAccountB(150);
    await new Promise((r) => setTimeout(r, 700));

    // Step 3: Commit
    setSimStep(5);
    logs.push('[FSYNC FLUSH]: WAL forçado para disco físico');
    logs.push('✅ [COMMIT]: Transação finalizada com sucesso');
    setWalLogs([...logs]);
    setSimStatus('success');
  };

  const handleResetTransfer = () => {
    setAccountA(200);
    setAccountB(50);
    setSimStep(0);
    setSimStatus('idle');
    setWalLogs([]);
  };

  return (
    <section id="capitulo-acid" className="py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Subtitle */}
        <div className="text-xs uppercase tracking-widest font-sans text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
          Capítulo Primeiro
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          O Altar do ACID e as Leis da Confiabilidade
        </h2>

        <p className="mt-4 text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-indigo-600/40 dark:border-indigo-400/40 pl-4 py-1">
          &ldquo;Para que a civilização confiasse seu ouro e seus contratos a pulsos eletromagnéticos, foi necessário formular um pacto inegociável de quatro mandamentos.&rdquo;
        </p>

        {/* Narrative Section */}
        <div className="mt-8 space-y-6 text-stone-800 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed text-justify">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-indigo-700 dark:first-letter:text-indigo-400">
            Em 1983, os cientistas da computação Jim Gray e Andreas Reuter sintetizaram formalmente o acrônimo <strong className="font-semibold text-stone-900 dark:text-stone-100">ACID</strong>
            <CitationBadge sourceId="gray-reuter-1992" onSelectSource={onSelectSource} />. Mais do que uma cartilha de boas práticas, o ACID é a fundação teórica que transforma um punhado de transistores e blocos de armazenamento voláteis em uma fortaleza de consistência matemática inabalável.
          </p>

          <p>
            Sem essas garantias, uma transação financeira poderia evaporar dinheiro se o servidor reiniciasse entre o débito e o crédito; dois clientes em fusos horários distintos poderiam reservar a mesma poltrona de avião simultaneamente; e um relatório corporativo poderia ler dados fantasmas gravados pela metade.
          </p>
        </div>

        {/* ACID Pillar Selector Tabs */}
        <div className="mt-10 border border-stone-300 dark:border-stone-800 rounded-xl overflow-hidden bg-white dark:bg-stone-900/60 shadow-xs">
          <div className="grid grid-cols-4 border-b border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-900 text-xs sm:text-sm font-sans font-medium">
            {[
              { key: 'A', name: 'Atomicidade', sub: 'Tudo ou Nada' },
              { key: 'C', name: 'Consistência', sub: 'Invariantes de Estado' },
              { key: 'I', name: 'Isolamento', sub: 'Concorrência Segura' },
              { key: 'D', name: 'Durabilidade', sub: 'Escrito em Pedra' },
            ].map((pillar) => (
              <button
                key={pillar.key}
                onClick={() => setActiveTab(pillar.key as any)}
                className={`py-3 sm:py-4 px-2 sm:px-4 text-center transition-colors cursor-pointer border-r border-stone-200 dark:border-stone-800 last:border-r-0 ${
                  activeTab === pillar.key
                    ? 'bg-white dark:bg-stone-800 text-indigo-700 dark:text-indigo-400 font-semibold border-b-2 border-b-indigo-600 dark:border-b-indigo-400'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                <div className="text-base sm:text-lg font-serif font-bold">{pillar.key}</div>
                <div className="hidden sm:block text-xs">{pillar.name}</div>
              </button>
            ))}
          </div>

          {/* Pillar Details Content */}
          <div className="p-6 sm:p-8 font-serif">
            {activeTab === 'A' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="w-4 h-4" />
                  Atomicidade — O Princípio da Indivisibilidade
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
                  A transação não admite meios-termos: ou tudo triunfa, ou nada existiu.
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  Uma transação pode envolver centenas de operações aritméticas, inserções e atualizações em múltiplas tabelas. Para o mundo exterior, ela deve se manifestar como um único átomo indivisível.
                </p>
                <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-sm font-sans not-italic space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                      Mecanismo Interno: Algoritmo ARIES & Write-Ahead Logging (WAL)
                    </span>
                    <CitationBadge sourceId="mohan-aries-1992" onSelectSource={onSelectSource} />
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm">
                    Antes de qualquer alteração ser escrita nas páginas de dados na memória RAM, o motor grava uma nota sequencial no arquivo de log contendo o valor antigo (para permitir reversão imediata caso ocorra um <code className="font-mono text-xs">ROLLBACK</code>) e o novo valor pretendido, seguindo as 3 fases formais do ARIES: <em>Analysis</em>, <em>Redo</em> e <em>Undo</em>.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'C' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Consistência — A Fidelidade às Leis da Realidade
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
                  De um estado válido para outro estado estritamente válido.
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  O banco de dados é um guardião de contratos. Nenhuma transação pode violar as regras de integridade declaradas no esquema: restrições de chave estrangeira (<code className="font-mono text-xs">FOREIGN KEY</code>), valores únicos (<code className="font-mono text-xs">UNIQUE</code>) ou invariantes de negócio (<code className="font-mono text-xs">CHECK saldo &gt;= 0</code>).
                </p>
                <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-sm font-sans not-italic space-y-2">
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                    Analogia: As Leis da Termodinâmica Contábil
                  </span>
                  <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm">
                    Em uma transferência bancária entre Alice e Bob, a soma total do dinheiro no sistema antes da operação deve ser exatamente idêntica à soma total após a transação. O dinheiro não pode ser criado do vácuo nem aniquilado.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'I' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                  <Lock className="w-4 h-4" />
                  Isolamento — A Serenidade em Meio à Multidão
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
                  Transações paralelas operam como se estivessem em universo exclusivo.
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  Milhares de conexões simultâneas disparam leituras e escritas nos mesmos dados. O motor de banco de dados cria uma barreira temporal que impede que uma transação testemunhe os rascunhos inacabados de outra transação.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans not-italic mt-3">
                  <div className="p-3 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">2-Phase Locking (2PL)</span>
                    <span className="text-stone-500 dark:text-stone-400">Abordagem pessimista tradicional: bloqueia a leitura ou escrita do registro com travas na memória.</span>
                  </div>
                  <div className="p-3 rounded border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/40">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">MVCC (Multi-Version)</span>
                    <span className="text-stone-500 dark:text-stone-400">Abordagem moderna (Postgres, InnoDB): cada linha possui versões com carimbo de tempo. Leitores nunca bloqueiam escritores!</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'D' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest font-sans font-semibold text-indigo-600 dark:text-indigo-400">
                  <HardDrive className="w-4 h-4" />
                  Durabilidade — O Registro Esculpido em Pedra
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-medium text-stone-900 dark:text-stone-100">
                  Uma vez retornado o COMMIT, os dados sobrevivem a qualquer colapso.
                </h3>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed">
                  Quando o cliente recebe a confirmação de sucesso de uma transação, o banco assume a responsabilidade de que, mesmo se os geradores da sala de servidores explodirem um milissegundo depois, o dado persistirá intacto na reinicialização.
                </p>
                <div className="p-4 rounded-lg bg-stone-100 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 text-sm font-sans not-italic space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 block">
                      O Custo Físico do <code className="font-mono text-xs">fsync()</code> (Norma POSIX)
                    </span>
                    <CitationBadge sourceId="posix-fsync-2017" onSelectSource={onSelectSource} />
                  </div>
                  <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm">
                    Para garantir durabilidade sem a lentidão de reescrever megabytes de tabelas, o banco apenas força a gravação do registro sequencial do WAL através da syscall POSIX <code className="font-mono text-xs">fsync()</code>. Isso contorna o cache volátil do disco rígido e o grava fisicamente em meio não-volátil.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Interactive Transfer Simulator */}
        <div className="mt-12 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Database className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Simulador de Transação Bancária & Rollback Atômico
              </h3>
              <p className="text-xs font-sans text-stone-500 dark:text-stone-400">
                Transfira R$ 100,00 da Conta de Alice para a Conta de Bob com salvaguardas de WAL.
              </p>
            </div>
            
            {/* Toggle failure simulation */}
            <label className="flex items-center gap-2 text-xs font-sans text-stone-700 dark:text-stone-300 cursor-pointer self-start sm:self-auto bg-stone-200/60 dark:bg-stone-800 px-3 py-1.5 rounded-md">
              <input
                type="checkbox"
                checked={failAtStep}
                onChange={(e) => setFailAtStep(e.target.checked)}
                disabled={simStatus === 'running'}
                className="rounded accent-indigo-600"
              />
              <span>Injetar falha de rede/energia</span>
            </label>
          </div>

          {/* Accounts Card Visualizer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 font-sans">
            <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-800/80">
              <span className="text-xs uppercase text-stone-500 dark:text-stone-400 tracking-wider">Conta de Alice (Origem)</span>
              <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
                R$ {accountA.toFixed(2)}
              </div>
              <div className="text-xs text-stone-500 mt-1 flex items-center justify-between">
                <span>Invariante: Saldo &ge; 0</span>
                {simStep >= 2 && simStatus !== 'rollback' && (
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">- R$ 100,00</span>
                )}
              </div>
            </div>

            <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/90 dark:bg-stone-800/80">
              <span className="text-xs uppercase text-stone-500 dark:text-stone-400 tracking-wider">Conta de Bob (Destino)</span>
              <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
                R$ {accountB.toFixed(2)}
              </div>
              <div className="text-xs text-stone-500 mt-1 flex items-center justify-between">
                <span>Status da Conta: Regular</span>
                {simStep >= 4 && (
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">+ R$ 100,00</span>
                )}
              </div>
            </div>
          </div>

          {/* Transfer Flow Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunTransfer}
              disabled={simStatus === 'running'}
              className="px-4 py-2 text-xs font-sans font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <span>{simStatus === 'running' ? 'Executando Transação...' : 'Executar BEGIN ... COMMIT'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleResetTransfer}
              disabled={simStatus === 'running'}
              className="px-3 py-2 text-xs font-sans text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restaurar Saldos
            </button>
          </div>

          {/* WAL Append Stream */}
          <div className="mt-4 p-3.5 rounded-lg bg-stone-950 text-stone-200 font-mono text-xs leading-relaxed max-h-40 overflow-y-auto border border-stone-800">
            <div className="text-stone-500 pb-1 border-b border-stone-800 text-[11px] flex justify-between">
              <span>Write-Ahead Log (WAL) Append Stream</span>
              <span>Modo: WAL Serial com Undo-Log</span>
            </div>
            <div className="pt-2 space-y-1">
              {walLogs.length === 0 ? (
                <span className="text-stone-600 italic">O log sequencial está em espera. Clique em executar para observar as entradas atômicas.</span>
              ) : (
                walLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.includes('CRASH')
                        ? 'text-rose-400 font-semibold'
                        : log.includes('ROLLBACK') || log.includes('RESTAURADO')
                          ? 'text-amber-400 font-medium'
                          : log.includes('COMMIT')
                            ? 'text-emerald-400 font-semibold'
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
