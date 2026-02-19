---
created: 2026-02-19T00:37:01.585Z
title: Add CS330 Case Study documentation to portfolio
area: documentation
files: []
---

## Problem

CS330 Case Study project is currently only linked from homepage as "Other Projects" with external GitHub link. Should be integrated into portfolio site with comprehensive documentation following the same pattern as CPU and Graphics Engine projects.

Project exists at: https://github.com/AaronDiefes/cs330-case-study

## Solution

Create CS330 documentation following established portfolio pattern:

**URL Structure:**
- No demo page (project doesn't have interactive component)
- `/projects/cs330/docs` - Landing page
- `/projects/cs330/docs/[topic]` - Component documentation pages

**Implementation Steps:**
1. Create `src/pages/cs330/` directory
2. Create `Cs330DocsLanding.jsx` following pattern from CPU/Graphics docs
3. Create component documentation pages for different CS330 topics
4. Register routes in `App.jsx` following existing pattern
5. Update homepage to link to `/projects/cs330/docs` (not external GitHub)
6. Include images from code output in documentation pages
7. Match existing design:
   - Forest green theme (#2E7D32)
   - Inline CSS styling
   - Breadcrumbs: Home > CS330 Case Study > Documentation > [Topic]
   - Footer with GitHub repo link
   - Syntax highlighting for code blocks

**Files to Reference:**
- `src/pages/cpu/CpuDocsLanding.jsx` - Landing page pattern
- `src/pages/graphics/DocsPage.jsx` - Landing page pattern
- `src/pages/cpu/CpuAluPage.jsx` - Component doc page pattern
- `CLAUDE.md` - URL structure and navigation patterns

**Notes:**
- CS330 is a software engineering course project
- Some code produces images that should be included in docs
- No interactive demo needed (unlike CPU simulator or Graphics engine)
- Should feel like a professional portfolio piece, not a class assignment
