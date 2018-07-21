import { TestBed, inject } from '@angular/core/testing';

import { AeonService } from './aeon.service';

describe('AeonService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AeonService]
    });
  });

  it('should be created', inject([AeonService], (service: AeonService) => {
    expect(service).toBeTruthy();
  }));
});
