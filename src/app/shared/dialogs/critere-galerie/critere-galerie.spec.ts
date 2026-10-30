import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CritereGalerie } from './critere-galerie';

describe('CritereGalerie', () => {
  let component: CritereGalerie;
  let fixture: ComponentFixture<CritereGalerie>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CritereGalerie],
    }).compileComponents();

    fixture = TestBed.createComponent(CritereGalerie);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
