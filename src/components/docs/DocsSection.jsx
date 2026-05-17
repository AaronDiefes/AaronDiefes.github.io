import React from 'react'

// Thin wrapper that renders a docs section with a stable id for TOC anchors.
// The id is assigned at render time so deep links resolve on first paint.
function DocsSection({ id, title, children, className = '' }) {
  return (
    <section id={id} className={`section ${className}`.trim()}>
      <h2>{title}</h2>
      {children}
    </section>
  )
}

export default DocsSection
