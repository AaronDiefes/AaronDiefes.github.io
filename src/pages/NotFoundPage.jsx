import React from 'react'
import { Link } from 'react-router-dom'
import Navigation from '../components/shared/Navigation'

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
          color: #2c3e50;
        }
        .notfound h1 {
          font-size: clamp(3rem, 4vw + 2rem, 6rem);
          margin: 0;
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .notfound p {
          font-size: 1.2rem;
          margin: 1rem 0 2rem;
          color: #555;
        }
        .notfound a {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          background: #2E7D32;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          transition: background 0.2s;
        }
        .notfound a:hover {
          background: #1B5E20;
        }
        footer {
          background: #2c3e50;
          color: rgba(255, 255, 255, 0.8);
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

      <footer>
        <p>&copy; {new Date().getFullYear()} Aaron Diefes. All rights reserved.</p>
      </footer>
    </div>
  )
}
