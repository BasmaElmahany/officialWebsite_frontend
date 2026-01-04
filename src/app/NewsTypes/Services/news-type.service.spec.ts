import { TestBed } from '@angular/core/testing';

import { NewsTypeService } from './news-type.service';

describe('NewsTypeService', () => {
  let service: NewsTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewsTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
