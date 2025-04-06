import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from './auth.model';
import { environment } from '../../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  http = inject(HttpClient);

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(environment.baseUrl + '/auth/login', { username, password });
  }

  register(username: string, password: string): Observable<void> {
    return this.http.post<void>(environment.baseUrl + '/auth/register', { username, password });
  }
}
