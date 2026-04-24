import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CheckContactResponse,
  Contact,
  ImportContactsPayload,
  UpdateContactEmailPayload
} from '../models/contact.model';

@Injectable({ providedIn: 'root' })
export class ContactsService {
  private readonly http = inject(HttpClient);

  importContacts(payload: ImportContactsPayload): Observable<{ ok: boolean }> {
    return this.http.post<{ ok: boolean }>('/b0cbf7/list', payload);
  }

  listByTag(tagId: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`/abc/list/${encodeURIComponent(tagId)}`);
  }

  checkExists(email: string): Observable<CheckContactResponse> {
    return this.http.post<CheckContactResponse>(`/CS2aa3242/contact/${encodeURIComponent(email)}`, {});
  }

  updateEmail(payload: UpdateContactEmailPayload): Observable<Contact | null> {
    return this.http.put<Contact | null>('/CS2aa3242/contact', payload);
  }

  removeManually(email: string): Observable<unknown> {
    return this.http.put<unknown>(`/321sasr323/delContatos/${encodeURIComponent(email)}`, {});
  }
}
