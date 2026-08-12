import React from 'react'
import Navigation from './Navigation'
import SiteFooter from './SiteFooter'

function DemoLayout({ wrapperClass = '', title, subtitle, badge, children }) {
  return (
    <div className={`demo-layout-wrapper ${wrapperClass}`.trim()}>
      <Navigation />

      <div className="demo-page-body">
        <div className="demo-container">
          <header className="demo-header">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
            {badge && <span className="demo-badge">{badge}</span>}
          </header>

          <main className="demo-main">{children}</main>

        </div>
      </div>
      <SiteFooter />
    </div>
  )
}

export default DemoLayout
