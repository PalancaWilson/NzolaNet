import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aparencia } from './aparencia';

describe('Aparencia', () => {
  let component: Aparencia;
  let fixture: ComponentFixture<Aparencia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aparencia],
    }).compileComponents();

    fixture = TestBed.createComponent(Aparencia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
