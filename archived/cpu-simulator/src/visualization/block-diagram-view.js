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

      // Add stage labels (background layer)
      this.svg.appendChild(this._createStageLabels());

      // Add data path wires (background layer)
      this.svg.appendChild(this._createDataPaths());

      // Add hardware components (middle layer)
      this.svg.appendChild(this._createIFStage());
      this.svg.appendChild(this._createPipelineRegister('FD', 235, 'F/D', 'Fetch/Decode Register - Holds instruction between IF and ID stages'));
      this.svg.appendChild(this._createIDStage());
      this.svg.appendChild(this._createPipelineRegister('DX', 415, 'D/X', 'Decode/Execute Register - Holds decoded instruction and operands'));
      this.svg.appendChild(this._createEXStage());
      this.svg.appendChild(this._createPipelineRegister('XM', 575, 'X/M', 'Execute/Memory Register - Holds ALU result and write data'));
      this.svg.appendChild(this._createMEMStage());
      this.svg.appendChild(this._createPipelineRegister('MW', 735, 'M/W', 'Memory/Writeback Register - Holds data for register write'));
      this.svg.appendChild(this._createWBStage());

      // Append to container
      this.container.appendChild(this.svg);
    }

    /**
     * Creates stage labels above each pipeline stage
     * @returns {SVGGElement} Group containing stage labels
     * @private
     */
    _createStageLabels() {
      const g = this._svg('g', { class: 'stage-labels' });

      const stages = [
        { label: 'IF', x: 85 },
        { label: 'ID', x: 315 },
        { label: 'EX', x: 490 },
        { label: 'MEM', x: 665 },
        { label: 'WB', x: 820 }
      ];

      stages.forEach(({ label, x }) => {
        const text = this._svg('text', {
          x: x,
          y: 30,
          class: 'stage-label-text'
        });
        text.textContent = label;
        g.appendChild(text);
      });

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

      // Instruction Memory to F/D register
      g.appendChild(this._svg('line', {
        x1: 220, y1: 240, x2: 235, y2: 240,
        class: 'data-path'
      }));

      // F/D to Register File (instruction decode)
      g.appendChild(this._svg('line', {
        x1: 243, y1: 200, x2: 270, y2: 200,
        class: 'data-path'
      }));

      // F/D to Sign Extend
      g.appendChild(this._svg('line', {
        x1: 243, y1: 397, x2: 290, y2: 397,
        class: 'data-path'
      }));

      // Register File to D/X register (read data)
      g.appendChild(this._svg('line', {
        x1: 390, y1: 220, x2: 415, y2: 220,
        class: 'data-path'
      }));

      // Sign Extend to D/X register
      g.appendChild(this._svg('line', {
        x1: 370, y1: 397, x2: 415, y2: 397,
        class: 'data-path'
      }));

      // D/X to ALU Src Mux
      g.appendChild(this._svg('line', {
        x1: 423, y1: 230, x2: 445, y2: 230,
        class: 'data-path'
      }));

      // ALU Src Mux to ALU
      g.appendChild(this._svg('line', {
        x1: 460, y1: 230, x2: 480, y2: 230,
        class: 'data-path'
      }));

      // ALU to X/M register
      g.appendChild(this._svg('line', {
        x1: 560, y1: 230, x2: 575, y2: 230,
        class: 'data-path'
      }));

      // X/M to Data Memory (address)
      g.appendChild(this._svg('line', {
        x1: 583, y1: 220, x2: 610, y2: 220,
        class: 'data-path'
      }));

      // X/M to Data Memory (write data)
      g.appendChild(this._svg('line', {
        x1: 583, y1: 250, x2: 610, y2: 250,
        class: 'data-path'
      }));

      // Data Memory to M/W register
      g.appendChild(this._svg('line', {
        x1: 730, y1: 240, x2: 735, y2: 240,
        class: 'data-path'
      }));

      // M/W to WB Mux
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
     * @param {string} label - Display label (F/D, D/X, X/M, M/W)
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
      this.svg.querySelectorAll('.component.active, .multiplexer.active')
        .forEach(el => el.classList.remove('active'));

      // Highlight active components based on pipeline stage
      if (state.pipeline.IF.active) {
        this.componentMap.get('IMEM')?.classList.add('active');
        this.componentMap.get('PC')?.classList.add('active');
      }

      if (state.pipeline.ID.active) {
        this.componentMap.get('REGFILE')?.classList.add('active');
        this.componentMap.get('SIGNEXT')?.classList.add('active');
      }

      if (state.pipeline.EX.active) {
        this.componentMap.get('ALU')?.classList.add('active');
        this.componentMap.get('ALU_SRC')?.classList.add('active');
      }

      if (state.pipeline.MEM.active) {
        // Only highlight data memory if actually reading or writing
        if (state.pipeline.MEM.memRead || state.pipeline.MEM.memWrite) {
          this.componentMap.get('DMEM')?.classList.add('active');
        }
      }

      if (state.pipeline.WB.active) {
        this.componentMap.get('WB_SRC')?.classList.add('active');
      }

      // Update pipeline register instruction displays
      this._updatePipelineInstructions(state);
    }

    /**
     * Updates instruction text in pipeline registers
     * @param {CPUState} state - Current CPU state
     * @private
     */
    _updatePipelineInstructions(state) {
      // Map pipeline registers to their corresponding stages
      const pipelineMap = {
        'FD': 'IF',   // F/D shows what IF stage has
        'DX': 'ID',   // D/X shows what ID stage has
        'XM': 'EX',   // X/M shows what EX stage has
        'MW': 'MEM'   // M/W shows what MEM stage has
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
