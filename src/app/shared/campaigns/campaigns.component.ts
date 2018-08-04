import { Component, OnInit } from '@angular/core';
import { UnitsService } from '../services/units/units.service';
import { UnitsDetailsResponse } from '../models/response.model';

@Component({
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent implements OnInit {
  
  public unitsDetails: UnitsDetailsResponse = new UnitsDetailsResponse('', 0, 0);

  constructor(private unitsService: UnitsService) { }

  ngOnInit() {
    this.unitsService.getUnitsAvailable().subscribe(
      (response: UnitsDetailsResponse) => {
        this.unitsDetails = response;
      }
    );
  }

}
