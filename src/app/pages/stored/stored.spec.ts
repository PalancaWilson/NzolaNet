import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Stored } from './stored';

describe('Stored', () => {
  let component: Stored;
  let fixture: ComponentFixture<Stored>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stored],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Stored);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
