import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CritereCreate } from './critere-create';

describe('CritereCreate', () => {
  let component: CritereCreate;
  let fixture: ComponentFixture<CritereCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CritereCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(CritereCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
