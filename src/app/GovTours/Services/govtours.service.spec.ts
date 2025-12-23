import { TestBed } from '@angular/core/testing';

import { GovtoursService } from './govtours.service';

describe('GovtoursService', () => {
  let service: GovtoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GovtoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
