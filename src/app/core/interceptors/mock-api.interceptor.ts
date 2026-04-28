import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, delay, of, throwError } from 'rxjs';
import { EnqueueMessagePayload } from '../models/campaign.model';
import { ImportContactsPayload, UpdateContactEmailPayload } from '../models/contact.model';
import { TemplatePayload } from '../models/template.model';
import { MockApiModeService } from '../services/mock-api-mode.service';
import { MockApiStorageService } from '../services/mock-api-storage.service';

const MOCK_RESPONSE_DELAY_MS = 200;

const notFound = (message: string): Observable<never> =>
  throwError(
    () =>
      new HttpErrorResponse({
        status: 404,
        error: { message },
      }),
  );

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const modeService = inject(MockApiModeService);
  if (!modeService.enabled()) {
    return next(req);
  }

  const storage = inject(MockApiStorageService);
  const [pathWithoutQuery] = req.url.split('?');
  const path = pathWithoutQuery.startsWith('/') ? pathWithoutQuery : `/${pathWithoutQuery}`;

  if (req.method === 'GET' && path === '/tags') {
    return of(new HttpResponse({ status: 200, body: storage.listTags() })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'POST' && path === '/tags') {
    const title = (req.body as { title?: string } | null)?.title?.trim();
    if (!title) {
      return notFound('Título da tag é obrigatório.');
    }

    return of(new HttpResponse({ status: 200, body: storage.createTag(title) })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'PUT' && path.startsWith('/tags/')) {
    const id = decodeURIComponent(path.replace('/tags/', ''));
    const title = (req.body as { title?: string } | null)?.title?.trim();
    if (!title) {
      return notFound('Título da tag é obrigatório.');
    }

    const updated = storage.updateTag(id, title);
    if (!updated) {
      return notFound('Tag não encontrada.');
    }

    return of(new HttpResponse({ status: 200, body: updated })).pipe(delay(MOCK_RESPONSE_DELAY_MS));
  }

  if (req.method === 'DELETE' && path.startsWith('/tags/')) {
    const id = decodeURIComponent(path.replace('/tags/', ''));
    const removed = storage.deleteTag(id);
    if (!removed) {
      return notFound('Tag não encontrada.');
    }

    return of(new HttpResponse({ status: 200, body: undefined })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'GET' && path === '/templates') {
    return of(new HttpResponse({ status: 200, body: storage.listTemplates() })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'GET' && path.startsWith('/templates/')) {
    const id = decodeURIComponent(path.replace('/templates/', ''));
    const template = storage.getTemplateById(id);
    if (!template) {
      return notFound('Template não encontrado.');
    }

    return of(new HttpResponse({ status: 200, body: template })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'POST' && path === '/templates') {
    return of(
      new HttpResponse({ status: 200, body: storage.createTemplate(req.body as TemplatePayload) }),
    ).pipe(delay(MOCK_RESPONSE_DELAY_MS));
  }

  if (req.method === 'PUT' && path.startsWith('/templates/')) {
    const id = decodeURIComponent(path.replace('/templates/', ''));
    const updated = storage.updateTemplate(id, req.body as TemplatePayload);
    if (!updated) {
      return notFound('Template não encontrado.');
    }

    return of(new HttpResponse({ status: 200, body: updated })).pipe(delay(MOCK_RESPONSE_DELAY_MS));
  }

  if (req.method === 'DELETE' && path.startsWith('/templates/')) {
    const id = decodeURIComponent(path.replace('/templates/', ''));
    const removed = storage.deleteTemplate(id);
    if (!removed) {
      return notFound('Template não encontrado.');
    }

    return of(new HttpResponse({ status: 200, body: undefined })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'POST' && path === '/b0cbf7/list') {
    return of(
      new HttpResponse({
        status: 200,
        body: storage.importContacts(req.body as ImportContactsPayload),
      }),
    ).pipe(delay(MOCK_RESPONSE_DELAY_MS));
  }

  if (req.method === 'GET' && path.startsWith('/abc/list/')) {
    const tagId = decodeURIComponent(path.replace('/abc/list/', ''));
    return of(new HttpResponse({ status: 200, body: storage.listContactsByTag(tagId) })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'POST' && path.startsWith('/CS2aa3242/contact/')) {
    const email = decodeURIComponent(path.replace('/CS2aa3242/contact/', ''));
    return of(new HttpResponse({ status: 200, body: storage.checkContactExists(email) })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'PUT' && path === '/CS2aa3242/contact') {
    return of(
      new HttpResponse({
        status: 200,
        body: storage.updateContactEmail(req.body as UpdateContactEmailPayload),
      }),
    ).pipe(delay(MOCK_RESPONSE_DELAY_MS));
  }

  if (req.method === 'PUT' && path.startsWith('/321sasr323/delContatos/')) {
    const email = decodeURIComponent(path.replace('/321sasr323/delContatos/', ''));
    return of(new HttpResponse({ status: 200, body: storage.removeContact(email) })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'POST' && path === '/321sasr323/delContatos') {
    return of(new HttpResponse({ status: 200, body: storage.listDeletedContacts() })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'POST' && path === '/a89sdyhsad78/xmailerReportError') {
    return of(new HttpResponse({ status: 200, body: storage.removeXMailerErrors() })).pipe(
      delay(MOCK_RESPONSE_DELAY_MS),
    );
  }

  if (req.method === 'POST' && path === '/f45f76/messages') {
    return of(
      new HttpResponse({
        status: 200,
        body: storage.enqueueMessage(req.body as EnqueueMessagePayload),
      }),
    ).pipe(delay(MOCK_RESPONSE_DELAY_MS));
  }

  return next(req);
};
