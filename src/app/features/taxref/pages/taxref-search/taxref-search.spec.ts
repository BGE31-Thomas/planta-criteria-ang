import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxrefSearch } from './taxref-search';

describe('TaxrefSearch', () => {
  let component: TaxrefSearch;
  let fixture: ComponentFixture<TaxrefSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxrefSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxrefSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
