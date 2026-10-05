import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CritereEdit } from './critere-edit';

describe('CritereEdit', () => {
  let component: CritereEdit;
  let fixture: ComponentFixture<CritereEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CritereEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(CritereEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
