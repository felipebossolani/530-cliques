# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

530 Cliques — interactive manifesto arguing against calendar date pickers for date-of-birth input. Static single-page site in Brazilian Portuguese, deployed on GitHub Pages.

**Live:** https://felipebossolani.github.io/530-cliques/

## Stack

HTML + CSS + JS puros. Zero dependências. Zero build step. Zero frameworks.

- `index.html` — markup and structure only
- `style.css` — all styles, self-hosted JetBrains Mono font via `@font-face`
- `main.js` — all behavior (6 interactive demos + animations)
- `fonts/` — JetBrains Mono woff2 subsets (latin + latin-ext)

## CI

```bash
# HTML validation (same as CI)
npx html-validate@latest index.html

# Lighthouse (runs in CI via lhci autorun against static files)
```

CI runs on push/PR to `main` via `.github/workflows/ci.yml`:
- **html-validate** — blocks on invalid HTML
- **Lighthouse CI** — a11y, best-practices, SEO as warnings; performance off

## Architecture

All JS follows the same pattern: `initXxx()` functions called on `DOMContentLoaded`. Shared constants (`MONTHS`, `MONTHS_LC`) are at module scope.

Interactive demos (in page order):
1. **Calculator** — input birth year, animates click count with `requestAnimationFrame`
2. **Pain demo** — month-by-month calendar with click counter
3. **Popover demo** — month/year popover selectors + day grid
4. **Native dropdown demo** — three `<select>` elements
5. **Solution demo** — three text inputs with auto-advance and validation
6. **Share links** — Twitter/X, LinkedIn, clipboard copy

## Key Conventions

- All user-facing text is in Brazilian Portuguese
- Dark theme with CSS custom properties (`--bg`, `--green`, `--red`, `--yellow`)
- Mobile breakpoint at 600px
- No external requests — fonts are self-hosted, no analytics, no CDN
- Accessibility: `:focus-visible` outlines, ARIA labels, semantic HTML
