import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stored } from './stored';

describe('Stored', () => {
  let component: Stored;
  let fixture: ComponentFixture<Stored>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stored],
    }).compileComponents();

    fixture = TestBed.createComponent(Stored);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
