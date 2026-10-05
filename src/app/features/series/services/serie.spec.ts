import { TestBed } from '@angular/core/testing';
import { Serie } from './serie';

describe('Serie', () => {
  let service: Serie;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Serie);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
