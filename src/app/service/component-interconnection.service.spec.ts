import { TestBed } from '@angular/core/testing';

import { ComponentInterconnectionService } from './component-interconnection.service';

describe('ComponentInterconnectionService', () => {
  let service: ComponentInterconnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentInterconnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
