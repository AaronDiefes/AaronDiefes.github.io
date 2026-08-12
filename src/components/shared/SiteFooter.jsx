import React from 'react'
import { Link } from 'react-router-dom'
import PROFILE from '../../content/profile'

/**
 * The site footer.
 *
 * Replaces four hand-rolled footers (HomePage, NotFoundPage, DocsLayout,
 * DemoLayout) that had drifted apart - one of them hardcoded the year. There
 * was already a Footer.jsx in this directory, but nothing imported it.
 */
function SiteFooter() {
  const { github, resumePdf, updated } = PROFILE
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <span>© {year} Aaron Diefes</span>
        <span>
          Built with React and Vite ·{' '}
          <a href={github} target="_blank" rel="noopener noreferrer">
            source on GitHub
          </a>
        </span>
        <span>
          {resumePdf && (
            <>
              <a href={resumePdf} target="_blank" rel="noopener noreferrer">Résumé (PDF)</a>
              {' · '}
            </>
          )}
          Updated {updated}
        </span>
      </div>
    </footer>
  )
}

export default SiteFooter
