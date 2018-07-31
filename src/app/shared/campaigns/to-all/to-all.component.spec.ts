import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToAllComponent } from './to-all.component';

describe('ToAllComponent', () => {
  let component: ToAllComponent;
  let fixture: ComponentFixture<ToAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
