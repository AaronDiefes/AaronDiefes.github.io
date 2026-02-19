# Requirements: Technical Project Portfolio - v1.2 CS330 Case Study

**Defined:** 2026-02-16
**Core Value:** Showcase technical depth through interactive project demonstrations with comprehensive documentation

## v1.2 Requirements

### Documentation Pages (DOC)

- [ ] **DOC-01**: Visitor can navigate to `/projects/cs330/docs` and see CS330 landing page
- [ ] **DOC-02**: Landing page explains the ride-sharing matching problem and algorithm evolution
- [ ] **DOC-03**: Algorithm Evolution page documents T1-T5 progression with code examples
- [ ] **DOC-04**: KD-Tree page explains spatial indexing implementation with visualization
- [ ] **DOC-05**: Pathfinding page explains Dijkstra's algorithm on road networks
- [ ] **DOC-06**: Performance Analysis page shows D1/D2 metrics with comparison graphs
- [ ] **DOC-07**: Bonus Algorithms page documents B1-B4 advanced optimizations

### Visualizations (VIZ)

- [ ] **VIZ-01**: Performance graphs (D1/D2 time series) included in documentation
- [ ] **VIZ-02**: Supply-demand scatter plots shown in Performance Analysis
- [ ] **VIZ-03**: Algorithm comparison tables with metrics
- [ ] **VIZ-04**: Images stored in `public/projects/cs330/images/` or similar

### Integration (INT)

- [ ] **INT-01**: CS330 project card on homepage links to documentation
- [ ] **INT-02**: All CS330 pages use forest green design system (#2E7D32)
- [ ] **INT-03**: Breadcrumb navigation on all pages (Home > CS330 > Documentation > [Topic])
- [ ] **INT-04**: Routes registered in App.jsx following `/projects/cs330/docs` pattern
- [ ] **INT-05**: All pages link to GitHub repo (https://github.com/AaronDiefes/cs330-case-study)

### Code Examples (CODE)

- [ ] **CODE-01**: Python code blocks include syntax highlighting with span tags
- [ ] **CODE-02**: Key algorithms shown with annotated code snippets
- [ ] **CODE-03**: Data structure implementations explained with code

### React Implementation (REACT)

- [ ] **REACT-01**: All documentation pages are React components in `src/pages/cs330/`
- [ ] **REACT-02**: Pages use inline CSS in style tags (matching CPU/Graphics pattern)
- [ ] **REACT-03**: Python syntax highlighting uses keyword/comment/signal/operator/number span classes
- [ ] **REACT-04**: Shared Breadcrumbs component used on all pages

## Out of Scope

| Feature | Reason |
|---------|--------|
| Interactive algorithm visualizer | Documentation-only project, no demo page needed |
| Live Python code execution | Static portfolio site, no backend for execution |
| Full source code embedding | Link to GitHub for complete code, show key snippets only |
| Step-by-step algorithm animation | Significant development effort, focus on static explanations with images |
| Real-time matching simulator | Would duplicate demo functionality, keep documentation-focused |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DOC-01 | Phase 16 | Pending |
| DOC-02 | Phase 20 | Pending |
| DOC-03 | Phase 17 | Pending |
| DOC-04 | Phase 17 | Pending |
| DOC-05 | Phase 17 | Pending |
| DOC-06 | Phase 18 | Pending |
| DOC-07 | Phase 19 | Pending |
| VIZ-01 | Phase 18 | Pending |
| VIZ-02 | Phase 18 | Pending |
| VIZ-03 | Phase 18 | Pending |
| VIZ-04 | Phase 18 | Pending |
| INT-01 | Phase 20 | Pending |
| INT-02 | Phase 20 | Pending |
| INT-03 | Phase 20 | Pending |
| INT-04 | Phase 16 | Pending |
| INT-05 | Phase 20 | Pending |
| CODE-01 | Phase 17 | Pending |
| CODE-02 | Phase 17 | Pending |
| CODE-03 | Phase 17 | Pending |
| REACT-01 | Phase 16 | Pending |
| REACT-02 | Phase 16 | Pending |
| REACT-03 | Phase 17 | Pending |
| REACT-04 | Phase 16 | Pending |

**Coverage:**
- v1.2 requirements: 22 total
- Mapped to phases: 22/22 (100%)
- Unmapped: 0

**Phase Distribution:**
- Phase 16: 5 requirements (DOC-01, INT-04, REACT-01, REACT-02, REACT-04)
- Phase 17: 7 requirements (DOC-03, DOC-04, DOC-05, CODE-01, CODE-02, CODE-03, REACT-03)
- Phase 18: 4 requirements (DOC-06, VIZ-01, VIZ-02, VIZ-03, VIZ-04)
- Phase 19: 1 requirement (DOC-07)
- Phase 20: 5 requirements (DOC-02, INT-01, INT-02, INT-03, INT-05)

---
*Requirements defined: 2026-02-16*
*Last updated: 2026-02-18 after roadmap creation*
