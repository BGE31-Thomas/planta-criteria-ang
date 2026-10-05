import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationEdit } from './observation-edit';

describe('ObservationEdit', () => {
  let component: ObservationEdit;
  let fixture: ComponentFixture<ObservationEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
