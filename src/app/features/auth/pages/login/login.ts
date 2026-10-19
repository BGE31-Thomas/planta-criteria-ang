import { Component, inject, signal } from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/authService';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly hidePassword = signal(true);

  readonly form = this.fb.nonNullable.group({
    email: ['', [
      Validators.required,
      Validators.email
    ]],
    password: ['', [
      Validators.required
    ]]
  });

  submit(): void {

    if (this.form.invalid || this.loading()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.form.getRawValue())
      .pipe(
        finalize(() => this.loading.set(false))
      )
      .subscribe({
        next: () => {

          const returnUrl =
            this.route.snapshot.queryParamMap.get('returnUrl');

          // Éviter une redirection vers un site externe.
          const destination =
            returnUrl?.startsWith('/') &&
            !returnUrl.startsWith('//')
              ? returnUrl
              : '/plants/search';

          void this.router.navigateByUrl(destination);
        },

        error: () => {
          this.errorMessage.set(
            'Connexion impossible. Vérifiez votre email et votre mot de passe.'
          );
        }
      });
  }
}
