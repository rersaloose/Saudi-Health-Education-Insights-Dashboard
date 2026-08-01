import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTrends } from './student-trends';

describe('StudentTrends', () => {
  let component: StudentTrends;
  let fixture: ComponentFixture<StudentTrends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentTrends]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentTrends);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
