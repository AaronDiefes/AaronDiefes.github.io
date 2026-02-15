import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook that wraps the AnimationEngine vanilla JS class
 * Manages animation state and provides controls for React components
 */
export function useAnimationEngine() {
  const [currentState, setCurrentState] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const engineRef = useRef(null)

  useEffect(() => {
    // Import AnimationEngine on mount
    import('../lib/cpu/animation/animation-engine.js').then(() => {
      if (window.AnimationEngine) {
        const engine = new window.AnimationEngine()
        engineRef.current = engine

        // Listen to frame changes
        const handleFrameChange = (event) => {
          if (event.detail && event.detail.state) {
            setCurrentState(event.detail.state)
            setProgress({
              current: engine.currentFrame,
              total: engine.frames.length
            })
          }
        }

        window.addEventListener('cpu:framechange', handleFrameChange)

        return () => {
          window.removeEventListener('cpu:framechange', handleFrameChange)
          if (engine.isPlaying) {
            engine.pause()
          }
        }
      }
    })
  }, [])

  const controls = {
    loadFrames: (frames) => {
      if (engineRef.current) {
        engineRef.current.loadFrames(frames)
        setProgress({ current: 0, total: frames.length })
      }
    },

    step: () => {
      if (engineRef.current) {
        engineRef.current.stepForward()
      }
    },

    stepBack: () => {
      if (engineRef.current) {
        engineRef.current.stepBackward()
      }
    },

    play: () => {
      if (engineRef.current) {
        engineRef.current.play()
        setIsPlaying(true)
      }
    },

    pause: () => {
      if (engineRef.current) {
        engineRef.current.pause()
        setIsPlaying(false)
      }
    },

    reset: () => {
      if (engineRef.current) {
        engineRef.current.reset()
        setIsPlaying(false)
      }
    },

    jumpToFrame: (frameIndex) => {
      if (engineRef.current) {
        engineRef.current.jumpToFrame(frameIndex)
      }
    },

    setSpeed: (speed) => {
      if (engineRef.current && engineRef.current.timing) {
        engineRef.current.timing.setPlaybackSpeed(speed)
      }
    }
  }

  return {
    currentState,
    isPlaying,
    progress,
    controls,
    engine: engineRef.current
  }
}
