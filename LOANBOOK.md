# Loanbook web app (Conister Bank)

Fork of [openMF/web-app](https://github.com/openMF/web-app) used by [aigenticlab/loanbook-mvp](https://github.com/aigenticlab/loanbook-mvp). The upstream code is under the Mozilla Public License 2.0; changes to upstream files in this fork are shared here under the same licence.

## Base

- Branch `conister`, based on upstream `dev` at `10d24b85` (28 January 2026). Upstream publishes no source tag for the `openmf/web-app:1.12` image used before this fork, so this is the `dev` commit current when that image was pushed. Tested against Apache Fineract 1.12.1.
- Images: tag a commit `loanbook-vX.Y.Z` and the `Loanbook image` workflow publishes `ghcr.io/aigenticlab/loanbook-web:vX.Y.Z`.

## What we changed

Our own work lives in separate files where possible, so upstream fixes still merge.

**New files**

| Path | Purpose |
|---|---|
| `src/theme/conister/_tokens.scss` | Conister Bank design tokens (copied from loanbook-mvp `theme/conister/`) |
| `src/theme/conister/_conister.scss` | Theme overrides: colours, Hanken Grotesk, 3px buttons, flat bordered cards, white header, hidden out-of-scope features |
| `src/app/loanbook/loanbook-translate-loader.ts` | Loads upstream translations, then applies the Loanbook overlay |
| `src/assets/translations/loanbook/en-US.json` | Label overlay: Client > Lessee, Loan > Agreement, Office > Branch, Loan product > Product, Loan officer > Account manager, Center > Centre, app name "Loanbook" |
| `src/app/loanbook/login/` | Conister sign-in screen. Extends the upstream `LoginComponent`, so the login logic is unchanged |
| `src/assets/images/conister/logo-mark.svg` | Placeholder mark until the client supplies logo artwork |
| `.github/workflows/loanbook-image.yml` | Builds and pushes the image to GHCR |

**Edits to upstream files (kept small)**

| File | Change |
|---|---|
| `src/theme/_material-palette.scss` | Primary and accent palettes set to Conister purple and lime |
| `src/theme/mifosx-theme.scss` | Typography font family |
| `src/main.scss` | `@use 'theme/conister/conister'` (last import) |
| `src/app/app.module.ts` | Uses `LoanbookTranslateLoader` |
| `src/app/login/login-routing.module.ts` | Routes `/login` to `LoanbookLoginComponent` |
| `src/index.html` | Hanken Grotesk font link, favicon |
| `src/app/core/shell/sidenav/sidenav.component.html` | Logo image; `lb-out-of-scope` on collection sheets |
| `src/app/core/shell/sidenav/frequent-activities.ts` | Removed Groups and Centers shortcuts |
| `src/app/core/shell/toolbar/toolbar.component.html` | `lb-out-of-scope` on Groups, Centers, Savings reports |
| `src/app/products/products.component.html` | `lb-out-of-scope` on savings, share, fixed and recurring deposit products |
| `src/app/clients/clients-view/clients-view.component.html` | `lb-out-of-scope` on new savings and share accounts |

## Hiding features outside the MVP

Elements marked `class="lb-out-of-scope"` are hidden by one rule in `src/theme/conister/_conister.scss`. They are hidden, not removed: the routes still exist, and Fineract permissions remain the real control. To bring a feature back, delete the class from its element.

## Known gaps

- Logo artwork and the licensed Geomanist web font are still to come from the client.
- The sign-in form uses the upstream Material fields (floating labels) rather than the mockup's labels above the inputs. No "keep me signed in" option: upstream has no UI for it.
- The overlay is English only (`en-US`). Other languages show upstream wording.
- The dark theme toggle is hidden; the brand has no dark theme.

## Merging upstream

```bash
git remote add upstream https://github.com/openMF/web-app.git
git fetch upstream
git merge <upstream-release-or-commit>   # expect conflicts only in the files listed above
```
