import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaxrefDetail } from './taxref-detail';

describe('TaxrefDetail', () => {
  let component: TaxrefDetail;
  let fixture: ComponentFixture<TaxrefDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxrefDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(TaxrefDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
