/**
 * Copyright since 2025 Mifos Initiative
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Loanbook: Crestion Bank home page.
 *
 * Replaces the upstream Mifos home (logo and "Welcome ... to Default!") with a
 * portfolio overview: active agreements, balance outstanding, agreements in
 * arrears, and the arrears list. Read-only, from the Fineract REST API.
 */
import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { UntypedFormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';

import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { activities } from '../../home/activities';

interface ArrearsRow {
  loanId: number;
  clientId: number;
  lessee: string;
  agreement: string;
  product: string;
  overdue: number;
  since?: string;
}

@Component({
  selector: 'mifosx-loanbook-home',
  templateUrl: './loanbook-home.component.html',
  styleUrls: ['./loanbook-home.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    MatAutocomplete,
    MatAutocompleteTrigger,
    CurrencyPipe,
    DatePipe,
    DecimalPipe
  ]
})
export class LoanbookHomeComponent implements OnInit {
  private http = inject(HttpClient);
  private authenticationService = inject(AuthenticationService);

  greeting = 'Welcome';
  name = '';
  loaded = false;
  failed = false;

  currency = 'GBP';
  lessees = 0;
  activeAgreements = 0;
  outstanding = 0;
  arrearsCount = 0;
  arrearsAmount = 0;
  arrears: ArrearsRow[] = [];

  searchText = new UntypedFormControl('');
  filteredActivities: Observable<any[]>;

  ngOnInit() {
    const credentials = this.authenticationService.getCredentials();
    const hour = new Date().getHours();
    this.greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    this.name = this.capitalise(credentials?.username || '');

    if (credentials?.userId) {
      this.http
        .get<any>(`/users/${credentials.userId}`)
        .pipe(catchError(() => of(null)))
        .subscribe((user) => {
          if (user?.firstname) {
            this.name = user.firstname;
          }
        });
    }

    this.filteredActivities = this.searchText.valueChanges.pipe(
      startWith(''),
      map((value: string) => {
        const filter = (value || '').toString().toLowerCase();
        return filter ? activities.filter((a: any) => a.activity.toLowerCase().includes(filter)) : [];
      })
    );

    forkJoin({
      clients: this.http.get<any>('/clients', { params: { limit: '1' } }),
      loans: this.http.get<any>('/loans', { params: { limit: '1000' } })
    }).subscribe({
      next: ({ clients, loans }) => {
        this.lessees = clients?.totalFilteredRecords ?? 0;
        const items: any[] = (loans?.pageItems ?? []).filter((l: any) => l.status?.active);
        this.activeAgreements = items.length;
        if (items.length && items[0].currency?.code) {
          this.currency = items[0].currency.code;
        }
        this.outstanding = items.reduce((sum, l) => sum + (l.summary?.totalOutstanding ?? 0), 0);
        const late = items.filter((l) => (l.summary?.totalOverdue ?? 0) > 0);
        this.arrearsCount = late.length;
        this.arrearsAmount = late.reduce((sum, l) => sum + l.summary.totalOverdue, 0);
        this.arrears = late
          .map((l) => ({
            loanId: l.id,
            clientId: l.clientId,
            lessee: l.clientName,
            agreement: l.externalId || l.accountNo,
            product: l.loanProductName,
            overdue: l.summary.totalOverdue,
            since: this.toIso(l.summary.overdueSinceDate)
          }))
          .sort((a, b) => b.overdue - a.overdue)
          .slice(0, 8);
        this.loaded = true;
      },
      error: () => {
        this.failed = true;
        this.loaded = true;
      }
    });
  }

  private capitalise(s: string): string {
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  }

  /** Fineract returns dates as [yyyy, m, d]. */
  private toIso(d: any): string | undefined {
    if (Array.isArray(d) && d.length === 3) {
      return `${d[0]}-${String(d[1]).padStart(2, '0')}-${String(d[2]).padStart(2, '0')}`;
    }
    return typeof d === 'string' ? d : undefined;
  }
}
