import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DeletedContact } from '../models/deleted-contact.model';
import { MessageResponse } from '../models/campaign.model';

@Injectable({ providedIn: 'root' })
export class MaintenanceService {
  private readonly http = inject(HttpClient);

  listDeletedContacts(): Observable<DeletedContact[]> {
    return this.http.post<DeletedContact[]>('/321sasr323/delContatos', {});
  }

  removeXMailerErrors(): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('/a89sdyhsad78/xmailerReportError', {});
  }
}
