import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientGroupsComponent } from './client-groups.component';

describe('ClientGroupsComponent', () => {
  let component: ClientGroupsComponent;
  let fixture: ComponentFixture<ClientGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
