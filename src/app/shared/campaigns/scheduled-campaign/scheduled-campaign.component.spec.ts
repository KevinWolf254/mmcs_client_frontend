import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduledCampaignComponent } from './scheduled-campaign.component';

describe('ScheduledCampaignComponent', () => {
  let component: ScheduledCampaignComponent;
  let fixture: ComponentFixture<ScheduledCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduledCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduledCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
