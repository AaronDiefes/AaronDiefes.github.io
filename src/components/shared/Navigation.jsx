import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ProjectsDropdown from './ProjectsDropdown'

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const toggleRef = useRef(null)
  const menuRef = useRef(null)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Close menu on escape key
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen &&
          toggleRef.current && !toggleRef.current.contains(e.target) &&
          menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isMenuOpen])

  // Close menu on navigation (mobile)
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsMenuOpen(false)
    }
  }, [location])

  const isActive = (path) => location.pathname === path
  const isAboutActive = location.pathname === '/' && location.hash === '#about'

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link to="/" className="nav-brand">Aaron Diefes</Link>
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
      <ul
        ref={menuRef}
        id="nav-menu"
        className="nav-links"
        hidden={!isMenuOpen}
      >
        <li>
          <Link
            to="/"
            className={isActive('/') && !location.hash ? 'active' : ''}
            aria-current={isActive('/') && !location.hash ? 'page' : undefined}
          >
            Home
          </Link>
        </li>

        <ProjectsDropdown onNavigate={() => setIsMenuOpen(false)} />

        <li>
          <Link
            to="/#about"
            className={isAboutActive ? 'active' : ''}
            aria-current={isAboutActive ? 'page' : undefined}
          >
            About
          </Link>
        </li>

        <li>
          <a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
