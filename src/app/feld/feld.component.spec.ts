import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeldComponent } from './feld.component';

describe('FeldComponent', () => {
  let component: FeldComponent;
  let fixture: ComponentFixture<FeldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeldComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
