import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly http = inject(HttpClient);

  createTag(title: string): Observable<Tag> {
    return this.http.post<Tag>('/d555a343/tags', { title });
  }

  listTags(): Observable<Tag[]> {
    return this.http.post<Tag[]>('/d555a343/tags', {});
  }

  updateTag(id: string, title: string): Observable<Tag> {
    return this.http.put<Tag>(`/d555a343/tags/${encodeURIComponent(id)}`, { title });
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`/d555a343/tags/${encodeURIComponent(id)}`);
  }
}
