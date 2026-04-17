import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';

@Injectable({ providedIn: 'root' })
export class TagsService {
  private readonly http = inject(HttpClient);

  listTags(): Observable<Tag[]> {
    return this.http.post<Tag[]>('/d555a343/tags', {});
  }
}
