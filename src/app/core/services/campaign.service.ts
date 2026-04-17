import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EnqueueMessagePayload, MessageResponse } from '../models/campaign.model';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  private readonly http = inject(HttpClient);

  enqueueMessage(payload: EnqueueMessagePayload): Observable<MessageResponse> {
    return this.http.post<MessageResponse>('/f45f76/messages', payload);
  }
}
