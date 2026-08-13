import { useSyncExternalStore } from 'react'

/**
 * Subscribes to the simulator's current frame.
 *
 * The vanilla AnimationEngine broadcasts `cpu:framechange` on `window` with
 * `{ frame, index, state, totalFrames, isPlaying }`. Until now each React
 * component that wanted it added its own window listener - workable when only
 * PipelineDiagram cared, untenable once the timeline, the datapath and the
 * narration all need the same frame on the same tick.
 *
 * `useSyncExternalStore` is the right primitive here rather than
 * useState + useEffect: an effect runs *after* paint, so the first frame would
 * render stale and then correct itself. This subscribes outside React's render
 * cycle and reads a consistent snapshot.
 *
 * The listener is attached once for the whole app (module scope) and removed
 * when the last subscriber unmounts, so navigating away from the demo leaves
 * nothing bound - the failure mode that leaked a keydown handler on this very
 * page.
 */

let latest = null
const listeners = new Set()

function handleFrameChange(event) {
  // The detail object is recreated per dispatch, which is exactly the identity
  // change useSyncExternalStore needs to see to re-render.
  latest = event.detail
  listeners.forEach((notify) => notify())
}

function subscribe(notify) {
  if (listeners.size === 0) {
    window.addEventListener('cpu:framechange', handleFrameChange)
  }
  listeners.add(notify)

  return () => {
    listeners.delete(notify)
    if (listeners.size === 0) {
      window.removeEventListener('cpu:framechange', handleFrameChange)
      latest = null
    }
  }
}

/** Must be referentially stable between events or React will loop. */
function getSnapshot() {
  return latest
}

function getServerSnapshot() {
  return null
}

/**
 * @returns {{frame:number, index:number, state:object, totalFrames:number,
 *            isPlaying:boolean}|null} null until the first frame is dispatched.
 */
export function useCpuFrame() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

/** The frame's CPU state, or null. Most consumers only want this. */
export function useCpuState() {
  const detail = useCpuFrame()
  return detail ? detail.state : null
}

export default useCpuFrame
