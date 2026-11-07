/**
 * Loanbook: Conister Bank sign-in screen.
 *
 * Reuses all of the upstream LoginComponent behaviour (password expiry,
 * two-factor authentication, redirects) and only replaces the template and
 * styles, so upstream fixes to the login logic still apply.
 * Design: "Conister Loanbook Screens" > Login (Claude Design).
 */
import { Component } from '@angular/core';

import { STANDALONE_SHARED_IMPORTS } from 'app/standalone-shared.module';
import { LoginComponent } from '../../login/login.component';
import { LoginFormComponent } from '../../login/login-form/login-form.component';
import { ResetPasswordComponent } from '../../login/reset-password/reset-password.component';
import { TwoFactorAuthenticationComponent } from '../../login/two-factor-authentication/two-factor-authentication.component';

@Component({
  selector: 'mifosx-loanbook-login',
  templateUrl: './loanbook-login.component.html',
  styleUrls: ['./loanbook-login.component.scss'],
  imports: [
    ...STANDALONE_SHARED_IMPORTS,
    LoginFormComponent,
    ResetPasswordComponent,
    TwoFactorAuthenticationComponent
  ]
})
export class LoanbookLoginComponent extends LoginComponent {}
