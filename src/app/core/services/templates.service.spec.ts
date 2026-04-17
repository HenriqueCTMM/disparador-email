import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TemplatesService } from './templates.service';

describe('TemplatesService', () => {
  let service: TemplatesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(TemplatesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list templates', () => {
    service.listTemplates().subscribe();
    const request = httpMock.expectOne('/templates');
    expect(request.request.method).toBe('GET');
  });

  it('should delete a template', () => {
    service.deleteTemplate('abc123').subscribe();
    const request = httpMock.expectOne('/templates/abc123');
    expect(request.request.method).toBe('DELETE');
  });
});
