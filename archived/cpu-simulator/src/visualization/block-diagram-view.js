/**
 * BlockDiagramView - SVG-based processor block diagram visualization
 *
 * Renders a hardware-accurate 5-stage pipelined RISC processor architecture
 * showing Instruction Memory, Register File, ALU, Data Memory, pipeline registers,
 * multiplexers, PC, and data path connections.
 *
 * Components highlight based on active pipeline stages. Pipeline registers display
 * current instruction names. Tooltips provide component descriptions.
 *
 * Usage:
 *   const view = new BlockDiagramView(containerElement);
 *   view.render(cpuState);
 */
(function() {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';

  class BlockDiagramView {
    /**
     * Creates a BlockDiagramView instance
     * @param {HTMLElement} container - DOM element to render SVG diagram into
     */
    constructor(container) {
      this.container = container;
      this.svg = null;
      this.componentMap = new Map();  // Fast component lookup by data-component attribute
      this.initializeDiagram();
    }

    /**
     * Creates an SVG element with attributes
     * @param {string} tagName - SVG element tag name
     * @param {object} attributes - Attribute key-value pairs
     * @returns {SVGElement} Created SVG element
     * @private
     */
    _svg(tagName, attributes = {}) {
      const element = document.createElementNS(SVG_NS, tagName);
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      return element;
    }

    /**
     * Initializes the complete SVG block diagram
     * Creates all components in painter's order (back to front)
     * @private
     */
    initializeDiagram() {
      // Create root SVG with responsive viewBox
      this.svg = this._svg('svg', {
        viewBox: '0 0 900 500',
        preserveAspectRatio: 'xMidYMid meet',
        class: 'cpu-block-diagram'
      });

      // Add stage bands (background tints + headers — drawn first, behind everything)
      this.svg.appendChild(this._createStageBands());

      // Add data path wires (background layer)
      this.svg.appendChild(this._createDataPaths());

      // Add hardware components (middle layer)
      // Pipeline-register labels match the CPU docs (CpuPipelinePage.jsx):
      // IF/ID, ID/EX, EX/MEM, MEM/WB. Internal data-attribute codes (FD/DX/XM/MW)
      // stay as-is since they're not user-facing.
      this.svg.appendChild(this._createIFStage());
      this.svg.appendChild(this._createPipelineRegister('FD', 235, 'IF/ID', 'IF/ID Register - Holds the fetched instruction and PC+1 value'));
      this.svg.appendChild(this._createIDStage());
      this.svg.appendChild(this._createPipelineRegister('DX', 415, 'ID/EX', 'ID/EX Register - Holds decoded values, register data, and sign-extended immediate'));
      this.svg.appendChild(this._createEXStage());
      this.svg.appendChild(this._createPipelineRegister('XM', 575, 'EX/MEM', 'EX/MEM Register - Holds ALU result, memory write data, and destination register'));
      this.svg.appendChild(this._createMEMStage());
      this.svg.appendChild(this._createPipelineRegister('MW', 735, 'MEM/WB', 'MEM/WB Register - Holds final data to write back to the register file'));
      this.svg.appendChild(this._createWBStage());

      // Pipeline token (top layer) — animated chip that follows the active stage.
      this.svg.appendChild(this._createPipelineToken());

      // Append to container
      this.container.appendChild(this.svg);
    }

    /**
     * Creates the five stage bands — tinted background rects + prominent
     * stage headers. Each band spans the full diagram height and brackets the
     * components that belong to its stage. The bands are drawn first, so they
     * sit behind everything else; the .stage-band.active class (added by render())
     * raises their opacity for the currently-active stage.
     * @returns {SVGGElement}
     * @private
     */
    _createStageBands() {
      const g = this._svg('g', { class: 'stage-bands' });

      // Band geometry — chosen so each rect brackets the components for that
      // stage without overlapping the pipeline-register channels.
      // x0/x1 are inclusive; pipeline-register bars live in the gaps.
      const bands = [
        { stage: 'IF',  name: 'INSTRUCTION FETCH',  short: 'IF',  x: 0,   width: 230 },
        { stage: 'ID',  name: 'INSTRUCTION DECODE', short: 'ID',  x: 250, width: 165 },
        { stage: 'EX',  name: 'EXECUTE',            short: 'EX',  x: 430, width: 145 },
        { stage: 'MEM', name: 'MEMORY ACCESS',      short: 'MEM', x: 590, width: 145 },
        { stage: 'WB',  name: 'WRITE BACK',         short: 'WB',  x: 750, width: 150 },
      ];

      const bandTop = 50;
      const bandHeight = 380;

      bands.forEach(({ stage, name, short, x, width }) => {
        const bandGroup = this._svg('g', {
          class: `stage-band stage-${stage.toLowerCase()}`,
          'data-stage': stage,
        });

        // Background tint rectangle
        bandGroup.appendChild(this._svg('rect', {
          x: x,
          y: bandTop,
          width: width,
          height: bandHeight,
          rx: 6,
          class: 'stage-band-bg',
        }));

        // Full-name header (top of band)
        const header = this._svg('text', {
          x: x + width / 2,
          y: 22,
          'text-anchor': 'middle',
          class: 'stage-band-header',
        });
        header.textContent = name;
        bandGroup.appendChild(header);

        // Abbreviation underneath the header
        const abbrev = this._svg('text', {
          x: x + width / 2,
          y: 40,
          'text-anchor': 'middle',
          class: 'stage-band-abbrev',
        });
        abbrev.textContent = `(${short})`;
        bandGroup.appendChild(abbrev);

        g.appendChild(bandGroup);
      });

      return g;
    }

    /**
     * Creates the pipeline token — an animated chip that slides to the center
     * of the active stage band on each render. The token carries the active
     * instruction's mnemonic so the viewer can track a single instruction's
     * progress through the pipeline at a glance.
     * @returns {SVGGElement}
     * @private
     */
    _createPipelineToken() {
      const g = this._svg('g', {
        class: 'pipeline-token',
        'data-pipeline-token': '',
      });

      // The pill is positioned at x=0; we translate it on each render.
      const pillWidth = 90;
      const pillHeight = 22;
      g.appendChild(this._svg('rect', {
        x: -pillWidth / 2,
        y: -pillHeight / 2,
        width: pillWidth,
        height: pillHeight,
        rx: 11,
        class: 'pipeline-token-pill',
      }));

      const text = this._svg('text', {
        x: 0,
        y: 0,
        'text-anchor': 'middle',
        'dominant-baseline': 'central',
        class: 'pipeline-token-text',
      });
      text.textContent = '';
      g.appendChild(text);

      return g;
    }

    /**
     * Creates data path wires connecting components
     * @returns {SVGGElement} Group containing all data path connections
     * @private
     */
    _createDataPaths() {
      const g = this._svg('g', { class: 'data-paths' });

      // PC to Instruction Memory
      g.appendChild(this._svg('line', {
        x1: 80, y1: 240, x2: 100, y2: 240,
        class: 'data-path'
      }));

      // Instruction Memory to IF/ID register
      g.appendChild(this._svg('line', {
        x1: 220, y1: 240, x2: 235, y2: 240,
        class: 'data-path'
      }));

      // IF/ID to Register File (instruction decode)
      g.appendChild(this._svg('line', {
        x1: 243, y1: 200, x2: 270, y2: 200,
        class: 'data-path'
      }));

      // IF/ID to Sign Extend
      g.appendChild(this._svg('line', {
        x1: 243, y1: 397, x2: 290, y2: 397,
        class: 'data-path'
      }));

      // Register File to ID/EX register (read data)
      g.appendChild(this._svg('line', {
        x1: 390, y1: 220, x2: 415, y2: 220,
        class: 'data-path'
      }));

      // Sign Extend to ID/EX register
      g.appendChild(this._svg('line', {
        x1: 370, y1: 397, x2: 415, y2: 397,
        class: 'data-path'
      }));

      // ID/EX to ALU Src Mux
      g.appendChild(this._svg('line', {
        x1: 423, y1: 230, x2: 445, y2: 230,
        class: 'data-path'
      }));

      // ALU Src Mux to ALU
      g.appendChild(this._svg('line', {
        x1: 460, y1: 230, x2: 480, y2: 230,
        class: 'data-path'
      }));

      // ALU to EX/MEM register
      g.appendChild(this._svg('line', {
        x1: 560, y1: 230, x2: 575, y2: 230,
        class: 'data-path'
      }));

      // EX/MEM to Data Memory (address)
      g.appendChild(this._svg('line', {
        x1: 583, y1: 220, x2: 610, y2: 220,
        class: 'data-path'
      }));

      // EX/MEM to Data Memory (write data)
      g.appendChild(this._svg('line', {
        x1: 583, y1: 250, x2: 610, y2: 250,
        class: 'data-path'
      }));

      // Data Memory to MEM/WB register
      g.appendChild(this._svg('line', {
        x1: 730, y1: 240, x2: 735, y2: 240,
        class: 'data-path'
      }));

      // MEM/WB to WB Mux
      g.appendChild(this._svg('line', {
        x1: 743, y1: 240, x2: 780, y2: 240,
        class: 'data-path'
      }));

      // WB Mux to Register File (write back - long feedback line)
      g.appendChild(this._svg('path', {
        d: 'M 810 240 L 850 240 L 850 60 L 330 60 L 330 130',
        class: 'data-path',
        fill: 'none'
      }));

      // PC +4 feedback (Adder to PC)
      g.appendChild(this._svg('path', {
        d: 'M 50 310 L 50 330 L 10 330 L 10 210 L 20 210',
        class: 'data-path',
        fill: 'none'
      }));

      return g;
    }

    /**
     * Creates IF (Instruction Fetch) stage components
     * @returns {SVGGElement} Group containing PC, Adder, and Instruction Memory
     * @private
     */
    _createIFStage() {
      const g = this._svg('g', { class: 'stage-group if-stage' });

      // PC block
      const pc = this._createComponent('PC', 20, 220, 60, 40, 'PC', 'pc', 'Program Counter - Holds address of current instruction');
      this.componentMap.set('PC', pc);
      g.appendChild(pc);

      // Adder (+4)
      const adder = this._createComponent('ADDER', 20, 280, 60, 30, '+4', 'adder', 'Adder - Increments PC by 4 for next instruction');
      this.componentMap.set('ADDER', adder);
      g.appendChild(adder);

      // Instruction Memory
      const imem = this._createComponent('IMEM', 100, 150, 120, 180, null, 'instruction-memory', 'Instruction Memory - Stores program instructions');
      // Multi-line label for Instruction Memory
      const imemLabel = this._createMultiLineLabel(160, 240, ['Instruction', 'Memory']);
      imem.appendChild(imemLabel);
      this.componentMap.set('IMEM', imem);
      g.appendChild(imem);

      return g;
    }

    /**
     * Creates ID (Instruction Decode) stage components
     * @returns {SVGGElement} Group containing Register File and Sign Extend
     * @private
     */
    _createIDStage() {
      const g = this._svg('g', { class: 'stage-group id-stage' });

      // Register File
      const regfile = this._createComponent('REGFILE', 270, 130, 120, 220, null, 'register-file', 'Register File - 32 general-purpose registers');
      const regfileLabel = this._createMultiLineLabel(330, 240, ['Register', 'File']);
      regfile.appendChild(regfileLabel);
      this.componentMap.set('REGFILE', regfile);
      g.appendChild(regfile);

      // Sign Extend
      const signext = this._createComponent('SIGNEXT', 290, 380, 80, 35, null, 'sign-extend', 'Sign Extend - Extends 16-bit immediate to 32 bits');
      const signextLabel = this._createMultiLineLabel(330, 397, ['Sign', 'Extend']);
      signext.appendChild(signextLabel);
      this.componentMap.set('SIGNEXT', signext);
      g.appendChild(signext);

      return g;
    }

    /**
     * Creates EX (Execute) stage components
     * @returns {SVGGElement} Group containing ALU and ALU Src Mux
     * @private
     */
    _createEXStage() {
      const g = this._svg('g', { class: 'stage-group ex-stage' });

      // ALU Src Multiplexer (before ALU)
      const aluMux = this._createMultiplexer('ALU_SRC', 445, 220, 'ALU Source MUX - Selects register value or immediate');
      this.componentMap.set('ALU_SRC', aluMux);
      g.appendChild(aluMux);

      // ALU
      const alu = this._createComponent('ALU', 480, 170, 80, 120, 'ALU', 'alu', 'Arithmetic Logic Unit - Performs computations (add, sub, and, or, etc.)');
      this.componentMap.set('ALU', alu);
      g.appendChild(alu);

      return g;
    }

    /**
     * Creates MEM (Memory Access) stage components
     * @returns {SVGGElement} Group containing Data Memory
     * @private
     */
    _createMEMStage() {
      const g = this._svg('g', { class: 'stage-group mem-stage' });

      // Data Memory
      const dmem = this._createComponent('DMEM', 610, 150, 120, 180, null, 'data-memory', 'Data Memory - Read/write data storage for load/store instructions');
      const dmemLabel = this._createMultiLineLabel(670, 240, ['Data', 'Memory']);
      dmem.appendChild(dmemLabel);
      this.componentMap.set('DMEM', dmem);
      g.appendChild(dmem);

      return g;
    }

    /**
     * Creates WB (Write Back) stage components
     * @returns {SVGGElement} Group containing WB Mux
     * @private
     */
    _createWBStage() {
      const g = this._svg('g', { class: 'stage-group wb-stage' });

      // WB Multiplexer (select ALU result vs memory data)
      const wbMux = this._createMultiplexer('WB_SRC', 780, 230, 'Writeback MUX - Selects ALU result or memory data for register write');
      this.componentMap.set('WB_SRC', wbMux);
      g.appendChild(wbMux);

      return g;
    }

    /**
     * Creates a hardware component (functional unit)
     * @param {string} dataComponent - Component identifier for data-component attribute
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @param {number} width - Component width
     * @param {number} height - Component height
     * @param {string|null} label - Single-line label (null for multi-line labels added separately)
     * @param {string} className - CSS class name for component type
     * @param {string} tooltip - Tooltip description
     * @returns {SVGGElement} Component group
     * @private
     */
    _createComponent(dataComponent, x, y, width, height, label, className, tooltip) {
      const g = this._svg('g', {
        class: `component ${className}`,
        'data-component': dataComponent
      });

      // Tooltip
      const title = this._svg('title');
      title.textContent = tooltip;
      g.appendChild(title);

      // Background rectangle
      const rect = this._svg('rect', {
        x: x,
        y: y,
        width: width,
        height: height,
        rx: 4
      });
      g.appendChild(rect);

      // Single-line label (if provided)
      if (label) {
        const text = this._svg('text', {
          x: x + width / 2,
          y: y + height / 2,
          'text-anchor': 'middle',
          'dominant-baseline': 'middle',
          class: 'component-label'
        });
        text.textContent = label;
        g.appendChild(text);
      }

      return g;
    }

    /**
     * Creates a multi-line text label using tspan elements
     * @param {number} x - X coordinate (center)
     * @param {number} y - Y coordinate (center of all lines)
     * @param {string[]} lines - Array of text lines
     * @returns {SVGTextElement} Text element with tspan children
     * @private
     */
    _createMultiLineLabel(x, y, lines) {
      const lineHeight = 16;
      const totalHeight = (lines.length - 1) * lineHeight;
      const startY = y - totalHeight / 2;

      const text = this._svg('text', {
        x: x,
        'text-anchor': 'middle',
        class: 'component-label'
      });

      lines.forEach((line, index) => {
        const tspan = this._svg('tspan', {
          x: x,
          y: startY + index * lineHeight,
          'dominant-baseline': 'middle'
        });
        tspan.textContent = line;
        text.appendChild(tspan);
      });

      return text;
    }

    /**
     * Creates a multiplexer (blue triangle)
     * @param {string} muxName - Mux identifier for data-mux attribute
     * @param {number} x - Center X coordinate
     * @param {number} y - Center Y coordinate
     * @param {string} tooltip - Tooltip description
     * @returns {SVGGElement} Multiplexer group
     * @private
     */
    _createMultiplexer(muxName, x, y, tooltip) {
      const g = this._svg('g', {
        class: 'multiplexer',
        'data-mux': muxName
      });

      // Tooltip
      const title = this._svg('title');
      title.textContent = tooltip;
      g.appendChild(title);

      // Triangle pointing right (3 vertices)
      const polygon = this._svg('polygon', {
        points: `${x},${y - 10} ${x + 15},${y} ${x},${y + 10}`
      });
      g.appendChild(polygon);

      return g;
    }

    /**
     * Creates a pipeline register (red vertical bar with labels)
     * @param {string} regName - Register name for data attributes (FD, DX, XM, MW)
     * @param {number} x - X coordinate (left edge)
     * @param {string} label - Display label (IF/ID, ID/EX, EX/MEM, MEM/WB)
     * @param {string} tooltip - Tooltip description
     * @returns {SVGGElement} Pipeline register group
     * @private
     */
    _createPipelineRegister(regName, x, label, tooltip) {
      const g = this._svg('g', {
        class: 'pipeline-register',
        'data-pipeline-reg': regName
      });

      // Tooltip
      const title = this._svg('title');
      title.textContent = tooltip;
      g.appendChild(title);

      // Vertical red bar
      const bar = this._svg('rect', {
        x: x,
        y: 80,
        width: 8,
        height: 340,
        rx: 2
      });
      g.appendChild(bar);

      // Register label (above bar)
      const labelText = this._svg('text', {
        x: x + 4,
        y: 65,
        'text-anchor': 'middle',
        class: 'pipeline-label'
      });
      labelText.textContent = label;
      g.appendChild(labelText);

      // Instruction display (below bar)
      const instrText = this._svg('text', {
        x: x + 4,
        y: 440,
        'text-anchor': 'middle',
        class: 'pipeline-instruction',
        'data-instruction-display': regName
      });
      instrText.textContent = 'NOP';
      g.appendChild(instrText);

      return g;
    }

    /**
     * Renders the current CPU state
     * Updates component highlighting and pipeline register instruction displays
     * @param {CPUState} state - Current CPU state with pipeline data
     */
    render(state) {
      // Clear all active states
      this.svg.querySelectorAll('.component.active, .multiplexer.active, .stage-band.active')
        .forEach(el => el.classList.remove('active'));

      // Highlight active components AND their stage band
      if (state.pipeline.IF.active) {
        this.componentMap.get('IMEM')?.classList.add('active');
        this.componentMap.get('PC')?.classList.add('active');
        this.svg.querySelector('.stage-band[data-stage="IF"]')?.classList.add('active');
      }

      if (state.pipeline.ID.active) {
        this.componentMap.get('REGFILE')?.classList.add('active');
        this.componentMap.get('SIGNEXT')?.classList.add('active');
        this.svg.querySelector('.stage-band[data-stage="ID"]')?.classList.add('active');
      }

      if (state.pipeline.EX.active) {
        this.componentMap.get('ALU')?.classList.add('active');
        this.componentMap.get('ALU_SRC')?.classList.add('active');
        this.svg.querySelector('.stage-band[data-stage="EX"]')?.classList.add('active');
      }

      if (state.pipeline.MEM.active) {
        // Only highlight data memory if actually reading or writing
        if (state.pipeline.MEM.memRead || state.pipeline.MEM.memWrite) {
          this.componentMap.get('DMEM')?.classList.add('active');
        }
        this.svg.querySelector('.stage-band[data-stage="MEM"]')?.classList.add('active');
      }

      if (state.pipeline.WB.active) {
        this.componentMap.get('WB_SRC')?.classList.add('active');
        this.svg.querySelector('.stage-band[data-stage="WB"]')?.classList.add('active');
      }

      // Update pipeline register instruction displays
      this._updatePipelineInstructions(state);

      // Move the pipeline token to the active stage band
      this._updatePipelineToken(state);
    }

    /**
     * Positions the pipeline token at the center of the currently active stage
     * band and updates its label. The token is hidden when no stage is active.
     * Stage band centers (must match _createStageBands geometry):
     *   IF=115, ID=332.5, EX=502.5, MEM=662.5, WB=825
     * Y position sits just below the band abbreviation row (y=40), at y=62.
     * @param {CPUState} state
     * @private
     */
    _updatePipelineToken(state) {
      const tokenGroup = this.svg.querySelector('[data-pipeline-token]');
      if (!tokenGroup) return;

      const stageCenters = {
        IF: 115,
        ID: 332.5,
        EX: 502.5,
        MEM: 662.5,
        WB: 825,
      };
      const tokenY = 62;

      // Find which stage is active. In this non-pipelined sim only one is
      // active per frame; if multiple ever are, the latest in execution order
      // wins (so the chip tracks the leading edge).
      const order = ['IF', 'ID', 'EX', 'MEM', 'WB'];
      let activeStage = null;
      for (const s of order) {
        if (state.pipeline[s]?.active) activeStage = s;
      }

      const textEl = tokenGroup.querySelector('.pipeline-token-text');

      if (!activeStage) {
        tokenGroup.classList.remove('is-visible');
        if (textEl) textEl.textContent = '';
        return;
      }

      const x = stageCenters[activeStage];
      tokenGroup.setAttribute('transform', `translate(${x}, ${tokenY})`);
      tokenGroup.classList.add('is-visible');
      tokenGroup.setAttribute('data-active-stage', activeStage);

      // Label the chip with the in-flight instruction's mnemonic.
      const instruction = state.pipeline.IF.instruction;
      if (textEl && instruction && instruction.mnemonic !== 'NOP') {
        textEl.textContent = instruction.mnemonic;
      } else if (textEl) {
        textEl.textContent = '—';
      }
    }

    /**
     * Updates instruction text in pipeline registers
     * @param {CPUState} state - Current CPU state
     * @private
     */
    _updatePipelineInstructions(state) {
      // Map pipeline registers to their corresponding stages
      const pipelineMap = {
        'FD': 'IF',   // IF/ID register shows what IF stage has
        'DX': 'ID',   // ID/EX register shows what ID stage has
        'XM': 'EX',   // EX/MEM register shows what EX stage has
        'MW': 'MEM'   // MEM/WB register shows what MEM stage has
      };

      Object.entries(pipelineMap).forEach(([regName, stageName]) => {
        const displayEl = this.svg.querySelector(`[data-instruction-display="${regName}"]`);
        if (!displayEl) return;

        const stageData = state.pipeline[stageName];
        if (stageData.active) {
          // In non-pipelined mode, all stages share the same instruction
          const instruction = state.pipeline.IF.instruction;
          if (instruction) {
            displayEl.textContent = `${instruction.mnemonic} ${this._formatInstruction(instruction)}`.trim();
          } else {
            displayEl.textContent = 'NOP';
          }
        } else {
          displayEl.textContent = 'NOP';
        }
      });
    }

    /**
     * Formats instruction operands for assembly-style display
     * @param {object} instruction - Instruction object with mnemonic, type, and operand fields
     * @returns {string} Formatted operand string
     * @private
     */
    _formatInstruction(instruction) {
      if (!instruction || instruction.mnemonic === 'NOP') {
        return '';
      }

      const { type, rs, rt, rd, immediate } = instruction;

      switch (type) {
        case 'R':
          // R-type: ADD $rd, $rs, $rt
          return `$${rd}, $${rs}, $${rt}`;

        case 'I':
          if (instruction.mnemonic === 'ADDI') {
            // ADDI $rt, $rs, imm
            return `$${rt}, $${rs}, ${immediate}`;
          } else if (instruction.mnemonic === 'LW') {
            // LW $rt, imm($rs)
            return `$${rt}, ${immediate}($${rs})`;
          }
          break;

        case 'S':
          // SW $rt, imm($rs)
          return `$${rt}, ${immediate}($${rs})`;

        case 'B':
          // BEQ $rs, $rt, offset
          return `$${rs}, $${rt}, ${immediate}`;

        case 'J':
          // J target
          return `${immediate}`;

        case 'NOP':
          return '';

        default:
          return '';
      }

      return '';
    }
  }

  // Export to global scope (vanilla JS pattern)
  if (typeof window !== 'undefined') {
    window.BlockDiagramView = BlockDiagramView;
  } else if (typeof global !== 'undefined') {
    global.BlockDiagramView = BlockDiagramView;
  }
})();
