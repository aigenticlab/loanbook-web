/**
 * Loanbook: translation overlay.
 *
 * Loads the upstream translation file (assets/translations/<lang>.json), then
 * applies the Loanbook overlay from assets/translations/loanbook/<lang>.json:
 *   - "replace": whole-word term replacements applied to every label
 *     (Client > Lessee, Loan > Agreement, Office > Branch, ...)
 *   - "overrides": exact values for specific keys, applied last
 *
 * Keeping our wording in a separate file means upstream translation updates
 * still merge cleanly. Placeholders such as {{clientName}} are never changed.
 */
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

type Translations = { [key: string]: string | Translations };

export interface LoanbookOverlay {
  /** [from, to] pairs. Longer terms win over shorter ones. Case-sensitive, whole words only. */
  replace?: [string, string][];
  /** Nested key/value pairs merged over the result. */
  overrides?: Translations;
}

const PLACEHOLDER = /(\{\{[^}]*\}\})/;

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Build a function that replaces every term in one pass, longest first. */
export function buildReplacer(pairs: [string, string][]): (value: string) => string {
  if (!pairs.length) {
    return (value) => value;
  }
  const table = new Map(pairs);
  const terms = [...table.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp);
  const pattern = new RegExp(`\\b(${terms.join('|')})\\b`, 'g');
  return (value: string) =>
    value
      .split(PLACEHOLDER)
      .map((part) => (PLACEHOLDER.test(part) ? part : part.replace(pattern, (match) => table.get(match) ?? match)))
      .join('');
}

function transform(node: Translations, replace: (value: string) => string): Translations {
  const result: Translations = {};
  for (const [key, value] of Object.entries(node)) {
    result[key] = typeof value === 'string' ? replace(value) : transform(value, replace);
  }
  return result;
}

function merge(target: Translations, source: Translations): Translations {
  const result: Translations = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const existing = result[key];
    result[key] =
      typeof value === 'object' && typeof existing === 'object' ? merge(existing, value) : value;
  }
  return result;
}

export function applyOverlay(base: Translations, overlay: LoanbookOverlay): Translations {
  const replaced = transform(base, buildReplacer(overlay.replace ?? []));
  return merge(replaced, overlay.overrides ?? {});
}

export class LoanbookTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix = '/assets/translations/',
    private overlayPrefix = '/assets/translations/loanbook/'
  ) {}

  getTranslation(lang: string): Observable<Translations> {
    const base$ = this.http.get<Translations>(`${this.prefix}${lang}.json`);
    // Languages without an overlay fall back to the upstream wording.
    const overlay$ = this.http
      .get<LoanbookOverlay>(`${this.overlayPrefix}${lang}.json`)
      .pipe(catchError(() => of(null as LoanbookOverlay | null)));
    return forkJoin([base$, overlay$]).pipe(
      map(([base, overlay]) => (overlay ? applyOverlay(base, overlay) : base))
    );
  }
}
