import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(ContactsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request contacts by tag', () => {
    service.listByTag('tag-1').subscribe();

    const request = httpMock.expectOne('/abc/list/tag-1');
    expect(request.request.method).toBe('GET');
  });

  it('should update contact email', () => {
    service.updateEmail({ contact: 'old@example.com', newEmail: 'new@example.com' }).subscribe();

    const request = httpMock.expectOne('/CS2aa3242/contact');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ contact: 'old@example.com', newEmail: 'new@example.com' });
  });
});
