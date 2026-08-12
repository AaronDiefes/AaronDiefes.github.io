import React from 'react'
import { Link } from 'react-router-dom'
import CpuDatapathFigure from './CpuDatapathFigure'

/**
 * One project on the homepage: a media plate on the left, content on the right.
 *
 * Every card uses an identical frame - same aspect, same padding, same single
 * hairline, no drop shadow. Inconsistent framing across cards is itself an
 * informality signal, so the plate treatment is fixed and only its contents
 * vary.
 *
 * The "Live demo" pill is reserved exclusively for projects with a running
 * demo, so it stays a meaningful signal rather than decoration.
 */

function ProjectMedia({ media }) {
  if (media.type === 'cpu-datapath') return <CpuDatapathFigure />

  if (media.type === 'image-pair') {
    return (
      <div className="project-media-pair">
        {media.images.map((img) => (
          <img key={img.src} src={img.src} alt={img.alt} loading="lazy" decoding="async" />
        ))}
      </div>
    )
  }

  return <img src={media.src} alt={media.alt} loading="lazy" decoding="async" />
}

function ProjectCard({ project }) {
  const {
    kind, title, description, metrics, tech, media,
    demoHref, demoLabel, docsHref, docsCount, repo,
  } = project

  return (
    <article className="project-card">
      <div className="project-plate">
        <ProjectMedia media={media} />
        {media.caption && <p className="project-plate-caption">{media.caption}</p>}
      </div>

      <div className="project-body">
        <p className="project-kind">{kind}</p>
        <h3 className="project-title">{title}</h3>
        <p className="project-description">{description}</p>

        <dl className="project-metrics">
          {metrics.map((m) => (
            <div key={m.label}>
              <dd className="project-metric-value">{m.value}</dd>
              <dt className="project-metric-label">{m.label}</dt>
            </div>
          ))}
        </dl>

        <ul className="project-tech">
          {tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="project-links">
          {demoHref && (
            <Link className="text-link" to={demoHref}>
              {demoLabel} →
            </Link>
          )}
          <Link className="text-link" to={docsHref}>
            Documentation ({docsCount} pages)
          </Link>
          <a className="project-repo" href={repo} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          {demoHref && <span className="project-live">Live demo</span>}
        </div>
      </div>
    </article>
  )
}

export default ProjectCard
