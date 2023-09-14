import { TestBed } from '@angular/core/testing';

import { EnvironmentDataService } from './environment-data.service';

describe('EnvironmentDataService', () => {
  let service: EnvironmentDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
