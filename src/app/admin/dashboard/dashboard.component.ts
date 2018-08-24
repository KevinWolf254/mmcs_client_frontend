import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Chart } from 'chart.js';
import { UnitsComponent } from '../units/units.component';
import { CampaignService } from '../../shared/services/campaign/campaign.service';
import { MonthlyExpenditure } from '../../shared/models/monthly-expenditure.model';
import { UnitsService } from '../../shared/services/units/units.service';
import { UnitsDetailsResponse } from '../../shared/models/response.model';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';

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
    public months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    public modalRefDel: NgbModalRef;

    public purchasesForm: FormGroup;
    public deliveryForm: FormGroup;

    hoveredDate: NgbDate;

    fromDate: NgbDate;
    toDate: NgbDate;

    constructor(private fb: FormBuilder, private modalService: NgbModal, private calendar: NgbCalendar
        private _campaignService: CampaignService, private _unitsService: UnitsService) {
            this.fromDate = calendar.getToday();
            this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
         }

    ngOnInit() {
        this.purchasesForm = this.fb.group({
            'dateRange': ['',Validators.required]
        });
        this.deliveryForm = this.fb.group({
            'from': ['',Validators.required],
            'to': ['',Validators.required],
        });
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

    getSpentPreviousMonthUnits() {
        this.unitsSpentPreviousMonth = 5000;
        this.previousMonthUnitsIsLoading = false;
    }

    private setUpCurrency(unitsDetails: UnitsDetailsResponse){
        this.currency = this._unitsService.setUpCurrency(unitsDetails); 
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
        this.modalService.open(UnitsComponent);
    }

    public openPurchase(modal){
        // this.modalRefDel = 
        this.modalService.open(modal,  { size: 'sm' });
    }

    public openDelivery(modal){
        // this.modalRefDel = 
        this.modalService.open(modal,  { size: 'sm' });
    }

    sendRequestForDeliveryReport(form) {
        let from: Date = new Date();
        let to: Date = new Date();
        from.setUTCFullYear(form.from.year, form.from.month - 1,
            form.from.day);

        to.setUTCFullYear(form.to.year, form.to.month - 1, 
            form.to.day);

        console.log("From Date: "+from);
        console.log("To Date: "+to);
    }

    sendRequestForPurchasesReport(form){
        let from: Date = new Date();
        let to: Date = new Date();
        from.setUTCFullYear(form.from.year, form.from.month - 1,
            form.from.day);

        to.setUTCFullYear(form.to.year, form.to.month - 1, 
            form.to.day);

        console.log("From Date: "+from);
        console.log("To Date: "+to);
    }

    onDateSelection(date: NgbDate) {
        if (!this.fromDate && !this.toDate) {
          this.fromDate = date;
        } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
          this.toDate = date;
        } else {
          this.toDate = null;
          this.fromDate = date;
        }
      }
}
