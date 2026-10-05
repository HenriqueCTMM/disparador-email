import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Template, TemplatePayload } from '../models/template.model';

const isTemplate = (value: unknown): value is Template => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const template = value as Partial<Template>;
  return typeof template.subject === 'string' && typeof template.html === 'string';
};

@Injectable({ providedIn: 'root' })
export class TemplatesService {
  private readonly http = inject(HttpClient);

  createTemplate(payload: TemplatePayload): Observable<Template> {
    return this.http.post<Template>('/templates', payload);
  }

  listTemplates(): Observable<Template[]> {
    return this.http
      .get<unknown[]>('/templates')
      .pipe(map((templates) => templates.filter(isTemplate)));
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
