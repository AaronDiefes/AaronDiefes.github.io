# External Integrations

**Analysis Date:** 2026-02-02

## APIs & External Services

**GitHub Integration:**
- Links to GitHub repositories for project discovery
- Repository links: `https://github.com/AaronDiefes/2D-graphics-engine`, `https://github.com/AaronDiefes/CPU`, `https://github.com/AaronDiefes/cs330-case-study`
- No API authentication or SDK integration
- Static link references in `index.html` (lines 300, 305, 314) and `admin.html` (line 268)

**Contact Integration:**
- Email mailto link: `awdiefes@gmail.com`
- Static link in `index.html` (line 315)

## Data Storage

**Databases:**
- None - Static site with no backend database

**File Storage:**
- GitHub Pages - Serves all static files (HTML, CSS, images)
- No cloud storage integration
- All assets stored in git repository

**Caching:**
- Browser caching via HTTP headers (GitHub Pages default)
- No explicit cache configuration

## Authentication & Identity

**Auth Provider:**
- Custom client-side authentication only

**Implementation:**
- Password-protected admin page: `admin.html`
- Method: Client-side SHA-256 hashing using Web Crypto API
- Storage: sessionStorage for authenticated state
- Password hash hardcoded: `f8c3bf62a9aa3e6fc1619c250e48afe7519373d3ebc0f61c65b8c34e40fce1c7` (lines 277 in admin.html)
- Default password: `graphics2024` (plaintext backup in CLAUDE.md documentation only)
- No server-side validation or token-based auth

**Note:** This is not a secure authentication method for production. Suitable only for access restriction to source code viewer in portfolio context.

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service integrated

**Logs:**
- Console logging only via vanilla JavaScript `console` methods
- Browser developer console for debugging

## CI/CD & Deployment

**Hosting:**
- GitHub Pages
- Repository: `AaronDiefes/AaronDiefes.github.io`
- Domain: `https://aarondiefes.github.io/`
- Automatic deployment from main branch
- No build step required (static files)

**CI Pipeline:**
- None - GitHub Pages directly serves files from `main` branch
- No automated testing or build configuration detected

## Environment Configuration

**Required env vars:**
- None - Static site requires no environment variables

**Secrets location:**
- No external secrets management
- Admin password hash hardcoded in `admin.html` line 277
- SSH key configuration for git push in `~/.ssh/config` (personal GitHub account key)

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Browser APIs Used

**Web Crypto API:**
- SHA-256 hashing for admin password verification
- Used in `admin.html` lines 288-293

**Canvas 2D Context:**
- Graphics rendering in `graphics-demo.html`
- Methods: `fillRect`, `arc`, `beginPath`, `moveTo`, `lineTo`, `fill`, `stroke`, `rotate`, `scale`, `translate`, `save`, `restore`

**DOM APIs:**
- Element selection and manipulation
- Event listeners (input, click, submit)
- Session storage for authentication state

**Fetch API:**
- Not currently used (admin.html contains placeholder for server-side file loading on line 382)

## Cross-Origin Considerations

- All resources same-origin (GitHub Pages domain)
- No CORS headers required
- External links are navigational only (no API calls)

---

*Integration audit: 2026-02-02*
