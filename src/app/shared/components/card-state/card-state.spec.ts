import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardState } from './card-state';

describe('CardState', () => {
  let component: CardState;
  let fixture: ComponentFixture<CardState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardState]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardState);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
