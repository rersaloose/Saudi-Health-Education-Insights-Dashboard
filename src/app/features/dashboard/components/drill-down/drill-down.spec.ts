import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrillDown } from './drill-down';

describe('DrillDown', () => {
  let component: DrillDown;
  let fixture: ComponentFixture<DrillDown>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrillDown]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrillDown);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
