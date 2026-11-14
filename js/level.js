/**
 * Banco de fases do CodeGrid (Arquitetura Data-Driven).
 * Legenda do grid:
 *   0 = Piso livre
 *   1 = Parede / obstáculo
 *   2 = Posição inicial do robô
 *   3 = Portal de saída (objetivo)
 *   4 = Núcleo de energia (coletável obrigatório antes do portal)
 */
const LEVELS = [
  {
    id: 1,
    titulo: "Fase 1: Primeiros Passos",
    conceito: "Sequência Lógica",
    objetivoTexto: "Guie o robô em linha reta até o portal de energia.",
    dica: "Cada bloco mover() faz o robô avançar exatamente 1 quadrado na direção para onde ele está apontando.",
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 3, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    direcaoInicial: "LESTE",
    comandosPermitidos: ["mover", "virar_esquerda", "virar_direita"],
    limiteBlocos: 5
  },
  {
    id: 2,
    titulo: "Fase 2: Curva na Estação",
    conceito: "Orientação Espacial",
    objetivoTexto: "Contorne o corredor e alcance o portal ao sul.",
    dica: "O comando virar_direita() gira o robô 90 graus no próprio eixo, sem sair do quadrado atual.",
    grid: [
      [1, 1, 1, 1, 1, 1],
      [1, 2, 0, 0, 1, 1],
      [1, 1, 1, 0, 1, 1],
      [1, 1, 1, 3, 1, 1],
      [1, 1, 1, 1, 1, 1]
    ],
    direcaoInicial: "LESTE",
    comandosPermitidos: ["mover", "virar_esquerda", "virar_direita"],
    limiteBlocos: 7
  },
  {
    id: 3,
    titulo: "Fase 3: Coleta de Núcleo",
    conceito: "Subobjetivos",
    objetivoTexto: "Colete o núcleo de energia dourado para ativar o portal de saída.",
    dica: "O portal só libera a passagem depois que todos os núcleos dourados da fase forem coletados.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 3, 1],
      [1, 2, 0, 4, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    direcaoInicial: "LESTE",
    comandosPermitidos: ["mover", "virar_esquerda", "virar_direita"],
    limiteBlocos: 10
  },
  {
    id: 4,
    titulo: "Fase 4: Rota de Manutenção",
    conceito: "Planejamento de Rota",
    objetivoTexto: "Recolha os dois núcleos de energia contornando a barreira central.",
    dica: "Imagine-se no lugar do robô: quando ele estiver subindo (Norte), virar à esquerda aponta para o Oeste.",
    grid: [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 3, 0, 0, 4, 1, 1],
      [1, 1, 1, 1, 0, 1, 1],
      [1, 2, 0, 4, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ],
    direcaoInicial: "LESTE",
    comandosPermitidos: ["mover", "virar_esquerda", "virar_direita"],
    limiteBlocos: 13
  }
];