import { TestBed } from '@angular/core/testing';
import { Critere } from './critere';

describe('Critere', () => {
  let service: Critere;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Critere);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
