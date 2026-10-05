import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SourceEdit } from './source-edit';

describe('SourceEdit', () => {
  let component: SourceEdit;
  let fixture: ComponentFixture<SourceEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(SourceEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
