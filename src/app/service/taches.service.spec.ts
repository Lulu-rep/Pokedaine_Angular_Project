import { TestBed } from '@angular/core/testing';

import { TachesService } from './taches.service';

describe('TachesService', () => {
  let service: TachesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TachesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
