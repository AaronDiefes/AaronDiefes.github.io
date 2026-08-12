import React from 'react'
import Navigation from '../components/shared/Navigation'
import SiteFooter from '../components/shared/SiteFooter'
import PROFILE from '../content/profile'
import PROJECTS from '../content/projects'
import SKILL_GROUPS from '../content/skills'
import EXPERIENCE from '../content/experience'

/**
 * Web résumé at /resume.
 *
 * Renders from the same content modules as the homepage, so the two cannot
 * drift. The PDF is intended to be produced by printing this route - see the
 * @media print block in resume.css - which keeps a single source of truth
 * rather than maintaining a parallel document.
 *
 * Experience and education follow the same gate as the homepage: real content
 * or nothing. In a production build with EXPERIENCE.published false, this page
 * shows the header, selected projects and technical skills - complete and
 * honest, just shorter.
 */

/** A résumé entry: title, organisation, dates and optional bullets. */
function ResumeEntry({ title, org, when, bullets, note }) {
  return (
    <div className="cv-entry">
      <div className="cv-entry-head">
        <div>
          <h3 className="cv-entry-title">{title}</h3>
          {org && <p className="cv-entry-org">{org}</p>}
        </div>
        {when && <span className="cv-entry-when">{when}</span>}
      </div>
      {note && <p className="cv-entry-note">{note}</p>}
      {bullets && bullets.length > 0 && (
        <ul className="dash-list">
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

function ResumePage() {
  const isDraft = !EXPERIENCE.published
  const showDraft = isDraft && import.meta.env.DEV
  const showExperience = EXPERIENCE.published || showDraft

  return (
    <>
      <Navigation />

      <div className="wrap cv-page">
        <div className="cv-actions">
          {PROFILE.resumePdf ? (
            <a className="btn btn-accent" href={PROFILE.resumePdf} target="_blank" rel="noopener noreferrer">
              Download PDF
            </a>
          ) : (
            /* No PDF yet. Offer the browser's own print-to-PDF instead of a
               button that 404s - resume.css has a print stylesheet for it. */
            <button className="btn btn-accent" type="button" onClick={() => window.print()}>
              Print / save as PDF
            </button>
          )}
          <span className="cv-updated">Updated {PROFILE.updated}</span>
        </div>

        <article className="cv">
          <header className="cv-header">
            <div>
              <h1 className="cv-name">{PROFILE.name}</h1>
              <p className="cv-role">{PROFILE.role}</p>
            </div>
            <div className="cv-contact">
              <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
              <br />
              <a href={PROFILE.github} target="_blank" rel="noopener noreferrer">
                {PROFILE.githubLabel}
              </a>
            </div>
          </header>

          {showExperience && (
            <section className="cv-section">
              <h2>Experience</h2>
              <div className={showDraft ? 'draft' : undefined}>
                {showDraft && <span className="draft-tag">Draft · dev only</span>}
                {EXPERIENCE.roles.map((role) => (
                  <ResumeEntry
                    key={role.id}
                    title={role.title}
                    org={role.company}
                    when={`${role.start} – ${role.end}`}
                    bullets={role.highlights}
                  />
                ))}
              </div>
            </section>
          )}

          {showExperience && EXPERIENCE.education?.length > 0 && (
            <section className="cv-section">
              <h2>Education</h2>
              <div className={showDraft ? 'draft' : undefined}>
                {showDraft && <span className="draft-tag">Draft · dev only</span>}
                {EXPERIENCE.education.map((ed) => (
                  <ResumeEntry key={ed.id} title={ed.title} org={ed.company} when={ed.end} />
                ))}
              </div>
            </section>
          )}

          <section className="cv-section">
            <h2>Selected projects</h2>
            {PROJECTS.map((p) => (
              <ResumeEntry
                key={p.key}
                title={p.title}
                org={p.tech.join(' · ')}
                when="Solo"
                note={p.description}
                bullets={[
                  p.metrics.map((m) => `${m.value} ${m.label.toLowerCase()}`).join(' · '),
                ]}
              />
            ))}
          </section>

          <section className="cv-section">
            <h2>Technical skills</h2>
            <dl className="cv-skills">
              {SKILL_GROUPS.map((g) => (
                <React.Fragment key={g.title}>
                  <dt>{g.title}</dt>
                  <dd>{g.body}</dd>
                </React.Fragment>
              ))}
            </dl>
          </section>
        </article>
      </div>

      <SiteFooter />
    </>
  )
}

export default ResumePage
