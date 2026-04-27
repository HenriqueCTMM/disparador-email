import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TagsService } from './tags.service';

describe('TagsService', () => {
  let service: TagsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(TagsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list tags', () => {
    service.listTags().subscribe();

    const request = httpMock.expectOne('/d555a343/tags');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({});
  });

  it('should create a tag', () => {
    service.createTag('VIP').subscribe();

    const request = httpMock.expectOne('/d555a343/tags');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ title: 'VIP' });
  });

  it('should update a tag', () => {
    service.updateTag('tag-1', 'Clientes').subscribe();

    const request = httpMock.expectOne('/d555a343/tags/tag-1');
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ title: 'Clientes' });
  });

  it('should delete a tag', () => {
    service.deleteTag('tag-1').subscribe();

    const request = httpMock.expectOne('/d555a343/tags/tag-1');
    expect(request.request.method).toBe('DELETE');
  });
});
