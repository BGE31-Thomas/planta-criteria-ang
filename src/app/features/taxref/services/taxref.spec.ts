import { TestBed } from '@angular/core/testing';
import { Taxref } from './taxref';

describe('Taxref', () => {
  let service: Taxref;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Taxref);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
