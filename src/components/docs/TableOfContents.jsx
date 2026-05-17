import React, { useEffect, useState, useRef } from 'react'

// On-this-page TOC with IntersectionObserver-driven scrollspy.
// Receives a flat `items` array: [{ id, label, level }] where level is 2 or 3.
// Renders nothing if items is empty.
function TableOfContents({ items }) {
  const [activeId, setActiveId] = useState(items[0]?.id)
  const suppressObserverRef = useRef(false)
  const suppressTimerRef = useRef(null)

  useEffect(() => {
    if (!items || items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return
        // Find the topmost intersecting entry.
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          // Sort by top position; pick the highest one.
          visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
          setActiveId(visible[0].target.id)
        }
      },
      {
        // Trigger when section top crosses 30% from the top of viewport.
        rootMargin: '0px 0px -70% 0px',
        threshold: 0
      }
    )

    items.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => {
      observer.disconnect()
      if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
    }
  }, [items])

  const handleClick = (e, item) => {
    e.preventDefault()
    const { id, onClick } = item

    // Suppress the observer while smooth-scroll is animating so the active
    // highlight doesn't flicker through intermediate sections.
    suppressObserverRef.current = true
    setActiveId(id)
    if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current)
    suppressTimerRef.current = setTimeout(() => {
      suppressObserverRef.current = false
    }, 700)

    if (onClick) {
      // Page-supplied handler (e.g. tab pages: switch tab + scroll on next frame).
      onClick()
    } else {
      const el = document.getElementById(id)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    // Reflect the hash without re-triggering a full route render.
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${id}`)
    }
  }

  if (!items || items.length === 0) return null

  const list = (
    <ul className="docs-toc-list">
      {items.map((item) => (
        <li
          key={item.id}
          className={`docs-toc-item level-${item.level || 2} ${activeId === item.id ? 'active' : ''}`}
        >
          <a
            href={`#${item.id}`}
            onClick={(e) => handleClick(e, item)}
            aria-current={activeId === item.id ? 'true' : undefined}
          >
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  )

  return (
    <>
      <aside className="docs-toc" aria-label="On this page">
        <p className="docs-toc-heading">On this page</p>
        {list}
      </aside>

      <details className="docs-toc-mobile">
        <summary>On this page</summary>
        {list}
      </details>
    </>
  )
}

export default TableOfContents
