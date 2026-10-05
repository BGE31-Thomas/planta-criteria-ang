import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationCreate } from './observation-create';

describe('ObservationCreate', () => {
  let component: ObservationCreate;
  let fixture: ComponentFixture<ObservationCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObservationCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(ObservationCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
