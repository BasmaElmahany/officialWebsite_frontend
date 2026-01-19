import { TestBed } from '@angular/core/testing';

import { CenterService } from './society.service';

describe('SocietyService', () => {
  let service: CenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
