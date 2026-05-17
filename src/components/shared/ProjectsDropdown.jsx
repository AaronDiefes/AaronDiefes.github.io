import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { DOCS_NAV } from '../../lib/docs-nav'

// Two-level Projects dropdown. Top level: project headers (buttons that expand).
// Second level (when a project is expanded): Overview, its sub-pages, and Demo.
function ProjectsDropdown({ onNavigate }) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedProject, setExpandedProject] = useState(null)
  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  // Flat list of focusable refs in render order. Rebuilt each render.
  const focusables = useRef([])
  const location = useLocation()

  const projects = Object.values(DOCS_NAV)

  const prefixFor = (project) => ({
    cpu: '/projects/cpu/',
    graphics: '/projects/graphics-engine/',
    uber: '/projects/uber/'
  }[project.key])

  const isProjectActive = (project) => location.pathname.startsWith(prefixFor(project))
  const activeProjectKey = projects.find(isProjectActive)?.key || null
  const anyActive = !!activeProjectKey

  // Auto-expand the active project when the menu opens. Only on the rising edge
  // of isOpen — don't override the user's choice once it's open.
  useEffect(() => {
    if (isOpen && expandedProject === null && activeProjectKey) {
      setExpandedProject(activeProjectKey)
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  // Reset the flat focusables array each render.
  focusables.current = []
  const registerFocusable = (el) => {
    if (el) focusables.current.push(el)
  }

  // Click-outside close.
  useEffect(() => {
    if (!isOpen) return
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen])

  // Esc to close + return focus to trigger.
  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen])

  // Close on route change.
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const moveFocus = (delta) => {
    const list = focusables.current
    if (list.length === 0) return
    const current = document.activeElement
    const idx = list.indexOf(current)
    const next = idx < 0
      ? (delta > 0 ? 0 : list.length - 1)
      : (idx + delta + list.length) % list.length
    list[next]?.focus()
  }

  const handleTriggerKeyDown = (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setIsOpen(true)
      requestAnimationFrame(() => focusables.current[0]?.focus())
    }
  }

  const handleHeaderKeyDown = (e, projectKey) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1) }
    else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setExpandedProject(projectKey)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      if (expandedProject === projectKey) setExpandedProject(null)
    } else if (e.key === 'Home') { e.preventDefault(); focusables.current[0]?.focus() }
    else if (e.key === 'End') { e.preventDefault(); focusables.current[focusables.current.length - 1]?.focus() }
  }

  const handleLinkKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); moveFocus(1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); moveFocus(-1) }
    else if (e.key === 'Home') { e.preventDefault(); focusables.current[0]?.focus() }
    else if (e.key === 'End') { e.preventDefault(); focusables.current[focusables.current.length - 1]?.focus() }
  }

  const handleLinkClick = () => {
    setIsOpen(false)
    if (onNavigate) onNavigate()
  }

  const toggleProject = (projectKey) => {
    setExpandedProject((current) => (current === projectKey ? null : projectKey))
  }

  return (
    <li
      ref={containerRef}
      className={`projects-dropdown ${isOpen ? 'open' : ''}`}
    >
      <button
        ref={triggerRef}
        type="button"
        className={`projects-trigger ${anyActive ? 'active' : ''}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        onKeyDown={handleTriggerKeyDown}
      >
        Projects
        <span className="dropdown-caret" aria-hidden="true">▾</span>
      </button>

      <div className="projects-menu" role="menu" hidden={!isOpen}>
        <ul className="projects-menu-list">
          {projects.map((project) => {
            const expanded = expandedProject === project.key
            const projectActive = isProjectActive(project)
            return (
              <li key={project.key} className="projects-menu-group" role="none">
                <button
                  ref={registerFocusable}
                  type="button"
                  className={`projects-group-header ${projectActive ? 'active' : ''}`}
                  aria-expanded={expanded}
                  aria-controls={`projects-submenu-${project.key}`}
                  onClick={() => toggleProject(project.key)}
                  onKeyDown={(e) => handleHeaderKeyDown(e, project.key)}
                >
                  <span>{project.label}</span>
                  <span className="projects-group-caret" aria-hidden="true">▾</span>
                </button>

                {expanded && (
                  <ul
                    id={`projects-submenu-${project.key}`}
                    className="projects-submenu"
                    role="menu"
                  >
                    <li role="none">
                      <Link
                        ref={registerFocusable}
                        role="menuitem"
                        to={project.landingHref}
                        className={location.pathname === project.landingHref ? 'active' : ''}
                        aria-current={location.pathname === project.landingHref ? 'page' : undefined}
                        onClick={handleLinkClick}
                        onKeyDown={handleLinkKeyDown}
                      >
                        Overview
                      </Link>
                    </li>
                    {project.pages.map((page) => {
                      const pageActive = location.pathname === page.href
                      return (
                        <li key={page.slug} role="none">
                          <Link
                            ref={registerFocusable}
                            role="menuitem"
                            to={page.href}
                            className={pageActive ? 'active' : ''}
                            aria-current={pageActive ? 'page' : undefined}
                            onClick={handleLinkClick}
                            onKeyDown={handleLinkKeyDown}
                          >
                            {page.label}
                          </Link>
                        </li>
                      )
                    })}
                    {project.demoHref && (
                      <li role="none" className="projects-submenu-demo">
                        <Link
                          ref={registerFocusable}
                          role="menuitem"
                          to={project.demoHref}
                          className={location.pathname === project.demoHref ? 'active' : ''}
                          aria-current={location.pathname === project.demoHref ? 'page' : undefined}
                          onClick={handleLinkClick}
                          onKeyDown={handleLinkKeyDown}
                        >
                          Open Demo →
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </li>
  )
}

export default ProjectsDropdown
