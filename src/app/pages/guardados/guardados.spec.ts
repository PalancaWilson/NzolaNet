import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Guardados } from './guardados';

describe('Guardados', () => {
  let component: Guardados;
  let fixture: ComponentFixture<Guardados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Guardados],
    }).compileComponents();

    fixture = TestBed.createComponent(Guardados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
