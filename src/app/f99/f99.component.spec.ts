import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F99Component } from './f99.component';

describe('F99Component', () => {
  let component: F99Component;
  let fixture: ComponentFixture<F99Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F99Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(F99Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
