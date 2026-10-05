import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { apiKeyInterceptor } from '../interceptors/api-key.interceptor';
import { Template } from '../models/template.model';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiKeyInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(TemplatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list templates', () => {
    const templates: Template[] = [
      { _id: 'abc123', subject: 'Template de teste', html: '<p>Teste</p>' },
    ];
    const backendResponse = [...templates, { _id: 'incomplete-template' }];

    service.listTemplates().subscribe((response) => expect(response).toEqual(templates));
    const request = httpMock.expectOne('/templates');

    expect(request.request.method).toBe('GET');
    expect(request.request.headers.get('X-API-Key')).toBe(environment.apiKey);
    request.flush(backendResponse);
  });

  it('should delete a template', () => {
    service.deleteTemplate('abc123').subscribe();
    const request = httpMock.expectOne('/templates/abc123');
    expect(request.request.method).toBe('DELETE');
  });
});
