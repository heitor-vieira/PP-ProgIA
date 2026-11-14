/**
 * Controlador principal do CodeGrid.
 * Conecta a interface HTML ao motor lógico (GameEngine) e ao renderizador (Renderer).
 */
document.addEventListener("DOMContentLoaded", () => {
  // Referências de UI
  const canvas = document.getElementById("game-canvas");
  const levelSelect = document.getElementById("level-select");
  const btnPrevLevel = document.getElementById("btn-prev-level");
  const btnNextLevel = document.getElementById("btn-next-level");
  const conceptBadge = document.getElementById("concept-badge");
  const levelTitle = document.getElementById("level-title");
  const levelObjective = document.getElementById("level-objective");
  const btnHint = document.getElementById("btn-hint");
  const hintBox = document.getElementById("hint-box");
  const levelHint = document.getElementById("level-hint");

  const btnRun = document.getElementById("btn-run");
  const btnStep = document.getElementById("btn-step");
  const btnReset = document.getElementById("btn-reset");
  const speedSelect = document.getElementById("speed-select");

  const commandPalette = document.getElementById("command-palette");
  const blockCounter = document.getElementById("block-counter");
  const btnClear = document.getElementById("btn-clear");
  const programQueueEl = document.getElementById("program-queue");
  const codeViewerEl = document.getElementById("code-viewer");
  const feedbackBox = document.getElementById("feedback-box");

  // Instâncias principais
  const renderer = new Renderer(canvas);
  const engine = new GameEngine();

  let currentLevelIndex = 0;
  let program = []; // Fila de comandos montada pelo jogador

  const commandLabels = {
    mover: { icon: "⬆", code: "mover()" },
    virar_esquerda: { icon: "↺", code: "virar_esquerda()" },
    virar_direita: { icon: "↻", code: "virar_direita()" }
  };

  // Inicializa seletor de fases
  function initLevelSelector() {
    levelSelect.innerHTML = "";
    LEVELS.forEach((lvl, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = lvl.titulo;
      levelSelect.appendChild(option);
    });
  }

  // Carrega uma fase pelo índice
  function selectLevel(index) {
    if (index < 0 || index >= LEVELS.length) return;

    currentLevelIndex = index;
    const level = LEVELS[currentLevelIndex];

    levelSelect.value = String(currentLevelIndex);
    btnPrevLevel.disabled = currentLevelIndex === 0;
    btnNextLevel.disabled = currentLevelIndex === LEVELS.length - 1;

    conceptBadge.textContent = level.conceito;
    levelTitle.textContent = level.titulo;
    levelObjective.textContent = level.objetivoTexto;
    levelHint.textContent = level.dica;
    hintBox.classList.add("hidden");

    // Habilita apenas os comandos permitidos na fase
    const cmdButtons = commandPalette.querySelectorAll(".cmd-btn");
    cmdButtons.forEach((btn) => {
      const cmd = btn.dataset.cmd;
      const allowed = level.comandosPermitidos.includes(cmd);
      btn.style.display = allowed ? "flex" : "none";
    });

    program = [];
    engine.loadLevel(level);
    setControlsDisabled(false);
    setFeedback("Pronto. Monte sua sequência de blocos e clique em <strong>Executar</strong>.", "idle");
    refreshAllViews();
  }

  // Atualiza fila visual, visor de código e canvas
  function refreshAllViews() {
    const state = engine.getState();
    renderProgramQueue(state.currentStepIndex);
    renderCodeViewer(state.currentStepIndex);
    updateBlockCounter();
    renderer.render(state);
  }

  function updateBlockCounter() {
    const limit = LEVELS[currentLevelIndex].limiteBlocos;
    blockCounter.textContent = `${program.length} / ${limit} blocos`;
    blockCounter.classList.toggle("limit-reached", program.length >= limit);
  }

  function renderProgramQueue(activeIndex) {
    programQueueEl.innerHTML = "";

    if (program.length === 0) {
      const emptyLi = document.createElement("li");
      emptyLi.className = "queue-empty";
      emptyLi.textContent = "Clique nos comandos acima para montar a sequência de instruções do robô.";
      programQueueEl.appendChild(emptyLi);
      return;
    }

    const isRunning = engine.status === "running";

    program.forEach((cmd, idx) => {
      const li = document.createElement("li");
      li.className = "queue-item";
      if (idx === activeIndex) {
        li.classList.add("active");
      }

      const leftDiv = document.createElement("div");
      leftDiv.className = "queue-item-left";

      const numSpan = document.createElement("span");
      numSpan.className = "step-num";
      numSpan.textContent = `${idx + 1}.`;

      const labelSpan = document.createElement("span");
      labelSpan.textContent = `${commandLabels[cmd].icon} ${commandLabels[cmd].code}`;

      leftDiv.appendChild(numSpan);
      leftDiv.appendChild(labelSpan);
      li.appendChild(leftDiv);

      if (!isRunning) {
        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-block-btn";
        removeBtn.title = "Remover bloco";
        removeBtn.textContent = "✕";
        removeBtn.addEventListener("click", () => {
          program.splice(idx, 1);
          engine.reset();
          setFeedback("Bloco removido. Tabuleiro reiniciado.", "idle");
          refreshAllViews();
        });
        li.appendChild(removeBtn);
      }

      programQueueEl.appendChild(li);
    });
  }

  function renderCodeViewer(activeIndex) {
    codeViewerEl.innerHTML = "";

    const headerComment = document.createElement("div");
    headerComment.className = "code-line comment";
    headerComment.textContent = `# ${LEVELS[currentLevelIndex].titulo}`;
    codeViewerEl.appendChild(headerComment);

    if (program.length === 0) {
      const emptyComment = document.createElement("div");
      emptyComment.className = "code-line comment";
      emptyComment.textContent = "# Seu algoritmo aparecerá aqui em tempo real";
      codeViewerEl.appendChild(emptyComment);
      return;
    }

    program.forEach((cmd, idx) => {
      const lineDiv = document.createElement("div");
      lineDiv.className = "code-line";
      if (idx === activeIndex) {
        lineDiv.classList.add("active-line");
      }

      const lineNum = document.createElement("span");
      lineNum.className = "line-num";
      lineNum.textContent = String(idx + 1);

      const codeText = document.createElement("span");
      codeText.textContent = commandLabels[cmd].code;

      lineDiv.appendChild(lineNum);
      lineDiv.appendChild(codeText);
      codeViewerEl.appendChild(lineDiv);
    });
  }

  function setFeedback(htmlMessage, type) {
    feedbackBox.innerHTML = htmlMessage;
    feedbackBox.className = `feedback-box status-${type}`;
  }

  function setControlsDisabled(disabled) {
    btnRun.disabled = disabled;
    btnStep.disabled = disabled;
    btnClear.disabled = disabled;
    levelSelect.disabled = disabled;
    btnPrevLevel.disabled = disabled || currentLevelIndex === 0;
    btnNextLevel.disabled = disabled || currentLevelIndex === LEVELS.length - 1;

    commandPalette.querySelectorAll(".cmd-btn").forEach((btn) => {
      btn.disabled = disabled;
    });
  }

  // Eventos: Adicionar comandos
  commandPalette.addEventListener("click", (event) => {
    const btn = event.target.closest(".cmd-btn");
    if (!btn || btn.disabled) return;

    const limit = LEVELS[currentLevelIndex].limiteBlocos;
    if (program.length >= limit) {
      setFeedback(
        `Limite atingido: esta fase permite no máximo <strong>${limit} blocos</strong>. Tente otimizar sua rota!`,
        "error"
      );
      return;
    }

    if (engine.status !== "idle") {
      engine.reset();
    }

    program.push(btn.dataset.cmd);
    setFeedback("Bloco adicionado. Clique em <strong>Executar</strong> para testar.", "idle");
    refreshAllViews();
  });

  // Eventos: Limpar fila e Resetar tabuleiro
  btnClear.addEventListener("click", () => {
    program = [];
    engine.reset();
    setFeedback("Fila de comandos limpa.", "idle");
    refreshAllViews();
  });

  btnReset.addEventListener("click", () => {
    engine.reset();
    setControlsDisabled(false);
    setFeedback("Robô reposicionado no ponto inicial.", "idle");
    refreshAllViews();
  });

  // Evento: Executar algoritmo completo
  btnRun.addEventListener("click", async () => {
    const delayMs = Number(speedSelect.value) || 420;
    setControlsDisabled(true);

    await engine.run(program, delayMs, {
      onUpdate: (state, infoMsg) => {
        renderProgramQueue(state.currentStepIndex);
        renderCodeViewer(state.currentStepIndex);
        renderer.render(state);
        if (infoMsg) {
          setFeedback(infoMsg, "running");
        }
      },
      onComplete: (successMsg) => {
        setControlsDisabled(false);
        const hasNext = currentLevelIndex < LEVELS.length - 1;
        const extra = hasNext ? " Avance para a próxima fase no topo da tela!" : " Você completou todas as fases da Fase 1!";
        setFeedback(`<strong>Sucesso!</strong> ${successMsg}${extra}`, "success");
      },
      onError: (errorMsg) => {
        setControlsDisabled(false);
        setFeedback(`<strong>Atenção:</strong> ${errorMsg}`, "error");
      }
    });
  });

  // Evento: Executar passo a passo
  btnStep.addEventListener("click", () => {
    engine.step(program, {
      onUpdate: (state, infoMsg) => {
        renderProgramQueue(state.currentStepIndex);
        renderCodeViewer(state.currentStepIndex);
        renderer.render(state);
        if (infoMsg) {
          setFeedback(infoMsg, "running");
        }
      },
      onComplete: (successMsg) => {
        setFeedback(`<strong>Sucesso!</strong> ${successMsg}`, "success");
      },
      onError: (errorMsg) => {
        setFeedback(`<strong>Atenção:</strong> ${errorMsg}`, "error");
      }
    });
  });

  // Eventos: Navegação entre fases e Dica
  levelSelect.addEventListener("change", (e) => {
    selectLevel(Number(e.target.value));
  });

  btnPrevLevel.addEventListener("click", () => {
    selectLevel(currentLevelIndex - 1);
  });

  btnNextLevel.addEventListener("click", () => {
    selectLevel(currentLevelIndex + 1);
  });

  btnHint.addEventListener("click", () => {
    hintBox.classList.toggle("hidden");
  });

  // Inicialização
  initLevelSelector();
  selectLevel(0);
});