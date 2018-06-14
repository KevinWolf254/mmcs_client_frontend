import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimeCampaignComponent } from './one-time-campaign.component';

describe('OneTimeCampaignComponent', () => {
  let component: OneTimeCampaignComponent;
  let fixture: ComponentFixture<OneTimeCampaignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneTimeCampaignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneTimeCampaignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
