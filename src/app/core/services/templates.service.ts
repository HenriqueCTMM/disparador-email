import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Template, TemplatePayload } from '../models/template.model';

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private readonly http = inject(HttpClient);

  createTemplate(payload: TemplatePayload): Observable<Template> {
    return this.http.post<Template>('/templates', payload);
  }

  listTemplates(): Observable<Template[]> {
    return this.http.get<Template[]>('/templates');
  }

  getTemplateById(id: string): Observable<Template> {
    return this.http.get<Template>(`/templates/${encodeURIComponent(id)}`);
  }

  updateTemplate(id: string, payload: TemplatePayload): Observable<Template> {
    return this.http.put<Template>(`/templates/${encodeURIComponent(id)}`, payload);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`/templates/${encodeURIComponent(id)}`);
  }
}
