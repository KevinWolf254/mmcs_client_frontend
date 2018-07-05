import { Component, OnInit } from '@angular/core';
import { Chart } from "chart.js";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitsComponent } from '../units/units.component';
import { CampaignService } from '../../shared/services/campaign/campaign.service';
import { MonthlyExpenditure } from '../../shared/models/monthly-expenditure.model';
import { UnitsService } from '../../shared/services/units/units.service';
import { UnitsAvailableResponse, UnitsRequest, UnitsAvailableRequest } from '../../models/employer.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    private unitsRequest: UnitsAvailableRequest;
    
    public units: number;
    unitsSpent: number;
    years: number[] = new Array(10);

    date: Date = new Date();
    currentYear: number = this.date.getFullYear();

    requests: number;
    requestedAmount: number;

    expenditures: MonthlyExpenditure[] = [];

  constructor(private modalService: NgbModal, private campaignService: CampaignService, private unitsService: UnitsService) {
   }

  ngOnInit() {

      this.getAvailableUnits();
      this.getSpentUnits();
      this.calculatePrevious10YearsForSelect();
      this.getMonthlyExpenditures(this.currentYear);
      this.getPendingRequests();
  }

  /*Retrieve units available
  shared with campaign component 
  to verify if units are available to send sms */
  getAvailableUnits(){
    //   this.units = this.unitsService.getUnitsAvailable();
    this.unitsService.getUnitsAvailable();
  }
  
  getSpentUnits(){
      let currentDate: Date = new Date();
      let month: number = currentDate.getMonth();

      this.unitsSpent = this.unitsService.getUnitsSpentForMonth(month);
  }

  calculatePrevious10YearsForSelect(){
      for(let i=0; i<10; i++){
        this.years[i] = this.currentYear;
          this.currentYear --;
      }
  }

  getPendingRequests(){
      let response = this.unitsService.getPendingRequestsForUnits();
      this.requests = response.requests;
      this.requestedAmount = response.totalRequestedAmount;
  }

  getMonthlyExpenditures(year: number){        
      this.expenditures = this.campaignService.getExpenditures(year);    
      let onDemandLabel: string = '';
      let campaignsLabel: string = '';
      let onDemandMonthlyData: number[] = [];
      let campaignMonthlyData: number[] = [];

      this.expenditures.forEach((expense, index)=>{
          if(index == 0){
              onDemandLabel = expense.label;
              onDemandMonthlyData = expense.monthlyExpenditure;
          }else{
            campaignsLabel = expense.label;
            campaignMonthlyData = expense.monthlyExpenditure;
          }
      });
      let months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    
      let myChart = new Chart('monthlyCampaigns', {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: onDemandLabel,
                borderColor: 'rgba(255, 99, 132, 0.2)',
                backgroundColor: 'rgba(75, 192, 192, 1)',
                fill: false,
                data: onDemandMonthlyData
            },  
            {
                label: campaignsLabel,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: false,
                data: campaignMonthlyData
            }],
        },
    });
  }
  
  changeMonthlyExpenditure(event){
      this.getMonthlyExpenditures(event.target.value);
  }

  openUnitsRequestModal(){
    this.modalService.open(UnitsComponent);
  }
}
