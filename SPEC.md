# Especificação do Projeto — CodeGrid (GAC126 / PASIA)

## 1. Visão Geral e Público-Alvo
- **Objetivo:** Jogo educativo web 2D para ensinar lógica de programação básica a jovens de **15 a 18 anos** sem experiência prévia.
- **Abordagem Pedagógica (Programação Híbrida):**
  - O jogador monta a solução clicando em blocos de instrução (eliminando frustrações iniciais com erros de sintaxe).
  - Um painel lateral exibe em tempo real o **código equivalente** (sintaxe inspirada em Python) com destaque visual na linha que está sendo executada no tabuleiro.
  - **Progressão de conceitos:** Sequência lógica → Laços de repetição (`repita`) → Condicionais (`se / senão`) → Funções reutilizáveis.

## 2. Pilha Tecnológica e Restrições
- **Front-end:** HTML5, CSS3 e JavaScript (ES6+ modular, sem frameworks externos ou etapas de build).
- **Execução:** 100% client-side, rodando diretamente ao abrir `index.html` no navegador.
- **Design Data-Driven:** O motor do jogo (`engine.js`) e o renderizador (`renderer.js`) são totalmente desacoplados das fases, que são carregadas a partir de arquivos JSON.

## 3. Estrutura de Diretórios
```text
/
├── index.html          # Interface: tabuleiro, paleta de blocos, fila de execução e visor de código
├── css/
│   └── style.css       # Tema escuro moderno, grid responsivo e estados de destaque
├── js/
│   ├── main.js         # Controlador principal e eventos de interface
│   ├── engine.js       # Interpretador de comandos, estado do robô e detecção de colisão/vitória
│   ├── renderer.js     # Desenho do grid 2D, obstáculos, objetivos e animações
│   └── levelLoader.js  # Leitura e validação dos arquivos JSON de fase
├── levels/             # Arquivos level_01.json até level_08.json
├── SPEC.md             # Especificação arquitetural (contexto fixo para IA)
├── ROADMAP.md          # Planejamento das Fases 1 e 2
├── PROMPTS.md          # Registro histórico de prompts e reflexão sobre uso de IA
└── README.md           # Documentação oficial da entrega
```

## 4. Contrato de Dados das Fases (`levels/level_XX.json`)
Cada fase segue rigorosamente este esquema JSON:
```json
{
  "id": 1,
  "titulo": "Primeiros Passos",
  "conceito": "Sequência Lógica",
  "objetivoTexto": "Guie o robô até o portal de energia usando a menor quantidade de comandos.",
  "dica": "Conte quantos quadrados existem até o portal antes de clicar em Executar.",
  "grid": [
    [1, 1, 1, 1, 1, 1],
    [1, 2, 0, 0, 3, 1],
    [1, 1, 1, 1, 1, 1]
  ],
  "direcaoInicial": "LESTE",
  "comandosPermitidos": ["mover", "virar_esquerda", "virar_direita"],
  "limiteBlocos": 5
}
```
- **Legenda do `grid`:** `0` = piso livre | `1` = parede/obstáculo | `2` = posição inicial do robô | `3` = objetivo final | `4` = item coletável (bônus).
- **Direções válidas:** `"NORTE"`, `"SUL"`, `"LESTE"`, `"OESTE"`.

## 5. Regras de Execução do Motor (`engine.js`)
- A execução ocorre passo a passo com intervalo configurável (ex.: `400ms` por instrução) para permitir visualização clara de causa e efeito.
- Colidir com célula `1` (parede) ou sair dos limites do array interrompe a execução imediatamente e exibe uma mensagem de erro didática indicando o passo exato da falha.
- Atingir a célula `3` (objetivo) após coletar todos os itens `4` (se houver) conclui a fase e libera a próxima.