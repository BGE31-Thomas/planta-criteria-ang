import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CritereDetail } from './critere-detail';

describe('CritereDetail', () => {
  let component: CritereDetail;
  let fixture: ComponentFixture<CritereDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CritereDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(CritereDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
