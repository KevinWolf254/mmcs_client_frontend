import { TestBed, async, inject } from '@angular/core/testing';

import { SharedGuard } from './shared.guard';

describe('SharedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedGuard]
    });
  });

  it('should ...', inject([SharedGuard], (guard: SharedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
