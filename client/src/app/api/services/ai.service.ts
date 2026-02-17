import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AiChatResponse } from '../models/ai-chat-response';
import { ApiResponse } from '../models/api-response';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private baseUrl = `${environment.apiBaseUrl}/ai`;

  private http = inject(HttpClient);

  chatAsync(message: AiChatResponse): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.baseUrl}/chat`,
      message,
    );
  }
}
