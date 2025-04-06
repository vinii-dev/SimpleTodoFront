import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, switchMap, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { LoginResponse } from './auth.model';
import { Router } from '@angular/router';

const STORAGE_TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private authApi = inject(AuthService);
  private router = inject(Router);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    this.checkAuthStatus();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.authApi.login(username, password).pipe(
      tap(response => {
        this.token = response.token;
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  register(username: string, password: string): Observable<LoginResponse> {
    return this.authApi.register(username, password).pipe(
      switchMap(() => this.login(username, password)),
    );
  }

  logout(): void {
    this.clearToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  checkAuthStatus(): boolean {
    const token = this.token;
    const isAuthenticated = !!token;

    this.isAuthenticatedSubject.next(isAuthenticated);
    return isAuthenticated;
  }

  public get token(): string {
    return localStorage.getItem(STORAGE_TOKEN_KEY) || '';
  }

  private set token(token: string) {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
  }

  private clearToken() {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  }
}
