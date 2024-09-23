import { TestBed } from '@angular/core/testing';

import { HandService } from './hand.service';

describe('HandService', () => {
  let service: HandService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
