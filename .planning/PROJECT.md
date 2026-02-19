# Technical Project Portfolio

## Core Value

Showcase technical depth through interactive project demonstrations with comprehensive documentation, allowing visitors to explore implementations through visual walkthroughs and detailed explanations.

## Project Type

Portfolio website featuring multiple technical projects with interactive demos and in-depth documentation.

## Current Milestone: v1.2 - CS330 Case Study

**Goal:** Add CS330 algorithm design case study documentation to portfolio showcasing ride-sharing optimization algorithms with performance analysis.

**Target features:**
- Documentation-only project (no interactive demo)
- Algorithm evolution: T1-T5 progressive optimization with comparisons
- KD-tree spatial indexing deep dive
- Pathfinding with Dijkstra's algorithm on road networks
- Performance analysis with D1/D2 metric visualizations
- Bonus algorithms: Load balancing, traffic modeling, cache optimization
- Include matplotlib graphs and performance comparisons
- Match existing portfolio design and navigation patterns

## Success Criteria

The portfolio succeeds when:
- Each project has an interactive demo or visualization
- Documentation explains technical implementation details clearly
- Visitors can explore projects at their own pace with visual feedback
- Source code is accessible (either on-site or linked to GitHub)
- Site loads and runs performantly on GitHub Pages
- Design is cohesive across all projects

## Constraints

### Technical Constraints
- Must work on GitHub Pages (static hosting, no server-side processing)
- Browser compatibility: Modern browsers (Chrome, Firefox, Safari)
- Performance: Interactive demos should be responsive (< 100ms interaction feedback)
- File size: Keep page loads reasonable for portfolio visitors
- Accessibility: WCAG 2.1 AA contrast, keyboard navigation, ARIA labels

### Existing Codebase
- **v1.0 Graphics Engine**: C++ in graphics-engine/, WASM compiled
- **v1.1 CPU Simulator**: Verilog in separate repo (git@github.com:AaronDiefes/CPU.git)
- Projects stored in separate repos, referenced from portfolio site

### Scope Boundaries
- No server-side rendering or dynamic content generation
- No user account system or data persistence
- Focus on demonstration and education, not production libraries
- Documentation is informative, not tutorial-style step-by-step guides
- Demos simulate/visualize behavior (don't need to run actual compiled code)

## Context

### What Shipped (v1.0 - Graphics Engine)
- WASM-compiled C++ graphics engine with 10 interactive demos
- 7 documentation pages: Core Rendering, Transformations, Paths, Advanced Geometry, Final Features
- Unified forest green design system with responsive layouts
- Site-wide navigation with breadcrumbs
- Live at https://aarondiefes.github.io/ (tagged as v1.0)

### Target Audience
- Recruiters evaluating technical capabilities
- Engineers interested in graphics/systems programming
- Technical decision-makers assessing problem-solving skills

### Portfolio Approach
- Each project gets: Interactive demo/visualization + Documentation + GitHub link
- Progression-based documentation (basics → intermediate → advanced)
- Visual feedback and step-through capabilities
- Cohesive design system across all projects

---
*Last updated: 2026-02-16 after starting milestone v1.2*
