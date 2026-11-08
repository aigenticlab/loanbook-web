/**
 * Loanbook: the leasing MVP scope.
 *
 * One list of the Mifos X screens that are outside the leasing brief. Used by
 * the route guard (so hidden screens cannot be reached by URL) and to filter
 * the search, shortcuts and activity lists. Menu items, tiles, tabs and
 * actions are hidden in their templates with class "lb-out-of-scope".
 *
 * Fineract permissions remain the real control; this keeps the UI focused.
 */
import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';

/** URL prefixes outside the brief (matched from the start of the path). */
const OUT_OF_SCOPE_PREFIXES = [
  '/accounting',
  '/groups',
  '/centers',
  '/collections',
  '/navigation',
  '/templates',
  '/checker-inbox-and-tasks',
  '/products/saving-products',
  '/products/share-products',
  '/products/fixed-deposit-products',
  '/products/recurring-deposit-products',
  '/products/collaterals',
  '/products/products-mix',
  '/products/tax-configurations',
  '/products/floating-rates',
  '/organization/standing-instructions-history',
  '/organization/investors',
  '/organization/fund-mapping',
  '/organization/provisioning-criteria',
  '/organization/tellers',
  '/organization/sms-campaigns',
  '/organization/adhoc-query',
  '/organization/manage-funds',
  '/organization/bulkloan',
  '/organization/entity-data-table-checks',
  '/system/configure-mc-tasks',
  '/system/hooks',
  '/system/entity-to-entity-mapping',
  '/system/external-events',
  '/system/external-services',
  '/reports/Savings',
  '/reports/Fund',
  '/reports/Accounting'
];

/** Path segments outside the brief wherever they appear (e.g. under a client or loan). */
const OUT_OF_SCOPE_SEGMENTS = [
  'savings-accounts',
  'shares-accounts',
  'fixed-deposits-accounts',
  'recurring-deposits-accounts',
  'client-collateral',
  'standing-instructions',
  'transfer-funds',
  'glim-account',
  'guarantors'
];

/** True if the URL (router path, query ignored) is part of the leasing MVP. */
export function inScope(url: string): boolean {
  if (!url) {
    return true;
  }
  const path = url.split(/[?#]/)[0];
  if (OUT_OF_SCOPE_PREFIXES.some((p) => path === p || path.startsWith(p + '/'))) {
    return false;
  }
  const segments = path.split('/');
  return !OUT_OF_SCOPE_SEGMENTS.some((s) => segments.includes(s));
}

/**
 * Agreement (loan) actions outside the brief: savings, guarantors, collateral,
 * investors, and Fineract's advanced servicing and refund actions.
 */
const OUT_OF_SCOPE_LOAN_ACTIONS = [
  'Disburse to Savings',
  'Transfer Funds',
  'View Guarantors',
  'Create Guarantor',
  'Recover From Guarantor',
  'Sell Loan',
  'Add Collateral',
  'Add Interest Pause',
  'Charge-Off',
  'Undo Charge-Off',
  'Re-Age',
  'Undo Re-Age',
  'Re-Amortize',
  'Undo Re-Amortize',
  'Close (as Rescheduled)',
  'Contract Termination',
  'Goodwill Credit',
  'Interest Payment Waiver',
  'Payout Refund',
  'Merchant Issued Refund',
  'Buy Down Fee',
  'Capitalized Income'
];

/** True if an agreement action belongs in the leasing MVP. */
export function loanActionInScope(name: string): boolean {
  return !OUT_OF_SCOPE_LOAN_ACTIONS.includes(name);
}

/** Route guard: out-of-scope URLs go to the home page. */
export const scopeGuard: CanActivateChildFn = (_route, state) =>
  inScope(state.url) ? true : inject(Router).parseUrl('/home');
