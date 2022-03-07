import { TestBed } from '@angular/core/testing';

import { ConfigurationStoreService } from './configuration-store.service';

describe('ConfigurationStoreService', () => {
  let service: ConfigurationStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
