import { TestBed } from '@angular/core/testing';

import { SicoitService } from './sicoit.service';

describe('SicoitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SicoitService = TestBed.get(SicoitService);
    expect(service).toBeTruthy();
  });
});
