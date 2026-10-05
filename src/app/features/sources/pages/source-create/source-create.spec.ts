import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceCreate } from './source-create';

describe('SourceCreate', () => {
  let component: SourceCreate;
  let fixture: ComponentFixture<SourceCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
