# Tratado Ilustrado de Bancos de Dados
> Um compêndio digital, interativo e fundamentado sobre a arquitetura interna, evolução histórica e funcionamento de baixo nível dos Sistemas de Gerenciamento de Bancos de Dados (SGBDs).

---

## 📖 Visão Geral

O **Tratado Ilustrado de Bancos de Dados** é uma plataforma educacional imersiva projetada para transformar conceitos abstratos de engenharia de software e persistência de dados em experiências didáticas, visuais e manipuláveis.

Com estética de livro técnico clássico (estilo editorial em papel alabastro e nanquim, tipografia *Newsreader* e *Cinzel* e controle estrito de paleta), a obra guia o leitor desde as falhas de integridade dos arquivos de texto plano dos anos 1960 até os grafos de alta dimensão dos bancos vetoriais modernos para Inteligência Artificial.

---

## 🎯 Objetivos Instrucionais & Didática

1. **Desmistificar a Caixa Preta:** Revelar o que acontece entre o envio de um comando SQL na porta 5432/3306 e a gravação física dos bits no disco magnético ou flash NAND.
2. **Equilíbrio entre Intuição e Rigor:** Oferecer analogias do cotidiano (bibliotecas, livros-caixa, carimbos de cartório) sem abrir mão de fórmulas matemáticas ($O(\log n)$, $O(n)$, Teorema CAP, incerteza de relógios TrueTime $\epsilon < 7\text{ms}$ e chamadas POSIX de sistema como `fsync()`).
3. **Aprendizado Prático por Simulação:** Permitir que o engenheiro injete falhas de energia, execute varreduras de tabelas, altere balanceamento de nós e compare custos de rede em tempo real.

---

## 🗺️ Estrutura da Obra

### 📜 Prólogo — O Caos do Sistema de Arquivos
- **Conteúdo:** As limitações intrínsecas dos arquivos `.csv` e texto plano (redundância de dados, anomalias de escrita concorrente, dependência do programa em relação ao formato físico).
- **Simulador Interativo:** *Laboratório da Concorrência*. Compare a execução de débitos simultâneos em um arquivo plano ingênuo (*Lost Update* e corrupção por falta de luz) contra um SGBD com isolamento e transações.

### 🏛️ Capítulo I — O Altar do ACID e as Leis da Confiabilidade
- **Conteúdo:** A dissecação aprofundada de **Atomicidade**, **Consistência**, **Isolamento** e **Durabilidade**. Os 4 níveis de isolamento ANSI SQL e o protocolo 2-Phase Locking (2PL) versus MVCC (*Multi-Version Concurrency Control*).
- **Simulador Interativo:** *Transferência Bancária com Injeção de Falhas*. Observe a emissão atômica de entradas no Write-Ahead Log (WAL) e a reversão instantânea (*Rollback*) via Undo-Log.

### ⚙️ Capítulo II — Por Baixo do Capô: A Jornada de uma Query e o Buffer Pool
- **Conteúdo:** O pipeline de compilação da consulta (Lexer $\rightarrow$ AST $\rightarrow$ Otimizador Baseado em Custo $\rightarrow$ Motor Volcano de Execução). A hierarquia de latência física (Registradores 0.5ns vs RAM 100ns vs SSD NVMe 100µs vs HDD 10ms) e o gerenciamento de páginas no Buffer Pool (Cache Hit vs Cache Miss e *dirty pages*).
- **Simulador Interativo:** *Rastreamento de Execução de SQL*. Selecione queries e visualize seus tokens, árvore sintática, planos comparativos de custo e acesso a páginas de memória.

### 🌳 Capítulo III — O Segredo da Velocidade: Árvores B+ e Indexação
- **Conteúdo:** Por que árvores binárias balanceadas (AVL / Red-Black) falham catastroficamente em disco (*fan-out* baixo e altura excessiva). A anatomia da Árvore B+: nós internos puramente roteadores e folhas duplamente encadeadas ($\leftrightarrow$).
- **Simulador Interativo:** *B+ Tree vs Table Scan*. Busque qualquer ID de 1 a 90 e compare visualmente o número de saltos de bloco de disco ($O(\log n)$ com 3 leituras vs $O(n)$ com dezenas de blocos lidos). Inclui modo de busca por faixa de valores (*Range Scan* via `BETWEEN`).

### 🧬 Capítulo IV — A Árvore Genealógica: Dos Anos 60 aos Vetores da IA
- **Conteúdo:** Evolução cronológica: Hierárquico (IBM IMS), Redes (CODASYL), a Revolução Relacional de Edgar F. Codd (1970), a explosão NoSQL nos anos 2000 (Chave-Valor, Documentos, Wide-Column, Grafos), NewSQL com consenso distribuído (Google Spanner/CockroachDB) e Bancos Vetoriais para LLMs/IA (HNSW e embeddings).
- **Recurso Interativo:** *Matriz Comparativa de Paradigmas*. Tabela filtrável com modelos de consistência, trade-offs do Teorema CAP, estruturas de dados internas e motores de referência.

### 🌐 Capítulo V — A Escala Planetária: Sharding e MapReduce
- **Conteúdo:** Escalabilidade vertical (*Scale-up*) versus horizontal (*Scale-out*). Fragmentação de dados por Hash Consistente. O axioma clássico do Big Data: *"Mover código de 5 KB até onde o dado está gravado, em vez de mover 12 GB de dados brutos pela rede saturada"*.
- **Simuladores Interativos:**
  1. *Distribuidor de Shards:* Adicione registros e visualize o cálculo determinístico `hash(key) % 3`.
  2. *Simulador de Tráfego de Rede MapReduce:* Compare a sobrecarga de switches em transferências centralizadas contra a execução paralela local.

### 📚 Epílogo, Glossário & Fontes Oficiais
- **Glossário Técnico Pesquisável:** Definições diretas e analogias didáticas para termos fundamentais (IOPS, WAL, ACID, B+ Tree, MVCC, CAP, HNSW, fsync).
- **Dossiê de 12 Fontes Primárias:** Consulta aos papers seminais e padrões internacionais com link direto para DOI, resumo acadêmico e caminho no código-fonte de projetos reais (PostgreSQL, SQLite, Linux Kernel).

---

## 🎓 Como Utilizar Este Projeto de Forma Profissional

O Tratado foi construído para servir a múltiplos contextos profissionais de tecnologia:

### 1. No Onboarding e Nivelamento Técnico de Equipes de Engenharia
- **Problema comum:** Desenvolvedores utilizam ORMs modernos (Prisma, Hibernate, Entity Framework, Drizzle) tratando o banco como um repositório transparente, gerando queries $N+1$, índices redundantes ou transações longas que travam tabelas.
- **Como aplicar:**
  - Utilize o **Capítulo II** e o **Capítulo III** para demonstrar o impacto do custo de I/O em disco.
  - Faça o time rodar o simulador de *Table Scan vs B+ Tree* para entender visualmente por que uma coluna filtrada em `WHERE` sem índice degrada a performance sob carga.
  - Demonstre a importância do `fsync` e do WAL para desmistificar o custo real de *commits* frequentes.

### 2. Em Cursos Universitários e Treinamentos Corporativos
- **Uso como Material Didático Principal ou Complementar:**
  - Os módulos cobrem exatamente as ementas padrão de disciplinas de **Sistemas de Bancos de Dados** e **Sistemas Distribuídos** (modelo relacional, formas normais, escalabilidade horizontal e ACID).
  - Os simuladores servem como laboratórios práticos pré-configurados que dispensam a instalação de instâncias locais de banco de dados para os alunos observarem comportamentos de baixo nível.

### 3. Em Discussões de Arquitetura de Software & Design Reviews
- **Seleção de Tecnologias (Trade-off Analysis):**
  - Utilize a **Matriz Comparativa do Capítulo IV** durante reuniões de arquitetura para fundamentar a escolha entre um banco relacional com ACID estrito (PostgreSQL), um repositório chave-valor in-memory (Redis), um cluster colunar para telemetria (Cassandra/ScyllaDB) ou um banco vetorial para RAG (pgvector/Pinecone).
  - O modal de fontes oficiais fornece citações acadêmicas e normas ISO/IEEE para embasar pareceres técnicos e RFCs (*Request for Comments*) empresariais.

### 4. Guia Rápido de Sessão de Estudo em Grupo (Tech Talks)
1. **Passo 1 (10 min):** Apresente o Prólogo e rode o *Laboratório da Concorrência*, demonstrando a anomalia do *Lost Update*.
2. **Passo 2 (15 min):** Explore o Capítulo I e mostre a atuação do WAL no simulador de transferência bancária com injeção de falhas.
3. **Passo 3 (15 min):** Abra o Capítulo III, selecione um ID e compare o caminho de execução da Árvore B+ com a varredura linear.
4. **Passo 4 (15 min):** No Capítulo V, execute a simulação de MapReduce para evidenciar a economia de banda de rede em processamento distribuído.
5. **Passo 5 (5 min):** Abra o modal de **Fontes Oficiais** para apontar onde o código estudado está implementado no PostgreSQL (`src/backend/access/nbtree/`, `src/backend/executor/execProcNode.c`).

---

## 📑 Embasamento Científico e Fontes Primárias

O projeto é embasado em 12 referências históricas e normativas da computação:

| Código de Citação | Autor(es) | Ano | Publicação / Norma | Conceito Fundamental |
| :--- | :--- | :--- | :--- | :--- |
| `[ACM CACM 1970]` | Edgar F. Codd | 1970 | Communications of the ACM | Modelo Relacional & Álgebra de Relações |
| `[Acta Inf. 1972]` | Rudolf Bayer, Edward M. McCreight | 1972 | Acta Informatica | Árvore B e Indexação em Memória Secundária |
| `[ACM SIGMOD 1979]` | Patricia Selinger et al. | 1979 | ACM SIGMOD | Otimizador de Consultas por Custo (CBO) |
| `[Gray & Reuter 1992]`| Jim Gray, Andreas Reuter | 1992 | Morgan Kaufmann | Definição Canônica do Teorema ACID e 2PL |
| `[ACM TODS 1992]` | C. Mohan et al. | 1992 | ACM Transactions on Database Systems | Algoritmo ARIES e Recuperação pós-falha com WAL |
| `[IEEE TKDE 1994]` | Goetz Graefe | 1994 | IEEE TKDE | Modelo de Execução Pipelined Volcano (Iterator) |
| `[USENIX OSDI 2004]` | Jeffrey Dean, Sanjay Ghemawat | 2004 | USENIX OSDI | Paradigma MapReduce (Computação Distribuída) |
| `[IEEE Computer 2012]`| Eric Brewer | 2012 | IEEE Computer | Teorema CAP e Sistemas Particionados |
| `[USENIX OSDI 2012]` | James C. Corbett et al. | 2012 | USENIX OSDI / Google Research | NewSQL, Paxos e Relógios Atômicos TrueTime |
| `[POSIX.1-2017]` | IEEE & The Open Group | 2017 | Padrão IEEE 1003.1 | Especificação formal de persistência `fsync()` |
| `[IEEE TPAMI 2018]` | Yury A. Malkov, Dmitry A. Yashunin | 2018 | IEEE TPAMI | Grafo HNSW para Bancos Vetoriais e Embeddings |
| `[ISO/IEC 9075:2023]`| ISO/IEC JTC 1/SC 32 | 2023 | Padrão Internacional ISO | Especificação da Linguagem SQL e SQL/PGQ |

---

## 🛠️ Stack Tecnológica

- **Core:** React 19, TypeScript
- **Bundler & Build Tool:** Vite 8
- **Estilização & Tema:** Tailwind CSS v4 (`@custom-variant dark`)
- **Ícones & Interface:** Lucide React
- **Tipografia:** Google Fonts (*Newsreader*, *Cinzel*, *Plus Jakarta Sans*, *JetBrains Mono*)
- **Performance:** Arquitetura 100% estática no cliente, sem requisições desnecessárias a servidores externos.

---

## 🚀 Instalação e Execução Local

### Pré-requisitos
- Node.js (versão 20 ou superior recomendada)
- Gerenciador de pacotes npm, yarn, pnpm ou bun

### Passos de Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/usuario/tratado-bancos-de-dados.git

# 2. Acesse a pasta do projeto
cd tratado-bancos-de-dados

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev

# 5. Abra no navegador
# Acesse http://localhost:3000
```

### Comandos de Verificação

```bash
# Executar verificação de tipos e lint
npm run lint

# Gerar build otimizada para produção
npm run build
```

---

## 🎨 Identidade Visual e Acessibilidade

- **Modo Claro (Papiro / Papel Alabastro):** Canvas aquecido (`#FAF8F5`), tipografia em carvão profundo (`#1C1917`) e bordas finas em traço à pena.
- **Modo Escuro (Ardósia Nanquim):** Fundo suave em tom carvão (`#121316`) com tipografia de alto contraste óptico (`#F5F5F4`), evitando saturações agressivas.
- **Acento Singular:** Azul Índigo Nanquim (`#2563EB` no claro, `#60A5FA` no escuro) aplicado exclusivamente a botões de ação e nós ativos de árvores.
- **Acessibilidade:** Conformidade WCAG AA com foco visível, elementos com suporte completo a leitores de tela (`aria-modal`, `role="progressbar"`) e responsividade integral para telas de celulares, tablets e desktops.

---

## 📜 Créditos e Licença

- **Nota de Inspiração:** Conteúdo didático inspirado no *“Roadmap de Aprendizado e Desmistificação de Bancos de Dados”*.
- **Rodapé Oficial:**
  > *Desenvolvido por ThazSobral para fins de Educação Tecnológica Prática e Interativa. © 2026 — Todos os direitos reservados.*
