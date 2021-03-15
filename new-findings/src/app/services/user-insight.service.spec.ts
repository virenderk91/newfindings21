import { TestBed } from '@angular/core/testing';

import { UserInsightService } from './user-insight.service';

describe('UserInsightService', () => {
  let service: UserInsightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserInsightService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
