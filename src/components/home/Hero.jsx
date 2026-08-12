import React from 'react'
import { Link } from 'react-router-dom'
import PROFILE from '../../content/profile'

/**
 * Homepage masthead.
 *
 * The name is the header wordmark (see Navigation), so the H1 here is the role.
 * That answers "what is this person" in the first second, which is what a
 * hiring manager scans for, and avoids the oversized-display-name convention
 * that reads as a creative portfolio rather than an engineering one.
 */
function Hero() {
  const { name, role, bio, email, github, githubLabel, linkedin, resumePdf, proof, stack } = PROFILE

  return (
    <header className="hero">
      <p className="eyebrow">{name}</p>
      <h1 className="hero-title">{role}</h1>
      <p className="hero-bio">{bio}</p>

      <div className="hero-actions">
        {/* Only rendered once a PDF actually exists - a resume button that
            404s is worse than no button. */}
        {resumePdf && (
          <a className="btn btn-accent" href={resumePdf} target="_blank" rel="noopener noreferrer">
            Résumé (PDF)
          </a>
        )}
        <a className="btn" href="#projects">
          View projects
        </a>
      </div>

      <div className="hero-contact">
        <a className="text-link" href={`mailto:${email}`}>{email}</a>
        <a className="text-link" href={github} target="_blank" rel="noopener noreferrer">
          {githubLabel}
        </a>
        {linkedin && (
          <a className="text-link" href={linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        )}
      </div>

      <p className="hero-proof">
        {proof.map((item, i) => (
          <React.Fragment key={item.label}>
            {i > 0 && <span className="hero-proof-sep" aria-hidden="true">·</span>}
            <span>
              <b>{item.value}</b> {item.label}
            </span>
          </React.Fragment>
        ))}
        <span className="hero-proof-sep" aria-hidden="true">·</span>
        <span>{stack}</span>
      </p>
    </header>
  )
}

export default Hero
