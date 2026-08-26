import React from 'react'
import { Link } from 'react-router-dom'

/**
 * A render the engine itself produced, shown beside the technique that produced it.
 *
 * The six technique pages carried no images at all until now - prose and C++ listings
 * describing output nobody could see. These PNGs are the engine's own output, already
 * in the repo; they were only wired into one gallery on the docs hub.
 *
 * `demo` optionally links through to the demo where the same technique can be driven.
 */
function EngineFigure({ src, alt, caption, demo, wide = false }) {
  return (
    <figure className={`engine-figure${wide ? ' is-wide' : ''}`}>
      <img
        src={`/projects/graphics-engine/docs/assets/images/${src}`}
        alt={alt}
        loading="lazy"
        decoding="async"
      />
      <figcaption>
        {caption}
        {demo && (
          <>
            {' '}
            <Link className="engine-figure-demo" to={`/projects/graphics-engine/demo?scene=${demo}`}>
              Try it ›
            </Link>
          </>
        )}
      </figcaption>
    </figure>
  )
}

export default EngineFigure
