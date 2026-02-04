# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is **AaronDiefes.github.io**, a personal portfolio website hosted on GitHub Pages. The site showcases projects, including an interactive JavaScript demo of a C++ 2D graphics engine.

**Live URL:** https://aarondiefes.github.io/

## Repository Structure

```
.
├── index.html              # Portfolio homepage
├── graphics-demo.html      # Interactive graphics engine demo
├── admin.html              # Password-protected source code viewer
└── graphics-engine/        # C++ graphics engine source (reference only)
```

## Key Architecture

### Three-Page Site Structure

1. **index.html** - Portfolio homepage
   - Professional landing page with gradient header
   - About section with skills badges
   - Featured project showcase (graphics engine)
   - Links to other GitHub projects
   - Responsive design with mobile breakpoints

2. **graphics-demo.html** - Interactive Demo
   - JavaScript/Canvas API demo mimicking the C++ engine's capabilities
   - Left sidebar with interactive controls (shape type, color, transforms, blend modes)
   - Right canvas area for real-time rendering
   - Supports drawing shapes, applying transformations, and animations
   - No external dependencies - pure HTML/CSS/JS

3. **admin.html** - Source Code Viewer
   - Password-protected page (default password: `graphics2024`)
   - Client-side authentication using SHA-256 hashing
   - File tree navigation showing graphics engine structure
   - Links to GitHub repository for actual source code
   - Session-based authentication (sessionStorage)

### Graphics Engine Reference

The `graphics-engine/` directory contains the original C++ implementation. This is for reference only and not used by the website. The actual demo is a JavaScript recreation.

**Key C++ components:**
- `my_canvas.cpp` - Main canvas implementation
- `blend_functions.h` - Color blending algorithms
- `shader_ops.h` - Shader pipeline
- `path_ops.h` - Path operations
- `include/` - Header files for API definitions

## Git Configuration

This repository uses a **personal GitHub account SSH key** configured in `~/.ssh/config`:

```
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
```

The remote is configured as `git@github.com-personal:AaronDiefes/AaronDiefes.github.io.git` to ensure it uses the personal SSH key, not work credentials.

## Deployment

GitHub Pages automatically deploys from the `main` branch. Changes pushed to `main` go live within minutes at https://aarondiefes.github.io/.

Check deployment status: https://github.com/AaronDiefes/AaronDiefes.github.io/deployments

## Admin Password Management

To change the admin.html password:

1. Generate new SHA-256 hash:
   ```javascript
   async function hash(msg) {
     const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
     return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
   }
   await hash("your-new-password");
   ```

2. Update `PASSWORD_HASH` constant in admin.html (around line 55)

## Design System

**Color Palette:**
- Primary gradient: `#667eea` to `#764ba2` (purple/blue)
- Dark text: `#2c3e50`
- Light backgrounds: `#f8f9fa`, `#f5f5f5`
- Accent red: `#e74c3c`

**Typography:**
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`
- Monospace for code: `'Monaco', 'Courier New', monospace`

## Modifying the Graphics Demo

The demo lives entirely in `graphics-demo.html`. Key sections:

- **Control bindings:** Lines 150-200 (event listeners)
- **Drawing logic:** `drawShape()` function
- **Transformation math:** Applied via canvas context (translate, rotate, scale)
- **Animation:** `animate()` function with requestAnimationFrame

The demo uses HTML5 Canvas 2D context (`ctx.fillRect`, `ctx.arc`, etc.) to recreate the C++ engine's rendering capabilities in the browser.
