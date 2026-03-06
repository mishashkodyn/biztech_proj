import { HttpClient } from '@angular/common/http';
import { inject, Inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ApiResponse } from '../models/api-response';
import { User } from '../models/user';
import { JsonPipe } from '@angular/common';
import { environment } from '../../../environments/environment';
import { SidebarService } from './sidebar.service';
import { PresenceService } from './presence-service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/account`;
  private token = 'token';
  isLoading = signal(false);
  sidebarService = inject(SidebarService);
  httpClient = inject(HttpClient);
  presenceService = inject(PresenceService);
  chatService = inject(ChatService);

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
      .post<ApiResponse<string>>(`${this.baseUrl}/login`, { email, password }, { withCredentials: true })
      .pipe(
        tap((res) => {
          if (res.isSuccess && res.data) {
            localStorage.setItem(this.token, res.data);
          }
        }),
      );
  }

  refreshToken(): Observable<ApiResponse<string>>{
    console.log("Refresh session");
    return this.httpClient.post<any>(`${this.baseUrl}/refresh`, {}, {withCredentials: true}).pipe(tap(response => {
      localStorage.setItem(this.token, response.data);
    }))
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
          if (!this.presenceService.isConnected()) {
            this.presenceService.startConnection();
          }
          if (!this.chatService.isConnected()) {
            this.chatService.startConnection();
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
    this.sidebarService.toggleSideBar();
    this.presenceService.stopConnection();
    this.chatService.stopConnection();
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
