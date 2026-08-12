import React from 'react'
import { Link } from 'react-router-dom'
import SKILL_GROUPS from '../../content/skills'

/**
 * Technical skills as a two-column index of grouped prose.
 *
 * Each group can carry an `evidence` link to the documentation page that proves
 * the claim - the differentiator here is that the write-ups actually exist, so
 * the skills list can point at them instead of asserting.
 */
function SkillsGrid() {
  return (
    <section className="band" id="skills">
      <div className="wrap">
        <div className="section-head">
          <p className="eyebrow">Technical skills</p>
          <h2 className="section-title">What the projects required</h2>
        </div>

        <div className="skills-grid">
          {SKILL_GROUPS.map((group) => (
            <div className="skill-group" key={group.title}>
              <h3 className="skill-group-title">{group.title}</h3>
              <p className="skill-group-body">{group.body}</p>
              {group.evidence && (
                <Link className="skill-evidence text-link" to={group.evidence.href}>
                  {group.evidence.label} →
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsGrid
