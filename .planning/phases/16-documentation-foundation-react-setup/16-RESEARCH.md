# Phase 16: Documentation Foundation & React Setup - Research

**Researched:** 2026-02-18
**Domain:** React documentation site patterns, project structure, routing, and component organization
**Confidence:** HIGH

## Summary

Phase 16 establishes the foundation for CS330 documentation by creating the project structure, landing page, and routing infrastructure. The existing portfolio already has strong patterns to follow from the CPU and Graphics Engine projects, with React 18 + Vite + React Router 6, inline CSS styling, shared Breadcrumbs component, and forest green design system.

The research confirms that the existing patterns in this codebase are well-aligned with 2026 best practices. The portfolio uses React Router 6 (v6.22.0), React 18 (v18.3.1), and Vite 6 (v6.0.3), all current as of early 2026. The inline CSS approach (styles in `<style>` tags within components) is acceptable for documentation pages and matches the existing pattern used successfully in CPU and Graphics Engine docs.

**Primary recommendation:** Follow the exact patterns from CpuDocsLanding.jsx and DocsPage.jsx. These represent proven, working implementations in this codebase that already satisfy all requirements.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.3.1 | UI framework | Latest stable, concurrent rendering, modern hooks API |
| React Router | 6.22.0 | Client-side routing | Industry standard for SPAs, nested routes, declarative routing |
| Vite | 6.0.3 | Build tool and dev server | Fast HMR, modern ES modules, official React tooling recommendation |
| React DOM | 18.3.1 | React rendering layer | Pairs with React 18, browser DOM rendering |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @vitejs/plugin-react | 4.3.4 | Vite React support | Enables JSX, Fast Refresh in Vite |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Router | TanStack Router | TanStack has more features but React Router is already in use and working |
| Inline CSS | CSS Modules | CSS Modules provide better isolation but inline CSS matches existing portfolio pattern |
| Vite | Create React App | CRA is deprecated; Vite is now official recommendation for React without framework |

**Installation:**
```bash
# Already installed in package.json
npm install
```

## Architecture Patterns

### Recommended Project Structure
```
src/pages/cs330/
├── Cs330DocsLanding.jsx     # Landing page at /projects/cs330/docs
├── Cs330AlgorithmPage.jsx   # Algorithm Evolution (Phase 17)
├── Cs330KdTreePage.jsx       # KD-Tree documentation (Phase 17)
├── Cs330PathfindingPage.jsx # Dijkstra pathfinding (Phase 17)
├── Cs330PerformancePage.jsx # Performance Analysis (Phase 18)
└── Cs330BonusPage.jsx        # Bonus Algorithms (Phase 19)
```

**Naming convention:** `Cs330[Topic]Page.jsx` matches existing `Cpu[Topic]Page.jsx` and `Graphics[Topic]Page.jsx` patterns.

### Pattern 1: Documentation Landing Page
**What:** Full-page React component with inline CSS, breadcrumbs, gradient header, doc cards, and footer
**When to use:** Project documentation entry point
**Example:**
```jsx
// Source: src/pages/cpu/CpuDocsLanding.jsx (proven working implementation)
import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function Cs330DocsLanding() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CS330 Case Study', href: '/projects/cs330/docs' },
    { label: 'Documentation' }
  ]

  return (
    <div>
      <style>{`
        /* Inline CSS here matching design system */
        .landing-header {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          color: white;
          padding: 4rem 2rem 3rem;
          text-align: center;
        }
        /* ... more styles ... */
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <header className="landing-header">
        <h1>CS330 Case Study</h1>
        <p>Ride-Sharing Matching Algorithm Design</p>
      </header>

      <div className="container">
        <section className="section">
          <h2>About the Project</h2>
          {/* Content */}
        </section>

        <section className="section">
          <div className="doc-cards">
            <Link to="/projects/cs330/docs/algorithm" className="doc-card">
              <h3>Algorithm Evolution</h3>
              <p>T1-T5 progression with code examples</p>
            </Link>
            {/* More cards */}
          </div>
        </section>
      </div>

      <footer style={{ /* inline styles */ }}>
        {/* Footer content */}
      </footer>
    </div>
  )
}

export default Cs330DocsLanding
```

### Pattern 2: Route Registration in App.jsx
**What:** Routes grouped by project with comments
**When to use:** Adding new project routes
**Example:**
```jsx
// Source: src/App.jsx
// Add after Graphics Engine routes, before closing </Routes>
{/* CS330 Case Study Project */}
<Route path="/projects/cs330/docs" element={<Cs330DocsLanding />} />
<Route path="/projects/cs330/docs/algorithm" element={<Cs330AlgorithmPage />} />
<Route path="/projects/cs330/docs/kdtree" element={<Cs330KdTreePage />} />
<Route path="/projects/cs330/docs/pathfinding" element={<Cs330PathfindingPage />} />
```

### Pattern 3: Body Class Management
**What:** useEffect in AppContent sets body class based on route
**When to use:** When project needs page-specific styling
**Example:**
```jsx
// Source: src/App.jsx AppContent component
useEffect(() => {
  // Scroll to top on route change
  window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

  // Remove all page-specific classes
  document.body.classList.remove(
    'home-page',
    'cpu-page',
    'graphics-page',
    'cs330-page',  // Add this
    'admin-page'
  )

  // Add class based on current route
  if (location.pathname === '/') {
    document.body.classList.add('home-page')
  } else if (location.pathname.startsWith('/projects/cpu/')) {
    document.body.classList.add('cpu-page')
  } else if (location.pathname.startsWith('/projects/graphics-engine/')) {
    document.body.classList.add('graphics-page')
  } else if (location.pathname.startsWith('/projects/cs330/')) {  // Add this
    document.body.classList.add('cs330-page')
  } else if (location.pathname === '/admin') {
    document.body.classList.add('admin-page')
  }
}, [location])
```

### Pattern 4: Breadcrumbs Component Usage
**What:** Shared Breadcrumbs component with items array
**When to use:** All documentation pages
**Example:**
```jsx
// Source: src/components/shared/Breadcrumbs.jsx
// Component accepts array of { label, href? } objects
const breadcrumbItems = [
  { label: 'Home', href: '/' },
  { label: 'CS330 Case Study', href: '/projects/cs330/docs' },
  { label: 'Documentation', href: '/projects/cs330/docs' },
  { label: 'Algorithm Evolution' }  // No href = current page
]

<Breadcrumbs items={breadcrumbItems} />
```

### Pattern 5: Design System Usage
**What:** Forest green color palette with CSS custom properties
**When to use:** All CS330 pages
**Example:**
```css
/* Source: src/styles/design-system.css */
/* Use these tokens in inline CSS: */
--color-primary: #2E7D32;           /* Forest green */
--color-primary-dark: #1B5E20;      /* Dark forest green */
--gradient-primary: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
--color-text-heading: #2c3e50;      /* Headings */
--color-text: #555;                 /* Body text */
```

### Anti-Patterns to Avoid
- **Don't use `<a>` tags for internal links:** Use React Router `<Link>` components to avoid page reloads
- **Don't use separate CSS files for doc pages:** Matches existing pattern; inline CSS keeps pages self-contained
- **Don't hardcode colors:** Use design system tokens (--color-primary, etc.) or exact hex values (#2E7D32)
- **Don't skip breadcrumbs:** Required on all pages per REACT-04
- **Don't forget aria-labels:** Breadcrumbs component has proper accessibility built-in

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Routing system | Custom hash-based router | React Router 6 | Handles nested routes, navigation state, browser history, and accessibility out of the box |
| Breadcrumb logic | Manual breadcrumb path parsing | Breadcrumbs component | Already exists, handles accessibility (aria-current, role), supports Link and external links |
| CSS scoping | Custom CSS-in-JS solution | Inline CSS in style tags | Matches existing portfolio pattern, simple, no build tooling needed |
| Page scrolling | Custom scroll restoration | window.scrollTo in useEffect | Already implemented in App.jsx, handles instant scroll on route changes |

**Key insight:** This portfolio has established patterns that work. Don't introduce new approaches (CSS modules, styled-components, breadcrumb libraries) when proven patterns exist.

## Common Pitfalls

### Pitfall 1: Route Path Mismatch
**What goes wrong:** Routes defined with trailing slash but Link uses no trailing slash (or vice versa) causing navigation failures
**Why it happens:** Inconsistency between Route path and Link to props
**How to avoid:** Use exact same path format everywhere: `/projects/cs330/docs` (no trailing slash)
**Warning signs:** Clicking link doesn't navigate, or navigates but shows 404/blank page

### Pitfall 2: Forgetting Body Class Handling
**What goes wrong:** New project routes don't trigger body class change, breaking page-specific styles
**Why it happens:** Forgot to update useEffect in App.jsx AppContent component
**How to avoid:** When adding routes for new project, add condition to body class useEffect
**Warning signs:** CSS styles from other projects bleeding into new pages

### Pitfall 3: Import Path Errors
**What goes wrong:** Import fails with "Cannot find module" even though file exists
**Why it happens:** Wrong relative path depth (../../ vs ../../../)
**How to avoid:**
- Pages in `src/pages/cs330/` need `../../components/shared/Breadcrumbs`
- Count directory levels: cs330 → pages → src = 2 levels up
**Warning signs:** Build fails with import errors, HMR doesn't work

### Pitfall 4: Inline CSS Scope Conflicts
**What goes wrong:** CSS class names from one doc page affect other pages
**Why it happens:** Inline styles still create global CSS classes
**How to avoid:** Use descriptive class names (`.cs330-header` not `.header`), or reuse common pattern classes (`.landing-header`, `.container`, `.section`)
**Warning signs:** Styles appear where they shouldn't, layout breaks on other pages

### Pitfall 5: Breaking Design System Consistency
**What goes wrong:** CS330 pages use different colors/fonts than rest of portfolio
**Why it happens:** Not referencing existing landing pages for color values
**How to avoid:** Copy exact CSS from CpuDocsLanding.jsx or DocsPage.jsx, replace content only
**Warning signs:** Visual inconsistency, reviewer feedback about "doesn't match portfolio style"

## Code Examples

Verified patterns from official sources:

### React Router 6 Nested Route Pattern
```jsx
// Source: React Router official docs - https://reactrouter.com/en/main/start/concepts
// This portfolio uses flat routes, not nested Outlet pattern
// All routes at top level in App.jsx

<Routes>
  {/* CS330 Case Study Project */}
  <Route path="/projects/cs330/docs" element={<Cs330DocsLanding />} />
  <Route path="/projects/cs330/docs/algorithm" element={<Cs330AlgorithmPage />} />
  {/* Each route is independent, no parent-child nesting */}
</Routes>
```

### React Router Link Component
```jsx
// Source: React Router official docs
// CORRECT: Use Link for internal navigation
import { Link } from 'react-router-dom'

<Link to="/projects/cs330/docs/algorithm">Algorithm Evolution</Link>

// WRONG: Don't use <a> tags for internal links
<a href="/projects/cs330/docs/algorithm">Algorithm Evolution</a>  // Causes full page reload
```

### Vite Import Paths
```jsx
// Source: Vite official docs - relative imports for React components
// From src/pages/cs330/Cs330DocsLanding.jsx
import Breadcrumbs from '../../components/shared/Breadcrumbs'  // Relative path

// This works because:
// - File location: src/pages/cs330/Cs330DocsLanding.jsx
// - Target: src/components/shared/Breadcrumbs.jsx
// - Path: up 2 levels (cs330 → pages → src), then down (components/shared)
```

### Breadcrumbs Component API
```jsx
// Source: src/components/shared/Breadcrumbs.jsx (verified implementation)
// Items array with label and optional href
const breadcrumbItems = [
  { label: 'Home', href: '/' },                        // Link
  { label: 'CS330 Case Study', href: '/projects/cs330/docs' },  // Link
  { label: 'Documentation' }                           // Current page (no href)
]

<Breadcrumbs items={breadcrumbItems} />

// Component features:
// - Renders <nav> with aria-label="Breadcrumb"
// - Uses React Router <Link> for internal navigation
// - Supports external links with { href, external: true }
// - Last item without href gets aria-current="page"
// - Separator (›) between items with aria-hidden="true"
```

### Design System CSS Variables
```css
/* Source: src/styles/design-system.css (verified tokens) */
.landing-header {
  /* Use CSS custom properties from design system */
  background: var(--gradient-primary);  /* linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%) */
  color: white;
  padding: var(--space-xl, 3.25rem) var(--space-lg, 2rem) var(--space-lg);
}

/* Or use exact hex values (both approaches used in codebase) */
.landing-header {
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  color: white;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Create React App | Vite | 2023-2024 | Faster dev server, official React recommendation, better DX |
| React Router 5 | React Router 6 | 2021 | Declarative routing, nested routes, smaller bundle size |
| Class components | Function components + Hooks | React 16.8+ (2019) | Simpler code, better for concurrent rendering, official recommendation |
| Separate CSS files | Inline CSS in style tags | Project decision | Matches portfolio pattern, keeps pages self-contained |
| CSS-in-JS libraries | Native CSS approaches | 2024+ trend | Simpler, faster builds, less runtime overhead |

**Deprecated/outdated:**
- Create React App: Officially deprecated; use Vite or framework like Next.js
- React Router <Switch>: Replaced by <Routes> in v6
- React Router exact prop: No longer needed in v6, routes ranked by specificity
- Class components: Still work but function components + hooks recommended for new code

## Open Questions

1. **Should CS330 have a demo page like CPU/Graphics?**
   - What we know: Requirements specify documentation-only (no interactive demo)
   - What's unclear: Would a simple matching visualization add value?
   - Recommendation: Follow requirements (DOC-01 to DOC-07, no demo page). URL pattern is `/projects/cs330/docs`, not `/projects/cs330/demo`

2. **Should CS330 use same footer pattern as CPU/Graphics?**
   - What we know: Both existing projects have large inline footer with 4 columns
   - What's unclear: Is this footer required or just a pattern?
   - Recommendation: Use same footer pattern for consistency (copy footer JSX from CpuDocsLanding.jsx, update links)

3. **Where should performance graphs be stored?**
   - What we know: Requirement VIZ-04 says `public/projects/cs330/images/` or similar
   - What's unclear: Exact directory structure
   - Recommendation: Use `public/projects/cs330/images/` to match pattern `public/projects/graphics-engine/docs/assets/images/`

## Sources

### Primary (HIGH confidence)
- Existing codebase files (verified working implementations):
  - `src/App.jsx` - Route registration pattern, body class management
  - `src/pages/cpu/CpuDocsLanding.jsx` - Landing page pattern
  - `src/pages/graphics/DocsPage.jsx` - Landing page pattern
  - `src/pages/cpu/CpuAluPage.jsx` - Individual doc page pattern
  - `src/components/shared/Breadcrumbs.jsx` - Breadcrumbs component API
  - `src/styles/design-system.css` - Design system tokens
  - `package.json` - Installed dependencies and versions
  - `vite.config.js` - Vite configuration
- `.planning/REQUIREMENTS.md` - v1.2 requirements (verified 2026-02-18)
- `.planning/ROADMAP.md` - Phase 16 requirements and success criteria

### Secondary (MEDIUM confidence)
- [React Router Official Documentation](https://reactrouter.com/) - Routing patterns and API
- [Vite Official Guide](https://vite.dev/guide/) - Build configuration and best practices
- [React Stack Patterns 2026](https://www.patterns.dev/react/react-2026/) - Modern React patterns
- [How to Set Up a Production-Ready React Project with Vite (Jan 2026)](https://oneuptime.com/blog/post/2026-01-08-react-typescript-vite-production-setup/view) - Current Vite best practices
- [React Router v6 Guide](https://blog.webdevsimplified.com/2022-07/react-router/) - Routing patterns
- [React Breadcrumbs Component - Material UI](https://mui.com/material-ui/react-breadcrumbs/) - Accessibility best practices
- [React Navigation - Build a Breadcrumb Component](https://www.freecodecamp.org/news/react-navigation-build-a-breadcrumb-component/) - Implementation patterns
- [React Folder Structure in 5 Steps](https://www.robinwieruch.de/react-folder-structure/) - Organization patterns

### Tertiary (LOW confidence)
- None - all claims verified with codebase or official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified in package.json, official docs confirm current status
- Architecture: HIGH - Patterns extracted from working code in this repository
- Pitfalls: HIGH - Based on common React Router and Vite issues documented in official guides
- Code examples: HIGH - All examples from verified sources (codebase or official docs)

**Research date:** 2026-02-18
**Valid until:** 2026-03-18 (30 days - stable ecosystem, React 18 and React Router 6 are mature)

**Notes:**
- This phase has high confidence because it follows established patterns already working in the codebase
- No experimental features or cutting-edge tools required
- All patterns are proven through existing CPU and Graphics Engine implementations
- Requirements are clear and well-defined in REQUIREMENTS.md
