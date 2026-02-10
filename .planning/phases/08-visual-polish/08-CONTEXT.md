# Phase 8: Visual Polish - Context

**Gathered:** 2026-02-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply professional visual polish to the existing live site structure: homepage (index.html), demo pages (wasm-graphics-demo.html, graphics-demo.html, admin.html), and documentation (7 pages in docs/). Focus on typography, color consistency, animations, and responsive design WITHOUT restructuring file locations or navigation hierarchy.

**Important:** The live site has root-level demo/admin pages and a docs/ folder. Do NOT create `/projects/` subdirectories or restructure URLs. Polish the existing structure.

</domain>

<decisions>
## Implementation Decisions

### Color Scheme & Branding
- **Unified green palette** throughout the site (not purple/blue gradients)
- Primary green: User prefers consistency across portfolio and graphics engine pages
- "Make sure that the style is the same or similar for the landing page of the portfolio and the individual pages of the graphics engine project. The whole website should flow with the same style."

### Typography & Readability
- **System font stack** for body and headings (keep current approach)
- **Balanced spacing** - not too cramped, not too spacious
- **Code fonts**: Claude's discretion for documentation code blocks

### Navigation & Page Flow
- **Root-level structure** - All pages stay at current paths (no `/projects/` restructuring)
- **Minimal, clean navigation** - Users should easily navigate between:
  - Portfolio homepage ↔ Demo pages ↔ Documentation
- **Context-aware repo links** - "View Source" links should point to the graphics-engine repo (not portfolio repo)
- **Link optimization** - Don't over-link to the same pages (e.g., if demo is linked multiple times, reduce redundancy)

### Animations & Interactions
- **Minimal and subtle** animations
- No distracting or excessive motion
- Smooth, professional micro-interactions

### Responsive Design
- **Hamburger menu** for mobile navigation
- **Same content hierarchy** across devices
- Tablet and mobile breakpoints: Claude's discretion

### Claude's Discretion
- Exact spacing values and measurements
- Loading states and transitions
- Tablet viewport breakpoints
- Mobile demo layout specifics
- Exact animation timing and easing

</decisions>

<specifics>
## Specific Ideas

- "The whole website should flow with the same style" - consistency between portfolio landing and graphics engine pages is critical
- Green color scheme unification (replace any purple/blue with green variants)
- Link frequency optimization - remove redundant links where appropriate
- Repository link accuracy - graphics engine pages should link to graphics engine repo, not portfolio repo

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope

</deferred>

---

*Phase: 08-visual-polish*
*Context gathered: 2026-02-09*
