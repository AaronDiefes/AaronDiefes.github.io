# Phase 5: Code Examples - Research

**Researched:** 2026-02-03
**Domain:** Syntax highlighting, code documentation, tabbed interfaces, iframe embedding
**Confidence:** HIGH

## Summary

Phase 5 creates documentation pages that showcase C++ graphics engine implementation through syntax-highlighted code snippets and embedded interactive demos. The standard approach uses Prism.js for syntax highlighting with its plugin ecosystem (line numbers, line highlighting, copy-to-clipboard), vanilla JavaScript for accessible tab navigation, and iframes with lazy loading for demo embedding.

**Key findings:**
- Prism.js v1.30.0 is the established syntax highlighter with C++ support via `cpp` language identifier
- Official prism-themes repository includes VS Code Dark+ theme matching the user's requirements
- Toolbar plugin is mandatory dependency for copy-to-clipboard functionality
- Accessible tab implementation requires ARIA roles (tablist, tab), roving tabindex, and arrow key navigation
- Iframe lazy loading with `loading="lazy"` attribute defers demo loading until viewport proximity
- Server-side or build-time pre-rendering eliminates runtime highlighting overhead for static sites

**Primary recommendation:** Use Prism.js with deferred loading, official VS Code Dark+ theme, and all three plugins (line-numbers, line-highlight, copy-to-clipboard with toolbar). Implement accessible tabs with proper ARIA markup and keyboard navigation. Embed demos via iframes with `loading="lazy"` and minimal sandbox restrictions for same-origin content.

## Standard Stack

The established libraries/tools for code documentation with syntax highlighting:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prism.js | 1.30.0 | Syntax highlighting | Lightweight (2KB core), 297 languages including C++, extensive plugin ecosystem |
| prism-themes | latest | Dark themes collection | Official theme repository with VS Code Dark+ and 50+ other themes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Prism Line Numbers | 1.30.0+ | Add line numbers to code blocks | Always - required per user decision |
| Prism Line Highlight | 1.30.0+ | Highlight specific lines | Always - required per user decision |
| Prism Toolbar | 1.30.0+ | Button container for plugins | Required dependency for copy-to-clipboard |
| Prism Copy to Clipboard | 1.30.0+ | One-click code copying | Always - required per user decision |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Prism.js | Highlight.js | More languages (over 300), but heavier bundle, less granular plugin system |
| Prism.js | Shiki | VS Code's actual highlighter, perfect accuracy, but can be slow (10+ seconds for few blocks) |
| Runtime highlighting | Build-time pre-rendering | Zero client-side JS, instant display, but requires build step for content updates |

**Installation (CDN approach):**
```html
<!-- Core Prism -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/themes/prism.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.js"></script>

<!-- C++ Language Support -->
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-cpp.min.js"></script>

<!-- Plugins (order matters: Toolbar before Copy-to-Clipboard) -->
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-highlight/prism-line-highlight.css" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/toolbar/prism-toolbar.css" rel="stylesheet" />

<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-highlight/prism-line-highlight.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/toolbar/prism-toolbar.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>

<!-- VS Code Dark+ Theme (replace prism.css) -->
<link href="https://cdn.jsdelivr.net/npm/prism-themes/themes/prism-vsc-dark-plus.css" rel="stylesheet" />
```

**Installation (Download approach):**
Visit https://prismjs.com/download.html and select:
- Minified version
- Theme: Default (will be replaced with prism-themes)
- Language: C/C-like/C++
- Plugins: Line Numbers, Line Highlight, Toolbar, Copy to Clipboard

## Architecture Patterns

### Recommended Project Structure
```
docs/
├── rendering.html          # Rendering basics documentation
├── shaders.html            # Shaders system documentation
├── advanced.html           # Advanced features documentation
├── architecture.html       # Architecture overview documentation
├── assets/
│   ├── css/
│   │   ├── docs.css       # Documentation page styles
│   │   ├── tabs.css       # Tab interface styles
│   │   └── code.css       # Code block customizations
│   └── js/
│       ├── tabs.js        # Accessible tab implementation
│       └── docs.js        # Documentation page scripts
└── code-snippets/
    ├── blend_modes.cpp    # Extracted code snippets
    ├── shader_linear.cpp  # Linear gradient implementation
    └── ...                # Other focused excerpts
```

### Pattern 1: Prism.js Setup with Deferred Loading
**What:** Load Prism.js with `defer` attribute for non-blocking parsing
**When to use:** Always for static documentation sites
**Example:**
```html
<!-- Add defer to prevent blocking DOM parsing -->
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-cpp.min.js"></script>
```
**Why:** Prism auto-detects page loading state and delays highlighting until DOM ready. `defer` ensures scripts execute in order after parsing completes, avoiding DOMContentLoaded race conditions that occur with `async`.

**Source:** [GitHub Issue #2149](https://github.com/PrismJS/prism/issues/2149), [Prism docs](https://prismjs.com/)

### Pattern 2: Code Block Markup with All Features
**What:** HTML structure enabling line numbers, line highlighting, and copy button
**When to use:** Every code snippet in documentation
**Example:**
```html
<pre class="line-numbers" data-line="23-25,35" data-start="20"><code class="language-cpp">
// S + (1 - Sa)*D
GPixel src_over_mode(GPixel src, GPixel dest){
    int sa = GPixel_GetA(src);
    int sr = GPixel_GetR(src);
    // ... implementation details

    int ba = sa + div255((255-sa)*da);
    int br = sr + div255((255-sa)*dr);
    return GPixel_PackARGB(ba, br, bg, bb);
}
</code></pre>
```

**Attributes explained:**
- `class="line-numbers"` on `<pre>` - Enables line number plugin
- `data-line="23-25,35"` - Highlights lines 23-25 and 35
- `data-start="20"` - First line displays as line 20 (for context)
- `class="language-cpp"` on `<code>` - Triggers C++ syntax highlighting

**Source:** [Prism Line Numbers plugin](https://prismjs.com/plugins/line-numbers/), [Prism Line Highlight plugin](https://prismjs.com/plugins/line-highlight/)

### Pattern 3: Accessible Tab Interface
**What:** Keyboard-navigable tabs with ARIA markup and roving tabindex
**When to use:** Multi-view code documentation (API usage, implementation, shader logic)
**Example:**
```html
<div class="tabs">
  <div role="tablist" aria-label="Shader implementations">
    <button role="tab" aria-selected="true" aria-controls="linear-panel" id="linear-tab" tabindex="0">
      Linear Gradient
    </button>
    <button role="tab" aria-selected="false" aria-controls="radial-panel" id="radial-tab" tabindex="-1">
      Radial Gradient
    </button>
  </div>

  <div role="tabpanel" id="linear-panel" aria-labelledby="linear-tab">
    <!-- Code snippet here -->
  </div>
  <div role="tabpanel" id="radial-panel" aria-labelledby="radial-tab" hidden>
    <!-- Code snippet here -->
  </div>
</div>
```

**JavaScript requirements:**
```javascript
// Roving tabindex management
function selectTab(tab) {
  // Set aria-selected, update tabindex (0 for active, -1 for inactive)
  document.querySelectorAll('[role="tab"]').forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
  });
  tab.setAttribute('aria-selected', 'true');
  tab.setAttribute('tabindex', '0');

  // Show/hide panels
  const panelId = tab.getAttribute('aria-controls');
  document.querySelectorAll('[role="tabpanel"]').forEach(p => p.hidden = true);
  document.getElementById(panelId).hidden = false;
}

// Arrow key navigation
tablist.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
    const currentIndex = tabs.indexOf(document.activeElement);
    const nextIndex = e.key === 'ArrowRight'
      ? (currentIndex + 1) % tabs.length
      : (currentIndex - 1 + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    selectTab(tabs[nextIndex]);
  }
});
```

**Source:** [MDN Accessibility: CSS and JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript), [LogRocket: Building accessible UI tabs](https://blog.logrocket.com/build-accessible-user-interface-tabs-javascript/)

### Pattern 4: Lazy-Loaded Demo Iframes
**What:** Defer iframe loading until near viewport for performance
**When to use:** Demos at end of documentation sections
**Example:**
```html
<iframe
  src="/wasm-graphics-demo.html#demo=linear-gradient"
  title="Linear gradient shader interactive demo"
  loading="lazy"
  width="100%"
  height="600"
  style="border: 1px solid #ccc; border-radius: 4px;">
</iframe>
```

**Why lazy loading matters:**
- Reduces initial page load time (demos contain WASM modules, Canvas rendering)
- Saves bandwidth if user doesn't scroll to bottom
- Browser calculates viewport distance automatically

**Same-origin security:** No sandbox needed for same-origin iframes (e.g., `/wasm-graphics-demo.html`). Sandbox attribute is for untrusted third-party content only.

**Source:** [MDN: iframe element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe), [Qrvey: Iframe Security Risks](https://qrvey.com/blog/iframe-security/)

### Pattern 5: Responsive Code Blocks
**What:** Horizontal scroll for long lines on mobile, proper overflow handling
**When to use:** All code blocks
**Example:**
```css
pre[class*="language-"] {
  overflow-x: auto; /* Horizontal scroll for long lines */
  max-width: 100%;
  white-space: pre; /* Preserve formatting, no wrap */
  tab-size: 4;
  -webkit-overflow-scrolling: touch; /* Smooth scroll on iOS */
}

/* Optional: wrap on hover for better readability */
pre[class*="language-"]:hover {
  white-space: pre-wrap;
  word-break: break-all;
}

/* Mobile: ensure container doesn't overflow */
@media (max-width: 768px) {
  .code-container {
    margin-left: -1rem;
    margin-right: -1rem;
    border-radius: 0;
  }
}
```

**Source:** [Yihui Xie: CSS Trick for Horizontal Scrollbars](https://yihui.org/en/2023/08/css-scrollbar/), [LogRocket: Preventing overflow scrolling](https://blog.logrocket.com/how-to-prevent-overflow-scrolling-css/)

### Anti-Patterns to Avoid
- **Loading Prism with `async`:** Can cause DOMContentLoaded race conditions where highlightAll() never fires
- **Both `allow-scripts` and `allow-same-origin` sandbox:** Allows iframe to remove sandbox attribute (defeats purpose)
- **Omitting ARIA roles on tabs:** Screen readers announce as generic buttons, not tabs
- **Fixed pixel widths on code blocks:** Causes horizontal page scroll on mobile
- **Showing complete files:** Overwhelms readers; extract 20-50 line focused excerpts instead
- **Using `aria-label` when visible text exists:** Prefer `aria-labelledby` to reference visible labels

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Syntax highlighting | Custom parser with regex | Prism.js or Highlight.js | Language grammars are complex (nested structures, edge cases), requires constant maintenance for language updates |
| Copy to clipboard | `document.execCommand('copy')` | Prism copy-to-clipboard plugin | Modern async Clipboard API with fallbacks, permission handling, success/error states already implemented |
| Tab accessibility | Basic show/hide divs | ARIA-compliant tab pattern | Requires roving tabindex, keyboard navigation, screen reader announcements, focus management |
| Line highlighting | Custom CSS classes | Prism line-highlight plugin | Handles ranges, multiple selections, URL hash linking, offset numbering automatically |
| Responsive iframes | JavaScript resize listeners | CSS aspect-ratio property | Modern CSS handles aspect ratios natively: `aspect-ratio: 16/9; width: 100%;` |

**Key insight:** Code presentation is solved problem domain. Prism's plugin architecture provides composable, tested solutions. Custom implementations miss accessibility, edge cases, and browser quirks.

## Common Pitfalls

### Pitfall 1: Plugin Load Order Dependency
**What goes wrong:** Copy-to-clipboard button doesn't appear or throws console errors
**Why it happens:** Copy-to-clipboard plugin depends on Toolbar plugin, but Toolbar loads after
**How to avoid:** Always load plugins in dependency order:
```html
<!-- 1. Core Prism -->
<script src="prism.js"></script>
<!-- 2. Language support -->
<script src="prism-cpp.js"></script>
<!-- 3. Toolbar (dependency) -->
<script src="plugins/toolbar/prism-toolbar.js"></script>
<!-- 4. Copy-to-clipboard (depends on toolbar) -->
<script src="plugins/copy-to-clipboard/prism-copy-to-clipboard.js"></script>
```
**Warning signs:** Console error mentioning "Toolbar" or copy button missing despite plugin included

**Source:** [Prism Copy to Clipboard plugin docs](https://prismjs.com/plugins/copy-to-clipboard/)

### Pitfall 2: C++ Language Not Loading
**What goes wrong:** C++ code displays without syntax highlighting (plain black text)
**Why it happens:** C++ is NOT in Prism's default bundle (only markup, CSS, C-like, JavaScript load automatically)
**How to avoid:** Explicitly include C++ language component:
```html
<script src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-cpp.min.js"></script>
```
Or use the Autoloader plugin for automatic language loading.
**Warning signs:** Code block has `language-cpp` class but renders without syntax colors

**Source:** [Prism.js homepage](https://prismjs.com/)

### Pitfall 3: Tabbed Content Invisible to Search Engines
**What goes wrong:** Hidden tab panels not indexed by Google, invisible to LLMs like GPT-4
**Why it happens:** JavaScript-rendered hidden content (especially `display: none`) often ignored by crawlers
**How to avoid:**
- Use `hidden` attribute (semantic HTML5) rather than `display: none` in CSS
- Server-render all tab content in HTML, hide with progressive enhancement
- For critical SEO content, consider single-page layout instead of tabs
**Warning signs:** Search Console shows lower indexed pages than expected, AI tools can't reference your documentation

**Source:** [OneUpWeb: Collapsible and Hidden Content SEO](https://www.oneupweb.com/blog/seo-for-accordion-content/)

### Pitfall 4: Code Block Horizontal Page Scroll on Mobile
**What goes wrong:** Long lines cause entire page to scroll horizontally, breaking layout
**Why it happens:** Code block width exceeds viewport, no `overflow-x` constraint on parent containers
**How to avoid:**
```css
/* Container must constrain width */
body, .content-wrapper {
  overflow-x: hidden; /* Prevent page-level horizontal scroll */
}

/* Code block handles its own overflow */
pre[class*="language-"] {
  overflow-x: auto; /* Scroll within code block only */
  max-width: 100%;
}
```
**Warning signs:** Mobile testing reveals horizontal swipe on page, code extends beyond screen

**Source:** [Fox Scribbler: Fix Horizontal Scroll on Mobile](https://foxscribbler.com/prevent-horizontal-scroll-on-mobile/)

### Pitfall 5: Prism Highlights Wrong Content
**What goes wrong:** Prism highlights HTML entities, escape codes, or template syntax instead of C++ code
**Why it happens:** Content needs proper escaping for HTML context; `<`, `>`, `&` must be encoded
**How to avoid:**
```html
<!-- WRONG: Raw angle brackets -->
<code class="language-cpp">
std::vector<int> v;
</code>

<!-- CORRECT: HTML entities -->
<code class="language-cpp">
std::vector&lt;int&gt; v;
</code>
```
Or use `<script type="text/plain">` wrapper approach for complex code.
**Warning signs:** Code renders with broken syntax, missing content after `<`, red error highlighting

### Pitfall 6: Performance Degradation with Many Code Blocks
**What goes wrong:** Page load hangs or stutters with 10+ code blocks
**Why it happens:** Synchronous highlighting blocks main thread during page render
**How to avoid:**
- Use `defer` attribute on Prism script (already recommended)
- For extreme cases (50+ blocks), implement manual triggering with `data-manual` attribute:
```html
<script src="prism.js" data-manual></script>
<script>
  // Trigger highlighting when browser is idle
  requestIdleCallback(() => {
    Prism.highlightAll();
  });
</script>
```
- Or pre-render at build time (static site generators)
**Warning signs:** Lighthouse performance score drops, visible flash of unstyled code

**Source:** [StudyRaid: Code Highlighting Optimization](https://app.studyraid.com/en/read/12497/404180/code-highlighting-optimization-techniques)

## Code Examples

Verified patterns from official sources:

### Prism.js Complete Setup
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shader Implementation - Graphics Engine Docs</title>

  <!-- VS Code Dark+ Theme -->
  <link href="https://cdn.jsdelivr.net/npm/prism-themes/themes/prism-vsc-dark-plus.css" rel="stylesheet" />

  <!-- Prism Plugins CSS -->
  <link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-highlight/prism-line-highlight.css" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/toolbar/prism-toolbar.css" rel="stylesheet" />
</head>
<body>

<h2>Blend Mode Implementation</h2>
<pre class="line-numbers" data-line="8-10" data-start="23"><code class="language-cpp">
// S + (1 - Sa)*D
GPixel src_over_mode(GPixel src, GPixel dest){
    int sa = GPixel_GetA(src);
    int sr = GPixel_GetR(src);
    int sg = GPixel_GetG(src);
    int sb = GPixel_GetB(src);

    int da = GPixel_GetA(dest);
    int dr = GPixel_GetR(dest);
    int dg = GPixel_GetG(dest);
    int db = GPixel_GetB(dest);

    int ba = sa + div255((255-sa)*da);
    int br = sr + div255((255-sa)*dr);
    int bg = sg + div255((255-sa)*dg);
    int bb = sb + div255((255-sa)*db);

    return GPixel_PackARGB(ba, br, bg, bb);
}
</code></pre>

<!-- Prism Core (defer for non-blocking) -->
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/prism.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/components/prism-cpp.min.js"></script>

<!-- Prism Plugins (order matters: toolbar before copy-to-clipboard) -->
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-numbers/prism-line-numbers.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/line-highlight/prism-line-highlight.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/toolbar/prism-toolbar.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/prismjs@1.30.0/plugins/copy-to-clipboard/prism-copy-to-clipboard.min.js"></script>

</body>
</html>
```
**Source:** [Prism.js official site](https://prismjs.com/), [prism-themes GitHub](https://github.com/PrismJS/prism-themes)

### Accessible Tab Implementation
```html
<div class="shader-tabs">
  <div role="tablist" aria-label="Shader implementation types">
    <button role="tab" aria-selected="true" aria-controls="linear-panel" id="linear-tab" tabindex="0">
      Linear Gradient
    </button>
    <button role="tab" aria-selected="false" aria-controls="radial-panel" id="radial-tab" tabindex="-1">
      Radial Gradient
    </button>
    <button role="tab" aria-selected="false" aria-controls="sweep-panel" id="sweep-tab" tabindex="-1">
      Sweep Gradient
    </button>
  </div>

  <div role="tabpanel" id="linear-panel" aria-labelledby="linear-tab">
    <h3>Linear Gradient Implementation</h3>
    <p>Linear gradients interpolate colors along a straight line...</p>
    <pre class="line-numbers"><code class="language-cpp">
// Implementation code here
    </code></pre>
  </div>

  <div role="tabpanel" id="radial-panel" aria-labelledby="radial-tab" hidden>
    <h3>Radial Gradient Implementation</h3>
    <p>Radial gradients interpolate from a center point...</p>
    <pre class="line-numbers"><code class="language-cpp">
// Implementation code here
    </code></pre>
  </div>

  <div role="tabpanel" id="sweep-panel" aria-labelledby="sweep-tab" hidden>
    <h3>Sweep (Angle) Gradient Implementation</h3>
    <p>Sweep gradients rotate around a center point...</p>
    <pre class="line-numbers"><code class="language-cpp">
// Implementation code here
    </code></pre>
  </div>
</div>

<script>
const tablist = document.querySelector('[role="tablist"]');
const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));

tabs.forEach(tab => {
  tab.addEventListener('click', () => selectTab(tab));
});

tablist.addEventListener('keydown', (e) => {
  const currentIndex = tabs.indexOf(document.activeElement);
  let nextIndex;

  if (e.key === 'ArrowRight') {
    nextIndex = (currentIndex + 1) % tabs.length;
  } else if (e.key === 'ArrowLeft') {
    nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
  } else if (e.key === 'Home') {
    nextIndex = 0;
  } else if (e.key === 'End') {
    nextIndex = tabs.length - 1;
  } else {
    return; // Not an arrow/home/end key
  }

  tabs[nextIndex].focus();
  selectTab(tabs[nextIndex]);
  e.preventDefault();
});

function selectTab(selectedTab) {
  // Update all tabs
  tabs.forEach(tab => {
    const isSelected = tab === selectedTab;
    tab.setAttribute('aria-selected', isSelected);
    tab.setAttribute('tabindex', isSelected ? '0' : '-1');

    // Show/hide associated panel
    const panelId = tab.getAttribute('aria-controls');
    document.getElementById(panelId).hidden = !isSelected;
  });
}
</script>
```
**Source:** [MDN: Building accessible tabs](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript), [Make Things Accessible: Tabbed Interfaces](https://www.makethingsaccessible.com/guides/responsive-and-accessible-tabbed-interfaces/)

### Lazy-Loaded Demo Iframe
```html
<section class="demo-section">
  <h3>Interactive Demo</h3>
  <p>Try the shader implementation in real-time:</p>

  <iframe
    src="/wasm-graphics-demo.html#demo=linear-gradient"
    title="Linear gradient shader interactive demo - adjust colors and angle in real-time"
    loading="lazy"
    width="100%"
    height="600"
    style="border: 1px solid #444; border-radius: 8px; max-width: 100%;">
    <p>Your browser does not support iframes.
       <a href="/wasm-graphics-demo.html#demo=linear-gradient">View demo in new tab</a>
    </p>
  </iframe>
</section>

<style>
/* Responsive iframe container */
.demo-section iframe {
  display: block;
  margin: 2rem 0;
}

@media (max-width: 768px) {
  .demo-section iframe {
    height: 500px; /* Shorter on mobile */
  }
}
</style>
```
**Source:** [MDN: iframe element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Runtime syntax highlighting only | Build-time pre-rendering or server-side generation | 2023-2024 (Jamstack era) | Zero client-side JS, instant display, better Core Web Vitals |
| `document.execCommand('copy')` | Async Clipboard API | 2020 (Chrome 76+, Firefox 63+) | Permission handling, secure contexts, promise-based |
| Manual ARIA attribute management | Framework-integrated accessibility (React Aria, Radix UI) | 2021-2022 | Reduced boilerplate, consistent patterns |
| Fixed aspect ratio iframes with JS | CSS `aspect-ratio` property | 2021 (CSS standard) | Native browser support, no JavaScript needed |
| Highlight.js dominance | Prism.js as equal/preferred option | 2018-2020 | Smaller bundle, better plugin system, comparable language support |

**Deprecated/outdated:**
- **Shiki for runtime highlighting:** Too slow for multiple blocks (10+ seconds). Use for build-time only.
- **Google Code Prettify:** Abandoned (last update 2013), use Prism or Highlight.js instead.
- **Manual `overflow: scroll` on body for mobile:** Use `overflow-x: hidden` on body, `overflow-x: auto` on code blocks.

## Open Questions

Things that couldn't be fully resolved:

1. **Optimal code snippet length for documentation**
   - What we know: Industry suggests 20-50 lines focused on algorithm core, omit boilerplate
   - What's unclear: Balance between completeness (compilable) vs. clarity (algorithm-focused)
   - Recommendation: Start with 20-50 line excerpts showing key algorithm logic. Add "View complete file" links if readers need full context.

2. **Build-time vs. runtime highlighting tradeoff**
   - What we know: Build-time is fastest (pre-rendered HTML), runtime is simplest (no build step)
   - What's unclear: At what point does page count justify build tooling complexity?
   - Recommendation: For 4 documentation pages, runtime highlighting with deferred loading is sufficient. Build-time matters at 50+ pages or if Lighthouse performance scores drop.

3. **Prism v2 migration timeline**
   - What we know: Prism team working on v2, only accepting security PRs for v1.x currently
   - What's unclear: Release date, breaking changes, migration path
   - Recommendation: Use v1.30.0 (stable). Monitor [Prism GitHub](https://github.com/PrismJS/prism) for v2 announcements. Unlikely to release before 2027 based on development pace.

## Sources

### Primary (HIGH confidence)
- [Prism.js official documentation](https://prismjs.com/) - Core library, plugins, download customization
- [Prism.js Line Numbers plugin](https://prismjs.com/plugins/line-numbers/) - Line number setup and data-start attribute
- [Prism.js Line Highlight plugin](https://prismjs.com/plugins/line-highlight/) - data-line syntax for highlighting ranges
- [Prism.js Copy to Clipboard plugin](https://prismjs.com/plugins/copy-to-clipboard/) - Toolbar dependency, data attributes
- [prism-themes GitHub repository](https://github.com/PrismJS/prism-themes) - VS Code Dark+ and 50+ theme options
- [MDN: iframe element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe) - Sandbox attribute, loading="lazy", security best practices
- [MDN: CSS and JavaScript Accessibility](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/CSS_and_JavaScript) - ARIA roles, keyboard navigation
- [MDN: ARIA label attribute](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label) - When to use aria-label vs aria-labelledby

### Secondary (MEDIUM confidence)
- [LogRocket: Building accessible tabs in JavaScript](https://blog.logrocket.com/build-accessible-user-interface-tabs-javascript/) - Roving tabindex pattern, arrow key navigation
- [Make Things Accessible: Tabbed Interfaces](https://www.makethingsaccessible.com/guides/responsive-and-accessible-tabbed-interfaces/) - Tab structure with `<a>` vs `<button>` elements
- [Qrvey: 2026 Iframe Security Risks](https://qrvey.com/blog/iframe-security/) - Sandbox tokens, same-origin vs cross-origin
- [OneUpWeb: Collapsible and Hidden Content SEO](https://www.oneupweb.com/blog/seo-for-accordion-content/) - Search engine indexing of hidden tab content
- [Yihui Xie: CSS Trick for Horizontal Scrollbars in Code Blocks](https://yihui.org/en/2023/08/css-scrollbar/) - Hover-to-wrap technique
- [LogRocket: Preventing overflow scrolling in CSS](https://blog.logrocket.com/how-to-prevent-overflow-scrolling-css/) - Mobile overflow handling
- [Fox Scribbler: Fix Horizontal Scroll on Mobile](https://foxscribbler.com/prevent-horizontal-scroll-on-mobile/) - overflow-x: hidden on body

### Tertiary (LOW confidence)
- [Codacy: Code Documentation Best Practices](https://blog.codacy.com/code-documentation) - General documentation principles (not syntax-highlighting specific)
- [StudyRaid: Code Highlighting Optimization Techniques](https://app.studyraid.com/en/read/12497/404180/code-highlighting-optimization-techniques) - Performance strategies (aggregated source, not primary documentation)
- [GitHub Issue #2149: Prism async/defer](https://github.com/PrismJS/prism/issues/2149) - Community discussion (not official guidance)

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** - Official Prism documentation and npm package confirm version, plugin availability, C++ support
- Architecture: **HIGH** - MDN and official Prism docs provide authoritative patterns for tabs, iframes, code markup
- Pitfalls: **MEDIUM-HIGH** - Mix of official docs (HIGH) and community experience (MEDIUM) for performance, mobile issues
- Performance optimization: **MEDIUM** - Build-time pre-rendering validated by multiple sources but not universally documented as "standard"

**Research date:** 2026-02-03
**Valid until:** 2026-04-03 (60 days - stable library, slow-moving domain)
**Re-check triggers:** Prism v2 release announcement, major browser changes to iframe loading behavior
