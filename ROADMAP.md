# Roadmap de Desenvolvimento — CodeGrid

## Setup Inicial (12/11)
- [OK] Criar repositório privado no GitHub e adicionar o docente (`caburu`) como colaborador.
- [OK] Adicionar arquivos de planejamento (`SPEC.md`, `ROADMAP.md`, `PROMPTS.md`).
- [ ] Criar estrutura inicial de pastas (`css/`, `js/`, `levels/`).

---

## Fase 1 — MVP Jogável (12/11 a 16/11)
**Meta:** Entregar uma versão jogável e estável para a dinâmica de Testes / Code Review em 16/11, cobrindo sequência lógica e 4 fases completas.

- [ ] **Interface (`index.html` + `style.css`):** Criar layout em 3 colunas (Tabuleiro à esquerda, Montagem de Blocos ao centro, Código Espelhado à direita) + barra superior com seletor de fases e botões (`Executar`, `Passo a Passo`, `Limpar`).
- [ ] **Renderizador (`renderer.js`):** Desenhar o grid 2D a partir da matriz JSON, incluindo orientação visual do robô (seta/frente).
- [ ] **Motor Sequencial (`engine.js`):** Implementar fila de execução com `mover()`, `virar_esquerda()` e `virar_direita()`, sincronizando o destaque da linha no painel de código.
- [ ] **Conteúdo Inicial (`levels/`):** Criar `level_01.json` a `level_04.json` com dificuldade progressiva em sequência lógica.
- [ ] **Validação Pré-Review (15/11):** Testar todas as fases no navegador e verificar ausência de erros no console antes da aula de 16/11.

---

## Fase 2 — Estruturas de Controle, Feedback Inteligente e Polimento (17/11 a 30/11)
**Meta:** Incorporar feedbacks do primeiro Code Review, adicionar laços, condicionais e funções, e preparar o jogo para o Code Review final de 30/11.

- [ ] **Ajustes Pós-Review 1:** Corrigir bugs de usabilidade ou layout apontados pelos colegas em 16/11.
- [ ] **Laços de Repetição:** Implementar bloco `repita(N)` no motor e no gerador de código espelhado.
- [ ] **Condicionais:** Implementar sensores de ambiente (`caminho_livre()`, `obstaculo_frente()`) e bloco `se / senão`.
- [ ] **Funções:** Adicionar suporte a uma sub-rotina (`executar_f1()`) para ensinar decomposição e reuso.
- [ ] **Expansão de Fases:** Criar `level_05.json` a `level_08.json` explorando loops, condicionais e funções.
- [ ] **Feedback Didático:** Melhorar mensagens de erro (ex.: explicar por que o robô bateu ou por que faltou coletar um item) e botão de dica contextual.
- [ ] **Validação Pré-Review 2 (29/11):** Revisão completa de código, responsividade e testes de ponta a ponta para a aula de 30/11.

---

## Entrega e Apresentação Final (01/12 a 08/12)
- [ ] Preencher `README.md` completo (descrição, funcionalidades, arquitetura, instruções de uso e papel das ferramentas de IA).
- [ ] Consolidar exemplos de prompts e lições aprendidas a partir de `PROMPTS.md`.
- [ ] Preparar slides da apresentação (15–20 min) com demonstração ao vivo e reflexão crítica sobre o uso de IA.