/**
 * Renderizador gráfico 2D do CodeGrid usando HTML5 Canvas.
 * Responsável exclusivamente por desenhar o estado atual do tabuleiro e do robô.
 */
class Renderer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");

    this.colors = {
      bg: "#090d16",
      floor: "#131c31",
      floorBorder: "#1e293b",
      floorDot: "#26344d",
      wall: "#334155",
      wallHighlight: "#475569",
      wallShadow: "#1e293b",
      goalActive: "#10b981",
      goalCore: "#a7f3d0",
      goalLocked: "rgba(16, 185, 129, 0.28)",
      coreOuter: "#f59e0b",
      coreInner: "#fef08a",
      robotBody: "#38bdf8",
      robotVisor: "#090d16",
      robotPointer: "#ffffff",
      robotError: "#f43f5e",
      robotSuccess: "#10b981"
    };
  }

  /**
   * Desenha todo o quadro atual do jogo.
   * @param {Object} state - Estado contendo grid, robot, collectedCores, totalCores e status
   */
  render(state) {
    const { grid, robot, collectedCores, totalCores, status } = state;
    const rows = grid.length;
    const cols = grid[0].length;

    // Limpa o canvas
    this.ctx.fillStyle = this.colors.bg;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Calcula tamanho proporcional e centraliza o mapa
    const padding = 16;
    const availW = this.canvas.width - padding * 2;
    const availH = this.canvas.height - padding * 2;
    const cellSize = Math.floor(Math.min(availW / cols, availH / rows));

    const offsetX = Math.floor((this.canvas.width - cellSize * cols) / 2);
    const offsetY = Math.floor((this.canvas.height - cellSize * rows) / 2);

    const allCoresCollected = collectedCores.size >= totalCores;

    // Desenha células do tabuleiro
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = offsetX + c * cellSize;
        const y = offsetY + r * cellSize;
        const cell = grid[r][c];

        if (cell === 1) {
          this._drawWall(x, y, cellSize);
        } else {
          this._drawFloor(x, y, cellSize);

          if (cell === 3) {
            this._drawPortal(x, y, cellSize, allCoresCollected);
          } else if (cell === 4 && !collectedCores.has(`${r},${c}`)) {
            this._drawEnergyCore(x, y, cellSize);
          }
        }
      }
    }

    // Desenha o robô por cima do tabuleiro
    if (robot) {
      const rx = offsetX + robot.col * cellSize;
      const ry = offsetY + robot.row * cellSize;
      this._drawRobot(rx, ry, cellSize, robot.dir, status);
    }
  }

  _drawFloor(x, y, size) {
    const ctx = this.ctx;
    ctx.fillStyle = this.colors.floor;
    ctx.fillRect(x, y, size, size);

    ctx.strokeStyle = this.colors.floorBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, size - 1, size - 1);

    // Ponto sutil no centro do piso
    ctx.fillStyle = this.colors.floorDot;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  _drawWall(x, y, size) {
    const ctx = this.ctx;
    const inset = 3;

    ctx.fillStyle = this.colors.wallShadow;
    ctx.fillRect(x, y, size, size);

    ctx.fillStyle = this.colors.wall;
    ctx.fillRect(x + inset, y + inset, size - inset * 2, size - inset * 2);

    ctx.strokeStyle = this.colors.wallHighlight;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x + inset + 0.5, y + inset + 0.5, size - inset * 2 - 1, size - inset * 2 - 1);
  }

  _drawPortal(x, y, size, isUnlocked) {
    const ctx = this.ctx;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const outerRadius = size * 0.34;
    const innerRadius = size * 0.16;

    ctx.save();
    ctx.strokeStyle = isUnlocked ? this.colors.goalActive : this.colors.goalLocked;
    ctx.lineWidth = Math.max(3, size * 0.06);
    ctx.beginPath();
    ctx.arc(cx, cy, outerRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isUnlocked ? this.colors.goalCore : this.colors.goalLocked;
    ctx.beginPath();
    ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawEnergyCore(x, y, size) {
    const ctx = this.ctx;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size * 0.22;

    ctx.save();
    // Losango energético
    ctx.fillStyle = this.colors.coreOuter;
    ctx.beginPath();
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
    ctx.fill();

    // Brilho interno
    ctx.fillStyle = this.colors.coreInner;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  _drawRobot(x, y, size, dir, status) {
    const ctx = this.ctx;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const bodyRadius = size * 0.33;

    const angleMap = {
      LESTE: 0,
      SUL: Math.PI / 2,
      OESTE: Math.PI,
      NORTE: -Math.PI / 2
    };

    let mainColor = this.colors.robotBody;
    if (status === "error") mainColor = this.colors.robotError;
    if (status === "success") mainColor = this.colors.robotSuccess;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angleMap[dir] ?? 0);

    // Chassi do robô
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.roundRect(-bodyRadius, -bodyRadius * 0.85, bodyRadius * 2, bodyRadius * 1.7, 8);
    ctx.fill();

    // Visor frontal escuro
    ctx.fillStyle = this.colors.robotVisor;
    ctx.beginPath();
    ctx.roundRect(bodyRadius * 0.05, -bodyRadius * 0.55, bodyRadius * 0.65, bodyRadius * 1.1, 4);
    ctx.fill();

    // Seta branca indicando claramente a frente do robô
    ctx.fillStyle = this.colors.robotPointer;
    ctx.beginPath();
    ctx.moveTo(bodyRadius * 0.62, 0);
    ctx.lineTo(bodyRadius * 0.2, -bodyRadius * 0.32);
    ctx.lineTo(bodyRadius * 0.2, bodyRadius * 0.32);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}