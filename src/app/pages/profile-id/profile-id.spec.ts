import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileId } from './profile-id';

describe('ProfileId', () => {
  let component: ProfileId;
  let fixture: ComponentFixture<ProfileId>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileId],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileId);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
