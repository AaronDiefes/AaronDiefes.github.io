import React from 'react'
import PROFILE from '../../content/profile'

/**
 * The single dark band on the page, and the page's closing call to action.
 *
 * The heading is a neutral call to contact, not an availability claim. Do not
 * reintroduce "open to work" copy unless Aaron confirms it is true - an
 * inaccurate availability line is worse than none.
 */
function ContactBand() {
  const { email, github, linkedin, resumePdf } = PROFILE

  return (
    <section className="contact-band" id="contact">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow contact-eyebrow">Contact</p>
          <h2 className="contact-title">Get in touch.</h2>
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
