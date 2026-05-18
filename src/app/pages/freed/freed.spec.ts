import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Freed } from './freed';

describe('Freed', () => {
  let component: Freed;
  let fixture: ComponentFixture<Freed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Freed],
    }).compileComponents();

    fixture = TestBed.createComponent(Freed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
