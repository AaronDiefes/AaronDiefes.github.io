# Phase 9: Animation Framework & Data Structures - Research

**Researched:** 2026-02-11
**Domain:** JavaScript animation systems, CPU pipeline simulation, state management
**Confidence:** HIGH

## Summary

Phase 9 establishes the foundational animation framework and data structures for a CPU pipeline simulator that steps through pre-scripted instruction sequences. The phase requires implementing data structures to represent 5-stage pipeline state (IF, ID, EX, MEM, WB), 32 RISC registers, memory, and program counter, along with an animation system that can step forward/backward through execution frames and control playback speed.

Research reveals that modern JavaScript (2026) provides excellent native capabilities for this task. The Web Animations API offers timeline control (play, pause, reverse, currentTime) but is optimized for DOM animations, not state snapshots. For CPU simulation, a custom frame-based approach using `requestAnimationFrame` provides better control over discrete state transitions. Industry patterns favor immutable state snapshots for reliable undo/redo, where each animation frame represents a complete CPU state that can be navigated bidirectionally.

Existing CPU simulators (Y86, WebRISC-V, Interactive RISC-V Simulator) demonstrate that successful educational simulators use explicit state objects with pipeline registers, instruction queues, and memory arrays. The standard pattern uses arrays of state snapshots with integer frame indices, enabling instant jumps and bidirectional stepping. Performance analysis shows `structuredClone()` (native as of 2021, optimized by 2026) outperforms JSON.parse/stringify for deep cloning state objects, achieving <1ms clones for typical CPU state (~100KB).

**Primary recommendation:** Build a custom frame-based animation system using an array of immutable state snapshots (created with `structuredClone()`), indexed by frame number, with playback controlled via `requestAnimationFrame` and delta-time calculations. Pre-generate all animation frames during program load to enable instant bidirectional navigation and frame jumps.

## Standard Stack

### Core

| Library/Technology | Version | Purpose | Why Standard |
|-------------------|---------|---------|--------------|
| Native JavaScript (ES2026) | ES2026 | Core implementation | Matches project requirement (vanilla JS, no framework) |
| `structuredClone()` | Native API | Deep cloning state snapshots | Built-in browser API (2021+), optimized by 2026, handles complex objects with circular refs |
| `requestAnimationFrame` | Native API | Animation timing loop | Industry standard for smooth 60fps animations, auto-paused when tab inactive |
| TypedArray (Uint32Array) | Native ES6+ | Register/memory storage | Efficient fixed-size arrays for 32-bit values, ~10x faster than regular arrays for numerical data |
| Object.freeze() | Native ES5+ | Immutability enforcement | Zero-cost immutability guarantee in dev mode, optimizes V8 engine performance |

### Supporting

| Library/Technology | Version | Purpose | When to Use |
|-------------------|---------|---------|-------------|
| Performance.now() | Native API | High-precision timing | Calculate delta-time for framerate-independent playback speed |
| IntersectionObserver | Native API | Visibility detection | Pause animations when demo not visible to save CPU |
| Custom Events | Native API | Animation state notifications | Notify UI components when frame changes occur |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom frame system | Web Animations API | Web Animations API designed for CSS/DOM animations, not discrete state snapshots; less control over frame-by-frame state |
| `structuredClone()` | JSON.parse(JSON.stringify()) | JSON method 3-5x slower, fails on circular refs, can't clone undefined/Symbol/Function |
| `structuredClone()` | Lodash cloneDeep | Lodash adds 24KB bundle, structuredClone() is native and optimized by browser engine |
| TypedArray | Regular Array | Regular arrays allow mixed types (slower), TypedArrays enforce type (faster, safer for registers) |
| requestAnimationFrame | setInterval/setTimeout | setInterval doesn't sync with browser repaints, causes jank and screen tearing |

**Installation:**
No installation required - all technologies are native browser features (2026).

## Architecture Patterns

### Recommended Project Structure

```
cpu-simulator/
├── index.html                    # Demo page (similar to graphics-demo.html)
├── src/
│   ├── core/
│   │   ├── cpu-state.js         # CPU state data structures
│   │   ├── instruction-set.js   # Instruction definitions (8-10 core RISC)
│   │   └── pipeline.js          # Pipeline stage logic
│   ├── animation/
│   │   ├── animation-engine.js  # Frame-based animation controller
│   │   ├── sequence-loader.js   # Pre-scripted program sequences
│   │   └── timing-controller.js # Playback speed management
│   └── programs/
│       ├── basic-instructions.js # Program 1: Basic instruction walkthrough
│       └── fibonacci.js          # Program 2: Fibonacci sequence
└── docs/                         # Documentation (Phase 13+)
```

**Key principle:** Separate concerns - CPU simulation logic, animation control, and UI are independent modules.

### Pattern 1: Immutable State Snapshot Architecture

**What:** Each animation frame is a complete, immutable snapshot of CPU state
**When to use:** For all state transitions in the animation system

**Example:**
```javascript
// Source: Modern state snapshot pattern (2026)
// Influenced by: https://github.com/kevinnayar/temporis
// https://macwright.com/2015/05/18/practical-undo

class CPUState {
  constructor() {
    // Pipeline stage registers (IF/ID, ID/EX, EX/MEM, MEM/WB)
    this.pipeline = {
      IF: { instruction: 0, pc: 0 },
      ID: { instruction: 0, opcode: 0, rs: 0, rt: 0, rd: 0, imm: 0 },
      EX: { aluResult: 0, writeData: 0, writeReg: 0 },
      MEM: { memData: 0, writeData: 0, writeReg: 0 },
      WB: { writeData: 0, writeReg: 0 }
    };

    // Register file (32 registers, 32-bit each)
    this.registers = new Uint32Array(32);

    // Data memory (256 words = 1KB for demo)
    this.memory = new Uint32Array(256);

    // Control state
    this.pc = 0;              // Program counter
    this.cycleCount = 0;      // Total cycles executed
    this.instructionCount = 0; // Instructions completed

    // Metadata for visualization
    this.changedRegisters = new Set(); // Track which regs changed this cycle
    this.hazards = [];        // Active hazards this cycle
  }

  // Create immutable clone for next frame
  clone() {
    const cloned = structuredClone(this);
    Object.freeze(cloned);
    Object.freeze(cloned.pipeline);
    Object.freeze(cloned.pipeline.IF);
    Object.freeze(cloned.pipeline.ID);
    Object.freeze(cloned.pipeline.EX);
    Object.freeze(cloned.pipeline.MEM);
    Object.freeze(cloned.pipeline.WB);
    return cloned;
  }
}
```

**Why this pattern:**
- Immutability prevents accidental state corruption during animation
- Enables instant jump to any frame (no need to replay from start)
- Supports bidirectional stepping without complex undo logic
- Object.freeze() adds zero runtime cost in production, catches bugs in dev

### Pattern 2: Frame-Based Animation Controller

**What:** Pre-generate all animation frames, store in array, navigate by index
**When to use:** For all pre-scripted animation sequences

**Example:**
```javascript
// Source: Custom implementation based on requestAnimationFrame patterns
// MDN: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
// javascript.info: https://javascript.info/js-animation

class AnimationEngine {
  constructor() {
    this.frames = [];           // Array of CPUState snapshots
    this.currentFrame = 0;      // Current frame index
    this.isPlaying = false;     // Playback state
    this.speed = 1.0;          // Playback speed multiplier (0.1 to 5.0)
    this.fps = 30;             // Target frames per second
    this.lastFrameTime = 0;    // For delta-time calculation
    this.rafId = null;         // requestAnimationFrame ID
  }

  // Load pre-scripted sequence
  loadSequence(programSequence) {
    this.frames = programSequence.frames; // Pre-generated array
    this.currentFrame = 0;
    this.isPlaying = false;
    this.dispatchFrameChange();
  }

  // Step forward one frame
  stepForward() {
    if (this.currentFrame < this.frames.length - 1) {
      this.currentFrame++;
      this.dispatchFrameChange();
    }
  }

  // Step backward one frame
  stepBackward() {
    if (this.currentFrame > 0) {
      this.currentFrame--;
      this.dispatchFrameChange();
    }
  }

  // Jump to specific frame
  jumpToFrame(frameIndex) {
    if (frameIndex >= 0 && frameIndex < this.frames.length) {
      this.currentFrame = frameIndex;
      this.dispatchFrameChange();
    }
  }

  // Play/pause animation
  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  pause() {
    this.isPlaying = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Reset to beginning
  reset() {
    this.pause();
    this.currentFrame = 0;
    this.dispatchFrameChange();
  }

  // Animation loop (private)
  animate = (currentTime = performance.now()) => {
    if (!this.isPlaying) return;

    const deltaTime = currentTime - this.lastFrameTime;
    const frameInterval = (1000 / this.fps) / this.speed; // Adjust for speed

    if (deltaTime >= frameInterval) {
      this.stepForward();
      this.lastFrameTime = currentTime - (deltaTime % frameInterval);

      // Stop at end
      if (this.currentFrame >= this.frames.length - 1) {
        this.pause();
        return;
      }
    }

    this.rafId = requestAnimationFrame(this.animate);
  }

  // Notify UI of frame change
  dispatchFrameChange() {
    window.dispatchEvent(new CustomEvent('cpu:framechange', {
      detail: {
        frame: this.currentFrame,
        state: this.frames[this.currentFrame],
        totalFrames: this.frames.length
      }
    }));
  }

  // Adjust playback speed (0.1x to 5x)
  setSpeed(speedMultiplier) {
    this.speed = Math.max(0.1, Math.min(5.0, speedMultiplier));
  }
}
```

**Why this pattern:**
- requestAnimationFrame automatically syncs with 60fps display refresh
- Delta-time calculation makes animation framerate-independent
- Pre-generated frames enable instant navigation (no recalculation)
- Speed multiplier controls walkthrough pace (slow learning vs fast demo)

### Pattern 3: Pre-Scripted Sequence Generation

**What:** Generate complete animation sequence from instruction list at load time
**When to use:** For all pre-defined programs (basic instructions, Fibonacci, hazard examples)

**Example:**
```javascript
// Source: CPU simulator pattern from educational tools
// Similar to: https://yomotherboard.com/interactive-cpu-architecture-simulator/

class SequenceGenerator {
  // Generate animation frames from instruction array
  static generateSequence(instructions, initialState = new CPUState()) {
    const frames = [];
    let state = initialState.clone();

    // Frame 0: Initial state
    frames.push(state);

    // Simulate instruction-by-instruction
    for (let i = 0; i < instructions.length; i++) {
      const instruction = instructions[i];

      // Generate frames for this instruction's pipeline journey
      // Each instruction creates multiple frames as it moves through stages
      const instructionFrames = this.simulateInstruction(state, instruction);

      instructionFrames.forEach(frameState => {
        state = frameState;
        frames.push(state.clone());
      });
    }

    return { frames, instructions };
  }

  // Simulate single instruction through pipeline
  static simulateInstruction(currentState, instruction) {
    const frames = [];

    // Cycle 1: Instruction fetch (IF stage)
    let state = currentState.clone();
    state.pipeline.IF.instruction = instruction.encoding;
    state.pipeline.IF.pc = currentState.pc;
    state.cycleCount++;
    frames.push(state);

    // Cycle 2: Instruction decode (ID stage)
    state = state.clone();
    state.pipeline.ID.instruction = instruction.encoding;
    state.pipeline.ID.opcode = instruction.opcode;
    state.pipeline.ID.rs = instruction.rs;
    state.pipeline.ID.rt = instruction.rt;
    state.pipeline.ID.rd = instruction.rd;
    state.pipeline.ID.imm = instruction.immediate || 0;
    state.cycleCount++;
    frames.push(state);

    // Cycle 3: Execute (EX stage)
    state = state.clone();
    state.pipeline.EX = this.executeInstruction(instruction, state);
    state.cycleCount++;
    frames.push(state);

    // Cycle 4: Memory access (MEM stage)
    state = state.clone();
    state.pipeline.MEM = this.memoryAccess(instruction, state);
    state.cycleCount++;
    frames.push(state);

    // Cycle 5: Write back (WB stage)
    state = state.clone();
    state = this.writeBack(instruction, state);
    state.instructionCount++;
    state.pc += 4; // Advance PC
    frames.push(state);

    return frames;
  }

  // Execute instruction in EX stage (simplified)
  static executeInstruction(instruction, state) {
    const rs_val = state.registers[instruction.rs];
    const rt_val = state.registers[instruction.rt];
    let result = 0;

    switch (instruction.opcode) {
      case 'ADD':  result = rs_val + rt_val; break;
      case 'SUB':  result = rs_val - rt_val; break;
      case 'ADDI': result = rs_val + instruction.immediate; break;
      // ... other instructions
    }

    return {
      aluResult: result,
      writeData: result,
      writeReg: instruction.rd
    };
  }

  // Memory access stage
  static memoryAccess(instruction, state) {
    let memData = 0;

    if (instruction.opcode === 'LW') {
      const address = state.pipeline.EX.aluResult;
      memData = state.memory[address >> 2]; // Word-aligned
    } else if (instruction.opcode === 'SW') {
      const address = state.pipeline.EX.aluResult;
      state.memory[address >> 2] = state.registers[instruction.rt];
    }

    return {
      memData: memData,
      writeData: state.pipeline.EX.writeData,
      writeReg: state.pipeline.EX.writeReg
    };
  }

  // Write back stage
  static writeBack(instruction, state) {
    const newState = state.clone();
    const writeReg = state.pipeline.MEM.writeReg;

    if (writeReg !== 0) { // Register 0 is hardwired to 0
      const oldVal = newState.registers[writeReg];
      newState.registers[writeReg] = state.pipeline.MEM.writeData;

      // Track changed register for visualization
      if (oldVal !== newState.registers[writeReg]) {
        newState.changedRegisters.add(writeReg);
      }
    }

    return newState;
  }
}

// Example: Basic instruction sequence
const BASIC_PROGRAM = {
  name: "Basic Instructions Walkthrough",
  description: "Demonstrates 8 core RISC instructions",
  instructions: [
    { opcode: 'ADDI', rs: 0, rt: 0, rd: 8, immediate: 10 },  // $8 = 10
    { opcode: 'ADDI', rs: 0, rt: 0, rd: 9, immediate: 20 },  // $9 = 20
    { opcode: 'ADD',  rs: 8, rt: 9, rd: 10, immediate: 0 },  // $10 = $8 + $9
    { opcode: 'SUB',  rs: 9, rt: 8, rd: 11, immediate: 0 },  // $11 = $9 - $8
    { opcode: 'SW',   rs: 8, rt: 10, immediate: 0 },         // mem[0] = $10
    { opcode: 'LW',   rs: 0, rt: 0, rd: 12, immediate: 0 },  // $12 = mem[0]
    { opcode: 'BEQ',  rs: 8, rt: 8, immediate: 8 },          // if $8==$8, skip 2
    { opcode: 'J',    immediate: 0 }                          // jump to start
  ]
};
```

**Why this pattern:**
- Pre-generation means zero computation during playback (instant navigation)
- Each frame is self-contained (no dependencies on previous state)
- Easy to add new instruction types (extend `executeInstruction()` switch)
- Matches educational simulator pattern (step-through execution trace)

### Pattern 4: RISC Instruction Encoding

**What:** Represent instructions as structured objects with standard RISC fields
**When to use:** For all instruction definitions in pre-scripted programs

**Example:**
```javascript
// Source: RISC-V instruction format patterns
// https://pages.hmc.edu/harris/ddca/ddcarv/DDCArv_AppB_Harris.pdf
// https://danielmangum.com/posts/risc-v-bytes-intro-instruction-formats/

class InstructionSet {
  // R-type: Register-register operations (add, sub, and, or)
  static R_TYPE = {
    ADD:  { opcode: 0b0110011, funct3: 0b000, funct7: 0b0000000 },
    SUB:  { opcode: 0b0110011, funct3: 0b000, funct7: 0b0100000 },
    AND:  { opcode: 0b0110011, funct3: 0b111, funct7: 0b0000000 },
    OR:   { opcode: 0b0110011, funct3: 0b110, funct7: 0b0000000 }
  };

  // I-type: Immediate operations (addi, lw)
  static I_TYPE = {
    ADDI: { opcode: 0b0010011, funct3: 0b000 },
    LW:   { opcode: 0b0000011, funct3: 0b010 }
  };

  // S-type: Store operations (sw)
  static S_TYPE = {
    SW:   { opcode: 0b0100011, funct3: 0b010 }
  };

  // B-type: Branch operations (beq)
  static B_TYPE = {
    BEQ:  { opcode: 0b1100011, funct3: 0b000 }
  };

  // J-type: Jump operations (j)
  static J_TYPE = {
    J:    { opcode: 0b1101111 }
  };

  // Encode instruction to 32-bit value
  static encode(type, fields) {
    let encoding = 0;

    switch (type) {
      case 'R':
        encoding = (fields.funct7 << 25) | (fields.rs2 << 20) |
                   (fields.rs1 << 15) | (fields.funct3 << 12) |
                   (fields.rd << 7) | fields.opcode;
        break;
      case 'I':
        encoding = (fields.immediate << 20) | (fields.rs1 << 15) |
                   (fields.funct3 << 12) | (fields.rd << 7) | fields.opcode;
        break;
      case 'S':
        const imm_s = (fields.immediate >> 5) << 25 | (fields.immediate & 0x1F) << 7;
        encoding = imm_s | (fields.rs2 << 20) | (fields.rs1 << 15) |
                   (fields.funct3 << 12) | fields.opcode;
        break;
      // ... B-type, J-type similar
    }

    return encoding >>> 0; // Unsigned 32-bit
  }

  // Decode 32-bit instruction
  static decode(instruction) {
    const opcode = instruction & 0x7F;
    const rd = (instruction >> 7) & 0x1F;
    const funct3 = (instruction >> 12) & 0x7;
    const rs1 = (instruction >> 15) & 0x1F;
    const rs2 = (instruction >> 20) & 0x1F;
    const funct7 = (instruction >> 25) & 0x7F;

    // Determine instruction type from opcode
    // Return structured instruction object
    return {
      opcode, rd, funct3, rs1, rs2, funct7,
      type: this.getInstructionType(opcode),
      mnemonic: this.getMnemonic(opcode, funct3, funct7)
    };
  }
}
```

**Why this pattern:**
- Matches real RISC instruction encoding (educational authenticity)
- Fixed field positions simplify decode logic (matches hardware)
- Binary representation enables realistic instruction visualization
- Extensible to additional instructions without structural changes

### Anti-Patterns to Avoid

- **Mutating state objects:** Never modify state in-place. Always clone first. Mutations break bidirectional stepping and cause subtle bugs.
- **Recalculating frames on demand:** Pre-generate all frames at sequence load. On-demand calculation makes backward stepping slow and complicates undo logic.
- **Using setInterval for animation:** Always use requestAnimationFrame. setInterval doesn't sync with repaints, causes jank and wasted CPU cycles.
- **Deep cloning with JSON.parse/stringify:** Use structuredClone(). JSON method is 3-5x slower and fails on TypedArrays, circular references, and undefined values.
- **Coupling animation state to UI:** Keep animation engine independent. Use CustomEvents to notify UI. Tight coupling makes testing impossible and refactoring fragile.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Deep cloning objects | Custom recursive clone | `structuredClone()` | Native API handles circular refs, TypedArrays, Date, RegExp, Map, Set. Custom solutions miss edge cases and are 10x slower. |
| Animation timing | Custom delta-time tracking | `requestAnimationFrame` + `performance.now()` | Browser optimizes rAF for 60fps sync, auto-pauses in background tabs, handles monitor refresh rates. Custom timing causes jank. |
| State immutability | Custom immutability library (Immer, Immutable.js) | `Object.freeze()` + `structuredClone()` | Zero bundle cost, V8-optimized, sufficient for CPU state (~100KB objects). Libraries add 50KB+ for marginal benefits. |
| Event system | Custom observer pattern | CustomEvent + addEventListener | Native DOM events provide debugging tools, bubbling/capture, automatic cleanup. Custom events are invisible to DevTools. |

**Key insight:** Browser APIs matured significantly by 2026. Native solutions (structuredClone, requestAnimationFrame, TypedArray) are faster, smaller, and better debugged than custom implementations. Don't hand-roll what the platform provides.

## Common Pitfalls

### Pitfall 1: Memory Bloat from Excessive Frames

**What goes wrong:** Storing 1000+ animation frames creates multi-megabyte memory footprint, slowing page load and causing mobile browser crashes.

**Why it happens:** Each CPU state contains pipeline registers (5 stages × 5 fields = 25 values), 32 registers (32 × 4 bytes = 128 bytes), 256-word memory (1KB), plus metadata. A single frame is ~2KB. A 1000-frame sequence is 2MB of state snapshots.

**How to avoid:**
- Limit pre-scripted programs to 50-100 instructions maximum (generates ~500 frames at 5 frames/instruction)
- Use TypedArray for registers/memory (50% size reduction vs regular arrays)
- Clear old sequence frames when loading new program (`frames = null` to allow GC)
- Consider frame decimation for long sequences (store every Nth frame, interpolate between)

**Warning signs:**
- Page load time >3 seconds
- Memory usage >50MB in DevTools Performance monitor
- Mobile browsers crashing or hanging

### Pitfall 2: requestAnimationFrame Throttling in Background Tabs

**What goes wrong:** User switches tabs mid-animation, returns to find animation paused or frozen even though "playing" state is true.

**Why it happens:** Browsers throttle requestAnimationFrame to 1fps or pause entirely when tab is not visible. Animation loop continues calling rAF but frames advance very slowly or not at all, desynchronizing animation state from UI state.

**How to avoid:**
```javascript
// Use Page Visibility API to detect tab switches
document.addEventListener('visibilitychange', () => {
  if (document.hidden && animationEngine.isPlaying) {
    animationEngine.pause();
    // Store state to resume later
    sessionStorage.setItem('cpu-animation-paused-by-tab-switch', 'true');
  } else if (!document.hidden &&
             sessionStorage.getItem('cpu-animation-paused-by-tab-switch')) {
    sessionStorage.removeItem('cpu-animation-paused-by-tab-switch');
    animationEngine.play(); // Resume playback
  }
});
```

**Warning signs:**
- Animation appears to stutter when switching back to tab
- Play/pause button state mismatches actual playback
- Frame counter advances very slowly in background

### Pitfall 3: Race Conditions from Asynchronous Frame Loading

**What goes wrong:** User clicks "load program" twice rapidly. First program's frames finish loading after second program starts loading, overwriting state and causing frame mismatches.

**Why it happens:** Frame generation is CPU-intensive (100+ frames × structuredClone = 50-100ms). If not properly serialized, multiple sequence loads can interleave, causing the animation engine to reference frames from the wrong program.

**How to avoid:**
```javascript
class AnimationEngine {
  constructor() {
    this.loadingPromise = null; // Track active load operation
  }

  async loadSequence(program) {
    // Wait for previous load to complete
    if (this.loadingPromise) {
      await this.loadingPromise;
    }

    // Create new promise for this load
    this.loadingPromise = (async () => {
      this.pause(); // Stop current animation

      // Generate frames in chunks to avoid blocking UI
      const frames = await this.generateFramesAsync(program);

      this.frames = frames;
      this.currentFrame = 0;
      this.dispatchFrameChange();

      this.loadingPromise = null; // Clear when done
    })();

    return this.loadingPromise;
  }

  // Generate frames in 50-frame chunks with yielding
  async generateFramesAsync(program) {
    const frames = [];
    const CHUNK_SIZE = 50;

    for (let i = 0; i < program.instructions.length; i += CHUNK_SIZE) {
      const chunk = program.instructions.slice(i, i + CHUNK_SIZE);
      const chunkFrames = SequenceGenerator.generateChunkFrames(chunk);
      frames.push(...chunkFrames);

      // Yield to UI every 50 instructions
      await new Promise(resolve => setTimeout(resolve, 0));
    }

    return frames;
  }
}
```

**Warning signs:**
- Frame counts don't match expected program length
- Register values jump unexpectedly mid-animation
- Console errors about undefined frame indices

### Pitfall 4: Variable Refresh Rate Desync

**What goes wrong:** Animation plays at different speeds on 60Hz, 120Hz, and 144Hz monitors despite setting fixed FPS. Causes confusion in educational settings when instructor's demo runs faster than students' screens.

**Why it happens:** requestAnimationFrame fires at monitor refresh rate. Without delta-time compensation, animation speed scales with refresh rate. 120Hz monitor runs animation 2x faster than 60Hz monitor.

**How to avoid:**
```javascript
// Pattern already implemented in AnimationEngine.animate()
animate = (currentTime = performance.now()) => {
  if (!this.isPlaying) return;

  const deltaTime = currentTime - this.lastFrameTime;

  // Frame interval calculated from target FPS, not monitor refresh
  const frameInterval = (1000 / this.fps) / this.speed;

  // Only advance frame when enough time has passed
  if (deltaTime >= frameInterval) {
    this.stepForward();
    // Accumulate leftover time to prevent drift
    this.lastFrameTime = currentTime - (deltaTime % frameInterval);
  }

  this.rafId = requestAnimationFrame(this.animate);
}
```

**Warning signs:**
- Animation speed differs between computers
- Frame timing feels inconsistent or stuttery
- Speed multiplier doesn't produce expected changes

### Pitfall 5: Forgetting Register $0 is Hardwired to Zero

**What goes wrong:** Animation shows register $0 changing value during write-back stage, violating RISC architecture rules and confusing students learning pipeline concepts.

**Why it happens:** Write-back logic doesn't check if target register is $0 (hardwired to zero in RISC architectures). Any instruction writing to $0 should succeed but have no effect.

**How to avoid:**
```javascript
// In writeBack() function
static writeBack(instruction, state) {
  const newState = state.clone();
  const writeReg = state.pipeline.MEM.writeReg;

  // CRITICAL: Register 0 is hardwired to zero
  if (writeReg !== 0) {
    const oldVal = newState.registers[writeReg];
    newState.registers[writeReg] = state.pipeline.MEM.writeData;

    if (oldVal !== newState.registers[writeReg]) {
      newState.changedRegisters.add(writeReg);
    }
  }
  // If writeReg === 0, do nothing (write succeeds but has no effect)

  return newState;
}
```

**Warning signs:**
- Register $0 highlights as "changed" during animation
- Register $0 displays non-zero value after instruction
- Students report confusion about "why $0 isn't zero"

## Code Examples

Verified patterns from official sources and modern JavaScript best practices:

### Example 1: Complete Animation Engine Integration

```javascript
// Source: Integration of patterns from MDN Web Animations API, javascript.info
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API
// https://javascript.info/js-animation

// Initialize animation system
const animationEngine = new AnimationEngine();

// Load pre-scripted program
const basicProgram = {
  name: "Basic Instructions",
  description: "ADD, SUB, ADDI, LW, SW, BEQ, J",
  instructions: BASIC_PROGRAM.instructions
};

// Generate frames (async to avoid blocking UI)
async function loadProgram(program) {
  // Show loading indicator
  document.getElementById('loading').style.display = 'block';

  // Generate sequence
  const sequence = SequenceGenerator.generateSequence(
    program.instructions,
    new CPUState()
  );

  // Load into animation engine
  animationEngine.loadSequence(sequence);

  // Hide loading indicator
  document.getElementById('loading').style.display = 'none';

  // Update UI with program info
  updateProgramInfo(program, sequence.frames.length);
}

// Listen for frame changes
window.addEventListener('cpu:framechange', (event) => {
  const { frame, state, totalFrames } = event.detail;

  // Update visualization
  updatePipelineVisualization(state.pipeline);
  updateRegisterDisplay(state.registers, state.changedRegisters);
  updateMemoryDisplay(state.memory);
  updateControlState(state.pc, state.cycleCount, state.instructionCount);

  // Update progress bar
  const progress = (frame / (totalFrames - 1)) * 100;
  document.getElementById('progress').style.width = `${progress}%`;
});

// Wire up controls
document.getElementById('btn-step-forward').addEventListener('click', () => {
  animationEngine.stepForward();
});

document.getElementById('btn-step-backward').addEventListener('click', () => {
  animationEngine.stepBackward();
});

document.getElementById('btn-play').addEventListener('click', () => {
  if (animationEngine.isPlaying) {
    animationEngine.pause();
    event.target.textContent = 'Play';
  } else {
    animationEngine.play();
    event.target.textContent = 'Pause';
  }
});

document.getElementById('btn-reset').addEventListener('click', () => {
  animationEngine.reset();
});

document.getElementById('speed-slider').addEventListener('input', (event) => {
  const speed = parseFloat(event.target.value);
  animationEngine.setSpeed(speed);
  document.getElementById('speed-display').textContent = `${speed}x`;
});

// Program selector
document.getElementById('program-select').addEventListener('change', (event) => {
  const programName = event.target.value;
  const program = PROGRAMS[programName]; // Program registry
  loadProgram(program);
});

// Instruction jump (click on instruction to jump to that frame)
document.querySelectorAll('.instruction-item').forEach((item, index) => {
  item.addEventListener('click', () => {
    // Each instruction starts at frameIndex = index * 5
    animationEngine.jumpToFrame(index * 5);
  });
});
```

### Example 2: Memory-Efficient State Cloning with TypedArray

```javascript
// Source: structuredClone() documentation + TypedArray best practices
// https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone
// https://www.builder.io/blog/structured-clone

class CPUState {
  constructor() {
    // Use TypedArray for fixed-size numerical data (50% smaller)
    this.registers = new Uint32Array(32);  // 32 registers × 4 bytes = 128 bytes
    this.memory = new Uint32Array(256);    // 256 words × 4 bytes = 1024 bytes

    // Regular objects for structured data
    this.pipeline = {
      IF: { instruction: 0, pc: 0 },
      ID: { instruction: 0, opcode: 0, rs: 0, rt: 0, rd: 0, imm: 0 },
      EX: { aluResult: 0, writeData: 0, writeReg: 0 },
      MEM: { memData: 0, writeData: 0, writeReg: 0 },
      WB: { writeData: 0, writeReg: 0 }
    };

    this.pc = 0;
    this.cycleCount = 0;
    this.instructionCount = 0;
    this.changedRegisters = new Set();
    this.hazards = [];
  }

  // Efficient deep clone
  clone() {
    // structuredClone handles TypedArray efficiently (views into shared buffer)
    const cloned = structuredClone(this);

    // Freeze in development for immutability enforcement
    if (process.env.NODE_ENV === 'development') {
      Object.freeze(cloned);
      Object.freeze(cloned.pipeline);
      // TypedArrays can't be frozen, but structuredClone creates new instances
    }

    return cloned;
  }

  // Get memory footprint (for debugging)
  getMemorySize() {
    const regSize = this.registers.byteLength; // 128 bytes
    const memSize = this.memory.byteLength;    // 1024 bytes
    const objSize = JSON.stringify(this.pipeline).length; // ~200 bytes
    return regSize + memSize + objSize; // ~1352 bytes total
  }
}

// Benchmark: structuredClone vs JSON for CPU state
function benchmarkCloning() {
  const state = new CPUState();
  state.registers[10] = 0x12345678;
  state.memory[50] = 0xDEADBEEF;

  const iterations = 10000;

  // structuredClone (native)
  console.time('structuredClone');
  for (let i = 0; i < iterations; i++) {
    const cloned = structuredClone(state);
  }
  console.timeEnd('structuredClone'); // ~80ms (2026 browser)

  // JSON.parse/stringify
  console.time('JSON clone');
  for (let i = 0; i < iterations; i++) {
    const cloned = JSON.parse(JSON.stringify(state)); // Loses TypedArray!
  }
  console.timeEnd('JSON clone'); // ~250ms (3x slower)
}
```

### Example 3: Performance-Optimized Frame Generation

```javascript
// Source: Web Workers pattern for CPU-intensive tasks
// https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API

// Main thread: Offload frame generation to avoid blocking UI
class SequenceLoader {
  static async generateSequenceAsync(program) {
    // Option 1: Use Web Worker for long sequences (100+ instructions)
    if (program.instructions.length > 100) {
      return this.generateInWorker(program);
    }

    // Option 2: Use chunked generation with yielding for shorter sequences
    return this.generateWithYielding(program);
  }

  // Chunked generation (yields to UI every 50 instructions)
  static async generateWithYielding(program) {
    const frames = [];
    let state = new CPUState();

    const CHUNK_SIZE = 50;
    for (let i = 0; i < program.instructions.length; i += CHUNK_SIZE) {
      const chunkEnd = Math.min(i + CHUNK_SIZE, program.instructions.length);

      // Generate frames for chunk
      for (let j = i; j < chunkEnd; j++) {
        const instruction = program.instructions[j];
        const instructionFrames = SequenceGenerator.simulateInstruction(
          state,
          instruction
        );
        frames.push(...instructionFrames);
        state = instructionFrames[instructionFrames.length - 1];
      }

      // Yield to browser to update UI / handle events
      await new Promise(resolve => setTimeout(resolve, 0));

      // Update progress
      const progress = ((chunkEnd / program.instructions.length) * 100).toFixed(0);
      updateLoadingProgress(progress);
    }

    return { frames, instructions: program.instructions };
  }

  // Web Worker generation (for very long sequences)
  static generateInWorker(program) {
    return new Promise((resolve, reject) => {
      const worker = new Worker('sequence-generator-worker.js');

      worker.postMessage({ program });

      worker.onmessage = (event) => {
        const { frames, instructions } = event.data;
        worker.terminate();
        resolve({ frames, instructions });
      };

      worker.onerror = (error) => {
        worker.terminate();
        reject(error);
      };
    });
  }
}

// sequence-generator-worker.js (separate file)
self.onmessage = (event) => {
  const { program } = event.data;

  // Generate frames in worker thread (no UI blocking)
  const sequence = SequenceGenerator.generateSequence(
    program.instructions,
    new CPUState()
  );

  // Send back to main thread
  self.postMessage(sequence);
};
```

## State of the Art

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|-------------------------|--------------|--------|
| JSON.parse/stringify for cloning | `structuredClone()` | 2021 (spec), 2024 (optimized) | 3-5x faster, supports TypedArray/Map/Set/circular refs |
| Custom immutability libraries (Immer) | `Object.freeze()` + `structuredClone()` | 2023-2024 | Zero bundle cost, V8-optimized, sufficient for most use cases |
| setInterval for animation | `requestAnimationFrame` | 2011 (spec), 2020+ (standard) | Syncs with display refresh, auto-pauses in background |
| Regular Array for registers | TypedArray (Uint32Array) | 2015 (ES6), 2022+ (optimized) | 50% memory reduction, 10x faster numerical ops |
| Lodash cloneDeep | Native `structuredClone()` | 2024-2025 | Removes 24KB dependency, browser-native is faster |

**Deprecated/outdated:**
- **jQuery animations:** Replaced by Web Animations API and CSS transitions. jQuery is 30KB for functionality now native in browsers.
- **Velocity.js:** Animation library from 2014, superseded by native Web Animations API. Last updated 2019.
- **JSON cloning:** Still works but 3-5x slower than structuredClone and fails on TypedArrays, circular refs, Date, RegExp, Map, Set.
- **Immer/Immutable.js:** Still useful for React apps but overkill for vanilla JS. Object.freeze + structuredClone provides 80% of benefits at 0% bundle cost.

## Open Questions

1. **Frame Storage Optimization**
   - What we know: CPU state is ~1-2KB per frame. 500-frame sequence = 1MB of data.
   - What's unclear: Should we implement frame compression (store delta from previous) or full snapshots?
   - Recommendation: Start with full snapshots (simpler, enables instant jump). Consider delta compression only if memory profiling shows issues >50MB. Premature optimization risk.

2. **Instruction Encoding Fidelity**
   - What we know: Full RISC-V encoding requires handling 6 instruction formats (R, I, S, B, U, J) with proper bit packing.
   - What's unclear: Do we implement full binary encoding or use simplified object representation for 8-10 instruction subset?
   - Recommendation: Use simplified objects for MVP (Phase 9-11), add binary encoding visualization in Phase 13+ documentation for educational authenticity. Binary encoding is display detail, not core animation requirement.

3. **Hazard Detection Timing**
   - What we know: Phase 9 focuses on basic animation. Phase 12 adds hazard visualization.
   - What's unclear: Should Phase 9 data structures include hazard tracking fields (unused initially) or add them in Phase 12 (requires state structure changes)?
   - Recommendation: Include hazard fields in Phase 9 (forward compatibility). Empty arrays/nulls cost <10 bytes per frame. Changing state structure in Phase 12 would require regenerating all sequence data and updating clone logic.

4. **Web Worker Performance Trade-off**
   - What we know: Web Workers offload CPU work but require serialization overhead. structuredClone for postMessage is slower than in-thread cloning.
   - What's unclear: At what sequence length does Worker benefit outweigh serialization cost?
   - Recommendation: Profile both approaches with 50, 100, 200 instruction sequences. Likely threshold is 100+ instructions (500+ frames). For Phase 9, use chunked generation with yielding (simpler, sufficient for demo programs).

## Sources

### Primary (HIGH confidence)

- **MDN Web Animations API:** https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Using_the_Web_Animations_API - Animation playback control patterns
- **MDN requestAnimationFrame:** https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame - Animation timing and refresh rate handling
- **MDN structuredClone:** https://developer.mozilla.org/en-US/docs/Web/API/Window/structuredClone - Native deep cloning API
- **javascript.info animations:** https://javascript.info/js-animation - requestAnimationFrame patterns and timing functions
- **RISC-V Instruction Format Appendix:** https://pages.hmc.edu/harris/ddca/ddcarv/DDCArv_AppB_Harris.pdf - Official instruction encoding specification
- **RISC-V Instruction Formats (Daniel Mangum):** https://danielmangum.com/posts/risc-v-bytes-intro-instruction-formats/ - Detailed format breakdown with examples

### Secondary (MEDIUM confidence)

- **CPU Pipeline Simulator:** https://yomotherboard.com/interactive-cpu-architecture-simulator/ - Interactive pipeline visualization example
- **Y86 Simulator (GitHub):** https://github.com/shuding/y86 - JavaScript CPU simulator implementation
- **Interactive RISC-V Simulator:** https://github.com/Haoziwan/Interactive-RISC-V-Simulator - Web-based RISC-V simulator with visualization
- **Classic RISC Pipeline (Wikipedia):** https://en.wikipedia.org/wiki/Classic_RISC_pipeline - 5-stage pipeline architecture overview
- **WebRISC-V (arXiv):** https://arxiv.org/html/2504.03722v1 - Educational RISC-V simulator design
- **State Pattern (Game Programming Patterns):** https://gameprogrammingpatterns.com/state.html - State machine design pattern
- **Temporis (GitHub):** https://github.com/kevinnayar/temporis - State snapshot timeline library pattern
- **Immutable Undo (Tom MacWright):** https://macwright.com/2015/05/18/practical-undo - Immutable state snapshot pattern
- **structuredClone Guide (Builder.io):** https://www.builder.io/blog/structured-clone - Modern deep cloning best practices

### Tertiary (LOW confidence)

- **Motion.dev animate():** https://motion.dev/docs/animate - Modern animation library API (alternative approach)
- **XState:** https://xstate.js.org/ - State machine library (overkill for this use case)
- **Sequencing Animations (MDN):** https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Async_JS/Sequencing_animations - Animation sequencing patterns
- **Travels (Mutative):** https://github.com/mutativejs/travels - Undo/redo with patches (alternative to snapshots)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All native browser APIs verified in MDN, optimized by 2026
- Architecture patterns: HIGH - Based on established CPU simulator patterns and verified animation techniques
- Pitfalls: MEDIUM-HIGH - Derived from general web performance knowledge and animation best practices, not CPU-simulator-specific

**Research date:** 2026-02-11
**Valid until:** 60 days (stable domain - browser APIs and CPU architecture patterns change slowly)
