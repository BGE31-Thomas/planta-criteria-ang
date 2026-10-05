import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SerieList } from './serie-list';

describe('SerieList', () => {
  let component: SerieList;
  let fixture: ComponentFixture<SerieList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerieList],
    }).compileComponents();

    fixture = TestBed.createComponent(SerieList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
