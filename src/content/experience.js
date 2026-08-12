/**
 * Professional experience.
 *
 * GATING: `published` is false, so ExperienceSection renders nothing in a
 * production build. The placeholder copy below is visible only in development.
 *
 * Why gate rather than style the placeholders as obviously-draft: a visitor who
 * sees "[[ Company ]]" on a page attached to a job application reads it as
 * carelessness. An absent section just reads as "not listed". There is no
 * placeholder treatment clever enough to fully defuse that, so the section
 * simply does not ship until the copy is real.
 *
 * To publish: replace every [[ ... ]] value, then set published: true.
 *
 * The [[ ]] sentinel is greppable - a CI guard can fail the build if it ever
 * reaches dist/.
 */

export const EXPERIENCE = {
  published: false,

  roles: [
    {
      id: 'current',
      title: '[[ Role title ]]',
      company: '[[ Company ]]',
      location: '[[ City, State / Remote ]]',
      employmentType: '[[ Full-time ]]',
      start: '[[ MON YYYY ]]',
      end: 'Present',
      summary:
        '[[ Two or three sentences: what the product does, who it serves, the size of the team, the part of the system you own, and one number that conveys scale — users, requests/day, records, services. ]]',
      highlights: [
        '[[ Shipped/built/migrated WHAT, which changed WHICH METRIC by HOW MUCH, measured HOW. ]]',
        '[[ Prefer a number over an adjective. ]]',
        '[[ One that shows ownership or scope — led, owned, on-call, cross-team — not just output. ]]',
      ],
      stack: ['[[ Lang ]]', '[[ Framework ]]', '[[ Datastore ]]', '[[ Infra ]]'],
    },
  ],

  education: [
    {
      id: 'degree',
      title: '[[ Degree, field ]]',
      company: '[[ Institution ]]',
      end: '[[ YYYY ]]',
    },
  ],
}

/** True when there is real, publishable content to show. */
export const hasPublishedExperience = () =>
  EXPERIENCE.published && EXPERIENCE.roles.length > 0

export default EXPERIENCE
