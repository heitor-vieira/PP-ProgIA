# Registro de Engenharia de Prompt e Uso de IA

Este documento registra os prompts mais relevantes utilizados no desenvolvimento do **CodeGrid**, bem como observações críticas sobre acertos, limitações e ajustes manuais realizados.

---

## Etapa 1: Planejamento e Especificação (SDD)
- **Ferramenta:** Gemini
- **Objetivo:** Definir pilha tecnológica, arquitetura desacoplada (Data-Driven) e cronograma compatível com as Fases 1 e 2.
- **Resultado:** Criação de `SPEC.md`, `ROADMAP.md` e `PROMPTS.md` antes da geração de código, evitando retrabalho na expansão de fases.

---

## Etapa 2: Prompts Planejados para a Fase 1 (Seguindo os 4 Ss)

### Prompt 2.1 — Estrutura HTML/CSS da Interface
> "Com base no `SPEC.md` aberto, crie o `index.html` e o `css/style.css` de um jogo educativo de programação em tema escuro moderno. O layout deve ter um cabeçalho com título e seletor de fases, e uma área principal dividida em três painéis: (1) tabuleiro do jogo à esquerda, (2) paleta de botões de comando e fila de instruções ao centro, e (3) visor de código equivalente à direita. Use apenas HTML5 e CSS3 puro."

### Prompt 2.2 — Renderizador do Grid (`js/renderer.js`)
> "Implemente o módulo ES6 `js/renderer.js` conforme o contrato de grid definido em `SPEC.md`. Crie uma classe `Renderer` que receba um elemento `<canvas>` e desenhe a matriz do nível (`0` piso, `1` parede, `2` robô com indicador claro de direção, `3` portal objetivo, `4` item coletável). Inclua um método `render(estadoJogo)`."

### Prompt 2.3 — Motor de Execução Passo a Passo (`js/engine.js`)
> "Implemente o módulo ES6 `js/engine.js` com uma classe `GameEngine` que execute uma lista de comandos (`mover`, `virar_esquerda`, `virar_direita`) de forma assíncrona com delay configurável. A cada passo, emita um callback `onStep(indiceComando, estadoAtual)` para atualizar a UI e destaque a linha de código correspondente. Se houver colisão com parede (`1`) ou borda, pare a execução e chame `onError(mensagemDidatica)`."

---

## Registro de Execução e Reflexão Crítica (Preencher durante o desenvolvimento)

### 1. Prompts que funcionaram muito bem (e por quê)
- *(Registrar aqui prompts que geraram código limpo de primeira graças ao contexto do `SPEC.md`)*

### 2. Limitações e Erros da IA encontrados
- *(Ex.: bugs de rotação de coordenadas Norte/Sul/Leste/Oeste, dessincronização de `async/await` ao clicar em "Resetar" no meio da execução, etc.)*

### 3. Aprendizados sobre o uso produtivo de IA
- *(Registrar como a decomposição em arquivos pequenos e o uso de contratos JSON reduziram alucinações e facilitaram o debug)*