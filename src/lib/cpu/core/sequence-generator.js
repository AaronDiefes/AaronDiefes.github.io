/**
 * SequenceGenerator - compatibility shim over the cycle-accurate pipeline.
 *
 * The old implementation of this file WAS the simulator: it walked the program
 * one instruction at a time and emitted five frames per instruction, one per
 * stage, with only ever one stage active. That model is gone - see
 * pipeline-simulator.js, which emits one frame per clock cycle with up to five
 * instructions in flight.
 *
 * This shim survives only because `program-selector.js` calls
 * `SequenceGenerator.generateSequence(instructions)` and expects
 * `{ frames, instructions, metadata }` back. Keeping that signature means the
 * entire existing UI drives the new core without being rewritten first, so the
 * demo never goes dark mid-rework. Once the views are rebuilt against the richer
 * per-cycle frame, this file can go.
 */
(function () {
  'use strict';

  const SequenceGenerator = {
    /**
     * @param {Array|Object} programOrInstructions - an instruction array (the
     *   historical call shape) or a whole program object.
     * @returns {{frames: Array, instructions: Array, metadata: Object}}
     */
    generateSequence(programOrInstructions) {
      const sim = (typeof window !== 'undefined' && window.PipelineSimulator)
        || (typeof globalThis !== 'undefined' && globalThis.PipelineSimulator);

      if (!sim) {
        throw new Error('SequenceGenerator: PipelineSimulator has not been loaded');
      }

      const program = Array.isArray(programOrInstructions)
        ? { instructions: programOrInstructions }
        : (programOrInstructions || { instructions: [] });

      const result = sim.simulate(program);

      return {
        frames: result.frames,
        instructions: result.instructions,
        metadata: result.metadata,
      };
    },
  };

  if (typeof window !== 'undefined') {
    window.SequenceGenerator = SequenceGenerator;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.SequenceGenerator = SequenceGenerator;
  }
})();
