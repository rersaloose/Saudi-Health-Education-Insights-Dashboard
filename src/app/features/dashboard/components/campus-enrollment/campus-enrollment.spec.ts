import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusEnrollment } from './campus-enrollment';

describe('CampusEnrollment', () => {
  let component: CampusEnrollment;
  let fixture: ComponentFixture<CampusEnrollment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampusEnrollment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampusEnrollment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
