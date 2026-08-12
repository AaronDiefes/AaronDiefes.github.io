import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PROFILE from '../../content/profile'
import { hasPublishedExperience } from '../../content/experience'

/**
 * Site navigation: a flat list, no dropdown.
 *
 * The previous version carried a two-level Projects menu with roughly 25 links.
 * That is product-documentation behaviour; every professional engineering
 * portfolio sampled during the redesign uses a flat nav. Deep links into the
 * documentation are reached from each project's overview page instead.
 *
 * Three contracts here are load-bearing and must not be "tidied":
 *
 *  - The <ul> keeps id="nav-menu" and className="nav-links", and uses the
 *    `hidden` attribute for the mobile menu. navigation.css sets
 *    `.nav-links { display: flex }`, which overrides the UA `[hidden]` rule, so
 *    the ONLY thing that actually closes the mobile menu is the
 *    `@media (max-width: 768px) .site-nav .nav-links[hidden] { display: none }`
 *    rule. Removing that rule leaves the menu permanently open.
 *
 *  - The 768px breakpoint below is duplicated in navigation.css. Change one
 *    without the other and the menu stops auto-closing on navigation.
 *
 *  - .sr-only must keep its clip pattern or "Toggle menu" becomes visible text.
 */

const MOBILE_BREAKPOINT = 768 // keep in sync with navigation.css

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isStuck, setIsStuck] = useState(false)
  const location = useLocation()
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  const toggleMenu = () => setIsMenuOpen((open) => !open)

  // The bottom hairline appears only once the page has scrolled, so the nav
  // reads as part of the page at rest and as a bar once it starts overlapping
  // content. Passive listener; only flips state on the boundary crossing.
  useEffect(() => {
    const onScroll = () => setIsStuck(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the menu and returns focus to the trigger.
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
        toggleRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMenuOpen])

  // Click outside closes the menu.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMenuOpen &&
        toggleRef.current && !toggleRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setIsMenuOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  // Close on navigation (mobile only).
  useEffect(() => {
    if (window.innerWidth <= MOBILE_BREAKPOINT) setIsMenuOpen(false)
  }, [location])

  const onHome = location.pathname === '/'
  const inProject = location.pathname.startsWith('/projects/')

  /* Only link to things that exist. Experience is gated until its copy is
     real, and the résumé link appears once a PDF is in place - a nav item
     pointing at a missing anchor or a 404 is worse than no nav item. */
  const sectionLinks = [
    { label: 'Projects', hash: '#projects', active: inProject },
    hasPublishedExperience() ? { label: 'Experience', hash: '#experience' } : null,
    { label: 'Skills', hash: '#skills' },
    { label: 'Contact', hash: '#contact' },
  ].filter(Boolean)

  return (
    <nav className={`site-nav${isStuck ? ' is-stuck' : ''}`} aria-label="Main navigation">
      <div className="site-nav-inner">
        <Link to="/" className="nav-brand">{PROFILE.name}</Link>

        <button
          ref={toggleRef}
          className="menu-toggle"
          aria-expanded={isMenuOpen}
          aria-controls="nav-menu"
          onClick={toggleMenu}
        >
          <span className="sr-only">Toggle menu</span>
          <span className="hamburger-icon"></span>
        </button>

        <ul ref={menuRef} id="nav-menu" className="nav-links" hidden={!isMenuOpen}>
          {sectionLinks.map((link) => (
            <li key={link.label}>
              {/* On the homepage this is an in-page jump; from anywhere else it
                  routes home first and HomePage's hash effect scrolls. */}
              <Link
                to={onHome ? link.hash : `/${link.hash}`}
                className={link.active ? 'active' : undefined}
                aria-current={link.active ? 'page' : undefined}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {PROFILE.resumePdf && (
            <li>
              <a
                className="nav-resume"
                href={PROFILE.resumePdf}
                target="_blank"
                rel="noopener noreferrer"
              >
                Résumé
              </a>
            </li>
          )}

          <li>
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navigation
