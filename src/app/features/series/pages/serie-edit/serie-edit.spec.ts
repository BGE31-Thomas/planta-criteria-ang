import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SerieEdit } from './serie-edit';

describe('SerieEdit', () => {
  let component: SerieEdit;
  let fixture: ComponentFixture<SerieEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
