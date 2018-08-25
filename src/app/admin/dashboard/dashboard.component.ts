import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Chart } from 'chart.js';
import { UnitsComponent } from '../units/units.component';
import { CampaignService } from '../../shared/services/campaign/campaign.service';
import { MonthlyExpenditure } from '../../shared/models/monthly-expenditure.model';
import { UnitsService } from '../../shared/services/units/units.service';
import { UnitsDetailsResponse, _UserDetails } from '../../shared/models/response.model';
import { FormBuilder, FormGroup, Validators } from '../../../../node_modules/@angular/forms';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-calendar';
import { ReportService } from '../../shared/services/report/report.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    // styleUrls: ['./dashboard.component.scss']
    styles: [`
    .custom-day {
      text-align: center;
      padding: 0.185rem 0.25rem;
      display: inline-block;
      height: 2rem;
      width: 2rem;
    }
    .custom-day.focused {
      background-color: #e6e6e6;
    }
    .custom-day.range, .custom-day:hover {
      background-color: rgb(2, 117, 216);
      color: white;
    }
    .custom-day.faded {
      background-color: rgba(2, 117, 216, 0.5);
    }
  `]
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
    expenseChart = [];
    public smsLabel: string = 'sms expense 2018';
    public smsScheduledLabel: string = 'scheduled sms expense 2018';

    public smsCostData: number[] = []; 
    public smsScheduledCostData: number[] = [];
    public months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    public modalRefDel: NgbModalRef;

    public purchasesForm: FormGroup;
    public deliveryForm: FormGroup;

    purchaseReportParamsIsValid: boolean;
    deliveryReportParamsIsValid: boolean;

    hoveredDate: NgbDate;

    fromDate: NgbDate;
    toDate: NgbDate;

    constructor(private fb: FormBuilder, private modalService: NgbModal,
        private _campaignService: CampaignService, private _unitsService: UnitsService,
        private reportService: ReportService, private signinService: SignInService) {

    }

    ngOnInit() {
        this.purchasesForm = this.fb.group({
            'from': ['',Validators.required],
            'to': ['',Validators.required],
        });
        this.deliveryForm = this.fb.group({
            'from': ['',Validators.required],
            'to': ['',Validators.required],
        });
        this.getUnitsDetails();
        this.calculatePrevious10YearsForSelect();
        // this.sendRequestForMonthlyExpenditure(this.currentYear);
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

    private setUpCurrency(unitsDetails: UnitsDetailsResponse){
        this.currency = this._unitsService.setUpCurrency(unitsDetails); 
    }

    private calculatePrevious10YearsForSelect() {
        for (let i = 0; i < 10; i++) {
            this.years[i] = this.currentYear;
            this.currentYear--;
        }
    }

    sendRequestForMonthlyExpenditure(year: number){
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
        this.modalService.open(modal,  { size: 'lg' });
    }

    public openDelivery(modal){
        this.modalService.open(modal,  { size: 'lg' });
    }
    public getUserInfo(){
        let organization: string;
        this.signinService.sendRequestForUserDetails().subscribe(
            (userDetails: _UserDetails)=>{
                organization = userDetails.organisation;
            }
          );
          return organization;
    }
    sendRequestForPurchasesReport(form){
        let from: NgbDate = new NgbDate(form.from.year, form.from.month, form.from.day);
        let to: NgbDate = new NgbDate(form.to.year, form.to.month, form.to.day);
        if(from.after(to)){
            this.purchaseReportParamsIsValid = false;
            console.log("invalid range: ");
        }else {
            this.reportService.requestPurchasesReport(from, to).subscribe(
                response =>{
                    
                }
            );
        }
    }

    sendRequestForDeliveryReport(form) {
        let from: NgbDate = new NgbDate(form.from.year, form.from.month, form.from.day);
        let to: NgbDate = new NgbDate(form.to.year, form.to.month, form.to.day);
        if(from.after(to)){
            this.deliveryReportParamsIsValid = false;
            console.log("invalid range: ");
        }else{
            this.reportService.requestDeliveryReport(from, to).subscribe(
                response =>{

                }
            );
        }
    }
}
