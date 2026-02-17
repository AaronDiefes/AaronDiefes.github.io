import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'

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

  const isActive = (path) => {
    return location.pathname === path
  }

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
            className={isActive('/') ? 'active' : ''}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Home
          </Link>
        </li>
        <li>
          <Link
            to="/projects/cpu"
            className={isActive('/projects/cpu') ? 'active' : ''}
            aria-current={isActive('/projects/cpu') ? 'page' : undefined}
          >
            CPU Simulator
          </Link>
        </li>
        <li>
          <Link
            to="/projects/graphics-engine"
            className={isActive('/projects/graphics-engine') ? 'active' : ''}
            aria-current={isActive('/projects/graphics-engine') ? 'page' : undefined}
          >
            Graphics Engine
          </Link>
        </li>
        <li>
          <Link
            to="/projects/graphics-engine/docs"
            className={isActive('/docs') ? 'active' : ''}
            aria-current={isActive('/docs') ? 'page' : undefined}
          >
            Documentation
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
