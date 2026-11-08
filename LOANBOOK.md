# Loanbook web app (Crestion Bank)

Fork of [openMF/web-app](https://github.com/openMF/web-app) used by [aigenticlab/loanbook-mvp](https://github.com/aigenticlab/loanbook-mvp). The upstream code is under the Mozilla Public License 2.0; changes to upstream files in this fork are shared here under the same licence.

## Base

- Branch `crestion`, based on upstream `dev` at `10d24b85` (28 January 2026). Upstream publishes no source tag for the `openmf/web-app:1.12` image used before this fork, so this is the `dev` commit current when that image was pushed. Tested against Apache Fineract 1.12.1.
- Images: tag a commit `loanbook-vX.Y.Z` and the `Loanbook image` workflow publishes `ghcr.io/aigenticlab/loanbook-web:vX.Y.Z`.

## What we changed

Our own work lives in separate files where possible, so upstream fixes still merge.

**New files**

| Path | Purpose |
|---|---|
| `src/theme/crestion/_tokens.scss` | Crestion Bank design tokens (copied from loanbook-mvp `theme/crestion/`) |
| `src/theme/crestion/_crestion.scss` | Theme overrides: colours, Hanken Grotesk, 3px buttons, flat bordered cards, white header, hidden out-of-scope features |
| `src/app/loanbook/loanbook-translate-loader.ts` | Loads upstream translations, then applies the Loanbook overlay |
| `src/assets/translations/loanbook/en-US.json` | Label overlay: Client > Lessee, Loan > Agreement, Office > Branch, Loan product > Product, Loan officer > Account manager, Center > Centre, app name "Loanbook" |
| `src/app/loanbook/scope.ts` | The leasing scope: out-of-scope URL prefixes, path segments and agreement actions. Drives the route guard and filters search, shortcuts and activity lists |
| `src/app/loanbook/login/` | Crestion sign-in screen. Extends the upstream `LoginComponent`, so the login logic is unchanged |
| `src/assets/images/crestion/logo-mark.svg` | Placeholder mark until the client supplies logo artwork |
| `.github/workflows/loanbook-image.yml` | Builds and pushes the image to GHCR |

**Edits to upstream files (kept small)**

| File | Change |
|---|---|
| `src/theme/_material-palette.scss` | Primary and accent palettes set to Crestion purple and lime |
| `src/theme/mifosx-theme.scss` | Typography font family |
| `src/main.scss` | `@use 'theme/crestion/crestion'` (last import) |
| `src/app/app.module.ts` | Uses `LoanbookTranslateLoader` |
| `src/app/login/login-routing.module.ts` | Routes `/login` to `LoanbookLoginComponent` |
| `src/index.html` | Static title, description and link-preview (Open Graph) tags, Hanken Grotesk font link, favicon |
| `src/manifest.json` | App name |
| `src/app/core/route/route.service.ts` | `canActivateChild: [scopeGuard]` on the shell route, so out-of-scope URLs go to the home page |
| `src/app/core/shell/sidenav/sidenav.component.html` | Logo image; `lb-out-of-scope` on navigation, checker inbox, collection sheets and the accounting shortcuts |
| `src/app/core/shell/sidenav/sidenav.component.ts`, `frequent-activities.ts` | "Frequently accessed" icons filtered by `inScope` |
| `src/app/core/shell/toolbar/toolbar.component.html` | `lb-out-of-scope` on Accounting, Configuration Wizard, Groups, Centers, Templates, and Savings, Funds and Accounting reports |
| `src/app/home/activities.ts`, `src/app/keyboards-shortcut-config.ts` | Activity search and keyboard shortcuts filtered by `inScope` |
| `src/app/shared/search-tool/search-tool.component.ts` | Search covers lessees and agreements only |
| `src/app/products/products.component.html` | `lb-out-of-scope` on every product tile except loan products, charges and delinquency buckets |
| `src/app/organization/organization.component.html` | `lb-out-of-scope` on investors, funds, provisioning, tellers, SMS, standing instructions, ad hoc query, bulk reassignment, data table checks |
| `src/app/system/system.component.html` | `lb-out-of-scope` on maker checker, hooks, entity mapping, surveys, external events and services, two-factor |
| `src/app/clients/clients-view/clients-view.component.html` | `lb-out-of-scope` on group membership, savings, share and deposit accounts, collateral, survey, default savings, standing instructions |
| `src/app/clients/clients-view/general-tab/general-tab.component.html` | Savings figures, transfer funds, and the savings, deposit, share and collateral sections hidden |
| `src/app/loans/loans-view/loans-view.component.html` | `lb-out-of-scope` on collateral, floating rate, standing instruction and external asset owner tabs |
| `src/app/loans/loans-view/loan-accounts-button-config.ts` | Agreement actions filtered by `loanActionInScope` |

## Hiding features outside the MVP

Elements marked `class="lb-out-of-scope"` are hidden by one rule in `src/theme/crestion/_crestion.scss`. They are hidden, not removed. Their routes are blocked by the scope guard in `src/app/loanbook/scope.ts`, which sends any out-of-scope URL to the home page. Fineract permissions remain the real control. To bring a feature back, delete the class from its element and its entry from `scope.ts`.

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
