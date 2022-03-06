import { TestBed } from '@angular/core/testing';

import { CdeclService } from './cdecl.service';

describe('CdeclService', () => {
  let service: CdeclService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CdeclService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
