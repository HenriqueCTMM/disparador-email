import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly http = inject(HttpClient);

  createTag(title: string): Observable<Tag> {
    return this.http.post<Tag>('/tags', { title });
  }

  listTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>('/tags');
  }

  updateTag(id: string, title: string): Observable<Tag> {
    return this.http.put<Tag>(`/tags/${encodeURIComponent(id)}`, { title });
  }

  deleteTag(id: string): Observable<void> {
    return this.http.delete<void>(`/tags/${encodeURIComponent(id)}`);
  }
}
