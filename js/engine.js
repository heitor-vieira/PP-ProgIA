/**
 * Motor lógico do CodeGrid.
 * Executa instruções sobre o estado do tabuleiro de forma desacoplada da interface.
 */
class GameEngine {
  constructor() {
    this.level = null;
    this.robot = null;
    this.collectedCores = new Set();
    this.totalCores = 0;
    this.status = "idle"; // "idle" | "running" | "stepping" | "error" | "success"
    this.currentStepIndex = -1;
    this.runToken = 0; // Evita execuções antigas continuarem após um Reset

    this.directions = ["NORTE", "LESTE", "SUL", "OESTE"];
    this.vectors = {
      NORTE: { dRow: -1, dCol: 0 },
      LESTE: { dRow: 0, dCol: 1 },
      SUL: { dRow: 1, dCol: 0 },
      OESTE: { dRow: 0, dCol: -1 }
    };
  }

  /**
   * Carrega uma fase e posiciona o robô no estado inicial.
   */
  loadLevel(levelData) {
    this.level = levelData;
    this.reset();
  }

  /**
   * Restaura o robô e os itens coletáveis para o início da fase atual.
   */
  reset() {
    this.runToken++;
    this.collectedCores = new Set();
    this.totalCores = 0;
    this.status = "idle";
    this.currentStepIndex = -1;

    if (!this.level) return;

    const grid = this.level.grid;
    let startRow = 0;
    let startCol = 0;

    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (grid[r][c] === 2) {
          startRow = r;
          startCol = c;
        } else if (grid[r][c] === 4) {
          this.totalCores++;
        }
      }
    }

    this.robot = {
      row: startRow,
      col: startCol,
      dir: this.level.direcaoInicial || "LESTE"
    };
  }

  getState() {
    return {
      grid: this.level ? this.level.grid : [],
      robot: this.robot ? { ...this.robot } : null,
      collectedCores: new Set(this.collectedCores),
      totalCores: this.totalCores,
      status: this.status,
      currentStepIndex: this.currentStepIndex
    };
  }

  /**
   * Executa toda a fila de comandos de forma assíncrona.
   */
  async run(commands, delayMs, callbacks) {
    const { onUpdate, onComplete, onError } = callbacks;

    if (!commands || commands.length === 0) {
      onError("Sua fila está vazia! Adicione pelo menos um bloco antes de executar.");
      return;
    }

    this.reset();
    const token = ++this.runToken;
    this.status = "running";
    onUpdate(this.getState(), "Executando algoritmo...");

    for (let i = 0; i < commands.length; i++) {
      if (token !== this.runToken) return; // Execução cancelada por Reset

      this.currentStepIndex = i;
      const result = this._executeSingleCommand(commands[i], i + 1);

      if (!result.ok) {
        this.status = "error";
        onUpdate(this.getState());
        onError(result.message);
        return;
      }

      if (result.won) {
        this.status = "success";
        onUpdate(this.getState());
        onComplete(
          `Missão concluída com ${commands.length} bloco(s)! Todos os objetivos foram alcançados.`
        );
        return;
      }

      onUpdate(this.getState(), result.info || null);
      await this._sleep(delayMs);
    }

    if (token !== this.runToken) return;

    // Chegou ao fim dos blocos sem atingir o portal ativo
    this.status = "error";
    const missingCores = this.totalCores - this.collectedCores.size;
    const endMsg =
      missingCores > 0
        ? `Fim da fila: faltou coletar ${missingCores} núcleo(s) de energia antes de entrar no portal.`
        : "Fim da fila: o robô parou antes de alcançar o portal de saída. Adicione mais instruções.";

    onUpdate(this.getState());
    onError(endMsg);
  }

  /**
   * Executa exatamente uma instrução por chamada (modo Passo a Passo).
   */
  step(commands, callbacks) {
    const { onUpdate, onComplete, onError } = callbacks;

    if (!commands || commands.length === 0) {
      onError("Sua fila está vazia! Adicione comandos antes de usar o modo Passo.");
      return;
    }

    // Se estava parado, com erro ou já tinha vencido, reinicia do passo 0
    if (this.status === "idle" || this.status === "error" || this.status === "success") {
      this.reset();
      this.status = "stepping";
    }

    const nextIndex = this.currentStepIndex + 1;

    if (nextIndex >= commands.length) {
      this.status = "error";
      onUpdate(this.getState());
      onError("Não há mais blocos na fila. Clique em Resetar ou adicione novos comandos.");
      return;
    }

    this.currentStepIndex = nextIndex;
    const result = this._executeSingleCommand(commands[nextIndex], nextIndex + 1);

    if (!result.ok) {
      this.status = "error";
      onUpdate(this.getState());
      onError(result.message);
      return;
    }

    if (result.won) {
      this.status = "success";
      onUpdate(this.getState());
      onComplete(`Missão concluída no passo ${nextIndex + 1}!`);
      return;
    }

    if (nextIndex === commands.length - 1) {
      this.status = "error";
      onUpdate(this.getState());
      onError("Último passo executado, mas o robô ainda não concluiu o objetivo.");
      return;
    }

    onUpdate(
      this.getState(),
      result.info || `Passo ${nextIndex + 1} de ${commands.length} executado (${commands[nextIndex]}()).`
    );
  }

  /**
   * Aplica a regra de um comando individual no tabuleiro.
   */
  _executeSingleCommand(cmd, stepNumber) {
    if (cmd === "virar_direita") {
      const idx = this.directions.indexOf(this.robot.dir);
      this.robot.dir = this.directions[(idx + 1) % 4];
      return { ok: true, won: false };
    }

    if (cmd === "virar_esquerda") {
      const idx = this.directions.indexOf(this.robot.dir);
      this.robot.dir = this.directions[(idx + 3) % 4];
      return { ok: true, won: false };
    }

    if (cmd === "mover") {
      const vec = this.vectors[this.robot.dir];
      const nextRow = this.robot.row + vec.dRow;
      const nextCol = this.robot.col + vec.dCol;
      const grid = this.level.grid;

      // Verifica limites do mapa
      if (
        nextRow < 0 ||
        nextRow >= grid.length ||
        nextCol < 0 ||
        nextCol >= grid[0].length
      ) {
        return {
          ok: false,
          message: `Erro na linha ${stepNumber} (mover): o robô tentou sair dos limites da estação.`
        };
      }

      const targetCell = grid[nextRow][nextCol];

      // Verifica colisão com parede
      if (targetCell === 1) {
        return {
          ok: false,
          message: `Colisão na linha ${stepNumber} (mover): há uma parede bloqueando o caminho ao ${this.robot.dir}.`
        };
      }

      // Atualiza posição
      this.robot.row = nextRow;
      this.robot.col = nextCol;

      // Coleta núcleo de energia se houver
      if (targetCell === 4) {
        const key = `${nextRow},${nextCol}`;
        if (!this.collectedCores.has(key)) {
          this.collectedCores.add(key);
          const remaining = this.totalCores - this.collectedCores.size;
          return {
            ok: true,
            won: false,
            info:
              remaining === 0
                ? "Todos os núcleos coletados! O portal de saída foi ativado."
                : `Núcleo coletado! Falta(m) ${remaining} núcleo(s).`
          };
        }
      }

      // Verifica entrada no portal
      if (targetCell === 3) {
        if (this.collectedCores.size >= this.totalCores) {
          return { ok: true, won: true };
        }
        return {
          ok: true,
          won: false,
          info: "O robô passou pelo portal, mas ele ainda está bloqueado. Colete todos os núcleos dourados primeiro!"
        };
      }

      return { ok: true, won: false };
    }

    return {
      ok: false,
      message: `Comando desconhecido na linha ${stepNumber}: "${cmd}".`
    };
  }

  _sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}