import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Navigation from '../shared/Navigation'
import SiteFooter from '../shared/SiteFooter'
import TableOfContents from './TableOfContents'
import { getSiblingNav } from '../../lib/docs-nav'

function DocsLayout({
  project,
  currentSlug,
  title,
  subtitle,
  tocItems = [],
  tocMode = 'list', // 'list' | 'none'
  children
}) {
  const location = useLocation()
  const { prev, next, landing } = getSiblingNav(project, currentSlug)

  // Scroll to hash target on mount (handles deep links). The headings are
  // rendered with stable ids via <DocsSection>, so the element is available
  // synchronously — but retry once just in case React paint hasn't flushed.
  useEffect(() => {
    if (!location.hash) return
    const id = location.hash.slice(1)
    const tryScroll = (retries = 1) => {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else if (retries > 0) {
        requestAnimationFrame(() => tryScroll(retries - 1))
      }
    }
    tryScroll()
  }, [location.hash])

  const showToc = tocMode !== 'none' && tocItems && tocItems.length > 0

  return (
    <div className={`docs-layout ${showToc ? 'has-toc' : 'no-toc'}`}>
      <Navigation />

      <header className="landing-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </header>

      <div className="docs-layout-grid">
        {showToc && <TableOfContents items={tocItems} />}

        <main className="docs-content">
          {children}

          {(prev || next || landing) && (
            <nav className="docs-pager" aria-label="Documentation navigation">
              <div className="docs-pager-row">
                {prev ? (
                  <Link to={prev.href} className="docs-pager-link prev">
                    <span className="docs-pager-direction">← Previous</span>
                    <span className="docs-pager-title">{prev.label}</span>
                  </Link>
                ) : <span />}

                {next ? (
                  <Link to={next.href} className="docs-pager-link next">
                    <span className="docs-pager-direction">Next →</span>
                    <span className="docs-pager-title">{next.label}</span>
                  </Link>
                ) : <span />}
              </div>
              {landing && (
                <div className="docs-pager-landing">
                  <Link to={landing.href}>{landing.label}</Link>
                </div>
              )}
            </nav>
          )}
        </main>
      </div>

      <SiteFooter />
    </div>
  )
}

export default DocsLayout
