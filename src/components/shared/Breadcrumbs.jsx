import React from 'react'
import { Link } from 'react-router-dom'

function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <li>
              {item.href ? (
                item.external ? (
                  <a href={item.href}>{item.label}</a>
                ) : (
                  <Link to={item.href}>{item.label}</Link>
                )
              ) : (
                <span aria-current="page">{item.label}</span>
              )}
            </li>
            {index < items.length - 1 && (
              <li>
                <span className="separator" aria-hidden="true">›</span>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  )
}

export default Breadcrumbs
