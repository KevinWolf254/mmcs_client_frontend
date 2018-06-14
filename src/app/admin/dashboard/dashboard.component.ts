import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsComponent } from '../units/units.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    private units: number;
    private unitsSpent: number;
    private years: number[] = new Array(10);
    private date: Date = new Date();
    private currentYear: number = this.date.getFullYear();
    private requests: number;
    private requestedAmount: number;

    private monthlyCampaigns: number[] = [12, 19, 5, 3, 6, 8];

  constructor(private modalService: NgbModal) {
   }

  ngOnInit() {
    this.getAvailableUnits();
    this.getSpentUnits();
    this.getYears();
    this.getMonthlyCampaigns(this.currentYear);
    this.getPendingRequests();
  }

  /*Retrieve units available
  shared with campaign component 
  to verify if units are available to send sms */
  getAvailableUnits(){
      this.units = 10000;
  }
  
  getSpentUnits(){
      this.unitsSpent = 5000;
  }

  getYears(){
      for(let i=0; i<10; i++){
        this.years[i] = this.currentYear;
          this.currentYear --;
      }
  }

  getPendingRequests(){
      this.requests = 1;
      this.requestedAmount = 10000;
  }

  getMonthlyCampaigns(year:number){
      let heading: string = "Sent OnDemand SMS 2018";
      let heading02: string = "Sent Campaign SMS 2018";
      let months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
      let myChart = new Chart('monthlyCampaigns', {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: heading,
                borderColor: 'rgba(255, 99, 132, 0.2)',
                backgroundColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                data: [12, 19, 3, 5, 2, 3]
            },
            {
                label: heading02,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                data: [1, 5, 23, 6, 15, 13]
            }
        ],
        },
    });
  }
  
  private onSelectYear(event){
      this.getMonthlyCampaigns(event.target.value);
  }
  private openUnitsRequestModal(){
    this.modalService.open(UnitsComponent);
  }
}
