# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development server (hot reload on http://localhost:1313)
hugo server

# Production build (output in public/)
hugo --gc --minify

# Format code
npm run format

# Check formatting (CI)
npm run format:check
```

There is no test suite. Build verification is the correctness check: `hugo --gc --minify` must succeed.

## Architecture

This is a **Hugo** static site (Extended v0.162.1) with completely custom layouts — the Congo theme has been removed. It serves the same content in English, Spanish, and Simplified Chinese. Deployment is via **Netlify** (Git integration), with GitHub Actions CI (`hugo-ci.yml`) running build verification on PRs and pushes to `main`.

**Rendering model**: All layouts are custom-built under `layouts/`. Goldmark is set to `unsafe = true`, which allows raw HTML in Markdown files. Content pages use `lead` + `toc` in front matter for page hero intro text and table-of-contents sidebar; the Markdown body renders as prose.

**CSS**: Three custom stylesheets loaded via Hugo Pipes with minification and fingerprinting:
- `assets/css/brand.css` — shared base: CSS variables (warm palette), nav, buttons, form cards, footer
- `assets/css/home.css` — homepage-specific: hero, mission, programs grid, governance, support CTA
- `assets/css/page.css` — inner pages: page-hero, TOC sidebar, prose typography, shortcode styles

**Design system**: Warm palette (`#E8E4D9` base, `#C8842A` warm accent, `#1E1A13` dark), Inter + JetBrains Mono fonts. Static assets in `static/assets/`: lighthouse.png, logo-circle.png, logo-seal-emboss.png, jaf-bg-glow.mp4.

**Multilingual setup**: Three languages in `hugo.toml`:
- `en` (weight 1, default, no subdirectory in URL)
- `es` (weight 2, under `/es/`)
- `zh` (weight 3, under `/zh/`)

Each language has `contentDir` (`content/en/`, `content/es/`, `content/zh/`) and its own menu file (`config/_default/menus.{en,es,zh}.toml`). Pages use `slug` for consistent URLs across languages.

**Templates** (`layouts/`):
- `_default/baseof.html` — shell (head, header, main, footer, scripts)
- `_default/single.html` — inner pages: page-hero + optional TOC sidebar + prose content
- `_default/list.html` — taxonomy/list pages
- `index.html` — 5-section homepage driven by front matter parameters
- `partials/head.html` — meta, OG tags, CSS loading, favicon, canonical/hreflang
- `partials/header.html` — fixed nav with scroll detection, mobile toggle, language-agnostic links
- `partials/footer.html` — 3-column dark footer with language switcher
- `partials/scripts.html` — nav scroll, mobile menu, TOC scrollspy, video background handling

**Shortcodes** (`layouts/shortcodes/`):
- `section.html`, `callout.html` — structured content blocks
- `subgrid.html`/`subcard.html` — card grids within prose
- `facts.html`/`fact-row.html` — key-value fact lists
- `page-cta.html` — CTA banner (title, text, button link)
- `typeform-embed.html` — Typeform Live embed (contact, campus-study)
- `contact-form.html` — trilingual Netlify Forms contact form with honeypot
- `donate-form.html` — trilingual Zeffy donation iframe

**Homepage front matter**: The homepage (`_index.md`) uses structured front matter to drive all 5 sections (hero, mission, programs, governance, support). Each section has its own set of parameters (lede, pillars, items, points, etc.). The Markdown body is unused for the homepage.

**Inner page front matter**: Pages use `lead` (hero intro text) and `toc` (array of `label`/`id` pairs for sidebar navigation). Pages without TOC (contact, campus-study, thank-you) omit the `toc` field. The `thank-you`/`gracias`/`xiesie` pages use `hideLighthouse: true` to suppress the hero image.

**Deployment**: Netlify Git integration — Deploy Previews on PRs, production on merge to `main`. `netlify.toml` pins Hugo/Go versions, sets security headers (CSP with Typeform exceptions, HSTS), caching for fingerprinted assets, and www→apex redirect. Deploy previews use `--baseURL $DEPLOY_PRIME_URL/`.
