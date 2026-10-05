import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CritereList } from './critere-list';

describe('CritereList', () => {
  let component: CritereList;
  let fixture: ComponentFixture<CritereList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CritereList],
    }).compileComponents();

    fixture = TestBed.createComponent(CritereList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
