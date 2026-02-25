import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user';
import { JsonPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { SidebarService } from './sidebar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/account`;
  private token = 'token';
  isLoading = signal(false);
  sidebarService = inject(SidebarService);
  httpClient = inject(HttpClient);

  register(data: FormData): Observable<ApiResponse<string>> {
    return this.httpClient
      .post<ApiResponse<string>>(`${this.baseUrl}/register`, data)
      .pipe(
        tap((res) => {
          localStorage.setItem(this.token, res.data);
        }),
      );
  }

  login(email: string, password: string): Observable<ApiResponse<string>> {
    return this.httpClient
      .post<ApiResponse<string>>(`${this.baseUrl}/login`, {
        email,
        password,
      })
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            localStorage.setItem(this.token, res.data);
          }

          return res;
        }),
      );
  }

  me(): Observable<ApiResponse<User>> {
    return this.httpClient
      .get<ApiResponse<User>>(`${this.baseUrl}/me`, {
        headers: {
          Authorization: `Bearer ${this.getAccessToken}`,
        },
      })
      .pipe(
        tap((res) => {
          if (res.isSuccess) {
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        }),
      );
  }

  getUserAIProveder(): Observable<ApiResponse<User>> {
    return this.httpClient.get<ApiResponse<User>>(
      `${this.baseUrl}/AIprovider`,
      {
        headers: {
          Authorization: `Bearer ${this.getAccessToken}`,
        },
      },
    );
  }

  logout() {
    this.sidebarService.toggleSideBar()
    localStorage.removeItem(this.token);
    localStorage.removeItem('user');
  }

  get getAccessToken(): string | null {
    return localStorage.getItem(this.token) || '';
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.token);
  }

  get currentLoggedUser(): User | null {
    const user: User = JSON.parse(localStorage.getItem('user') || '{}');
    return user;
  }

  get isSuperAdmin(): boolean {
    return this.currentLoggedUser?.roles?.includes('Superadmin') ?? false;
  }

  get isAdmin(): boolean {
    const roles = this.currentLoggedUser?.roles ?? [];
    return roles.includes('Administrator') || roles.includes('Superadmin');
  }

  get isPsychologist(): boolean {
    return this.currentLoggedUser?.roles?.includes('Psychologist') ?? false;
  }

  hasRole(role: string): boolean {
    return this.currentLoggedUser?.roles?.includes(role) ?? false;
  }
}
