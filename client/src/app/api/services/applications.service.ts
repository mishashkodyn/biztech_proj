import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AiChatRequest, AiMessage } from '../models/ai-chat-request';
import { ApiResponse } from '../models/api-response';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PsychologistApplicationResponseDto } from '../models/psychologist-application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationsService {
  private baseUrl = `${environment.apiBaseUrl}/applications`;

  private http = inject(HttpClient);

  getPsychologistApplications(): Observable<
    ApiResponse<PsychologistApplicationResponseDto[]>
  > {
    return this.http.get<ApiResponse<PsychologistApplicationResponseDto[]>>(
      `${this.baseUrl}/admin/applications`,
    );
  }

  approveApplication(id: string) {
    return this.http.post(`${this.baseUrl}/approve-application/${id}`, id)
  }
}
