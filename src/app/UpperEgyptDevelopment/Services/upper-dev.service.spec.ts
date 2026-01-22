import { TestBed } from '@angular/core/testing';

import { UpperDevService } from './upper-dev.service';

describe('UpperDevService', () => {
  let service: UpperDevService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpperDevService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
