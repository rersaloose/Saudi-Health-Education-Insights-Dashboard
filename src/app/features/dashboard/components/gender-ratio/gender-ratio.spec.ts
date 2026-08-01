import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenderRatio } from './gender-ratio';

describe('GenderRatio', () => {
  let component: GenderRatio;
  let fixture: ComponentFixture<GenderRatio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenderRatio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenderRatio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
