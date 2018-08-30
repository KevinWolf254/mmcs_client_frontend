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
import { ReportService } from '../../shared/services/report/report.service';
import { SignInService } from '../../shared/services/sign-in/sign-in.service';
import { ClientService } from '../../shared/services/client/client.service';
import { Contacts } from '../../shared/models/client.model';

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

    constructor(private fb: FormBuilder, private modalService: NgbModal,private signinService: SignInService,
        private _campaignService: CampaignService, private _unitsService: UnitsService,
        private reportService: ReportService, private clientService: ClientService) {

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
        // this.calculatePrevious10YearsForSelect();
        this.getContactsForPieChart();
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

    // private calculatePrevious10YearsForSelect() {
    //     for (let i = 0; i < 10; i++) {
    //         this.years[i] = this.currentYear;
    //         this.currentYear--;
    //     }
    // }

    public getContactsForPieChart(){
        if(!this.expendituresAreLoading){
            this.expendituresAreLoading = true;            
        }
        this.clientService.getNoOfContacts().subscribe(
            (contacts: Contacts) => {               
                this.expendituresAreLoading = false;
                this.setPieChart(contacts);
            }
        );
    }

    public setPieChart(contacts: Contacts) {
        this.expenseChart = new Chart('ctx', {
            type: 'pie',
            data: {
                datasets: [{
                    data: [
                        contacts.rwf,
                        contacts.rwfAir,
                        contacts.kes,
                        contacts.kesAir,
                        contacts.tzs,
                        contacts.tzsAir,
                        contacts.ugx,
                        contacts.ugxAir,
                        contacts.other,
                    ],
                    backgroundColor: [
                        '#3cba9f',
                        '#148970',
                        '#348bca',
                        '#175d91',
                        '#b8d759',
                        '#749219',
                        '#d6bc44',
                        '#a48b16',
                        '#9334bf',
                    ],
                    label: 'Dataset 1'
                }],
                labels: [
                    'Rwanda',
                    'Rwanda Airtel',
                    'Kenya',
                    'Kenya Airtel',
                    'Uganda',
                    'Uganda Airtel',
                    'Tanzania',
                    'Tanzania Airtel',
                    'Other'
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: 'Contacts'
                },
                legend: {
                    display: true,
                    labels: {
                        fontColor: 'rgb(255, 99, 132)'
                    }
                }
            }
        });
    }

    
    // setLineChart(expenditures: MonthlyExpenditure[]) {
        
    //     this.smsLabel = expenditures[0].label;
    //     this.smsScheduledLabel = expenditures[1].label;

    //     this.smsCostData = expenditures[0].monthlyExpenditure;
    //     this.smsScheduledCostData = expenditures[1].monthlyExpenditure; 
    //     this.expenseChart = new Chart('monthlySmsExpenditureChart', {
    //         type: 'line',
    //         data: {
    //             labels: this.months,
    //             datasets: [{
    //                 label: this.smsLabel,
    //                 borderColor: '#3cba9f',
    //                 fill: false,
    //                 data: this.smsCostData
    //             },
    //             {
    //                 label: this.smsScheduledLabel,
    //                 borderColor: '#ffcc00',
    //                 fill: false,
    //                 data: this.smsScheduledCostData
    //             }],
    //         },
    //     });
    // } 
    

    // changeMonthlyExpenditure(event) {
    //     this.sendRequestForMonthlyExpenditure(event.target.value);
    // }

    public openUnitsRequestModal() {
        this.modalService.open(UnitsComponent);
    }

    public openPurchase(modal){
        this.modalService.open(modal,  { size: 'lg' });
    }

    public openDelivery(modal){
        this.modalService.open(modal,  { size: 'lg' });
    }
    public sendRequestForPurchasesReport(form) {
        let from: NgbDate = new NgbDate(form.from.year, form.from.month, form.from.day);
        let to: NgbDate = new NgbDate(form.to.year, form.to.month, form.to.day);
        if (from.after(to)) {
            this.purchaseReportParamsIsValid = false;
            console.log("invalid range: ");
        } else {
            this.signinService.sendRequestForUserDetails().subscribe(
                (userDetails: _UserDetails) => {
                    let organization = userDetails.organisation;
                    console.log(organization);
                    this.reportService.requestPurchasesReport(organization, from, to).subscribe(
                        response => {

                        }
                    );
                }
            );
        }
    }

    public sendRequestForDeliveryReport(form) {
        let from: NgbDate = new NgbDate(form.from.year, form.from.month, form.from.day);
        let to: NgbDate = new NgbDate(form.to.year, form.to.month, form.to.day);
        if(from.after(to)){
            this.deliveryReportParamsIsValid = false;
            console.log("invalid range: ");
        }else{
            this.signinService.sendRequestForUserDetails().subscribe(
                (userDetails: _UserDetails) => {
                    let organization = userDetails.organisation;
                    console.log(organization);
                    this.reportService.requestDeliveryReport(organization, from, to).subscribe(
                        response => {

                        }
                    );
                }
            );            
        }
    }
}
