import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SerieCreate } from './serie-create';

describe('SerieCreate', () => {
  let component: SerieCreate;
  let fixture: ComponentFixture<SerieCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
