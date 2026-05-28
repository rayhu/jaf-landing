# JAF Website — Setup and Deployment Guide

## Prerequisites

| Tool            | Version   | Install                |
| --------------- | --------- | ---------------------- |
| Hugo (extended) | ≥ 0.146.0 (Congo v2 uses `layouts/_partials/`) | `brew install hugo`    |
| Go              | ≥ 1.21    | `brew install go`      |
| Git             | any       | pre-installed on macOS |

Verify:

```bash
hugo version   # should show "extended"
go version
```

---

## 1. Install the Congo Theme (Hugo Module)

Run once in the project root:

```bash
# Initialise Go module (use your own GitHub path if you have one)
hugo mod init jaf

# Download Congo
hugo mod get github.com/jpanther/congo/v2
```

This creates `go.mod` and `go.sum`. Commit both.

---

## 2. Local Preview

```bash
hugo server
```

Open http://localhost:1313 in your browser.

- English site: http://localhost:1313/
- Spanish site: http://localhost:1313/es/
- Chinese site: http://localhost:1313/zh/

The language switcher in the header switches between all three automatically.

---

## 3. Build for Production

```bash
hugo --minify
```

Output lands in `public/`. This folder contains the complete static website ready to upload.

---

## 4. Deploy Options

### Option A — Netlify (recommended, free tier)

This repo already includes `netlify.toml` (build command, `HUGO_VERSION`, deploy-preview `baseURL`, headers, and redirects) and a GitHub Actions workflow that deploys via the Netlify CLI: every PR gets a Deploy Preview URL and every merge to `main` updates production. **Set two secrets once** — see **§9 GitHub Actions → Netlify (PR previews & production)** below.

### Option B — GitHub Pages

```bash
# Add GitHub Actions workflow at .github/workflows/hugo.yml
# (Hugo provides an official workflow template at gohugo.io/hosting/github-pages/)
```

### Option C — Any static host

Upload the contents of `public/` to any web host (AWS S3 + CloudFront, Cloudflare Pages, etc.).

---

## 5. Custom Domain

After deploying to Netlify or GitHub Pages, set your custom domain
(e.g., `justiceaccessfoundation.org`) in the host's DNS settings
and update `baseURL` in `hugo.toml`.

---

## 6. Before Launch — Required Substitutions

Search the content files for these placeholders and replace with real values:

| Placeholder                                                     | Replace with                                               |
| --------------------------------------------------------------- | ---------------------------------------------------------- |
| `[TBD]` / `[Por Determinar]` / `待定`                           | IRS-issued EIN                                             |
| `[payment processor]` / `[procesador de pago]` / `[支付处理商]` | Donation processor name (e.g., Stripe, PayPal Giving Fund) |
| `https://justiceaccessfoundation.org/` in `hugo.toml`           | Actual domain                                              |
| `[Board Development Committee contact]`                         | Contact email or form URL                                  |

Quick search:

```bash
grep -r "TBD\|Por Determinar\|待定\|payment processor" content/
```

---

## 7. File Structure Reference

```
jaf/
├── hugo.toml                  Main Hugo config + language definitions
├── go.mod / go.sum            Hugo module files (created by step 1)
├── config/_default/
│   ├── params.toml            Congo theme parameters
│   ├── menus.en.toml          English navigation
│   ├── menus.es.toml          Spanish navigation
│   └── menus.zh.toml          Chinese navigation
├── assets/css/custom.css      Institutional CSS refinements
└── content/
    ├── en/                    English pages
    │   ├── _index.md          Homepage
    │   ├── 02-about.md        → /about/
    │   ├── 03-programs.md     → /programs/
    │   ├── 04-governance.md   → /governance/
    │   ├── 05-funding-transparency.md → /funding/
    │   ├── 06-board-recruitment.md    → /board/
    │   ├── 07-compliance-legal.md     → /compliance/
    │   └── 08-donate.md       → /donate/
    ├── es/                    Spanish pages → /es/[slug]/
    └── zh/                    Chinese pages → /zh/[slug]/
```

---

## 8. Updating Content

All content is plain Markdown. To update a page:

1. Open the relevant file in `content/en/`, `content/es/`, or `content/zh/`.
2. Edit the text below the `---` front matter block.
3. Run `hugo server` to preview.
4. Open a PR for a Deploy Preview, or merge to `main` to publish — GitHub Actions builds and deploys automatically (§9).

---

## 9. GitHub Actions → Netlify (PR previews & production)

**How it works:** GitHub Actions builds the site and ships it to Netlify with the Netlify CLI — the same `netlify deploy` you run locally, just automated. Two workflows:

- **Hugo CI** (`.github/workflows/hugo-ci.yml`) — build-only check; needs no secrets, so it stays green even on forks.
- **Netlify deploy** (`.github/workflows/netlify-deploy.yml`) — the deployer:
  - **Pull request to `main`** → **Deploy Preview** at `https://pr-<number>--<site>.netlify.app`, posted as a comment on the PR.
  - **Push / merge to `main`** → **production** deploy to the live site.
  - **Manual** (Actions tab → _Run workflow_) → pick preview or production.

### 9.1 One-time: store the two secrets

The deploy workflow needs two repository secrets. Set them once.

Prerequisites: [GitHub CLI](https://cli.github.com) installed and logged in (`gh auth login`).

1. Create a Netlify **personal access token**: Netlify → **User settings** → **Applications** → **Personal access tokens** → **New access token**.
2. Find the **Site ID**: Netlify → your site → **Site configuration** → **Site details** → **Site ID**.
3. From your machine, in the repo root:

```bash
chmod +x scripts/gh-netlify-secrets.sh
./scripts/gh-netlify-secrets.sh
```

Or set them directly (paste each value when prompted):

```bash
gh secret set NETLIFY_AUTH_TOKEN
gh secret set NETLIFY_SITE_ID
```

4. Verify: `gh secret list` should list `NETLIFY_AUTH_TOKEN` and `NETLIFY_SITE_ID`.

That's it — open a PR to get a preview, merge to publish. No Netlify dashboard wiring required.

### 9.2 Editing the workflow

Everything lives in `.github/workflows/netlify-deploy.yml`. Common tweaks:

- **Change the production branch:** edit the `push:` and `pull_request:` `branches:` lists.
- **Change the Hugo version:** edit the `hugo-version` line (keep it in sync with `HUGO_VERSION` in `netlify.toml`).
- **Stop auto-deploying production:** remove the `push:` trigger — pushes to `main` then only run the build check, and you deploy manually from the Actions tab.

### 9.3 Avoid duplicate production deploys

This workflow IS the deploy path. If the repo is **also** connected to Netlify's own Git integration (Netlify dashboard → **Site configuration** → **Build & deploy** → **Continuous deployment**), every push to `main` deploys **twice**. Pick one: keep this workflow (recommended, since it mirrors the local CLI flow), or disable continuous deployment in the Netlify dashboard and delete `netlify-deploy.yml`.

---

## 10. Theme Updates

```bash
hugo mod get -u github.com/jpanther/congo/v2
hugo mod tidy
```

---

## 11. Theme Attribution

This site uses [Congo](https://github.com/jpanther/congo) by JP Anther, MIT License.
Congo attribution in the footer is disabled in `params.toml` per JAF's institutional style.
If you wish to re-enable it: set `showThemeAttribution = true` in `config/_default/params.toml`.
