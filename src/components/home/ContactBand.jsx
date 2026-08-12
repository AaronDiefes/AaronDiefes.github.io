import React from 'react'
import PROFILE from '../../content/profile'

/**
 * The single dark band on the page, and the page's closing call to action.
 *
 * Availability copy is omitted until Aaron supplies it - stating an open role
 * type is only useful if it's accurate.
 */
function ContactBand() {
  const { email, github, linkedin, resumePdf } = PROFILE

  return (
    <section className="contact-band" id="contact">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow contact-eyebrow">Contact</p>
          <h2 className="contact-title">Open to new work.</h2>
        </div>

        <div>
          <a className="contact-email" href={`mailto:${email}`}>{email}</a>
          <div className="contact-links">
            <a href={github} target="_blank" rel="noopener noreferrer">GitHub</a>
            {linkedin && (
              <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            )}
            {resumePdf && (
              <a href={resumePdf} target="_blank" rel="noopener noreferrer">Résumé</a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactBand
