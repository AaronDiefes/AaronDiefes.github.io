import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { DOCS_NAV } from '../../lib/docs-nav'

/**
 * Cmd/Ctrl-K palette for jumping to any page.
 *
 * This exists because the flat navigation deliberately stopped listing all ~25
 * destinations. It is a UX affordance, not a concurrency demo: the index is 25
 * entries, so filtering is trivially fast and useDeferredValue here would be
 * cargo cult (and a documented no-op without memo on the child).
 *
 * The index is derived from DOCS_NAV - the same source the navigation and the
 * three project overview pages already read - so there is no second list to
 * drift out of sync.
 *
 * Keyboard model follows the pattern already proven in the old
 * ProjectsDropdown: arrow keys move a roving selection, Enter activates, Escape
 * closes and returns focus to whatever was focused before opening.
 */

/** Flatten DOCS_NAV into a searchable list. Static, so computed once. */
function buildIndex() {
  const entries = [
    { title: 'Home', group: 'Site', href: '/' },
    { title: 'Résumé', group: 'Site', href: '/resume' },
  ]

  Object.values(DOCS_NAV).forEach((project) => {
    entries.push({
      title: `${project.label} — Overview`,
      group: project.label,
      href: project.landingHref,
    })
    if (project.demoHref) {
      entries.push({
        title: `${project.label} — Demo`,
        group: project.label,
        href: project.demoHref,
      })
    }
    project.pages.forEach((page) => {
      entries.push({ title: page.label, group: project.label, href: page.href })
    })
  })

  return entries
}

const INDEX = buildIndex()

function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const restoreFocusRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return INDEX.slice(0, 10)
    return INDEX.filter((entry) =>
      `${entry.title} ${entry.group}`.toLowerCase().includes(q)
    )
  }, [query])

  const open = useCallback(() => {
    restoreFocusRef.current = document.activeElement
    setQuery('')
    setSelected(0)
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    // Return focus where the visitor left it, per the dialog pattern.
    if (restoreFocusRef.current instanceof HTMLElement) {
      restoreFocusRef.current.focus()
    }
  }, [])

  // Global shortcut. Bound once; the handler reads current state via the
  // functional setter so it does not need to be re-bound on every keystroke.
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsOpen((wasOpen) => {
          if (wasOpen) {
            if (restoreFocusRef.current instanceof HTMLElement) {
              restoreFocusRef.current.focus()
            }
            return false
          }
          restoreFocusRef.current = document.activeElement
          setQuery('')
          setSelected(0)
          return true
        })
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Focus the input when it opens.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  // Close on navigation.
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  // Keep the highlighted row in view while arrowing through a long list.
  useEffect(() => {
    if (!isOpen) return
    const el = listRef.current?.querySelector('[data-selected="true"]')
    el?.scrollIntoView({ block: 'nearest' })
  }, [selected, isOpen])

  const go = (href) => {
    setIsOpen(false)
    navigate(href)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (results.length) setSelected((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (results.length) setSelected((i) => (i - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const hit = results[selected]
      if (hit) go(hit.href)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="command-palette-backdrop"
      onMouseDown={(e) => {
        // Only a click on the backdrop itself closes - not one that started
        // inside the panel and drifted out.
        if (e.target === e.currentTarget) close()
      }}
    >
      <div className="command-palette" role="dialog" aria-modal="true" aria-label="Search pages">
        <input
          ref={inputRef}
          className="command-palette-input"
          type="text"
          value={query}
          placeholder="Jump to a page…"
          autoComplete="off"
          spellCheck="false"
          aria-label="Search pages"
          onChange={(e) => {
            setQuery(e.target.value)
            setSelected(0)
          }}
          onKeyDown={onKeyDown}
        />

        <ul className="command-palette-list" ref={listRef}>
          {results.length === 0 && <li className="command-palette-empty">No matches</li>}
          {results.map((entry, i) => (
            <li key={entry.href}>
              <button
                type="button"
                data-selected={i === selected}
                className="command-palette-item"
                onMouseEnter={() => setSelected(i)}
                onClick={() => go(entry.href)}
              >
                <span>{entry.title}</span>
                <span className="command-palette-group">{entry.group}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="command-palette-footer">
          <span>↑↓ navigate</span>
          <span>↵ open</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
