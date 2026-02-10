# Phase 8: Visual Polish - Research

**Researched:** 2026-02-09
**Domain:** CSS/HTML visual design, design systems, responsive patterns
**Confidence:** HIGH

## Summary

Phase 8 focuses on applying professional visual polish to the existing live site structure without restructuring URLs or navigation. The site currently consists of a portfolio homepage (index.html), demo pages (wasm-graphics-demo.html, graphics-demo.html, admin.html), and documentation (7 pages in docs/).

Current analysis reveals significant style inconsistencies: the homepage uses green gradients (#2E7D32, #1B5E20), while demo/admin pages use purple/blue (#667eea, #764ba2), and documentation uses mixed green accents with dark headers. Typography is inconsistent across pages with varying font sizes, line heights, and spacing patterns. The site has no unified design token system, and responsive patterns are implemented ad-hoc with different breakpoints and approaches per page.

Modern 2026 best practices emphasize CSS custom properties for design tokens, semantic color naming, consistent spacing scales using rem units, subtle animations under 300ms, and accessibility-first patterns for mobile navigation. The research identifies clear implementation patterns for unifying the green color scheme, establishing consistent typography, implementing professional micro-interactions, and creating a mobile-responsive hamburger menu.

**Primary recommendation:** Establish a centralized design system using CSS custom properties (:root variables) for colors, spacing, and typography, then systematically apply these tokens across all pages to create visual consistency while maintaining the existing file structure.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Color Scheme & Branding:**
- Unified green palette throughout the site (not purple/blue gradients)
- Primary green: User prefers consistency across portfolio and graphics engine pages
- "Make sure that the style is the same or similar for the landing page of the portfolio and the individual pages of the graphics engine project. The whole website should flow with the same style."

**Typography & Readability:**
- System font stack for body and headings (keep current approach)
- Balanced spacing - not too cramped, not too spacious
- Code fonts: Claude's discretion for documentation code blocks

**Navigation & Page Flow:**
- Root-level structure - All pages stay at current paths (no /projects/ restructuring)
- Minimal, clean navigation - Users should easily navigate between: Portfolio homepage ↔ Demo pages ↔ Documentation
- Context-aware repo links - "View Source" links should point to the graphics-engine repo (not portfolio repo)
- Link optimization - Don't over-link to the same pages (e.g., if demo is linked multiple times, reduce redundancy)

**Animations & Interactions:**
- Minimal and subtle animations
- No distracting or excessive motion
- Smooth, professional micro-interactions

**Responsive Design:**
- Hamburger menu for mobile navigation
- Same content hierarchy across devices
- Tablet and mobile breakpoints: Claude's discretion

### Claude's Discretion

- Exact spacing values and measurements
- Loading states and transitions
- Tablet viewport breakpoints
- Mobile demo layout specifics
- Exact animation timing and easing

### Deferred Ideas (OUT OF SCOPE)

None - discussion stayed within phase scope

</user_constraints>

## Standard Stack

### Core

| Library/Technology | Version | Purpose | Why Standard |
|-------------------|---------|---------|--------------|
| CSS Custom Properties | Native CSS | Design token system | Industry standard for maintainable design systems, supported in all modern browsers (2026) |
| System Font Stack | Native CSS | Typography | Zero latency, native OS fonts, excellent readability, already implemented in site |
| CSS Grid & Flexbox | Native CSS | Layout system | Modern standard for responsive layouts, no framework needed |
| CSS Transitions | Native CSS | Animations | Lightweight, performant, sufficient for subtle micro-interactions |
| Media Queries | Native CSS | Responsive design | Standard approach for breakpoint-based responsive design |

### Supporting

| Library/Technology | Version | Purpose | When to Use |
|-------------------|---------|---------|-------------|
| Prism.js | 1.30.0 | Code syntax highlighting | Already in use for docs, keep VS Code Dark+ theme |
| CSS @layer | Native CSS (2026) | Cascade control | Optional for managing specificity in complex stylesheets |
| :where() selector | Native CSS (2026) | Specificity management | Reduce specificity conflicts when refactoring |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Custom Properties | Sass/SCSS variables | Sass requires build step, custom properties are runtime-dynamic and native |
| Vanilla CSS | Tailwind CSS | Tailwind would require rewriting all HTML, contradicts minimal change goal |
| CSS Transitions | JavaScript animation libraries (GSAP, Framer Motion) | Overkill for subtle micro-interactions, adds bundle size |
| Native hamburger | jQuery menu plugins | jQuery is outdated (2026), native is lighter and more maintainable |

**Installation:**
No installation required - all technologies are native browser features or already included (Prism.js).

## Architecture Patterns

### Recommended Project Structure

Current structure (maintained):
```
.
├── index.html                      # Portfolio homepage
├── wasm-graphics-demo.html        # WebAssembly demo
├── graphics-demo.html             # JavaScript demo
├── admin.html                     # Admin/source viewer
├── docs/
│   ├── index.html                 # Docs landing
│   ├── core-rendering.html        # 6 content pages
│   └── assets/
│       └── css/
│           ├── docs.css           # Main documentation styles
│           └── code.css           # Code block overrides
└── assets/                        # NEW: Shared design system (recommended)
    └── css/
        └── design-system.css      # Design tokens & utilities
```

**Key principle:** Don't restructure files. Add a shared design system CSS file that all pages can reference.

### Pattern 1: CSS Custom Properties Design System

**What:** Centralized design tokens in :root using CSS custom properties
**When to use:** For all color, spacing, typography, and timing values across the site

**Example:**
```css
/* Source: Modern CSS design token patterns (2026) */
/* https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns */

:root {
  /* Color System - Semantic naming */
  --color-primary: #2E7D32;
  --color-primary-dark: #1B5E20;
  --color-primary-light: #4CAF50;

  --color-surface: #ffffff;
  --color-background: #f5f5f5;

  --color-text-primary: #2c3e50;
  --color-text-secondary: #555;
  --color-text-muted: #666;

  --color-accent: #2E7D32;
  --color-error: #e74c3c;

  /* Spacing Scale - 0.25rem increments then fibonacci */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */

  /* Typography Scale */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-family-mono: 'Monaco', 'Courier New', 'Consolas', monospace;

  --font-size-sm: 0.85rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.1rem;
  --font-size-xl: 1.3rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 3rem;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.4;
  --line-height-normal: 1.6;
  --line-height-relaxed: 1.8;

  /* Animation Timing */
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;

  --easing-smooth: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --easing-enter: cubic-bezier(0, 0, 0.2, 1);
  --easing-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Borders & Shadows */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-radius-xl: 12px;

  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 20px rgba(46, 125, 50, 0.3);
  --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.3);
}

/* Usage */
.button {
  background: var(--color-primary);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--border-radius-md);
  transition: background var(--duration-base) var(--easing-smooth);
}

.button:hover {
  background: var(--color-primary-dark);
  box-shadow: var(--shadow-md);
}
```

### Pattern 2: Gradient Unification

**What:** Convert purple/blue gradients to green equivalents
**When to use:** Headers, backgrounds, and accent elements across all pages

**Example:**
```css
/* OLD (purple/blue - demo pages) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* NEW (unified green) */
background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
/* OR specifically: */
background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
```

### Pattern 3: Responsive Hamburger Menu

**What:** Accessible mobile navigation with hamburger toggle
**When to use:** All pages for mobile breakpoint (< 768px)

**Example:**
```css
/* Source: Accessibility-first hamburger patterns (2026) */
/* https://a11ymatters.com/pattern/mobile-nav/ */

/* Hamburger button - hidden on desktop */
.hamburger {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
}

.hamburger-icon {
  display: block;
  width: 24px;
  height: 2px;
  background: currentColor;
  position: relative;
  transition: background var(--duration-base) var(--easing-smooth);
}

.hamburger-icon::before,
.hamburger-icon::after {
  content: '';
  display: block;
  width: 24px;
  height: 2px;
  background: currentColor;
  position: absolute;
  transition: transform var(--duration-base) var(--easing-smooth);
}

.hamburger-icon::before { top: -8px; }
.hamburger-icon::after { top: 8px; }

/* Animated hamburger to X */
.hamburger[aria-expanded="true"] .hamburger-icon {
  background: transparent;
}

.hamburger[aria-expanded="true"] .hamburger-icon::before {
  transform: translateY(8px) rotate(45deg);
}

.hamburger[aria-expanded="true"] .hamburger-icon::after {
  transform: translateY(-8px) rotate(-45deg);
}

/* Mobile navigation */
@media (max-width: 768px) {
  .hamburger { display: block; }

  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 80%;
    max-width: 300px;
    background: white;
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    transition: right var(--duration-slow) var(--easing-enter);
    overflow-y: auto;
    z-index: 1000;
  }

  .main-nav.open {
    right: 0;
  }

  /* Overlay backdrop */
  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--duration-base), visibility var(--duration-base);
    z-index: 999;
  }

  .nav-overlay.open {
    opacity: 1;
    visibility: visible;
  }
}
```

**JavaScript (minimal, required for accessibility):**
```javascript
// Source: ARIA state management for hamburger menus
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');
const overlay = document.querySelector('.nav-overlay');

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  hamburger.setAttribute('aria-expanded', !isOpen);
  nav.classList.toggle('open');
  overlay.classList.toggle('open');
});

overlay.addEventListener('click', () => {
  hamburger.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  overlay.classList.remove('open');
});

// ESC key to close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    hamburger.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    overlay.classList.remove('open');
  }
});
```

### Pattern 4: Subtle Micro-Interactions

**What:** Professional, minimal animations for user feedback
**When to use:** Buttons, links, cards, form elements

**Example:**
```css
/* Source: Professional micro-interaction patterns (2026) */
/* https://blog.pixelfreestudio.com/best-practices-for-animating-micro-interactions-with-css/ */

/* Button hover - smooth scale and shadow */
.button {
  transition:
    transform var(--duration-fast) var(--easing-smooth),
    box-shadow var(--duration-fast) var(--easing-smooth);
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button:active {
  transform: translateY(0);
}

/* Card hover - lift effect */
.card {
  transition:
    transform var(--duration-base) var(--easing-smooth),
    box-shadow var(--duration-base) var(--easing-smooth);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

/* Link underline animation */
.link {
  position: relative;
  text-decoration: none;
}

.link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--duration-base) var(--easing-smooth);
}

.link:hover::after {
  width: 100%;
}

/* Loading state - subtle pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.loading {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Anti-Patterns to Avoid

- **Overly specific selectors:** Use `.button` not `div.container a.button.primary` (specificity war)
- **!important overuse:** Reserve for true exceptions only, not for fixing specificity problems
- **Inconsistent color values:** Always use design tokens, never raw hex values scattered across files
- **Fixed pixel units for spacing:** Use rem for spacing to respect user font size preferences
- **Long animation durations:** Keep under 350ms for micro-interactions, over 500ms feels sluggish
- **Hover effects without transitions:** Always transition property changes for smooth UX
- **Missing focus states:** Every interactive element needs visible focus for keyboard navigation
- **Responsive design with pixel breakpoints only:** Consider content-based breakpoints too

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color contrast validation | Manual color picker trial-and-error | WebAIM Contrast Checker, browser DevTools contrast tools | WCAG AA requires 4.5:1 for text, 3:1 for UI components - tools guarantee compliance |
| Animation easing curves | Random cubic-bezier values | Standard easing keywords (ease, ease-in-out) or easings.net | Professional curves are well-tested, custom curves often feel unnatural |
| Responsive breakpoints | Device-specific pixel values | Content-based breakpoints + standard ranges (768px, 1024px) | Devices change constantly, content breakpoints are future-proof |
| CSS reset/normalize | Custom reset from scratch | Modern CSS reset (https://www.joshwcomeau.com/css/custom-css-reset/) | Handles cross-browser quirks comprehensively |
| Color palette generation | Manual hex selection | OKLCH color space tools (2026), or existing palette as baseline | Color harmony and accessibility require systematic approach |
| Hamburger menu animations | Complex transform chains | Standard 3-bar to X pattern (documented above) | Well-tested pattern, accessible, works across devices |
| Spacing scale | Random rem values | Fibonacci or 0.25rem increment system | Mathematical scale ensures visual harmony |

**Key insight:** Visual polish problems appear simple but have subtle accessibility, cross-browser, and UX implications that take years to perfect. Use battle-tested patterns and tools rather than rebuilding from scratch.

## Common Pitfalls

### Pitfall 1: Color Scheme Migration Breaks Contrast

**What goes wrong:** Replacing purple/blue (#667eea, #764ba2) with green without checking contrast ratios can make text unreadable, especially light green on white or dark green on dark backgrounds.

**Why it happens:** Purple and green have different luminance values at similar saturation levels. Pure green (#00FF00) has only 1.4:1 contrast against white, failing WCAG standards.

**How to avoid:**
- Use WebAIM Contrast Checker for every color combination
- Ensure text on primary green meets 4.5:1 (AA) or 7:1 (AAA) contrast
- Test both light and dark green variants
- Current homepage green (#2E7D32) has good contrast - validate before changing

**Warning signs:** Squinting to read text, light green appearing washed out, dark green looking muddy

### Pitfall 2: Inconsistent Design Tokens Across Files

**What goes wrong:** Creating design-system.css but continuing to use hard-coded values in individual page `<style>` blocks leads to partial consistency, with some pages updated and others forgotten.

**Why it happens:** Each HTML file has inline styles, and refactoring all of them is easy to do incompletely. Search/replace misses variations (e.g., #667eea vs rgba(102, 126, 234)).

**How to avoid:**
- Grep entire codebase for old color values: `grep -r "#667eea" *.html`
- Document ALL token replacements in a checklist
- Test every page visually after changes
- Consider moving ALL styles to external CSS files (not inline `<style>`)

**Warning signs:** Some pages look updated, others still have old purple/blue; inconsistent padding/margins between pages

### Pitfall 3: Mobile Menu Breaks Keyboard Navigation

**What goes wrong:** Hamburger menu works with mouse/touch but keyboard users can't tab to menu items, or ESC key doesn't close menu, failing accessibility standards.

**Why it happens:** Forgetting to add JavaScript for aria-expanded state management, or hiding menu with `display: none` instead of `visibility: hidden` (which removes elements from tab order permanently).

**How to avoid:**
- Test with keyboard only: Tab, Enter, ESC must work
- Use `aria-expanded`, `aria-controls`, and `aria-label` attributes
- Ensure menu items remain in tab order when open
- Add focus trap to keep keyboard navigation within open menu
- Test with screen reader (VoiceOver on Mac, NVDA on Windows)

**Warning signs:** Can't tab to hamburger button, menu opens but can't navigate items, ESC key does nothing, screen reader doesn't announce menu state

### Pitfall 4: Animation Causes Vestibular Issues

**What goes wrong:** Parallax effects, auto-playing animations, or bouncy transitions trigger nausea and dizziness for users with vestibular disorders, violating WCAG 2.1 Success Criterion 2.3.3.

**Why it happens:** Designing for aesthetic without considering accessibility. Motion can be beautiful but harmful to ~35% of adults over 40.

**How to avoid:**
- Respect `prefers-reduced-motion` media query
- Keep animations under 350ms and subtle (small transforms)
- Avoid parallax, auto-play, and infinite animations
- Provide pause controls for any animations over 5 seconds

**Example:**
```css
/* Default: subtle animation */
.card {
  transition: transform 250ms ease;
}

.card:hover {
  transform: translateY(-5px);
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }

  .card:hover {
    transform: none; /* Or reduce to minimal shift */
  }
}
```

**Warning signs:** User feedback about dizziness, animations feel "too bouncy," parallax scrolling present

### Pitfall 5: Responsive Breakpoints Break Layout

**What goes wrong:** Content overflows containers, hamburger menu overlaps content, or text becomes unreadable at tablet breakpoints (768px-1024px) because testing focused only on mobile and desktop.

**Why it happens:** Tablet viewport is the "awkward middle" - not quite mobile, not quite desktop. Easy to forget to test.

**How to avoid:**
- Test at three breakpoints: 375px (mobile), 768px (tablet portrait), 1024px (tablet landscape), 1440px (desktop)
- Use browser DevTools responsive mode with actual device presets
- Check both portrait and landscape orientations
- Use `min-width` and `max-width` media queries together for precise control

**Warning signs:** Sidebar navigation awkward on tablet, demo page canvas too large/small, text wrapping strangely at 800px

### Pitfall 6: Specificity Wars from Inline Styles

**What goes wrong:** Inline `<style>` blocks in each HTML file create high-specificity rules that conflict with shared design-system.css, requiring !important to override, which then creates cascade chaos.

**Why it happens:** Current architecture has styles embedded in HTML files. Adding external CSS creates specificity conflicts.

**How to avoid:**
- Use `:where()` selector in design-system.css to reduce specificity: `:where(.button) { }`
- Consider refactoring inline styles to external CSS gradually
- Use CSS @layer to control cascade explicitly (design-system as base layer)
- Avoid !important except for utility classes

**Warning signs:** Need !important to make changes work, styles randomly stop applying, can't override design tokens

## Code Examples

### Example 1: Complete Design System Integration

**File: assets/css/design-system.css**
```css
/* Source: Compiled from research on CSS design tokens and custom properties (2026) */
/* https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns */

:root {
  /* Colors - Green unified palette */
  --color-primary: #2E7D32;
  --color-primary-dark: #1B5E20;
  --color-primary-light: #4CAF50;
  --color-surface: #ffffff;
  --color-background: #f5f5f5;
  --color-background-alt: #f8f9fa;
  --color-text-primary: #2c3e50;
  --color-text-secondary: #555;
  --color-text-muted: #666;
  --color-border: #ddd;
  --color-error: #e74c3c;

  /* Spacing - Fibonacci-inspired scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Typography */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-family-mono: 'Monaco', 'Courier New', 'Consolas', monospace;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.85rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.1rem;
  --font-size-xl: 1.3rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 2rem;
  --font-size-4xl: 2.5rem;
  --font-size-5xl: 3rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --line-height-tight: 1.4;
  --line-height-normal: 1.6;
  --line-height-relaxed: 1.8;

  /* Animation */
  --duration-instant: 100ms;
  --duration-fast: 150ms;
  --duration-base: 250ms;
  --duration-slow: 350ms;
  --duration-slower: 500ms;
  --easing-smooth: cubic-bezier(0.25, 0.1, 0.25, 1.0);
  --easing-enter: cubic-bezier(0, 0, 0.2, 1);
  --easing-exit: cubic-bezier(0.4, 0, 1, 1);

  /* Borders & Effects */
  --border-radius-sm: 4px;
  --border-radius-md: 6px;
  --border-radius-lg: 8px;
  --border-radius-xl: 12px;
  --border-radius-2xl: 20px;
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 20px rgba(46, 125, 50, 0.3);
  --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.3);

  /* Container sizes */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1200px;
  --container-2xl: 1400px;
}

/* Base reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Body defaults */
body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
  background: var(--color-background);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Typography utilities */
h1, h2, h3, h4, h5, h6 {
  line-height: var(--line-height-tight);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

/* Accessibility - reduce motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Example 2: Page Header Unification

**Pattern for all pages (index.html, demos, admin, docs):**
```css
/* Replace purple/blue headers with unified green gradient */
/* OLD: linear-gradient(135deg, #667eea 0%, #764ba2 100%) */

.page-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  padding: var(--space-12) var(--space-8);
  text-align: center;
  box-shadow: var(--shadow-md);
}

.page-header h1 {
  font-size: var(--font-size-5xl);
  font-weight: var(--font-weight-bold);
  margin-bottom: var(--space-2);
}

.page-header p {
  font-size: var(--font-size-xl);
  opacity: 0.95;
  line-height: var(--line-height-normal);
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    padding: var(--space-8) var(--space-4);
  }

  .page-header h1 {
    font-size: var(--font-size-3xl);
  }

  .page-header p {
    font-size: var(--font-size-base);
  }
}
```

### Example 3: Button Component System

```css
/* Unified button styles across all pages */
.btn {
  display: inline-block;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition:
    background var(--duration-base) var(--easing-smooth),
    transform var(--duration-fast) var(--easing-smooth),
    box-shadow var(--duration-fast) var(--easing-smooth);
  font-family: inherit;
  font-size: var(--font-size-base);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-outline {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary);
  color: white;
}

/* Focus state for accessibility */
.btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Disabled state */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none !important;
}
```

### Example 4: Responsive Navigation with Hamburger

**HTML structure:**
```html
<header class="site-header">
  <div class="header-container">
    <a href="/" class="logo">Aaron Diefes</a>

    <button
      class="hamburger"
      aria-label="Toggle navigation menu"
      aria-expanded="false"
      aria-controls="main-nav">
      <span class="hamburger-icon" aria-hidden="true"></span>
    </button>

    <nav id="main-nav" class="main-nav">
      <a href="/">Portfolio</a>
      <a href="/wasm-graphics-demo.html">WebAssembly Demo</a>
      <a href="/graphics-demo.html">JS Demo</a>
      <a href="/docs/">Documentation</a>
      <a href="/admin.html">Source Code</a>
    </nav>
  </div>

  <div class="nav-overlay" aria-hidden="true"></div>
</header>
```

**CSS:**
```css
/* Source: Accessible mobile navigation patterns */
/* https://a11ymatters.com/pattern/mobile-nav/ */

.site-header {
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: var(--container-xl);
  margin: 0 auto;
  padding: var(--space-4) var(--space-6);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  text-decoration: none;
}

.hamburger {
  display: none;
}

.main-nav {
  display: flex;
  gap: var(--space-6);
}

.main-nav a {
  color: var(--color-text-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
  transition: color var(--duration-base) var(--easing-smooth);
  position: relative;
}

.main-nav a:hover {
  color: var(--color-primary);
}

.main-nav a::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width var(--duration-base) var(--easing-smooth);
}

.main-nav a:hover::after {
  width: 100%;
}

/* Mobile styles */
@media (max-width: 768px) {
  .hamburger {
    display: block;
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-2);
    z-index: 1001;
    position: relative;
  }

  .hamburger-icon {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text-primary);
    position: relative;
    transition: background var(--duration-base) var(--easing-smooth);
  }

  .hamburger-icon::before,
  .hamburger-icon::after {
    content: '';
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-text-primary);
    position: absolute;
    left: 0;
    transition: transform var(--duration-base) var(--easing-smooth);
  }

  .hamburger-icon::before { top: -8px; }
  .hamburger-icon::after { top: 8px; }

  .hamburger[aria-expanded="true"] .hamburger-icon {
    background: transparent;
  }

  .hamburger[aria-expanded="true"] .hamburger-icon::before {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger[aria-expanded="true"] .hamburger-icon::after {
    transform: translateY(-8px) rotate(-45deg);
  }

  .main-nav {
    position: fixed;
    top: 0;
    right: -100%;
    height: 100vh;
    width: 80%;
    max-width: 300px;
    background: var(--color-surface);
    box-shadow: -2px 0 10px rgba(0,0,0,0.1);
    flex-direction: column;
    padding: var(--space-16) var(--space-6) var(--space-6);
    transition: right var(--duration-slow) var(--easing-enter);
    overflow-y: auto;
    z-index: 1000;
  }

  .main-nav.open {
    right: 0;
  }

  .main-nav a {
    padding: var(--space-4) 0;
    border-bottom: 1px solid var(--color-border);
  }

  .nav-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    opacity: 0;
    visibility: hidden;
    transition: opacity var(--duration-base), visibility var(--duration-base);
    z-index: 999;
  }

  .nav-overlay.open {
    opacity: 1;
    visibility: visible;
  }
}
```

**JavaScript:**
```javascript
// Source: Accessibility-compliant hamburger interaction
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.main-nav');
const overlay = document.querySelector('.nav-overlay');

function closeNav() {
  hamburger.setAttribute('aria-expanded', 'false');
  nav.classList.remove('open');
  overlay.classList.remove('open');
}

function openNav() {
  hamburger.setAttribute('aria-expanded', 'true');
  nav.classList.add('open');
  overlay.classList.add('open');
}

hamburger.addEventListener('click', () => {
  const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
  isOpen ? closeNav() : openNav();
});

overlay.addEventListener('click', closeNav);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    closeNav();
  }
});
```

## State of the Art

| Old Approach | Current Approach (2026) | When Changed | Impact |
|--------------|-------------------------|--------------|--------|
| Sass/SCSS variables | CSS Custom Properties (native) | 2015-2020 transition | No build step required, runtime dynamic, better for theming |
| px for all units | rem/em for spacing and typography | 2018+ standard | Respects user font size preferences, better accessibility |
| jQuery for interactions | Vanilla JavaScript + native APIs | 2020+ mainstream | Lighter bundles, faster performance, better maintained |
| Fixed breakpoints | Container queries (2023+) | 2023-2024 adoption | Components responsive to their container, not viewport |
| cubic-bezier() manual | Easing function names or easings.net | Always preferred | Pre-tested curves feel more natural |
| Flexbox only | CSS Grid + Flexbox hybrid | 2018+ standard | Grid for 2D layouts, Flexbox for 1D, use both |
| Mobile-last design | Mobile-first design | 2015+ industry standard | Better performance, progressive enhancement |
| Vendor prefixes everywhere | Autoprefixer or PostCSS | 2016+ tooling | Auto-generated, no manual maintenance |

**Deprecated/outdated:**
- **jQuery:** No longer needed in 2026, vanilla JavaScript is sufficient and faster
- **Bootstrap/Foundation:** Utility frameworks like Tailwind or custom design systems preferred
- **Float-based layouts:** CSS Grid and Flexbox replaced floats entirely
- **px-only typography:** Fails accessibility, use rem with 16px base
- **CSS resets (normalize.css):** Modern browsers need minimal reset, use custom reset
- **@import in CSS:** Use build tools or link tags, @import blocks parallel loading
- **Browser-specific hacks:** Feature detection and autoprefixer handle this now

## Open Questions

### 1. Code Block Syntax Highlighting Consistency

**What we know:** Documentation uses Prism.js with VS Code Dark+ theme. Demo pages have their own code styling. Admin page shows code in plain text with Monaco font.

**What's unclear:** Should all code displays use Prism.js for consistency, or keep admin simple? Does Prism.js theme need color adjustments for unified green palette?

**Recommendation:** Keep Prism.js for documentation (complex syntax highlighting needed), use consistent Monaco font styling for inline code across all pages. Don't force Prism.js on admin page (simpler is better for file tree view).

### 2. Demo Page Canvas Responsiveness

**What we know:** wasm-graphics-demo.html and graphics-demo.html have canvas elements in grid layouts (sidebar + canvas). Current breakpoint at 768px might need adjustment.

**What's unclear:** Should canvas resize proportionally on mobile, or switch to scrollable full-width? Sidebar collapses or moves to hamburger menu?

**Recommendation:** Test both approaches during implementation:
- Option A: Stack sidebar above canvas on mobile (simpler)
- Option B: Move controls to bottom sheet/accordion on mobile (more native feel)
Prefer Option A for consistency with desktop experience and simpler implementation.

### 3. Documentation Navigation Structure

**What we know:** Docs have 7 pages with breadcrumbs and footer navigation. No sidebar navigation currently.

**What's unclear:** Mobile navigation for docs - should pages link to each other via hamburger menu, or keep footer navigation only?

**Recommendation:** Add docs page list to hamburger menu on mobile for easier navigation. Keep footer navigation as secondary method. Add "Next/Previous" page links at bottom of content for linear reading flow.

## Sources

### Primary (HIGH confidence)

**CSS Design Systems & Custom Properties:**
- [Tailwind CSS Best Practices 2025-2026: Design Tokens, Typography & Responsive Patterns | FrontendTools](https://www.frontendtools.tech/blog/tailwind-css-best-practices-design-system-patterns)
- [The developer's guide to design tokens and CSS variables](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/)
- [CSS Custom Properties (--*): CSS variables - MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/--*)

**Color & Accessibility:**
- [WCAG Color Accessibility Guide 2026 | Complete AA & AAA Standards | AI Brand Colors](https://aibrandcolors.com/accessibility-guide/)
- [WebAIM: Contrast and Color Accessibility](https://webaim.org/articles/contrast/)
- [WebAIM: Contrast Checker](https://webaim.org/resources/contrastchecker/)

**Typography:**
- [Modern Web Typography Techniques for Better Readability (2025 Guide) | FrontendTools](https://www.frontendtools.tech/blog/modern-web-typography-techniques-2025-readability-guide)
- [CSS Typography Best Practices for Better Readability | Medium](https://medium.com/@aicontentpace/css-typography-best-practices-07d549f88d4f)

**Animation & Micro-Interactions:**
- [Best Practices for Animating Micro-Interactions with CSS](https://blog.pixelfreestudio.com/best-practices-for-animating-micro-interactions-with-css/)
- [CSS / JS Animation Trends 2026: Motion & Micro-Interactions](https://webpeak.org/blog/css-js-animation-trends/)
- [animation-timing-function - CSS | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/animation-timing-function)
- [Easing Functions Cheat Sheet](https://easings.net/)

**Responsive Design & Mobile Navigation:**
- [Accessibility Matters - Mobile Navigation](https://a11ymatters.com/pattern/mobile-nav/)
- [Responsive, Scalable Hamburger Menu in Accessible CSS • Christian Tietze](https://christiantietze.de/posts/2025/01/responsive-scalable-hamburger-menu-accessible-css/)

**Spacing & Units:**
- [CSS Units Guide 2025-2026: px vs rem vs em vs vh - Complete Comparison & Best Practices | FrontendTools](https://www.frontendtools.tech/blog/css-units-responsive-design-2025)
- [Why `rem` Should Be Your Default for Spacing in Modern CSS](https://dev.to/alok38/why-rem-should-be-your-default-for-spacing-in-modern-css-2l9m)

### Secondary (MEDIUM confidence)

**CSS Organization & Pitfalls:**
- [CSS Best Practices for Clean and Maintainable Code - All Things Programming](https://allthingsprogramming.com/css-best-practices-for-clean-and-maintainable-code/)
- [12 Common CSS Mistakes Web Developers Make - WebFX](https://www.webfx.com/blog/web-design/12-common-css-mistakes-web-developers-make/)

**Design System Color Palettes:**
- [Creating a Color Palette for Your Design System: Practices and Tips](https://figr.design/blog/creating-a-color-palette-for-your-design-system-practices-and-tips)
- [5 Color Palettes For Balanced Web Design In 2026](https://www.elegantthemes.com/blog/design/color-palettes-for-balanced-web-design)

### Tertiary (LOW confidence)

None - all findings verified with official sources or multiple credible sources.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All technologies are native CSS or already implemented (Prism.js)
- Architecture: HIGH - Design token pattern is industry standard, verified by multiple 2026 sources
- Pitfalls: HIGH - Common issues well-documented across accessibility and CSS best practice sources
- Code examples: HIGH - Patterns compiled from official documentation and verified 2026 guides

**Research date:** 2026-02-09
**Valid until:** ~60 days (CSS standards stable, patterns are mature - valid through April 2026)

**Coverage completeness:**
- ✅ Color scheme unification (green palette)
- ✅ Design token system (CSS custom properties)
- ✅ Typography standards (system fonts, line-height, sizing)
- ✅ Animation patterns (micro-interactions, timing, easing)
- ✅ Responsive design (breakpoints, mobile-first, hamburger menu)
- ✅ Accessibility (WCAG contrast, ARIA, keyboard navigation, reduced motion)
- ✅ Common pitfalls (specificity, color contrast, mobile menu, vestibular)
- ✅ Code organization (anti-patterns, maintainability)

**Research methodology:**
- Examined current site structure (8 HTML files, 2 CSS files)
- Searched 2026 best practices for CSS design systems, typography, animation, responsive design
- Cross-referenced accessibility standards (WCAG 2.1)
- Verified findings with multiple authoritative sources (MDN, WebAIM, industry blogs)
- Identified color inconsistencies (green vs purple/blue) across pages
- Documented patterns already working well (system fonts, docs.css structure)
