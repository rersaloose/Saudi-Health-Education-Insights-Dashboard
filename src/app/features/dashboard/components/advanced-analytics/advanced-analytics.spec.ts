import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedAnalytics } from './advanced-analytics';

describe('AdvancedAnalytics', () => {
  let component: AdvancedAnalytics;
  let fixture: ComponentFixture<AdvancedAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedAnalytics]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
