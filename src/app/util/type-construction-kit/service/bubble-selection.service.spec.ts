import { TestBed } from '@angular/core/testing';

import { BubbleSelectionService } from './bubble-selection.service';

describe('BubbleSelectionService', () => {
  let service: BubbleSelectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BubbleSelectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
