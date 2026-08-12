import React from 'react'
import EXPERIENCE from '../../content/experience'

/**
 * Professional experience.
 *
 * Renders nothing in a production build until the copy is real. See the note in
 * src/content/experience.js: placeholder text on a page attached to a job
 * application reads as carelessness, whereas an absent section just reads as
 * "not listed".
 *
 * In development the placeholders render inside a loud draft frame so the
 * layout can be worked on without any risk of shipping it.
 */
function ExperienceSection() {
  const isDraft = !EXPERIENCE.published

  // Production + unpublished -> the section does not exist at all.
  if (isDraft && !import.meta.env.DEV) return null
  if (!EXPERIENCE.roles.length) return null

  return (
    <section className="band band-sunk" id="experience">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Experience</p>
          <h2 className="section-title">Current role</h2>
        </div>

        <div className={isDraft ? 'draft' : undefined}>
          {isDraft && (
            <span className="draft-tag">
              Draft · dev only · set published: true in content/experience.js
            </span>
          )}

          {EXPERIENCE.roles.map((role) => (
            <article className="role" key={role.id}>
              <div className="role-when">
                <b>
                  {role.start} — {role.end}
                </b>
                <span>{role.location}</span>
                <br />
                <span>{role.employmentType}</span>
              </div>

              <div>
                <h3 className="role-title">{role.title}</h3>
                <p className="role-company">{role.company}</p>
                <p className="role-summary">{role.summary}</p>

                <ul className="dash-list">
                  {role.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>

                <ul className="project-tech">
                  {role.stack.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ExperienceSection
