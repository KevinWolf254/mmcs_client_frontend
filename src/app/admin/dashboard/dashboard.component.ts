import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Chart } from 'chart.js';
import { UnitsComponent } from '../units/units.component';
import { CampaignService } from '../../shared/services/campaign/campaign.service';
import { MonthlyExpenditure } from '../../shared/models/monthly-expenditure.model';
import { UnitsService } from '../../shared/services/units/units.service';
import { UnitsDetailsResponse } from '../../shared/models/response.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public unitsDetails: UnitsDetailsResponse = new UnitsDetailsResponse('', 0, 0, 0);
    public currency: string = '';
    public unitsAvailableIsLoading: boolean = true;
    public previousMonthUnitsIsLoading: boolean = true;
    public expendituresAreLoading: boolean = true;

    public unitsSpentPreviousMonth: number = 0;

    public years: number[] = new Array(10);

    public date: Date = new Date();
    public currentYear: number = this.date.getFullYear();
    private expenseChart = [];
    public smsLabel: string = 'sms expense 2018';
    public smsScheduledLabel: string = 'scheduled sms expense 2018';

    public smsCostData: number[] = []; 
    public smsScheduledCostData: number[] = [];
    public months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    constructor(private _modalService: NgbModal, private _campaignService: CampaignService,
        private _unitsService: UnitsService) { }

    ngOnInit() {
        this.getUnitsDetails();
        this.getSpentPreviousMonthUnits();
        this.calculatePrevious10YearsForSelect();
        this.sendRequestForMonthlyExpenditure(this.currentYear);
    }

    private getUnitsDetails() { 
        this._unitsService.getUnitsAvailable().subscribe(
            (response: UnitsDetailsResponse) => {
                this.unitsDetails = response;
                this.setUpCurrency(response);
                this.unitsAvailableIsLoading = false;
            }
        );
    }

    private getSpentPreviousMonthUnits() {
        this.unitsSpentPreviousMonth = 5000;
        this.previousMonthUnitsIsLoading = false;
    }
    private setUpCurrency(unitsDetails: UnitsDetailsResponse){
        if(unitsDetails.country == "RWANDA")
            this.currency = 'rwf '
        else if(unitsDetails.country == "KENYA")
            this.currency = 'ksh '
        else if(unitsDetails.country == "TANZANIA")
            this.currency = 'tzs '
        else
            this.currency = 'ugx '
    }

    private calculatePrevious10YearsForSelect() {
        for (let i = 0; i < 10; i++) {
            this.years[i] = this.currentYear;
            this.currentYear--;
        }
    }

    public sendRequestForMonthlyExpenditure(year: number){
        if(!this.expendituresAreLoading){
            this.expendituresAreLoading = true;            
        }
        this._campaignService.sendRequestForMonthlyExpenditure(year).subscribe(
            (expenditures: MonthlyExpenditure[]) => {               
                this.expendituresAreLoading = false;
                this.setLineChart(expenditures);
            }
        );
    }

    public setLineChart(expenditures: MonthlyExpenditure[]) {
        
        this.smsLabel = expenditures[0].label;
        this.smsScheduledLabel = expenditures[1].label;

        this.smsCostData = expenditures[0].monthlyExpenditure;
        this.smsScheduledCostData = expenditures[1].monthlyExpenditure; 
        this.expenseChart = new Chart('monthlySmsExpenditureChart', {
            type: 'line',
            data: {
                labels: this.months,
                datasets: [{
                    label: this.smsLabel,
                    borderColor: '#3cba9f',
                    fill: false,
                    data: this.smsCostData
                },
                {
                    label: this.smsScheduledLabel,
                    borderColor: '#ffcc00',
                    fill: false,
                    data: this.smsScheduledCostData
                }],
            },
        });
    }

    public changeMonthlyExpenditure(event) {
        this.sendRequestForMonthlyExpenditure(event.target.value);
    }

    public openUnitsRequestModal() {
        this._modalService.open(UnitsComponent);
    }
}
