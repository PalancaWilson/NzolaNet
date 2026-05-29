import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserId } from './user-id';

describe('UserId', () => {
  let component: UserId;
  let fixture: ComponentFixture<UserId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserId],
    }).compileComponents();

    fixture = TestBed.createComponent(UserId);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
