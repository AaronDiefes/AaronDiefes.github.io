import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/shared/Navigation'
import SiteFooter from '../components/shared/SiteFooter'

export default function NotFoundPage() {
  return (
    <div>
      <style>{`
        .notfound {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 4rem 2rem;
          color: var(--color-text-heading);
        }
        .notfound h1 {
          font-size: clamp(3rem, 4vw + 2rem, 6rem);
          margin: 0;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .notfound p {
          font-size: 1.2rem;
          margin: 1rem 0 2rem;
          color: var(--color-text-light);
        }
        .notfound a {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: var(--color-primary);
          color: var(--color-surface);
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .notfound a:hover {
          background: var(--color-primary-dark);
        }
        footer {
          background: var(--color-footer-bg);
          color: var(--color-on-band-dim);
          text-align: center;
          padding: 2rem;
          margin-top: 4rem;
        }
      `}</style>

      <Navigation />

      <main className="notfound">
        <h1>404</h1>
        <p>That page doesn't exist (or moved).</p>
        <Link to="/">Back to home</Link>
      </main>
      <SiteFooter />
    </div>
  )
}
