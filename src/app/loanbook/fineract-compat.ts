/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Loanbook: compatibility with Apache Fineract 1.12.1.
 *
 * The web app fork tracks upstream `dev`, which sends some fields that
 * Fineract 1.12.1 does not know. Fineract rejects the whole request when it
 * sees an unsupported parameter, so these are removed before sending.
 * Remove an entry when the Fineract version that supports it is deployed.
 */

/** Product (POST/PUT /loanproducts) fields unknown to Fineract 1.12.1. */
export const UNSUPPORTED_LOAN_PRODUCT_FIELDS = ['allowFullTermForTranche'];

/** Agreement (POST/PUT /loans, calculateLoanSchedule) fields unknown to Fineract 1.12.1. */
export const UNSUPPORTED_LOAN_FIELDS = ['allowFullTermForTranche'];

/** Returns a shallow copy of the payload without the given fields. */
export function withoutFields<T>(payload: T, fields: string[]): T {
  if (!payload || typeof payload !== 'object') {
    return payload;
  }
  const copy: any = { ...(payload as any) };
  fields.forEach((f) => delete copy[f]);
  return copy;
}
