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

This repo already includes `netlify.toml` (build command, `HUGO_VERSION`, deploy-preview `baseURL`, headers, and redirects). **Connect GitHub once** so every PR gets a Deploy Preview URL and every merge to `main` updates production — see **§9 GitHub + Netlify (PR previews & production)** below.

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
4. Commit and push — Netlify rebuilds automatically.

---

## 9. GitHub + Netlify (PR previews & production)

**How it works:** Netlify’s **Git integration** builds on Netlify’s servers (so `DEPLOY_PRIME_URL` and `netlify.toml` deploy-preview settings apply). GitHub Actions in this repo only run **Hugo CI** (`.github/workflows/hugo-ci.yml`) to verify the build; they do not replace Netlify deploys.

### 9.1 One-time: connect the repository

1. Push this repo to GitHub (if it is not there yet).
2. In [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project** → **GitHub** → authorize the Netlify GitHub App when asked.
3. Select this repository, then confirm build settings:
   - Netlify reads **`netlify.toml`** at the repo root (build command, publish directory `public`, `HUGO_VERSION`, etc.).
4. Under **Site configuration** → **Build & deploy** → **Continuous deployment** → **Deploy contexts**:
   - **Production branch:** `main` (or your default branch).
   - **Deploy Previews:** enable for **Pull requests** (Netlify builds a preview per PR and comments with a preview URL if the GitHub integration is allowed to post comments).

After this, **opening a PR** triggers a **Deploy Preview** (unique `https://<deploy-id>--<site>.netlify.app` URL). **Merging to `main`** triggers a **production** deploy to your primary domain (and the Netlify subdomain).

### 9.2 GitHub Actions CI (automatic)

On every PR targeting `main` and every push to `main`, **Hugo CI** runs `hugo --gc --minify` so broken builds are caught before or alongside Netlify.

### 9.3 Optional: store Netlify credentials on GitHub (`gh` CLI)

This is **not required** for normal PR previews and production deploys (those use Netlify’s OAuth to GitHub). Add secrets only if you want to use the optional **Netlify manual deploy** workflow (`.github/workflows/netlify-manual-deploy.yml`) or other API/CLI automation.

Prerequisites: [GitHub CLI](https://cli.github.com) installed and logged in (`gh auth login`).

1. Create a Netlify **personal access token**: Netlify → **User settings** → **Applications** → **Personal access tokens** → generate a token with permission to deploy (follow Netlify’s current scope labels).
2. Copy the **Site ID**: Netlify → your site → **Site configuration** → **Site details** → **Site ID**.
3. From your machine, in the repo root:

```bash
chmod +x scripts/gh-netlify-secrets.sh
./scripts/gh-netlify-secrets.sh
```

Or set secrets directly:

```bash
gh secret set NETLIFY_AUTH_TOKEN
gh secret set NETLIFY_SITE_ID
```

(paste values when prompted)

4. Verify: `gh secret list`

5. Optional: **Actions** → **Netlify manual deploy** → **Run workflow** (draft vs production). Avoid turning this on for every push if Netlify Git is already connected, or you may double-deploy production.

### 9.4 Avoid duplicate production deploys

Use **either** Netlify’s continuous deployment from Git **or** a custom always-on Actions deploy — not both firing on every `main` push — unless you intend to deploy twice.

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
