import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly http = inject(HttpClient);

  private readonly router = inject(Router);

  private readonly loginUrl = `${environment.java_server}/api/auth/login`;

  private readonly tokenKey = 'tk_id_token';

  private readonly userKey = 'tk_current_user';

  // État initial restauré depuis le localStorage.
  private readonly tokenState = signal<string | null>(
    localStorage.getItem(this.tokenKey)
  );

  private readonly userState = signal<AuthResponse | null>(
    this.getStoredUser()
  );

  readonly token = this.tokenState.asReadonly();

  readonly currentUser = this.userState.asReadonly();

  private expirationTimer: ReturnType<typeof setTimeout> | null = null;

  startExpirationTimer(): void {

    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
    }

    const expiration = this.getTokenExpiration();

    if (!expiration) {
      this.logout();
      return;
    }

    const remainingTime = expiration - Date.now();

    if (remainingTime <= 0) {
      this.logout();
      return;
    }

    this.expirationTimer = setTimeout(() => {
      this.logout();
    }, remainingTime);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {

    const token = this.getToken();

    if (!token) {
      return false;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      const expiration = payload.exp * 1000;

      return Date.now() < expiration;

    } catch {
      return false;
    }
  }

  getTokenExpiration(): number | null {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload.exp * 1000;

    } catch {
      return null;
    }
  }


  /**
   * Connexion à l'API Spring Boot.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      this.loginUrl,
      credentials
    ).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  /**
   * Enregistrement du token et des informations utilisateur.
   */
  private setSession(response: AuthResponse): void {

    localStorage.setItem(this.tokenKey, response.token);

    localStorage.setItem(
      this.userKey,
      JSON.stringify({
        userId: response.userId,
        email: response.email,
        username: response.username
      })
    );

    this.tokenState.set(response.token);
    this.userState.set(response);
    this.startExpirationTimer();
  }

  /**
   * Restauration des informations utilisateur.
   */
  private getStoredUser(): AuthResponse | null {

    const token = localStorage.getItem(this.tokenKey);
    const user = localStorage.getItem(this.userKey);

    if (!token || !user) {
      return null;
    }

    try {
      return {
        ...JSON.parse(user),
        token
      } as AuthResponse;
    } catch {
      return null;
    }
  }

  /**
   * Déconnexion.
   */
  logout(): void {

    if (this.expirationTimer) {
      clearTimeout(this.expirationTimer);
      this.expirationTimer = null;
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);

    this.tokenState.set(null);
    this.userState.set(null);

    this.router.navigateByUrl('/login', {
      replaceUrl: true
    });
    this.userState.set(null);
  }
}
