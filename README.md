# CodeGrid — Laboratório de Lógica e Algoritmos

Projeto Prático desenvolvido na disciplina **GAC126 – Programação Aplicada com Suporte de IA (PASIA)**, ministrada pelo Prof. Julio César Alves (DAC/ICET – Universidade Federal de Lavras).

---

## 1. Descrição Geral e Objetivos

O **CodeGrid** é um jogo educativo web 2D projetado para introduzir **lógica de programação básica a jovens de 15 a 18 anos** sem contato prévio com desenvolvimento de software.

Iniciantes frequentemente enfrentam duas barreiras: a frustração precoce com erros de sintaxe (como ponto e vírgula, parênteses ou indentação) e o desinteresse por ferramentas excessivamente infantilizadas. Para resolver isso, o projeto adota uma estética tecnológica de operação de robótica/estação espacial combinada com uma **abordagem pedagógica híbrida**:

- **Montagem sem barreiras de sintaxe:** O jogador constrói o algoritmo clicando em blocos visuais de instrução (`mover()`, `virar_esquerda()`, `virar_direita()`).
- **Espelhamento de código em tempo real:** Um painel lateral traduz os blocos instantaneamente para código equivalente (sintaxe inspirada em Python) e destaca linha por linha durante a execução, familiarizando o estudante com a leitura de código real.
- **Diagnóstico didático:** Ao encontrar uma parede, sair dos limites do mapa ou deixar de coletar um núcleo de energia, a execução para na instrução exata da falha e explica o motivo em linguagem clara.

---

## 2. Principais Funcionalidades

### Implementadas (Fase 1 — MVP Jogável)
- **Tabuleiro Gráfico Interativo (`<canvas>`):** Renderização 2D proporcional de pisos, barreiras, núcleos de energia coletáveis, portal de saída (que se ativa somente após a coleta de todos os núcleos) e robô com indicador visual de orientação (`NORTE`, `SUL`, `LESTE`, `OESTE`).
- **Construção e Edição de Algoritmos:** Adição e remoção individual de comandos na fila de execução, com contador e limite máximo de blocos por fase para incentivar a otimização da solução.
- **Visor de Código Espelhado:** Geração dinâmica do código equivalente em Python com destaque visual sincronizado à instrução em execução.
- **Modos de Execução Flexíveis:** Execução contínua com controle de velocidade (*Lenta*, *Normal*, *Rápida*), execução **Passo a Passo** para depuração manual e botão de **Resetar**.
- **Progressão de Fases e Dicas Contextuais:** 4 fases iniciais cobrindo sequência lógica, orientação espacial, subobjetivos (coleta) e planejamento de rota, acompanhadas de dicas pedagógicas sob demanda.

### Planejadas (Fase 2)
- Laços de repetição (`repita(N)`).
- Estruturas condicionais (`se / senão`) com sensores de ambiente (`caminho_livre()`, `obstaculo_frente()`).
- Sub-rotinas / funções reutilizáveis (`funcao_1()`).
- Expansão para 8 fases completas e refinamentos de usabilidade baseados no *Code Review*.

---

## 3. Tecnologias Utilizadas

- **HTML5 (`<canvas>`):** Estrutura semântica da interface em três colunas e área de renderização gráfica do tabuleiro.
- **CSS3:** Estilização moderna em tema escuro (*dark mode*), layout responsivo via CSS Grid/Flexbox e estados visuais de feedback.
- **JavaScript (ES6+):** Arquitetura modular e *Data-Driven*, separando completamente os dados das fases (`levels.js`), a renderização (`renderer.js`), o motor de regras (`engine.js`) e o controle da interface (`main.js`).
- **Execução Zero-Dependência:** Roda 100% no navegador (*client-side*), sem necessidade de instalação de pacotes, servidores externos ou etapas de compilação.

---

## 4. Estrutura do Repositório

```text
/
├── index.html          # Interface principal (tabuleiro, fila de blocos e visor de código)
├── README.md           # Documentação geral do projeto
├── SPEC.md             # Especificação arquitetural e contrato de dados (SDD)
├── ROADMAP.md          # Cronograma e checklist das Fases 1 e 2
├── PROMPTS.md          # Histórico de engenharia de prompt e reflexão sobre uso de IA
├── css/
│   └── style.css       # Folha de estilos e tema visual
└── js/
    ├── levels.js       # Definição das matrizes e regras de cada fase
    ├── renderer.js     # Desenho vetorial do tabuleiro e do robô no Canvas
    ├── engine.js       # Interpretador de comandos, colisões e estado do jogo
    └── main.js         # Gerenciamento de eventos da UI e espelhamento de código
```

---

## 5. Instruções para Execução Local

Como o projeto foi desenvolvido em HTML5, CSS3 e JavaScript puro, não há dependências a instalar:

1. Clone este repositório para a sua máquina local:
   ```bash
   git clone https://github.com/heitor-vieira/PP-ProgIA.git
   ```
2. Acesse a pasta do projeto e abra o arquivo **`index.html`** diretamente no seu navegador de preferência (Google Chrome, Mozilla Firefox ou Microsoft Edge).
   - *Opcional:* Caso utilize o Visual Studio Code, você também pode iniciar o projeto clicando com o botão direito em `index.html` e selecionando **Open with Live Server**.

---

## 6. Uso de Inteligência Artificial no Desenvolvimento

O desenvolvimento seguiu práticas de **Spec-Driven Development (SDD)** e princípios de engenharia de prompt (decomposição em tarefas pequenas e fornecimento de contexto arquitetural fixo via `SPEC.md`). As ferramentas de IA atuam como apoio técnico, com revisão, testes e ajustes manuais realizados em todas as etapas:

- **Planejamento e Arquitetura (Gemini):** Apoio na definição da pilha tecnológica (opção por Web puro em vez de Pygame/3D para maximizar a qualidade da UI educativa e eliminar atritos de execução no *Code Review*), estruturação dos documentos `SPEC.md`, `ROADMAP.md` e `PROMPTS.md`, e definição do modelo *Data-Driven* das fases.
- **Geração de Interface e Estilos (Gemini):** Criação da estrutura HTML em três colunas (`index.html`) e da identidade visual escura (`css/style.css`).
- **Implementação da Lógica e Renderização (Gemini):** Geração modular de `js/renderer.js` (desenho vetorial no Canvas), `js/engine.js` (execução assíncrona, controle de cancelamento por `runToken` e detecção de colisões), `js/levels.js` e `js/main.js`.
- **Depuração e Validação:** Uso da IA para diagnosticar rapidamente erros de carregamento de scripts no navegador (como bloqueio de MIME type causado por divergência no nome do arquivo `levels.js`) e validar cenários de borda.

Os principais prompts utilizados e as reflexões críticas sobre potencialidades e limitações da IA estão documentados detalhadamente no arquivo [`PROMPTS.md`](./PROMPTS.md).

---
