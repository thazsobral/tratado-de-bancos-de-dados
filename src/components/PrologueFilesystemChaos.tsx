import React, { useState } from 'react';
import { FileText, AlertTriangle, ShieldCheck, Zap, RefreshCw, Layers } from 'lucide-react';
import { CitationBadge } from './CitationBadge';

interface PrologueProps {
  onSelectSource: (sourceId: string) => void;
}

export const PrologueFilesystemChaos: React.FC<PrologueProps> = ({ onSelectSource }) => {
  const [simMode, setSimMode] = useState<'naive' | 'dbms'>('naive');
  const [balance, setBalance] = useState<number>(100);
  const [logMessages, setLogMessages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [fileCorrupted, setFileCorrupted] = useState<boolean>(false);

  const runConcurrentTransaction = async (withCrash: boolean = false) => {
    setIsRunning(true);
    setFileCorrupted(false);
    setLogMessages([]);
    
    const logs: string[] = [];
    const addLog = (msg: string) => {
      logs.push(msg);
      setLogMessages([...logs]);
    };

    if (simMode === 'naive') {
      addLog('▶ [Processo A & B]: Iniciando acesso simultâneo ao arquivo "contas.csv"...');
      await new Promise((r) => setTimeout(r, 400));
      
      addLog('📄 Processo A lê linha 1: Saldo atual = R$ 100,00');
      addLog('📄 Processo B lê linha 1: Saldo atual = R$ 100,00 (ambos leram o mesmo valor na RAM!)');
      await new Promise((r) => setTimeout(r, 600));

      addLog('⚙️ Processo A calcula: 100 - 50 = R$ 50,00');
      addLog('⚙️ Processo B calcula: 100 - 50 = R$ 50,00');
      await new Promise((r) => setTimeout(r, 500));

      if (withCrash) {
        addLog('⚡ FALHA DE ENERGIA CRÍTICA DURANTE O write() DO DISCO!');
        setFileCorrupted(true);
        addLog('❌ ERRO I/O: "contas.csv" corrompido! Bytes truncados. Perda total da integridade.');
        setBalance(NaN);
        setIsRunning(false);
        return;
      }

      addLog('💾 Processo A grava no disco: "saldo: 50.00" (fechou arquivo)');
      await new Promise((r) => setTimeout(r, 400));
      addLog('💾 Processo B grava no disco: "saldo: 50.00" (SOBRESCREVEU A sem saber!)');
      
      setBalance(50);
      addLog('⚠️ ANOMALIA "LOST UPDATE": Dois débitos de R$ 50 ocorreram, mas o saldo final é R$ 50 em vez de R$ 0! O banco perdeu R$ 50.');
    } else {
      addLog('🛡️ [SGBD com ACID]: Iniciando Transação T1 e T2 sob isolamento...');
      await new Promise((r) => setTimeout(r, 400));

      addLog('🔒 T1 adquire Exclusive Lock (X-Lock) no registro da Conta 1.');
      addLog('⏳ T2 tenta ler o registro: bloqueado pelo gerenciador de locks, aguarda na fila.');
      await new Promise((r) => setTimeout(r, 600));

      addLog('📝 T1 registra débito no WAL (Write-Ahead Log): Saldo 100 -> 50.');
      addLog('✅ T1 executa COMMIT e libera o Lock.');
      await new Promise((r) => setTimeout(r, 500));

      if (withCrash) {
        addLog('⚡ Falha de energia simulada logo após o crash!');
        addLog('🔄 SGBD reinicia: Recovery Engine lê o WAL e restaura o estado exato e consistente.');
        setBalance(50);
        addLog('🛡️ DURABILIDADE GARANTIDA: Zero bytes corrompidos.');
        setIsRunning(false);
        return;
      }

      addLog('🔓 T2 é desbloqueado e lê o dado atualizado: Saldo agora é R$ 50,00.');
      addLog('⚙️ T2 calcula: 50 - 50 = R$ 0,00. Registra no WAL.');
      addLog('✅ T2 executa COMMIT.');
      setBalance(0);
      addLog('🎯 SUCESSO: Saldo final exato R$ 0,00. Ambas as transações foram serializadas perfeitamente.');
    }
    setIsRunning(false);
  };

  const resetSim = () => {
    setBalance(100);
    setFileCorrupted(false);
    setLogMessages([]);
    setIsRunning(false);
  };

  return (
    <section id="prologo" className="py-16 sm:py-24 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Editorial Subtitle / Kicker */}
        <div className="text-xs uppercase tracking-widest font-sans text-indigo-700 dark:text-indigo-400 font-semibold mb-2">
          Prólogo Fundamental
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-medium text-stone-900 dark:text-stone-100 tracking-tight leading-tight">
          O Caos do Caderno e a Fragilidade dos Sistemas de Arquivos
        </h2>

        <p className="mt-4 text-base sm:text-lg font-serif italic text-stone-600 dark:text-stone-400 leading-relaxed border-l-2 border-indigo-600/40 dark:border-indigo-400/40 pl-4 py-1">
          &ldquo;Antes dos motores de banco de dados, a humanidade confiava a memória do mundo a arquivos de texto plano. O resultado era inevitável: duplicidades silenciosas, escritas fantasmas e o pânico de um fio puxado da tomada.&rdquo;
        </p>

        {/* Narrative Prose */}
        <div className="mt-8 space-y-6 text-stone-800 dark:text-stone-300 font-serif text-base sm:text-lg leading-relaxed text-justify">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-indigo-700 dark:first-letter:text-indigo-400">
            Imagine um armazém comercial nos primórdios da computação. Cada departamento possui seu próprio arquivo em fita ou disco magnético: o departamento de vendas mantém <code className="text-sm font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">clientes_vendas.txt</code>, enquanto o faturamento grava em <code className="text-sm font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">cobrancas.csv</code>. Quando um comprador muda de endereço, uma das cópias é atualizada e a outra permanece esquecida no passado. O sistema físico não tem consciência semântica; para o sistema operacional, um arquivo não passa de uma sequência cega de bytes.
          </p>

          <p>
            Essa abordagem rudimentar padece de cinco enfermidades letais para qualquer engenharia que almeje escala e confiabilidade:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 font-sans not-italic text-sm">
            <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40">
              <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                1. Redundância & Inconsistência
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-normal text-xs sm:text-sm">
                A mesma informação é duplicada em múltiplos pontos, gerando estados divergentes quando atualizada de maneira parcial.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40">
              <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                2. Dificuldade de Acesso Ad-Hoc
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-normal text-xs sm:text-sm">
                Para responder a uma nova pergunta de negócio (&ldquo;qual o total de compras acima de R$ 500 no último mês?&rdquo;), era obrigatório compilar um novo script em C ou Cobol para varrer o arquivo linha a linha.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40">
              <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                3. Anomalias de Concorrência
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-normal text-xs sm:text-sm">
                Se dois processos leem o arquivo simultaneamente e tentam alterar a mesma conta, o último que salvar sobrescreve o trabalho do primeiro (<em className="italic">Lost Update</em>), destruindo dinheiro digital.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/40">
              <span className="font-semibold text-stone-900 dark:text-stone-100 block mb-1">
                4. Corrupção por Falha Fisiológica
              </span>
              <p className="text-stone-600 dark:text-stone-400 leading-normal text-xs sm:text-sm">
                Uma chamada padrão de sistema como <code className="text-xs font-mono">write()</code> não garante que os dados tocaram o prato magnético ou a célula NAND. Um pique de luz no meio da operação deixa o arquivo truncado em estado ilegível sem a chamada explícita de persistência síncrona
                <CitationBadge sourceId="posix-fsync-2017" onSelectSource={onSelectSource} />.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Simulator: The Chaos of Flat Files vs DBMS */}
        <div className="mt-10 p-5 sm:p-7 rounded-xl border border-stone-300 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/50 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900 dark:text-stone-100">
                  Laboratório Didático: O Experimento da Concorrência
                </h3>
              </div>
              <p className="text-xs font-sans text-stone-500 dark:text-stone-400 mt-0.5">
                Simule dois débitos simultâneos de R$ 50 em uma conta que possui saldo inicial de R$ 100.
              </p>
            </div>

            {/* Architecture Mode Selector */}
            <div className="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-800 rounded-lg text-xs font-sans self-start sm:self-auto">
              <button
                onClick={() => { setSimMode('naive'); resetSim(); }}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  simMode === 'naive'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                Arquivo Plano (.txt / .csv)
              </button>
              <button
                onClick={() => { setSimMode('dbms'); resetSim(); }}
                className={`px-3 py-1.5 rounded font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  simMode === 'dbms'
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
                }`}
              >
                SGBD Transacional (ACID)
              </button>
            </div>
          </div>

          {/* Current State Display */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 font-sans">
            <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60">
              <span className="text-xs uppercase text-stone-500 dark:text-stone-400 tracking-wider">Saldo em Conta</span>
              <div className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100 mt-1 tabular-nums">
                {isNaN(balance) ? 'ARQUIVO CORROMPIDO' : `R$ ${balance.toFixed(2)}`}
              </div>
              <span className="text-xs text-stone-500 mt-0.5 block">Saldo inicial: R$ 100,00</span>
            </div>

            <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60">
              <span className="text-xs uppercase text-stone-500 dark:text-stone-400 tracking-wider">Operações em Fila</span>
              <div className="text-sm font-medium text-stone-800 dark:text-stone-200 mt-1.5 space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Processo A: Débito de R$ 50</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Pendente</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span>Processo B: Débito de R$ 50</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Pendente</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-lg border border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-800/60 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase text-stone-500 dark:text-stone-400 tracking-wider">Resultado Esperado</span>
                <div className="text-lg font-serif font-semibold text-stone-900 dark:text-stone-100 mt-1">
                  R$ 0,00
                </div>
              </div>
              <div className="text-xs text-stone-500">
                {simMode === 'naive' ? '⚠️ Alto risco de anomalia' : '🛡️ Consistência garantida'}
              </div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => runConcurrentTransaction(false)}
              disabled={isRunning}
              className="px-4 py-2 text-xs font-sans font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
            >
              {isRunning ? 'Executando Concorrência...' : 'Disparar Débitos Simultâneos'}
            </button>

            <button
              onClick={() => runConcurrentTransaction(true)}
              disabled={isRunning}
              className="px-3.5 py-2 text-xs font-sans font-medium text-stone-800 dark:text-stone-200 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Simular com Queda de Energia
            </button>

            <button
              onClick={resetSim}
              disabled={isRunning}
              className="px-3 py-2 text-xs font-sans text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors ml-auto cursor-pointer"
            >
              Restaurar
            </button>
          </div>

          {/* Execution Telemetry / Terminal Logs */}
          <div className="mt-4 p-3.5 rounded-lg bg-stone-950 text-stone-200 font-mono text-xs leading-relaxed max-h-48 overflow-y-auto border border-stone-800">
            <div className="text-stone-500 pb-1.5 border-b border-stone-800 flex items-center justify-between text-[11px]">
              <span>Console de Execução de Baixo Nível</span>
              <span>Modo: {simMode === 'naive' ? 'Sem Lock (OS Flat File)' : '2-Phase Locking + WAL'}</span>
            </div>
            <div className="pt-2 space-y-1">
              {logMessages.length === 0 ? (
                <span className="text-stone-600 italic">Clique em um dos botões acima para observar a jornada dos bytes no disco.</span>
              ) : (
                logMessages.map((msg, idx) => (
                  <div 
                    key={idx} 
                    className={
                      msg.includes('ANOMALIA') || msg.includes('ERRO') 
                        ? 'text-rose-400 font-semibold' 
                        : msg.includes('SUCESSO') || msg.includes('DURABILIDADE') 
                          ? 'text-emerald-400 font-semibold' 
                          : 'text-stone-300'
                    }
                  >
                    {msg}
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
